const model = require("../../../src/data/model");
const Op = require("sequelize").Op;

describe("Versions", function () {

    it("can be created", function (done) {
        model.Version.create({
            name: "Test Version",
            sceneId: 1
        }).then(function (item) {
            expect(item.id).toBeDefined();
            done();
        });
    });

    it("can be created with figures", function (done) {
        model.Version.create({
            name: "Test Version with Figures",
            sceneId: 1,
            figures: [
                {
                    name: "Figure Folder",
                    geometry: null,
                    properties: "",
                    type: null,
                    parentId: null,
                    children: [
                        {
                            name: "Child",
                            geometry: null,
                            properties: "",
                            type: null,
                            children: [
                                {
                                    name: "Grandchild",
                                    geometry: null,
                                    properties: "",
                                    type: null
                                }
                            ]
                        },
                        {
                            name: "Child 2",
                            geometry: null,
                            properties: "",
                            type: null,
                            children: [
                                {
                                    name: "Grandchild 2",
                                    geometry: null,
                                    properties: "",
                                    type: null
                                }
                            ]
                        }
                    ],
                },
                {
                    name: "Figure Folder 2",
                    geometry: null,
                    properties: "",
                    type: null,
                    parentId: undefined
                },
                {
                    name: "Figure Folder 3",
                    geometry: null,
                    properties: "",
                    type: null,
                    parentId: undefined
                },
                {
                    name: "Figure Folder 4",
                    geometry: null,
                    properties: "",
                    type: null,
                    parentId: undefined
                },
                {
                    name: "Figure Folder 5",
                    geometry: null,
                    properties: "",
                    type: null,
                    parentId: undefined
                },
                {
                    name: "Figure Folder 6",
                    geometry: null,
                    properties: "",
                    type: null,
                    parentId: undefined
                }
            ]
        }, {
            include: [{
                model: model.Figure,
                as: "figures",
                include: [{
                    model: model.Figure,
                    as: "children"
                }]
            }]
        }).then(function (item) {
            expect(item.id).toBeDefined();
            return model.Figure.findAll({
                where: {
                    versionId: item.id,
                    parentId: null
                }
            });
        }).then(function (figures) {
            var parentsAndPrevious = figures.map(function (figure) {
                return {id: figure.id, parent: figure.parentId, previous: figure.previousId};
            });
            expect(figures.length).toEqual(6);
            done();
        });
    });

});