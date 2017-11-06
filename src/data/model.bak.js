const db = require("./database");
const Sequelize = require("sequelize");
const figureHooks = require("./hooks");


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
}, {
    hooks: {
        afterUpdate: function (scene, options) {
            if (scene.defaultVersionId === null) {
                return scene.getVersions().then(function (versions) {
                    scene.defaultVersionId = versions[0].id;
                    return scene.save;
                });
            }
            
        }
    }
});





//Set up relationships
Group.hasMany(Scene, {as: "scenes", foreignKey: {allowNull: false}});
Scene.hasMany(Version, {as: "versions", foreignKey: {allowNull: false}});
//The verbage below seems backwards so there may be a better way to do this. 
//However, it does accomplish the goal of putting defaultVersionId into the Scene table.






module.exports = {
    Group: Group,
    Scene: Scene,
    Version: Version,
    Figure: Figure
}

