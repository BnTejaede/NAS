const express = require('express');
const model = require("../data/model");
const router = express.Router({mergeParams: true});
const bodyParser = require('body-parser');

router.get('/', function (req, res) {
    var versionID = req.params.version;
    model.Figure.findAll({where: {versionId: versionID}}).then(function (figures) {
        res.send({
            items: figures
        });
    });
});

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawFigure = mapProperties(req.body),
        versionID = req.params.version;
    
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

    model.Figure.find({where: {id: figureID}}).then(function (figure) {
        return figure.update(rawFigure);
    }).then(function () {
        res.send({
            id: figureID
        });
    }).catch(function (error) {
        res.status(500);
        res.send({error: error});
    });
});

const ignoredProperties = {
    id: true,
    groupID: true,
    sceneID: true,
    versionID: true
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
    return value === undefined || (typeof value === "string" && !value.length) ? null : value;
}

function extractParentID (rawFigure) {
    var parentID = rawFigure.parentID;
    if (rawFigure.hasOwnProperty("parentID")) {
        delete rawFigure.parentID;
    }
    return parentID;
}

module.exports = router;