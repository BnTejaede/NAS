const express = require('express');
const model = require("../data/model");
const router = express.Router({mergeParams: true});
const figureRouter = require("./figures");

router.use("/:version/figure", figureRouter);


router.get('/', function (req, res) {
    var sceneID = req.params.scene;
    model.Version.findAll({where: {sceneId: sceneID}}).then(function (versions) {
        res.send({
            items: versions
        });
    });
});

router.get('/:version', function (req, res) {
    var versionID = req.params.version;
    model.Version.find({where: {id: versionID}}).then(function (versions) {
        res.send(versions);
    });
});

module.exports = router;