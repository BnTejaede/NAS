const express = require('express');
const model = require("../data/model");
const router = express.Router({mergeParams: true});
const versionRouter = require("./versions");
const bodyParser = require('body-parser');

router.use("/:scene/version", versionRouter);

router.get('/', function (req, res) {
    var groupID = req.params.group;
    console.log("Scenes For Group ID: " + groupID);
    model.Scene.findAll({where: {groupId: groupID}}).then(function (scenes) {
        res.send({
            items: scenes
        });
    });
});

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawScene = mapProperties(req.body),
        groupID = req.params.group,
        scene;
    
    model.Scene.create(rawScene).then(function (newScene) {
        scene = newScene;
        return model.Group.find({where: {id: groupID}});
    }).then(function (group) {
        group.addScene(scene);
        res.send({
            groupID: group.id,
            id: scene.id
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});

router.get('/:scene', function (req, res) {
    var sceneID = req.params.scene;
    model.Scene.find({where: {id: sceneID}}).then(function (scene) {
        res.send(scene);
    });
});

const ignoredProperties = {
    id: true,
    groupID: true
};

function mapProperties(object) {
    var keys = Object.keys(object),
        properties = {};
    keys.forEach(function (key) {
        if (!ignoredProperties[key]) {
            properties[key] = object[key];
        }
    });
    return properties;
}


module.exports = router;