module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    });

    User.associate = function (models) {
        User.belongsTo(models.Group);
        User.belongsTo(models.Bookmark, {as: "defaultBookmark"});
    };

    return User;
};

