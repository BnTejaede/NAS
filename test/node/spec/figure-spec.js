const model = require("../../../src/data/model");
describe("Figures", function () {
    var rootFigures;

    beforeAll(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
        model.Figure.findAll({
            where: {
                parentId: null
            }
        }).then(function (allFigures) {
            rootFigures = allFigures;
            done();
        });
    });


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
        var parent = rootFigures[0],
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
        var parent = rootFigures[0],
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


    it("can be moved to position", function (done) {
        var parent = rootFigures[0],
            fromPosition = 0,
            toPosition = 2,
            child;
        
        return parent.getChildren().then(function (children) {
            idToMove = children[fromPosition].id;
            return model.Figure.moveToPosition(idToMove, toPosition);
        }).then(function () {
            return parent.getChildren();
        }).then(function (children) {

            expect(children[toPosition].id).toEqual(idToMove);
            done();
        });
    });

    it("can be moved to next position", function (done) {
        var parent = rootFigures[0],
            fromPosition = 1,
            toPosition = 2,
            child;
        
        return parent.getChildren().then(function (children) {
            idToMove = children[fromPosition].id;
            return model.Figure.moveToPosition(idToMove, toPosition);
        }).then(function () {
            return parent.getChildren();
        }).then(function (children) {

            expect(children[toPosition].id).toEqual(idToMove);
            done();
        });
    });

    it("can be moved to last position", function (done) {
        var parent = rootFigures[0],
            fromPosition, toPosition,
            child;
        
        return parent.getChildren().then(function (children) {
            toPosition = children.length - 1;
            fromPosition = toPosition - 1;
            idToMove = children[fromPosition].id;
            return model.Figure.moveToPosition(idToMove, toPosition);
        }).then(function () {
            return parent.getChildren();
        }).then(function (children) {

            expect(children[toPosition].id).toEqual(idToMove);
            done();
        });
    });


    it("can be swapped", function (done) {
        var parent = rootFigures[0],
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
        var parentA = rootFigures[0],
            parentB = rootFigures[1],
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

    it("can move with position and parent", function (done) {
        var parentA = rootFigures[0],
            parentB = rootFigures[1],
            newPosition = 0,
            figureToMove;
            model.Figure.findAll({
                where: {
                    parentId: parentA.id
                }
            }).then(function (figures) {
                figureToMove = figures[figures.length-1];
                return figureToMove.update({parentId: parentB.id});
            }).then(function (updated) {
                figureToMove = updated;
                return model.Figure.moveToPosition(+figureToMove.id, newPosition);
            }).then(function (siblings) {
                return parentB.getChildren();
            }).then(function (siblings) {
                expect(siblings[newPosition].id).toEqual(figureToMove.id);
                done();
            });
    });


    it("can apply json patch", function (done) {
        var parent = rootFigures[2],
            fromIndex = 1,
            toIndex = 4,
            toMove, newPrevious, oldPrevious, oldFollower,
            operations, order;
            model.Figure.findAll({
                where: {
                    parentId: parent.id
                }
            }).then(function (figures) {
                toMove = figures[fromIndex].id;
                oldPrevious = figures[fromIndex - 1] && figures[fromIndex - 1].id || null;
                oldFollower = figures[fromIndex + 1] && figures[fromIndex + 1].id || null;

                if (fromIndex < toIndex) {
                    newFollower = figures[toIndex + 1] && figures[toIndex + 1].id || null;
                    newPrevious = figures[toIndex] && figures[toIndex].id || null;
                } else {
                    newFollower = figures[toIndex] && figures[toIndex].id || null;
                    newPrevious = figures[toIndex-1] && figures[toIndex-1].id || null;
                }
                


                operations = [
                    {op: "replace", path: "/" + toMove, value: newPrevious},
                    {op: "replace", path: "/" + newFollower, value: toMove},
                    {op: "replace", path: "/" + oldFollower, value: oldPrevious}
                ];

                order = figures.map(function (child) {
                    return child.id;
                });

                return model.Figure.applyPatch(parent.id, operations);
            }).then(function (result) {
                console.log(order, result.map(function (child) {
                    return child.id;
                }));
                done();
            });
    });


});