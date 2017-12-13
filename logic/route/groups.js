var express = require('express'),
    accessControl = require("../access-control"),
    model = require("../model"),
    router = express.Router(),
    bookmarkRouter = require("./bookmarks"),
    bodyParser = require('body-parser');


router.use(accessControl);
router.use("/:group/bookmark", bookmarkRouter);


/**
 * @swagger
 * /group:
 *   get:
 *     description: Get All Groups
 *     tags:
 *      - Groups
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all Groups
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Group'
 *   post:
 *     description: Create a Group
 *     tags:
 *      - Groups
 *     parameters:
 *       - $ref: '#/parameters/groupName'
 *       - $ref: '#/parameters/groupDescription'
 *       - $ref: '#/parameters/city'
 *       - $ref: '#/parameters/country'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of created Group
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

/**
 * @swagger
 * /group/{groupId}:
 *   get:
 *     description: Get a Group by ID
 *     tags:
 *      - Groups
 *     parameters:
 *       - $ref: '#/parameters/groupId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns a Group
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Group'
 *   put:
 *     description: Edit a Group
 *     tags:
 *      - Groups
 *     parameters:
 *       - $ref: '#/parameters/groupId'
 *       - $ref: '#/parameters/groupName'
 *       - $ref: '#/parameters/groupDescription'
 *       - $ref: '#/parameters/city'
 *       - $ref: '#/parameters/country'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of new Group
 *         schema:
 *           type: object
 */
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

var ignoredProperties = {
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
