const model = require("../../../src/data/model");
const seed = require("../../../src/data/seed");
describe("Figures", function () {
    var figures;
    beforeAll(function (done) {
        seed().then(function (allFigures) {
            figures = allFigures;
            done();
        });
    }, 20000);

    // it("can be created", function (done) {
    //     model.Figure.create({
    //         name: "Test Figure",
    //         description: "A Figure Created for tests",
    //         versionId: 1
    //     }).then(function (item) {
    //         console.log("CreateTestFigure....");
    //         expect(item.id).toBeDefined();
    //         done();
    //     });
    // });

    it("can create figure with parent", function (done) {
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
                expect(item.position).toBeDefined();
                return parent.getChildren();
            }).then(function (children) {
                expect(children[children.length-1].id).toBe(child.id);
                done();
            });
    });

    it("can create figure with parent & position", function (done) {
        var parent = figures["F1"],
            child;
        
            model.Figure.create({
                name: "Inserted Figure",
                description: "A figure created with a parent",
                versionId: 1,
                parentId: parent.id,
                position: 1
            }).then(function (item) {
                child = item;
                expect(item.id).toBeDefined();
                expect(item.position).toBeDefined();
                return parent.getChildren();
            }).then(function (children) {
                expect(children[1].id).toBe(child.id);
                done();
            });
    });

    it("can swap figure positions", function (done) {
        var parent = figures["F1"],
            figureA, figureB, positionA, positionB;
        model.Figure.findAll({
            where: {
                parentId: parent.id
            }
        }).then(function (figures) {
            figureA = figures[0];
            figureB = figures[2];
            positionA = figureA.position;
            positionB = figureB.position;
            return model.Figure.swap(figureA.id, figureB.id);
        }).then(function (result) {
            return Promise.all([
                figureA.reload(),
                figureB.reload()
            ]);
        }).then(function () {
            expect(figureA.position).toEqual(positionB);
            expect(figureB.position).toEqual(positionA);
            done();
        });
    });

    

    // it("can switch parents", function (done) {
    //     model.Figure.create({
    //         name: "Test Figure",
    //         description: "A Figure Created for tests",
    //         versionId: 1
    //     }).then(function (item) {
    //         expect(item.id).toBeDefined();
    //         done();
    //     });
    // });

});