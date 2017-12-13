var Sequelize = require("sequelize"),
    model = require("../../logic/model"),
    // seedData = require("./data/figures-hierarchy.json");
    seedData = require("./data/test.json");



var rawDataByIdentifier = {},
    dataByRawIdentifier = {};

function clearDatabase() {
    return Promise.all([
        model.Group.sync({force: true}),
        model.Bookmark.sync({force: true}),
        model.Version.sync({force: true}),
        model.Figure.sync({force: true})
    ]);
}

function iterateWithActions(array, operation, results) {
    var next = array.shift();
        results = results || [];
    return performAction(next, operation).then(function (item) {
        results.push(item);
        return array.length ? iterateWithActions(array, operation, results) : results;
    });
}

function performAction(object, action) {
    return action(object);
}

function createGroup (rawGroup) {
    return model.Group.create(mapProperties(rawGroup)).then(function (group) {
        dataByRawIdentifier[rawGroup.identifier] = group;
        return group;
    });
}

function createBookmark (rawBookmark) {
    var group = dataByRawIdentifier[rawBookmark.groupIdentifier],
        mapped = mapProperties(rawBookmark);

    mapped.groupId = group.id;

    return model.Bookmark.create(mapped).then(function (bookmark) {
        dataByRawIdentifier[rawBookmark.identifier] = bookmark;
        return bookmark;
    });
}

function createVersion (rawVersion) {
    var bookmark = dataByRawIdentifier[rawVersion.bookmarkIdentifier],
        mapped = mapProperties(rawVersion),
        isDefaultVersion = false;

    mapped.bookmarkId = bookmark.id;
    if (!bookmarksWithDefaultVersions[bookmark.id]) {
        bookmarksWithDefaultVersions[bookmark.id] = true;
        isDefaultVersion = true;
    }

    return model.Version.create(mapped).then(function (version) {
        dataByRawIdentifier[rawVersion.identifier] = version;
        if (isDefaultVersion) {
            return bookmark.update({
                defaultVersionId: version.id
            }).then(function () {
                return version;
            });
        } else {
            return version;
        }
    });
}

var bookmarksWithDefaultVersions = {};

function createFigure (rawFigure) {
    var version = dataByRawIdentifier[rawFigure.versionIdentifier],
        mapped = mapProperties(rawFigure),
        parent;

    mapped.versionId = version.id;

    return model.Figure.create(mapped).then(function (figure) {
        dataByRawIdentifier[rawFigure.identifier] = figure;
        return figure;
    });
}

function setFigureParent (rawFigure) {
    var figure = dataByRawIdentifier[rawFigure.identifier],
        parent = dataByRawIdentifier[rawFigure.parentIdentifier];
    return parent ? parent.addChild(figure) : Promise.resolve(null);
}

var ignoredProperties = {
    identifier: true,
    groupIdentifier: true,
    bookmarkIdentifier: true,
    versionIdentifier: true,
    parentIdentifier: true,
    bookmarks: true,
    versions: true,
    figures: true,
    children: true
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
    return value === undefined || (typeof value === "string" && !value.length) ? null : value;
}

function populateRawDataCache() {
    seedData.groups.forEach(function (group) {
        rawDataByIdentifier[group.identifier] = group;
        group.bookmarks = [];
    });
    
    seedData.bookmarks.forEach(function (bookmark) {
        
        bookmark.group = rawDataByIdentifier[bookmark.groupIdentifier];
        bookmark.group.bookmarks.push(bookmark);
        rawDataByIdentifier[bookmark.identifier] = bookmark;
        bookmark.versions = [];
    });
    
    seedData.versions.forEach(function (version) {
        version.bookmark = rawDataByIdentifier[version.bookmarkIdentifier];
        version.bookmark.versions.push(version);
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

    var parentLessCount = 0;
    seedData.figures.forEach(function (figure) {
        var previous;
        figure.parent = rawDataByIdentifier[figure.parentIdentifier];
        if (figure.parent) {
            figure.parent.children = figure.parent.children || [];
            previous = figure.parent.children[figure.parent.children.length - 1];
            // figure.position = figure.parent.children.length;
            if (previous) {
                previous.nextChildIdentifier = figure.identifier;
            }
            figure.parent.children.push(figure);
        } else {
            // figure.position = parentLessCount;
            parentLessCount++;
        }
    });
}

function populateSeedData () {
    populateRawDataCache();
    return clearDatabase().then(function () {
        return iterateWithActions(seedData.groups.slice(), createGroup);
    }).then(function () {
        return iterateWithActions(seedData.bookmarks.slice(), createBookmark);
    }).then(function () {
        return iterateWithActions(seedData.versions.slice(), createVersion);
    }).then(function () {
        return iterateWithActions(seedData.figures.slice(), createFigure);
    }).then(function () {
        console.log("FinishCreateFigure....");
        return iterateWithActions(seedData.figures.slice(), setFigureParent);
    }).then(function () {
        console.log("FinishSeed....");
        return dataByRawIdentifier;
    }).catch(function (e) {
        console.error(e);
    });
}

function populateSeedDataNew() {
    return clearDatabase().then(function () {
        return iterateWithActions(groups.slice(), createGroup);
    }).then(function () {
        return iterateWithActions(bookmarks.slice(), createBookmark);
    }).then(function () {
        return iterateWithActions(versions.slice(), createVersion);
    }).then(function () {
        return iterateWithActions(figures.slice(), createFigure);
    }).then(function () {
        console.log("FinishCreateFigure....");
        return iterateWithActions(figures.slice(), setFigureParent);
    }).then(function () {
        console.log("FinishSeed....");
        return dataByRawIdentifier;
    }).catch(function (e) {
        console.error(e);
    });
}

// clearDatabase();
// populateSeedData();

