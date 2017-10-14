const db = require("./../database");
const Sequelize = require("sequelize");
const Scene = require("./scene");

module.exports = function Group() {}

const Group = db.define('group', {
    name: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    country: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
});
Group.hasMany(Scene, {as: "scenes"});

module.exports = Group;