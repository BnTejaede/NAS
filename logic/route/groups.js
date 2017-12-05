const express = require('express');
const accessControl = require("../access-control");
const model = require("../model");
const router = express.Router();
const sceneRouter = require("./scenes");
const bodyParser = require('body-parser');


router.use(accessControl);
router.use("/:group/scene", sceneRouter);


/**
 * @swagger
 * /group:
 *   get:
 *     description: Returns groups
 *     tags:
 *      - Groups
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all groups
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Group'
 *   post:
 *     description: Create a group
 *     tags:
 *      - Groups
 *     parameters:
 *       - $ref: '#/parameters/name'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of new group
 *         schema:
 *           type: object
 */
router.get('/', function (req, res) {
    model.Group.findAll().then(function (groups) {
        res.send({
            items: groups
        });
    });
});


router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawGroup = mapProperties(req.body);
    model.Group.create(rawGroup).then(function (group) {
        res.send({
            id: group.id
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});

router.get('/:group', function (req, res) {
    var groupID = req.params.group;
    model.Group.find({where: {id: groupID}}).then(function (group) {
        res.send(group);
    });
});

router.put('/:group', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var groupID = req.params.group,
        rawGroup = mapProperties(req.body);

    model.Group.find({where: {id: groupID}}).then(function (group) {
        return group.update(rawGroup);
    }).then(function () {
        res.send({
            id: groupID
        });
    }).catch(function (error) {
        res.status(500);
        res.render({error: error});
    });;
});

const ignoredProperties = {
    id: true
};

/********************
 * Utilities
 */


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
