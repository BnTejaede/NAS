const express = require('express');
const model = require("../data/model");
const router = express.Router({mergeParams: true});
const bodyParser = require('body-parser');
const accessControl = require("../access-control");

router.use(accessControl);
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
        versionID = req.params.version;
    
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


var acceptedMethods = ["GET", "PUT"];
router.all('/:figure', function (req, res, next) {
    if (acceptedMethods.indexOf(req.method) === -1) {
        res.status(405);
        res.send("Method Not Allowed");
    } else {
        next(); // pass control to the next handler
    }
});

router.get('/:figure', function (req, res) {
    var figureID = req.params.figure;
    model.Figure.find({where: {id: figureID}}).then(function (figure) {
        res.send(figure);
    });
});

router.put('/:figure', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawFigure = mapProperties(req.body),
        figureID = req.params.figure;

    if (rawFigure.hasOwnProperty("position")) {
        model.Figure.moveToPosition(+figureID, +rawFigure.position).then(function () {
            res.send({
                id: +figureID,
                position: +rawFigure.position
            });
        }).catch(function (error) {
            console.log(error);
            res.status(500);
            res.send({error: error});
        });
    } else {
        model.Figure.update(rawFigure, {where: {id: figureID}}).then(function () {
            res.send({
                id: figureID
            });
        }).catch(function (error) {
            console.log(error);
            res.status(500);
            res.send({error: error});
        });
    }
});

// router.patch('/:figure', bodyParser.urlencoded({ extended: true }), function (req, res) {
//     var operations = req.body;
//     res.send({
//         operations: req.body
//     });
// });

const ignoredProperties = {
    id: true,
    groupID: true,
    groupId: true,
    sceneID: true,
    sceneId: true,
    versionID: true,
    versionId: true
};

const formPropertyToDatabaseProperty = {
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