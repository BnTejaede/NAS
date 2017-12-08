var express = require('express'),
    model = require("../model"),
    router = express.Router({mergeParams: true}),
    versionRouter = require("./versions"),
    bodyParser = require('body-parser');

router.use("/:scene/version", versionRouter);


/**
 * @swagger
 * /group/{groupId}/scene:
 *   get:
 *     description: Get all Scenes for a Group
 *     tags:
 *      - Scenes
 *     parameters:
 *     - $ref: '#/parameters/groupId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all Scenes for a Group
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scene'
 *   post:
 *     description: Create a Scene
 *     tags:
 *      - Scenes
 *     parameters:
 *       - $ref: '#/parameters/groupId'
 *       - $ref: '#/parameters/sceneName'
 *       - $ref: '#/parameters/sceneDescription'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of new Scene
 *         schema:
 *           type: object
 */
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
    rawScene.versions = [{name: "Initial"}];

    model.Scene.create(rawScene, {
        include: [{
            as: "versions",
            model: model.Version
        }]
    }).then(function (scene) {
        res.send({
            groupID: groupID,
            id: scene.id
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});


/**
 * @swagger
 * /scene/{sceneId}:
 *   get:
 *     description: Get Scene by ID
 *     tags:
 *      - Scenes
 *     parameters:
 *     - $ref: '#/parameters/sceneId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns a Scene
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scene'
 *   put:
 *     description: Edit a Scene
 *     tags:
 *      - Scenes
 *     parameters:
 *       - $ref: '#/parameters/sceneId'
 *       - $ref: '#/parameters/sceneName'
 *       - $ref: '#/parameters/sceneDescription'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of edited Scene
 *         schema:
 *           type: object
 */
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
    
    model.Scene.update(rawScene, {where: {id: sceneID}}).then(function () {
        res.send({
            id: sceneID
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});

var ignoredProperties = {
    id: true,
    groupID: true
};

function mapProperties(object) {
    var keys = Object.keys(object),
        properties = {};
    keys.forEach(function (key) {
        if (!ignoredProperties[key]) {
            properties[key] = normalizeValue(object[key]);
        }
    });
    return properties;
}

function normalizeValue(value) {
    var isUndefined = value === undefined,
        isInvalidString = !isUndefined && typeof value === "string" && (!value.length || value === "null");
    return isUndefined || isInvalidString ? null : value;
}

module.exports = router;