module.exports = function(sequelize, DataTypes) {
    var Version = sequelize.define('version', {
        name: {
            type: DataTypes.STRING
        }
    });

    Version.associate = function (models) {
        Version.hasOne(models.Scene, {as: "defaultVersion"});  
        Version.hasMany(models.Figure, {as: "figures", foreignKey: {allowNull: false}});
    };

    return Version;
};