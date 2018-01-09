
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
        Group.hasMany(models.Bookmark, {as: "bookmarks"});
        Group.hasMany(models.User, {as: "users"});
    };


    return Group;
};

