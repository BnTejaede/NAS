const Op = require("sequelize").Op;

module.exports = function(Sequelize) {


	return {
        beforeValidate: function (item, options) {
            // var values = item.dataValues,
            //     parentId = item.parentId,
            //     options = {
            //         where: {
            //             parentId: parentId
            //         }
            //     };

            // return this.findAll(options).then(function(results) {
            //     // item.position = results.length; //Set in last position of parent's current children
            //     // if (!parent) throw new Error('Parent does not exist');
            //     // console.log("HookResults", results.length);
            //     return null;
            // });
        },
		beforeCreate: function(item, options) {
            // var values = item.dataValues,
            //     parentId = item.parentId,
            //     options = {
            //         where: {
            //             parentId: parentId
            //         }
            //     };

            // if (item.children) {
            //     item.children.forEach(function (child) {
            //         child.versionId = item.versionId;
            //     });
            // }

			// return this.findAll(options).then(function(results) {
            //     // item.position = results.length; //Set in last position of parent's current children
			// 	// if (!parent) throw new Error('Parent does not exist');
            //     // console.log("HookResults", results.length);
            //     return null;
			// });
        },
        
		afterCreate: function(item, options) {
			// var values = item.dataValues,
            // parentId = item.parentId,
            // options = {
            //     where: {
            //         parentId: parentId,
            //         nextChildId: null
            //     }
            // };

            // if (item.children) {
            //     item.children.forEach(function (child) {
            //         child.versionId = item.versionId;
            //     });
            // }
            // console.log(options);
            // console.log("afterCreate....", item.id, parentId);
            
            // return this.find(options).then(function(result) {
            //     console.log("Results", !!result);
            //     // if (!parent) throw new Error('Parent does not exist');
            //     return null;
            // });
		},

        

		beforeUpdate: function(item, options) {
			// var values = item.dataValues,
            // parentId = item.parentId,
            // options = {
            //     where: {
            //         parentId: parentId
            //     }
            // };

            // if (item.children) {
            //     item.children.forEach(function (child) {
            //         child.versionId = item.versionId;
            //     });
            // }
            // console.log(options);
            // console.log("beforeUpdate....", item.id, parentId);
            
            // return this.findAll(options).then(function(results) {
                
            //     // if (!parent) throw new Error('Parent does not exist');
            //     return null;
            // });
        },

        afterUpdate: function(item, options) {
			// var values = item.dataValues,
            // parentId = item.parentId,
            // options = {
            //     where: {
            //         parentId: parentId,
            //         nextChildId: null
            //     }
            // };

            // if (item.children) {
            //     item.children.forEach(function (child) {
            //         child.versionId = item.versionId;
            //     });
            // }
            // console.log(options);
            // console.log("afterUpdate....", item.id, parentId);
            
            // return this.find(options).then(function(result) {
            //     console.log("Results", !!result);
            //     // if (!parent) throw new Error('Parent does not exist');
            //     return result ? result.setNextChild(item) : null;
            // });
		},
        

		beforeBulkCreate: function(daos, options) { // jshint ignore:line
			// set individualHooks = true so that beforeCreate and afterCreate hooks run
			options.individualHooks = true;
		},
		beforeBulkUpdate: function(options) {
			// set individualHooks = true so that beforeUpdate and afterUpdate hooks run
			options.individualHooks = true;
		}
	};
}();
