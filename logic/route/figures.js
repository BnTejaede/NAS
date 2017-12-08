var express = require('express'),
    model = require("../model"),
    router = express.Router({mergeParams: true}),
    bodyParser = require('body-parser'),
    accessControl = require("../access-control"),
    jsonPatch = require("fast-json-patch");

router.use(accessControl);
/**
 * @swagger
 * /version/{versionId}/figure:
 *   get:
 *     description: Get all Figures for a Version
 *     tags:
 *      - Figures
 *     parameters:
 *     - $ref: '#/parameters/versionId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all Figures for a Version
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Scene'
 *   post:
 *     description: Create a Figure
 *     tags:
 *      - Figures
 *     parameters:
 *       - $ref: '#/parameters/versionId'
 *       - $ref: '#/parameters/figureName'
 *       - $ref: '#/parameters/geometry'
 *       - $ref: '#/parameters/figureProperties'
 *       - $ref: '#/parameters/figureType'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of new Figure
 *         schema:
 *           type: object
 */
router.get('/', function (req, res) {
    var versionID = req.params.version,
        options = {};
    if (versionID !== undefined) {
        options = {
            where: {versionId: versionID}
        };
    }

    model.Figure.findAll(options).then(function (figures) {
        res.send({
            items: figures
        });
    });
});

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawFigure = mapProperties(req.body),
        versionID = req.params.version || rawFigure.versionId,
        position = +rawFigure.position;
        
        delete rawFigure.position;
    
    if (versionID === undefined) {
        res.status(400);
        res.send({error: "Cannot create figure without version id"});
    } else {
        rawFigure.versionId = versionID;
        model.Figure.create(rawFigure).then(function (figure) {
            res.send({
                versionID: versionID,
                id: figure.id
            });
        }).catch(function (error) {
            res.status(500);
            res.send({error: error});
        });
    }
    
});


var acceptedMethods = ["DELETE", "GET", "PATCH", "PUT"];
router.all('/:figure', function (req, res, next) {
    if (acceptedMethods.indexOf(req.method) === -1) {
        res.status(405);
        res.send("Method Not Allowed");
    } else {
        next(); // pass control to the next handler
    }
});


/**
 * @swagger
 * /figure/{figureId}:
 *   get:
 *     description: Get Figure by ID
 *     tags:
 *      - Figures
 *     parameters:
 *     - $ref: '#/parameters/figureId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns Figure object
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Figure'
 *   put:
 *     description: Edit a Figure
 *     tags:
 *      - Figures
 *     parameters:
 *       - $ref: '#/parameters/figureId'
 *       - $ref: '#/parameters/figureName'
 *       - $ref: '#/parameters/geometry'
 *       - $ref: '#/parameters/figureProperties'
 *       - $ref: '#/parameters/figureType'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of edited Version
 *         schema:
 *           type: object
 *   delete:
 *     description: Delete a Figure
 *     tags:
 *      - Figures
 *     parameters:
 *       - $ref: '#/parameters/figureId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ID of deleted Figure
 *         schema:
 *           type: object
 *   patch:
 *     description: Reorder children of a Figure Folder
 *     tags:
 *      - Figures
 *     parameters:
 *       - $ref: '#/parameters/figureId'
 *       - $ref: '#/parameters/patchOperations'
 *     consumes:
 *      - application/x-www-form-urlencoded
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns ids of Figure children in the new order
 *         schema:
 *           type: object
 */
router.get('/:figure', function (req, res) {
    var figureID = req.params.figure;
    model.Figure.find({where: {id: figureID}}).then(function (figure) {
        res.send(figure);
    });
});

router.put('/:figure', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawFigure = mapProperties(req.body),
        figureID = req.params.figure,
        position = +rawFigure.position;

    delete rawFigure.position;
    
    
    model.Figure.update(rawFigure, {where: {id: figureID}}).then(function () {
        return isNaN(position) ? null : model.Figure.moveToPosition(+figureID, +position);
    }).then(function () {
        res.send({
            id: figureID
        });
    }).catch(function (error) {
        console.log(error);
        res.status(500);
        res.send({error: error});
    });
});

router.delete('/:figure', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var figureID = req.params.figure;
    model.Figure.destroy({where: {id: figureID}}).then(function (result) {
        res.send({
            id: figureID
        });
    }).catch(function (error) {
        res.status(500);
        res.send({error: error});
    });
});

router.patch('/:figure', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var figureID = req.params.figure, 
        operations = JSON.parse(req.body.operations);
    
    return model.Figure.applyPatch(figureID, operations).then(function (children) {
        res.send({
            order: children.map(function (child) {
                return child.id;
            })
        });
    });
    
});


/**
 * @swagger
 * /figure/{figureId}/children:
 *   get:
 *     description: Get children of Figure
 *     tags:
 *      - Figures
 *     parameters:
 *     - $ref: '#/parameters/figureId'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all children of Figure
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Figure'
 *
 */

router.get('/:figure/children', function (req, res) {
    var figureID = req.params.figure;
    model.Figure.findAll({where: {parentId: figureID}}).then(function (children) {
        res.send({
            items: children
        });
    }).catch(function (error) {
        console.log(error);
        res.status(500);
        res.send({error: error});
    });
});


var ignoredProperties = {
    id: true,
    groupID: true,
    groupId: true,
    sceneID: true,
    sceneId: true,
    versionID: true
};

var formPropertyToDatabaseProperty = {
    parentID: "parentId"
};

function mapProperties(object) {
    var keys = Object.keys(object),
        properties = {},
        dbKey;
    keys.forEach(function (key) {
        if (!ignoredProperties[key]) {
            dbKey = formPropertyToDatabaseProperty[key] || key;
            properties[dbKey] = normalizeValue(object[key]);
        }
    });
    return properties;
}

function normalizeValue(value) {
    var isUndefined = value === undefined,
        isInvalidString = !isUndefined && typeof value === "string" && (!value.length || value === "null");
    return isUndefined || isInvalidString ? null : value;
}

function extractParentID (rawFigure) {
    var parentID = rawFigure.parentID;
    if (rawFigure.hasOwnProperty("parentID")) {
        delete rawFigure.parentID;
    }
    return parentID;
}

module.exports = router;