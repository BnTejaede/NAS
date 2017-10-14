const db = require("./../database");
const Sequelize = require("sequelize");
const Figure = require("./figure");

const Version = db.define('version', {
    name: {
        type: Sequelize.STRING
    }
});
Version.hasMany(Figure, {as: "figures"});

module.exports = Version;