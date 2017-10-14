const db = require("./../database");
const Sequelize = require("sequelize");

const Figure = db.define('figure', {
    name: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.INTEGER
    },
    geometry: {
        type: Sequelize.STRING
    },
    properties: {
        type: Sequelize.STRING
    }
});
Figure.hasMany(Figure, {as: { singular: "child", plural: "children" }, sourceKey: "id", foreignKey: "parentId"});


module.exports = Figure;
