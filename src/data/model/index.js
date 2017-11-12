var fs = require("fs-extra"),
    path = require("path"),
    Sequelize = require("sequelize");
    

var env = process.env.NODE_ENV || "development", 
    config = require(path.join(__dirname, '../../../', 'config', 'config.json'))[env],
    db = {}, 
    sequelize;

config.transactionType = Sequelize.Transaction.TYPES.EXCLUSIVE;
config.isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED;

console.log("Config", config);
if (config.seedStorage) { 
  if (fs.existsSync(config.storage)) {
    fs.removeSync(config.storage);
  }
  fs.copySync(config.seedStorage, config.storage);
  delete config.seedStorage;
} 



if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function(file) {
var model = sequelize.import(path.join(__dirname, file)),
    name = model.name.charAt(0).toUpperCase() + model.name.substring(1);
    db[name] = model;
});

Object.keys(db).forEach(function(modelName) {

  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
