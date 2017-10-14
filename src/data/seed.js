const db = require("./database");
const model = require("./model");
const seedData = require("../../data/groups.json");

var rawDataByIdentifier = {},
    dataByRawIdentifier = {};

function clearDatabase() {
    return Promise.all([
        model.Group.sync({force: true}),
        model.Scene.sync({force: true}),
        model.Version.sync({force: true}),
        model.Figure.sync({force: true})
    ]);
}

function mapToPromiseAll (array, operation) {
    return Promise.all(array.map(function (item) {
        return operation(item);
    }));
}

function createGroup (rawGroup) {
    return model.Group.create(mapProperties(rawGroup)).then(function (group) {
        dataByRawIdentifier[rawGroup.identifier] = group;
        return group;
    });
}

function createScene (rawScene) {
    return model.Scene.create(mapProperties(rawScene)).then(function (scene) {
        var group = dataByRawIdentifier[rawScene.groupIdentifier];
        group.addScene(scene);
        dataByRawIdentifier[rawScene.identifier] = scene;
        return scene;
    });
}

function createVersion (rawVersion) {
    return model.Version.create(mapProperties(rawVersion)).then(function (version) {
        var scene = dataByRawIdentifier[rawVersion.sceneIdentifier];
        scene.addVersion(version);
        dataByRawIdentifier[rawVersion.identifier] = version;
        return version;
    });
}

function createFigure (rawFigure) {
    return model.Figure.create(mapProperties(rawFigure)).then(function (figure) {
        var version = dataByRawIdentifier[rawFigure.versionIdentifier];
        version.addFigure(figure);
        dataByRawIdentifier[rawFigure.identifier] = figure;
        return figure;
    });
}

function setFigureParent (rawFigure) {
    var figure = dataByRawIdentifier[rawFigure.identifier],
        parent = dataByRawIdentifier[rawFigure.parentIdentifier];
    return parent ? parent.addChild(figure) : null;
}


const ignoredProperties = {
    identifier: true,
    groupIdentifier: true,
    sceneIdentifier: true,
    scenes: true,
    versions: true,
    figures: true,
    children: true
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

function populateRawDataCache() {
    seedData.groups.forEach(function (group) {
        rawDataByIdentifier[group.identifier] = group;
        group.scenes = [];
    });
    
    seedData.scenes.forEach(function (scene) {
        scene.group = rawDataByIdentifier[scene.groupIdentifier];
        scene.group.scenes.push(scene);
        rawDataByIdentifier[scene.identifier] = scene;
        scene.versions = [];
    });
    
    seedData.versions.forEach(function (version) {
        version.scene = rawDataByIdentifier[version.sceneIdentifier];
        version.scene.versions.push(version);
        rawDataByIdentifier[version.identifier] = version;
        version.figures = [];
    });

    seedData.figures.forEach(function (figure) {
        rawDataByIdentifier[figure.identifier] = figure;
        version = rawDataByIdentifier[figure.versionIdentifier];
        version.figures.push(figure);
        figure.geometry = figure.geometry ? JSON.stringify(figure.geometry) : "";
        figure.properties = figure.properties ? JSON.stringify(figure.properties) : "";
    });

    seedData.figures.forEach(function (figure) {
        figure.parent = rawDataByIdentifier[figure.parentIdentifier];
        if (figure.parent) {
            figure.parent.children = figure.parent.children || [];
            figure.parent.children.push(figure);
        }
    });
}

function populateSeedData () {
    populateRawDataCache();
    clearDatabase().then(function () {
        mapToPromiseAll(seedData.groups, createGroup).then(function () {
            return mapToPromiseAll(seedData.scenes, createScene);
        }).then(function () {
            return mapToPromiseAll(seedData.versions, createVersion);
        }).then(function () {
            return mapToPromiseAll(seedData.figures, createFigure);
        }).then(function () {
            return mapToPromiseAll(seedData.figures, setFigureParent);
        }).catch(function (e) {
            console.error(e);
        });
    })
}

module.exports = populateSeedData;

