var Sequelize = require("sequelize"),
Op = Sequelize.Op;

module.exports = function() {


    return {
        afterCreate: function (scene, options) {
            if (scene.defaultVersionId === null) {
                return scene.getVersions().then(function (versions) {
                    scene.defaultVersionId = versions[0].id;
                    return scene.save;
                });
            }
        },
        afterUpdate: function (scene, options) {
            if (scene.defaultVersionId === null) {
                return scene.getVersions().then(function (versions) {
                    scene.defaultVersionId = versions[0].id;
                    return scene.save;
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
    }
})