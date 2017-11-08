const model = require("../../../src/data/model");
const seed = require("../../../src/data/seed");
describe("Figures", function () {
    var figures;
    beforeAll(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
        seed().then(function (allFigures) {
            figures = allFigures;
            done();
        });
    }, 20000);

    it("can be created", function (done) {
        model.Figure.create({
            name: "Test Figure",
            description: "A Figure Created for tests",
            versionId: 1
        }).then(function (item) {
            expect(item.id).toBeDefined();
            done();
        });
    });

    it("can be created with parent", function (done) {
        var parent = figures["F1"],
            child;
        
            model.Figure.create({
                name: "Created Figure",
                description: "A figure created with a parent",
                versionId: 1,
                parentId: parent.id
            }).then(function (item) {
                child = item;
                expect(item.id).toBeDefined();
                return parent.getChildren();
            }).then(function (children) {
                expect(children[children.length-1].id).toBe(child.id);
                done();
            });
    });

    it("can be created with parent & position", function (done) {
        var parent = figures["F1"],
            position = 1,
            child;
        
            model.Figure.insertAtPosition({
                name: "Inserted Figure",
                description: "A figure created with a parent",
                versionId: 1,
                parentId: parent.id
            }, position).then(function (item) {
                child = item;
                expect(item.id).toBeDefined();
                return parent.getChildren();
            }).then(function (children) {
                expect(children[position].id).toBe(child.id);
                done();
            });
    });


    it("can be swapped", function (done) {
        var parent = figures["F1"],
            indexA = 0,
            indexB = 2,
            figureA, figureB;
        model.Figure.findAll({
            where: {
                parentId: parent.id
            }
        }).then(function (figures) {
            figureA = figures[indexA];
            figureB = figures[indexB];
            return model.Figure.swap(figureA.id, figureB.id);
        }).then(function (result) {
            return model.Figure.findAll({
                where: {
                    parentId: parent.id
                }
            });
        }).then(function (figures) {
            expect(figures[indexA].id).toBe(figureB.id);
            expect(figures[indexB].id).toBe(figureA.id);
            done();
        });
    });

    

    it("can switch parents", function (done) {
        var parentA = figures["F1"],
            parentB = figures["F2"],
            figureToMove;
        
            model.Figure.findAll({
                where: {
                    parentId: parentA.id
                }
            }).then(function (figures) {
                figureToMove = figures[0];
                return figureToMove.update({parentId: parentB.id});
            }).then(function (updated) {
                figureToMove = updated;
                expect(updated.parentId).toBe(parentB.id);
                return parentB.getChildren();
            }).then(function (siblings) {
                expect(siblings[siblings.length-1].id).toEqual(figureToMove.id);
                done();
            });

            done();
    });

});