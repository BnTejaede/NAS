var express = require('express'),
    model = require("../model"),
    router = express.Router({mergeParams: true}),
    figureRouter = require("./figures"),
    bodyParser = require('body-parser'),
    accessControl = require("../access-control");

router.use("/:version/figure", figureRouter);



router.use(accessControl);

/**
 * @swagger
 * /bookmark/{bookmarkId}/version:
 *   get:
 *     description: Get all Versions for a Bookmark
 *     tags:
 *      - Versions
 *     parameters:
 *     - $ref: '#/parameters/bookmarkId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all Versions for a Bookmark
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Bookmark'
 *   post:
 *     description: Create a Bookmark
 *     tags:
 *      - Versions
 *     parameters:
 *       - $ref: '#/parameters/bookmarkId'
 *       - $ref: '#/parameters/versionName'
 *       - $ref: '#/parameters/figures'
 *       - $ref: '#/parameters/layers'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of new Version
 *         schema:
 *           type: object
 */
router.get('/', function (req, res) {
    var bookmarkID = req.params.bookmark;
    model.Version.findAll({where: {bookmarkId: bookmarkID}}).then(function (versions) {
        res.send({
            items: versions
        });
    });
});

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawVersion = mapProperties(req.body),
        bookmarkID = req.params.bookmark,
        version, options;

    rawVersion.bookmarkId = bookmarkID;
    rawVersion.figures = rawVersion.figures ? JSON.parse(rawVersion.figures) : [];
    mapFiguresToRawData(rawVersion.figures);

    version = model.Version.create(rawVersion).then(function (version) {
        res.send({
            bookmarkID: bookmarkID,
            id: version.id
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});


/**
 * @swagger
 * /version/{versionId}:
 *   get:
 *     description: Get Version by ID
 *     tags:
 *      - Versions
 *     parameters:
 *     - $ref: '#/parameters/versionId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns Version object
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Version'
 *   put:
 *     description: Edit a Version
 *     tags:
 *      - Versions
 *     parameters:
 *       - $ref: '#/parameters/versionId'
 *       - $ref: '#/parameters/versionName'
 *       - $ref: '#/parameters/layers'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of edited Version
 *         schema:
 *           type: object
 */
router.get('/:version', function (req, res) {
    var versionID = req.params.version;
    model.Version.find({where: {id: versionID}}).then(function (versions) {
        res.send(versions);
    });
});

router.put('/:version', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawVersion = mapProperties(req.body),
        versionID = req.params.version,
        updatePromise = rawVersion.figures ? updateVersionWithFigures(rawVersion, versionID) : 
                                             updateVersionWithoutFigures(rawVersion, versionID);


    return updatePromise.then(function () {
        res.send({
            id: versionID
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});



function updateVersionWithoutFigures (rawVersion, versionID) {
    return model.Version.update(rawVersion, {where: {id: versionID}});
}

function updateVersionWithFigures (rawVersion, versionID) {
    var figuresToDelete;
    rawVersion.figures = JSON.parse(rawVersion.figures);
    mapFiguresToRawData(rawVersion.figures);
    rawVersion.figures = flattenFigures(rawVersion.figures);
    return model.Figure.findAll({
        attributes: ["id"],
        where: {versionId: versionID}
    }).then(function (figures) {
        figuresToDelete = arrayToSet(figures);
        return model.Version.update(rawVersion, {where: {id: versionID}});
    }).then(function () {
        return model.Figure.updateAll(rawVersion.figures, figuresToDelete, versionID);
    }).then(function () {
        return model.Figure.deleteAll(figuresToDelete);
    });
}

function arrayToSet (array) {
    var set = new Set();
    array.forEach(function (item) {
        set.add(item.id);
    });
    return set;
}

 ignoredProperties = {
    id: true,
    bookmarkID: true
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

function flattenFigures (figures) {
    return figures.reduce(function (array, figure) {
        array.push(figure);
        return figure.type == null ? array.concat(flattenFigures(figure.children)) : array;
    }, []);
}


function mapFiguresToRawData(figures) {
    figures.forEach(function (figure) {
        if (figure.type === null) {
            mapFiguresToRawData(figure.children);
        } else {
            figure.geometry = figure.geometry ? JSON.stringify(figure.geometry) : "";
            figure.properties = figure.properties ? JSON.stringify(figure.properties) : "";
        }
    });
}


module.exports = router;