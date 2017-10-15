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
Version.hasMany(Figure, {as: "figures", foreignKey: {allowNull: false}});
Figure.hasMany(Figure, {as: { singular: "child", plural: "children" }, sourceKey: "id", foreignKey: "parentId"});


module.exports = {
    Group: Group,
    Scene: Scene,
    Version: Version,
    Figure: Figure
}

