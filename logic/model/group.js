
module.exports = function (sequelize, DataTypes) {
    var Group = sequelize.define('group', {
        name: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    });

    Group.associate = function (models) {
        Group.hasMany(models.Scene, {as: "scenes", foreignKey: {allowNull: false}});
    };

    

    return Group;
};

