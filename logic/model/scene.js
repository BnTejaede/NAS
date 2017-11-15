module.exports = function(sequelize, DataTypes) {
    var Scene = sequelize.define('scene', {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        hooks: {
            afterUpdate: function (scene, options) {
                if (scene.defaultVersionId === null) {
                    return scene.getVersions().then(function (versions) {
                        scene.defaultVersionId = versions[0].id;
                        return scene.save;
                    });
                }
                
            }
        }
    });

    Scene.associate = function (models) {
        Scene.hasMany(models.Version, {as: "versions", foreignKey: {allowNull: false}});        
    };

    return Scene;
};