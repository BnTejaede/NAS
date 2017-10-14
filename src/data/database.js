const Sequelize = require("sequelize");

const sequelize = new Sequelize('biosurvelliance', 'pdc', 'pdc', {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // SQLite only
    storage: 'data/database.sqlite',
    logging: false
});
  
module.exports = sequelize;