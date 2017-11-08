var Sequelize = require("sequelize"),
    Op = Sequelize.Op,
    hooks = require("../hooks/figure-hooks");

module.exports = function(sequelize, DataTypes) {
    
    var Figure = sequelize.define('figure', {
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.INTEGER
        },
        geometry: {
            type: DataTypes.STRING
        },
        properties: {
            type: DataTypes.STRING
        }
    },{
        defaultScope: {
            order: ["parentId"]
        },
        version: true,
        validate: {
          bothTypeAndGeometryNullOrNeither() {
              var hasType = this.type !== null,
                  hasGeometry = this.geometry !== null;
            
            if (hasType && !hasGeometry) {
                console.log(this.type, this.geometry);
                throw new Error("Figure with type must include geometry");
            } else if (!hasType && hasGeometry) {
                console.log(this.type, this.geometry);
                throw new Error("Folder figure cannot include geometry");
            }
          }
        },
        hooks: hooks
    });
    
    Figure.associate = function (models) {
        Figure.hasMany(Figure, {as: { singular: "child", plural: "children" }, foreignKey: "parentId"});
        Figure.belongsTo(Figure, {as: "parent", foreignKey: "parentId"});

        Figure.hasOne(Figure, {as: "previous", foreignKey: "previousId"});
        Figure.belongsTo(Figure, {as: "next", foreignKey: "previousId"});
    };

    var protoCreate = Figure.create;
    
    Figure._create = function (data, transaction) {
        var self = this,
            parentId = typeof data.parentId === "number" ? data.parentId : null,
            previousSibling, index;

            return self.getLastChildOfParent(parentId, transaction).then(function (result) {
                lastSibling = result;
                data.previousId = lastSibling && lastSibling.id;
                return protoCreate.apply(self, [data, {
                    transaction: transaction,
                    lock: transaction.LOCK.UPDATE
                }]);
            });
    };

    Figure.create = function (data, options) {
        var transaction = options && options.transaction;

        if (transaction) {
            return Figure._create(data, transaction);
        } else {
            return sequelize.transaction(function (transaction) {
                return Figure._create(data, transaction);
            });
        }
    }


    Figure.insertAtPosition = function (rawFigure, position) {
        var self = this,
            newFigure,
            previousSibling;

        return sequelize.transaction(function (transaction) {
            return Figure._create(rawFigure, transaction).then(function (figure) {
                newFigure = figure;
                return figure.getSiblings({transaction: transaction});
            }).then(function (siblings) {
                position = Math.max(position, 0);
                position = Math.min(position, siblings.length - 1);
                previousSibling = siblings[position];
                return Figure.insertAfter(newFigure.id, previousSibling.id, {transaction: transaction});
            }).then(function () {
                return newFigure.reload();
            });
        });
    };

    Figure.swap = function (id1, id2) {

        return Figure.findAll({
            where: {
                id: [id1, id2]
            },
            hooks: false
        }).then(function (results) {
            var figure1 = results[0],
                figure2 = results[1];

            
            return Promise.all([
                Figure.insertAfter(figure1.id, figure2.previousId),
                Figure.insertAfter(figure2.id, figure1.previousId)
            ]);
        });
    };

    Figure._insertAfter = function (id, idToFollow, transaction) {

        return Figure.find({
            where: {
                id: id
            },
            transaction: transaction
        }).then(function (figure) {
            // Remove figure from current order
            return Figure.update({
                previousId: figure.previousId 
            }, {
                where: {
                    previousId: id
                },
                transaction: transaction
            });
        }).then(function () {
            //Point idToFollow's old previous to self
            return Figure.update({
                previousId: id
            }, {
                where: {
                    previousId: idToFollow 
                },
                transaction: transaction,
                hooks: false
            })
        }).then(function () {
            // Set value of own id to follow
            return Figure.update({
                previousId: idToFollow 
            }, {
                where: {
                    id: id
                },
                transaction: transaction
            });
        });
    };

    Figure.insertAfter = function (id, idToFollow, options) {
        var self = this,
            transaction = options && options.transaction;

        if (transaction) {
            return Figure._insertAfter(id, idToFollow, transaction);
        } else {
            return sequelize.transaction(function (transaction) {
                return Figure._insertAfter(id, idToFollow, transaction);
            });
        }
    };


    Figure.getLastChildOfParent = function (parentID, transaction) {
        var self = this;
        //TODO Update to take advantage of ordering that occurs in hooks.afterFind
        return this.findAll({
            attributes: ["previousId"],
            where: {
                parentId: parentID
            },
            transaction: transaction,
            lock: transaction.LOCK.SHARE
        }).then(function (siblingIDs) {
            var ids = siblingIDs.map(function (sibling) {
                return sibling.previousId;
            }).filter(function (previousId) {
                return typeof previousId === "number";
            }),
            where = {
                parentId: parentID
            };

            if (ids.length) {
                where.id = {
                    [Op.notIn]: ids
                }
            }
            return self.find({
                where: where,
                transaction: transaction,
                lock: transaction.LOCK.SHARE
            });
        })
    }


    Figure.prototype.getSiblings = function (options) {
        var self = this,
            parentId = this.getDataValue("parentId");
            options = options || {};


        if (typeof parentId === "number") {
            
            return this.getParent(options).then(function (parent) {
                return parent.getChildren({
                    where: {
                        id: {
                            [Op.ne]: self.id
                        }
                    },
                    transaction: options.transaction,
                    lock: options.lock
                });
            });
        } else {
            return Figure.findAll({
                where: {
                    parentId: null,
                    id: {
                        [Op.ne]: self.id
                    }
                },
                transaction: options.transaction,
                lock: options.lock
            });
        }
    };

    Figure.updateAll = function (rawFigures, figuresToDelete, versionId) {
        return Promise.all(rawFigures.map(function (rawFigure) {
            if (rawFigure.id === undefined) { // Must be new
                rawFigure.versionId = versionId;
                return Figure.create(rawFigure);
            } else {
                if (figuresToDelete && figuresToDelete.has(rawFigure.id)) {
                    figuresToDelete.delete(rawFigure.id);
                }
                return Figure.update(rawFigure, {where: {id: rawFigure.id}});
            }
        }));
    };
    
    
    Figure.deleteAll = function (figuresToDelete) {
        var promises = [];
        figuresToDelete.forEach(function (id) {
            promises.push(Figure.destroy({where: {id: id}}));
        });
        return Promise.all(promises);
    
    }

    return Figure;
};