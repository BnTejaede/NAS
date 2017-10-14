const express = require('express');
const model = require("../data/model");
const router = express.Router({mergeParams: true});

router.get('/', function (req, res) {
    var versionID = req.params.version;
    console.log("Scenes For Group ID: " + versionID);
    model.Figure.findAll({where: {versionId: versionID}}).then(function (figures) {
        res.send({
            items: figures
        });
    });
});

router.get('/:figure', function (req, res) {
    var figureID = req.params.figure;
    model.Figure.find({where: {id: figureID}}).then(function (figure) {
        res.send(figure);
    });
});

module.exports = router;