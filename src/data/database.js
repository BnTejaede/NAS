const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const sequelize = new Sequelize('biosurvelliance', 'pdc', 'pdc', {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // SQLite only
    storage: 'test/database.sqlite',
    logging: false,
    operatorsAliases: {
      $or: Op.or
    }
});
  
module.exports = sequelize;