var hooks = require("../hook/figure-hooks");
module.exports = function(sequelize, DataTypes) {
    var Scene = sequelize.define('scene', {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        hooks: hooks
    });

    Scene.associate = function (models) {
        Scene.hasMany(models.Version, {as: "versions", foreignKey: {allowNull: false}});    
        Scene.belongsTo(models.Version, {as: "defaultVersion"});
    };

    return Scene;
};