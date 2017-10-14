const db = require("./../database");
const Sequelize = require("sequelize");
const Version = require("./version");

const Scene = db.define('scene', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
});
Scene.hasMany(Version, {as: "versions"});

module.exports = Scene;