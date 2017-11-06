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
        },
        position: {
            type: DataTypes.INTEGER
        }
    },{
        defaultScope: {
            order: [
                ["parentId", 'DESC'],
                ["position", "ASC"]
            ]
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
    };

    Figure.swap = function (id1, id2) {

        return Figure.findAll({
            where: {
                id: [id1, id2]
            }
        }).then(function (results) {
            var figure1 = results[0],
                figure2 = results[1],
                position1 = figure1.position,
                position2 = figure2.position;
            return Promise.all([
                figure1.update({position: position2}, {hooks: false}),
                figure2.update({position: position1}, {hooks: false})
            ]);
        });
    };

    Figure.prototype.getSiblings = function (options) {
        var self = this,
            parentId = this.getDataValue("parentId");


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
                if (figuresToDelete.has(rawFigure.id)) {
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