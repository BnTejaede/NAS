var express = require('express'),
    model = require("../model"),
    router = express.Router({mergeParams: true}),
    versionRouter = require("./versions"),
    bodyParser = require('body-parser');

router.use("/:bookmark/version", versionRouter);


/**
 * @swagger
 * /group/{groupId}/bookmark:
 *   get:
 *     description: Get all Bookmarks for a Group
 *     tags:
 *      - Bookmarks
 *     parameters:
 *     - $ref: '#/parameters/groupId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all Bookmarks for a Group
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Bookmark'
 *   post:
 *     description: Create a Bookmark
 *     tags:
 *      - Bookmarks
 *     parameters:
 *       - $ref: '#/parameters/groupId'
 *       - $ref: '#/parameters/bookmarkName'
 *       - $ref: '#/parameters/bookmarkDescription'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of new Bookmark
 *         schema:
 *           type: object
 */
router.get('/', function (req, res) {
    var groupID = req.params.group;
    
    model.Bookmark.findAll({where: {groupId: groupID}}).then(function (bookmarks) {
        res.send({
            items: bookmarks
        });
    });
});

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawBookmark = mapProperties(req.body),
        groupID = req.params.group,
        bookmark;

    rawBookmark.groupId = groupID;
    rawBookmark.versions = [{name: "Initial"}];

    model.Bookmark.create(rawBookmark, {
        include: [{
            as: "versions",
            model: model.Version
        }]
    }).then(function (bookmark) {
        res.send({
            groupID: groupID,
            id: bookmark.id
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});


/**
 * @swagger
 * /bookmark/{bookmarkId}:
 *   get:
 *     description: Get Bookmark by ID
 *     tags:
 *      - Bookmarks
 *     parameters:
 *     - $ref: '#/parameters/bookmarkId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns a Bookmark
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Bookmark'
 *   put:
 *     description: Edit a Bookmark
 *     tags:
 *      - Bookmarks
 *     parameters:
 *       - $ref: '#/parameters/bookmarkId'
 *       - $ref: '#/parameters/bookmarkName'
 *       - $ref: '#/parameters/bookmarkDescription'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of edited Bookmark
 *         schema:
 *           type: object
 */
router.get('/:bookmark', function (req, res) {
    var bookmarkID = req.params.bookmark;
    model.Bookmark.find({where: {id: bookmarkID}}).then(function (bookmark) {
        res.send(bookmark);
    });
});

router.put('/:bookmark', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawBookmark = mapProperties(req.body),
        bookmarkID = req.params.bookmark,
        bookmark;
    
    model.Bookmark.update(rawBookmark, {where: {id: bookmarkID}}).then(function () {
        res.send({
            id: bookmarkID
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