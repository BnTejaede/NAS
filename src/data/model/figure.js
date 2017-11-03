
module.exports = function(sequelize, DataTypes) {
    var Figure = db.define('figure', {
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
        hooks: figureHooks
    });

    Figure.associate = function (models) {
        Figure.hasMany(Figure, {as: { singular: "child", plural: "children" }, sourceKey: "id", foreignKey: "parentId"});
        Figure.hasOne(Figure, {as: "nextChild", sourceKey: "id", foreignKey: "nextChildId"});
    };

    return Figure;
};