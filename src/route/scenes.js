const express = require('express');
const model = require("../data/model");
const router = express.Router({mergeParams: true});
const versionRouter = require("./versions");
const bodyParser = require('body-parser');

router.use("/:scene/version", versionRouter);

router.get('/', function (req, res) {
    var groupID = req.params.group;
    
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

    rawScene.groupId = groupID;

    model.Scene.create(rawScene).then(function (scene) {
        res.send({
            groupID: groupID,
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

router.put('/:scene', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawScene = mapProperties(req.body),
        sceneID = req.params.scene,
        scene;
    
    model.Scene.find({where: {id: sceneID}}).then(function (scene) {
        return scene.update(rawScene);
    }).then(function () {
        res.send({
            id: sceneID
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
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