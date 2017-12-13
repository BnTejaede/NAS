var hooks = require("../hook/bookmark-hooks");

module.exports = function(sequelize, DataTypes) {
    var Bookmark = sequelize.define('bookmark', {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        hooks: hooks
    });

    Bookmark.associate = function (models) {
        Bookmark.hasMany(models.Version, {as: "versions", foreignKey: {allowNull: false}});    
        Bookmark.belongsTo(models.Version, {as: "defaultVersion"});
    };

    return Bookmark;
};