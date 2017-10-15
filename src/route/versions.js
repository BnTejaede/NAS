const express = require('express');
const model = require("../data/model");
const router = express.Router({mergeParams: true});
const figureRouter = require("./figures");
const bodyParser = require('body-parser');

router.use("/:version/figure", figureRouter);


router.get('/', function (req, res) {
    var sceneID = req.params.scene;
    model.Version.findAll({where: {sceneId: sceneID}}).then(function (versions) {
        res.send({
            items: versions
        });
    });
});

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawVersion = mapProperties(req.body),
        sceneID = req.params.scene,
        version, options;

    rawVersion.sceneId = sceneID;
    rawVersion.figures = rawVersion.figures ? JSON.parse(rawVersion.figures) : [];
    mapFiguresToRawData(rawVersion.figures);

    version = model.Version.create(rawVersion, {
        include: [{
            model: model.Figure,
            as: "figures",
            include: [{
                model: model.Figure,
                as: "children"
            }]
        }]
    }).then(function (version) {
        res.send({
            sceneID: sceneID,
            id: version.id
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});

router.get('/:version', function (req, res) {
    var versionID = req.params.version;
    model.Version.find({where: {id: versionID}}).then(function (versions) {
        res.send(versions);
    });
});

router.put('/:version', bodyParser.urlencoded({ extended: true }), function (req, res) {
    var rawVersion = mapProperties(req.body),
        versionID = req.params.version;

    model.Version.find({where: {id: versionID}}).then(function (version) {
        return version.update(rawVersion);
    }).then(function () {
        res.send({
            id: versionID
        });
    }).catch(function (error) {
        res.status(500);
        res.send(error);
    });
});

const ignoredProperties = {
    id: true,
    sceneID: true
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