const db = require("./database");
const Sequelize = require("sequelize");

var readyPromises = [];
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

const Scene = db.define('scene', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
});

const Version = db.define('version', {
    name: {
        type: Sequelize.STRING
    }
});

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




//Set up relationships
Group.hasMany(Scene, {as: "scenes"});
Scene.hasMany(Version, {as: "versions"});
Version.hasMany(Figure, {as: "figures"});
Figure.hasMany(Figure, {as: { singular: "child", plural: "children" }, sourceKey: "id", foreignKey: "parentId"});


module.exports = {
    Group: Group,
    Scene: Scene,
    Version: Version,
    Figure: Figure
}

