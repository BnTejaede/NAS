var Sequelize = require("sequelize"),
    Op = Sequelize.Op,
    hooks = require("../hook/figure-hooks");

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
              var hasType = isNull(this.type),
                  hasGeometry = isNull(this.geometry);
            
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

    function isNull(field) {
        var type = typeof field;
        return field === null || type === "undefined" || (type === "string" && field.length === 0);
    }

    
    Figure.associate = function (models) {
        Figure.hasMany(Figure, {as: { singular: "child", plural: "children" }, foreignKey: "parentId", onDelete: "CASCADE"});
        Figure.belongsTo(Figure, {as: "parent", foreignKey: "parentId", onDelete: "CASCADE"});

        Figure.hasOne(Figure, {as: "previous", foreignKey: "previousId"});
        Figure.belongsTo(Figure, {as: "next", foreignKey: "previousId"});
    };


    var protoCreate = Figure.create;
    
    Figure._create = function (data, transaction) {
        var self = this,
            parentId = isNaN(data.parentId) ? null : data.parentId,
            previousSibling, index;

            data.type = isNaN(data.type) ? null : data.type;

            return self.getLastChildOfParent(parentId, data.versionId, transaction).then(function (result) {
                lastSibling = result;
                data.previousId = lastSibling && lastSibling.id;
                return protoCreate.apply(self, [data, {
                    transaction: transaction,
                    lock: transaction.LOCK.UPDATE
                }]);
            }).then(function (figure) {
                if (data.children) {
                    data.children.forEach(function (rawFigure) {
                        rawFigure.versionId = figure.versionId;
                        rawFigure.parentId = figure.id;
                    });
                    return Figure.createAll(data.children, transaction).then(function () {
                        return figure;
                    });
                } else {
                    return figure;
                }
            });
    };

    Figure.createAll = function (rawFigures, transaction, results) {
        var next = rawFigures.shift();
            results = results || [];
        if (next) {
            return Figure._create(next, transaction).then(function (item) {
                results.push(item);
                return Figure.createAll(rawFigures, transaction, results);
            });
        } else {
            return Promise.resolve(results);
        }
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


    Figure._insertAtPosition = function (rawFigure, position, transaction) {
        var self = this,
            newFigure,
            previousSibling,
            previousId;

        return Figure._create(rawFigure, transaction).then(function (figure) {
            newFigure = figure;
            return Figure.findAll({
                where: {
                    parentId: figure.parentId,
                    versionId: figure.versionId
                },
                transaction: transaction
            });
        }).then(function (siblings) {
            position = Math.max(position, 0);
            position = Math.min(position, siblings.length - 1);
            if (!position) {
                previousId = null;
            } else {
                previousSibling = siblings[position - 1];
                previousId = previousSibling ? previousSibling.id : null;
            }            
            return Figure._insertAfter(newFigure.id, previousId, transaction);
        }).then(function () {
            return newFigure.reload({transaction: transaction});
        });
    };

    Figure.insertAtPosition = function (rawFigure, position, options) {
        if (options && options.transaction) {
            return Figure._insertAtPosition(rawFigure, position, options.transaction);
        } else {
            return sequelize.transaction(function (transaction) {
                return Figure._insertAtPosition(rawFigure, position, transaction);
            });
        }
    };

    Figure.moveToPosition = function (figureID, position, options) {
        
        if (options && options.transaction) {
            return Figure._moveToPosition(figureID, position, options.transaction);
        } else {
            return sequelize.transaction(function (transaction) {
                return Figure._moveToPosition(figureID, position, transaction);
            });
        }
    };

    Figure._moveToPosition = function (figureID, position, transaction) {
        var self = this,
            previousSibling, previousId,
            indexOfSelf, sibling, found = false,
            figure;
        
        return Figure.find({
            where: {
                id: figureID
            },
            transaction: transaction
        }).then(function (result) {
            figure = result;
            return Figure.findAll({
                where: {
                    parentId: figure.parentId,
                    versionId: figure.versionId
                },
                transaction: transaction
            });
        }).then(function (siblings) {
            position = Math.max(position, 0);
            position = Math.min(position, siblings.length - 1);
            for (indexOfSelf = 0; (sibling = siblings[indexOfSelf]); indexOfSelf++) {
                if (sibling.id === figureID) {
                    break;
                }
            }
            if (!position) {
                previousId = null;
            } else {
                previousSibling = siblings[indexOfSelf < position ? position : position - 1];
                previousId = previousSibling ? previousSibling.id : null;
            }
            if (indexOfSelf === position) {
                return Promise.resolve(null);
            } else {
                return Figure._insertAfter(figureID, previousId, transaction);
            }

        }).then(function () {
            return Figure.findAll({
                where: {
                    parentId: figure.parentId
                },
                transaction: transaction
            });
        }).then(function (siblings) {
            return null;
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

    function parseJSONPatchOperation (operation) {
        return {
            id: +/\/(\d*)/.exec(operation.path)[1],
            previousId: operation.value
        };
    }
    Figure.applyPatch = function (figureID, operations) {
        return sequelize.transaction(function (transaction) {
            return Promise.all(operations.map(function (operation) {
                var parsed = parseJSONPatchOperation(operation);
                return Figure.update({
                    previousId: parsed.previousId
                }, {
                    where: {
                        id: parsed.id
                    },
                    transaction: transaction,
                    lock: transaction.LOCK.UPDATE,
                    hooks: false
                });
            }));
        }).then(function () {
            return Figure.findAll({
                where: {
                    parentId: figureID
                }
            });
        });
    };

    Figure._insertAfter = function (id, idToFollow, transaction) {
       var figure, parentId;

        return Figure.findAll({
            where: {
                [Op.or]: {
                    id: id,
                    previousId: id
                }
            },
            transaction: transaction,
            lock: transaction.LOCK.UPDATE
        }).then(function (results) {
            var next;
            if (results[0].id === id) {
                figure = results[0];
                next = results[1];
            } else {
                figure = results[1];
                next = results[0];
            }
            parentId = figure.parentId;
            // Remove self from current position
            return Figure.update({
                previousId: figure.previousId
            }, {
                where: {
                    previousId: id
                },
                transaction: transaction,
                lock: transaction.LOCK.UPDATE,
                hooks: false
            });
        }).then(function (result) {
            // Point current figure at position to self
            return Figure.update({
                previousId: id
            }, {
                where: {
                    previousId: idToFollow,
                    parentId: parentId,
                    versionId: figure.versionId
                },
                transaction: transaction,
                lock: transaction.LOCK.UPDATE,
                hooks: false
            });
        }).then(function (result) {
            // Point self to new idToFollow
            return Figure.update({
                previousId: idToFollow 
            }, {
                where: {
                    id: id
                },
                transaction: transaction,
                lock: transaction.LOCK.UPDATE,
                hooks: false
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


    Figure.getLastChildOfParent = function (parentID, versionId, transaction) {
        var self = this;
        //TODO Update to take advantage of ordering that occurs in hooks.afterFind
        return this.findAll({
            attributes: ["previousId"],
            where: {
                parentId: parentID,
                versionId: versionId
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
                parentId: parentID,
                versionId: versionId
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


        if (typeof parentId !== "number") {
            parentId = null;
        } 

        return Figure.findAll({
            where: {
                versionId: self.versionId,
                parentId: parentId,
                id: {
                    [Op.ne]: self.id
                }
            },
            transaction: options.transaction,
            lock: options.lock
        });
        
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