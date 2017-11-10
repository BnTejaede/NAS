var Sequelize = require("sequelize"),
    Op = Sequelize.Op;

module.exports = function() {

    function closeGapLeftByItem(item, transaction) {
        var previousID = item.previousId,
            self = this;

        return self.update({previousId: item.previousId}, {
            where: {
                previousId: item.id,
            },
            lock: transaction && transaction.LOCK.UPDATE,
            transaction: transaction,
            hooks: false
        });
    }

    function setPreviousBeforeInsert (item, transaction) {
        var self = this;
        return this.getLastChildOfParent(item.parentId, transaction).then(function (lastChild) {
            item.previousId = lastChild && lastChild.id;
            return item;
        });
    }

    function shouldOrderQuery (result, options) {
        var isArray = result && Array.isArray(result),
            isFolderContents = options.where && options.where.hasOwnProperty("parentId"),
            canOrderResult = options.attributes.indexOf("previousId") !== -1 && options.attributes.indexOf("id") !== -1;

        return isArray && isFolderContents && canOrderResult;
    }

    function orderQueryResults (figures) {
        var byPreviousID = {},
            newResult = [],
            next, i;

        figures.forEach(function (figure) {
            byPreviousID[figure.previousId] = figure;
            if (figure.previousId === null) {
                next = figure;
            }
        });

        while (next) {
            if (newResult.indexOf(next) === -1) {
                newResult.push(next);
            } 
            next = byPreviousID[next.id];
        }
        console.log("Fetch", newResult.map(function (figure) {
            return figure.id;
        }));
        return newResult;
    }

	return {
        afterFind: function (result, options) {
            if (shouldOrderQuery(result, options)) {
                result.splice.apply(result, [0, Infinity].concat(orderQueryResults(result)));
            }
        },
		beforeUpdate: function(item, options) {
            var willParentChange = item.changed("parentId"),
                figureModel = this;

            //TODO Clean up position of children of previous parent
            if (willParentChange) {
                if (options.transaction) {
                    return closeGapLeftByItem.bind(figureModel)(item, options.transaction).then(function () {
                        return setPreviousBeforeInsert.bind(figureModel)(item, transaction);
                    });
                } else {
                    return this.sequelize.transaction({type: Sequelize.Transaction.TYPES.EXCLUSIVE}, function (transaction) {
                        // console.log("WillParentChange...", item.id, item.previousId, item.nextId);
                        return closeGapLeftByItem.bind(figureModel)(item, transaction).then(function () {
                            return setPreviousBeforeInsert.bind(figureModel)(item, transaction);
                        });
                    });
                }
            } 
        },

        afterUpdate: function(item, options) {
            var didParentChange = item.changed("parentId"),
                figureModel = this;

            return figureModel.findAll({
                where: {
                    parentId: item.parentId
                },
                transaction: options.transaction
            }).then(function (figures) {
                var byPreviousID = {},
                    result = [], next;
                if (figures.length >= 3) {
                    console.log("");
                    console.log("AfterUpdate ******************", item.id, item.parentId);
                 
                    figures.forEach(function (figure) {
                        byPreviousID[figure.previousId] = figure;
                        
                        console.log(figure.previousId + " --> " + figure.id);
                        if (!figure.previousId) {
                            next = figure;
                        }
                    });

                    while (next) {
                        result.push(next.id);
                        next = byPreviousID[next.id];
                    }
                    console.log("Order", result);
                }
                
                return null;
            });
            
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
