var Sequelize = require("sequelize"),
    Op = Sequelize.Op;

module.exports = function() {


	return {
		beforeCreate: function(item, options) {
            var figureModel = this;
            if (!item.changed("position")) {
                return this.sequelize.transaction({type: Sequelize.Transaction.TYPES.EXCLUSIVE}, function (transaction) {
                    return item.getSiblings({transaction: transaction, lock: transaction.LOCK.SHARE}).then(function (siblings) {
                        item.position = siblings.length;
                        return item;
                    });
                });
            }
        
        },
        
		afterCreate: function(item, options) {
			var figureModel = this;

        if (item.changed("parentId") && item.changed("position")) {
            return figureModel.findAll({
                lock: options.transaction && options.transaction.LOCK.SHARE,
                transaction: options.transaction,
                where: {
                    id: {
                        [Op.ne]: item.id,
                    },
                    parentId: item.parentId
                }
            }).then(function (positionCollisions) {
                if (positionCollisions && positionCollisions.length) {
                    return figureModel.increment("position", {
                        where: {
                            id: {
                                [Op.ne]: item.id,
                            },
                            parentId: item.parentId,
                            position: {
                                [Op.gte]: item.position
                            }
                        },
                        transaction: options.transaction,
                        lock: options.transaction && options.transaction.LOCK.UPDATE
                    });
                }
            });
        }
        
		},

        

		beforeUpdate: function(item, options) {
			var willParentChange = options.fields.indexOf("parentId") !== -1;

            //TODO Clean up position of children of previous parent
            if (willParentChange) {
                return this.sequelize.transaction({type: Sequelize.Transaction.TYPES.EXCLUSIVE}, function (transaction) {
                    return item.getSiblings({transaction: transaction, lock: transaction.LOCK.SHARE}).then(function (siblings) {
                        return item.update({position: siblings.length}, {transaction: transaction, lock: transaction.LOCK.UPDATE});
                    });
                });
            }
        },

        afterUpdate: function(item, options) {
            var figureModel = this,
                didPositionChange = options.fields.indexOf("position") !== -1;

            if (didPositionChange) {
                return figureModel.findAll({
                    lock: options.transaction.LOCK.SHARE,
                    transaction: options.transaction,
                    where: {
                        id: {
                            [Op.ne]: item.id,
                        },
                        parentId: item.parentId
                    }
                }).then(function (positionCollisions) {
                    if (positionCollisions && positionCollisions.length) {
                        return figureModel.increment("position", {
                            where: {
                                id: {
                                    [Op.ne]: item.id,
                                },
                                parentId: item.parentId,
                                position: {
                                    [Op.gte]: item.position
                                }
                            },
                            transaction: options.transaction,
                            lock: options.transaction.LOCK.UPDATE
                        });
                    }
                });
            }
            
            
            


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
            // console.log("AfterUpdate", item.id, options.fields);
            // item.getSiblings().then(function (result) {
            //     console.log("Siblings", item.id, result && result.length);

            // });
            
            // if (!item.nextChild) {
            //     return this.find(options).then(function(result) {
            //         console.log("afterUpdate....", item.id, result && result.id, parentId);
            //         var shouldSetNextChild = result && result.id !== item.id;
            //         // console.log("Result", result);
            //         // if (!parent) throw new Error('Parent does not exist');
            //         return shouldSetNextChild ? result.setNextChild(item) : null;
            //     });
            // }
            
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
