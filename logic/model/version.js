module.exports = function(sequelize, DataTypes) {
    var Version = sequelize.define('version', {
        name: {
            type: DataTypes.STRING
        },
        layers: {
            type: DataTypes.STRING
        }
    });

    Version.associate = function (models) {
        Version.hasMany(models.Figure, {as: "figures", foreignKey: {allowNull: false}});

        var protoCreate = Version.create;
        
        Version._create = function (data, transaction) {
            var self = this,
                figures;
    
    
            return protoCreate.apply(self, [data, {
                transaction: transaction,
                lock: transaction.LOCK.UPDATE
            }]).then(function (version) {
                if (data.figures) {
                    data.figures.forEach(function (rawFigure) {
                        rawFigure.versionId = version.id;
                    });
                    return models.Figure.createAll(data.figures, transaction).then(function () {
                        return version;
                    });
                } else {
                    return version;
                }
            });
        };
    
        Version.create = function (data, options) {
            var transaction = options && options.transaction;
    
            if (transaction) {
                return Version._create(data, transaction);
            } else {
                return sequelize.transaction(function (transaction) {
                    return Version._create(data, transaction);
                });
            }
        }
    };


    

    return Version;
};