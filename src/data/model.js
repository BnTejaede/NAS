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

const Version = db.define('version', {
    name: {
        type: Sequelize.STRING
    }
});

const Figure = Sequelize.import("./model/index.js");




//Set up relationships
Group.hasMany(Scene, {as: "scenes", foreignKey: {allowNull: false}});
Scene.hasMany(Version, {as: "versions", foreignKey: {allowNull: false}});
//The verbage below seems backwards so there may be a better way to do this. 
//However, it does accomplish the goal of putting defaultVersionId into the Scene table.
Version.hasOne(Scene, {as: "defaultVersion"});  
Version.hasMany(Figure, {as: "figures", foreignKey: {allowNull: false}});


Figure.updateAll = function (rawFigures, figuresToDelete, versionId) {
    return Promise.all(rawFigures.map(function (rawFigure) {
        if (rawFigure.id === undefined) { // Must be new
            rawFigure.versionId = versionId;
            return Figure.create(rawFigure);
        } else {
            if (figuresToDelete.has(rawFigure.id)) {
                figuresToDelete.delete(rawFigure.id);
            }
            return Figure.update(rawFigure, {where: {id: rawFigure.id}});
        }
    }));
}

Figure.deleteAll = function (figuresToDelete) {
    var promises = [];
    figuresToDelete.forEach(function (id) {
        promises.push(Figure.destroy({where: {id: id}}));
    });
    return Promise.all(promises);

}



module.exports = {
    Group: Group,
    Scene: Scene,
    Version: Version,
    Figure: Figure
}

