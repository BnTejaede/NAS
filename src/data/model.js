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
    },
    position: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},{
    validate: {
      bothTypeAndGeometryNullOrNeither() {
          var hasType = this.type !== null,
              hasGeometry = this.geometry !== null;
        
        if (hasType && !hasGeometry) {
            console.log(this.type, this.geometry);
            throw new Error("Figure with type must include geometry");
        } else if (!hasType && hasGeometry) {
            console.log(this.type, this.geometry);
            throw new Error("Folder figure cannot include geometry");
        }
      }
    },
    hooks: {
        beforeCreate: function (figure, options) {
            if (figure.children) {
                figure.children.forEach(function (child) {
                    child.versionId = figure.versionId;
                });
            }
        }
    }
});




//Set up relationships
Group.hasMany(Scene, {as: "scenes", foreignKey: {allowNull: false}});
Scene.hasMany(Version, {as: "versions", foreignKey: {allowNull: false}});
Version.hasOne(Scene, {as: "defaultVersion"});
Version.hasMany(Figure, {as: "figures", foreignKey: {allowNull: false}});
Figure.hasMany(Figure, {as: { singular: "child", plural: "children" }, sourceKey: "id", foreignKey: "parentId"});


Figure.updateAll = function (rawFigures, figuresToDelete, versionId) {
    return Promise.all(rawFigures.map(function (rawFigure) {
        console.log("UpdateRawFigure", rawFigure.id);
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

