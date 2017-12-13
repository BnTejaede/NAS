var Sequelize = require("sequelize"),
    Op = Sequelize.Op;

module.exports = function() {

    return {
        afterCreate: function (bookmark, options) {
            if (bookmark.defaultVersionId === null || bookmark.defaultVersionId === undefined) {
                return bookmark.getVersions().then(function (versions) {
                    if (versions.length) {
                        bookmark.defaultVersionId = versions[0].id;
                        return bookmark.save();
                    } else {
                        return null;
                    }
                    
                });
            }
        },
        afterUpdate: function (bookmark, options) {
            if (bookmark.defaultVersionId === null || bookmark.defaultVersionId === undefined) {
                return bookmark.getVersions().then(function (versions) {
                    if (versions.length) {
                        bookmark.defaultVersionId = versions[0].id;
                        return bookmark.save();
                    } else {
                        return null;
                    }
                });
            }
            
        },
        beforeBulkCreate: function(daos, options) { // jshint ignore:line
			// set individualHooks = true so that beforeCreate and afterCreate hooks run
			options.individualHooks = true;
		},
		beforeBulkUpdate: function(options) {
			// set individualHooks = true so that beforeUpdate and afterUpdate hooks run
			options.individualHooks = true;
        },
        beforeBulkDestroy: function(options) {
			// set individualHooks = true so that beforeDestroy and afterDestroy hooks run
			options.individualHooks = true;
        }
    };
}();