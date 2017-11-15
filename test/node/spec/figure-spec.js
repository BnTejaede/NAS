const model = require("../../../src/data/model");
const Op = require("sequelize").Op;

describe("Figures", function () {
    var rootFigures;

    // beforeAll(function (done) {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
    //     model.Figure.findAll({
    //         where: {
    //             parentId: null
    //         }
    //     }).then(function (allFigures) {
    //         rootFigures = allFigures;
    //         done();
    //     });
    // });


    // it("can be created", function (done) {
    //     model.Figure.create({
    //         name: "Test Figure",
    //         description: "A Figure Created for tests",
    //         versionId: 1
    //     }).then(function (item) {
    //         expect(item.id).toBeDefined();
    //         done();
    //     });
    // });

    // it("can be created with parent", function (done) {
    //     var parent = rootFigures[0],
    //         child;
        
    //         model.Figure.create({
    //             name: "Created Figure",
    //             description: "A figure created with a parent",
    //             versionId: 1,
    //             parentId: parent.id
    //         }).then(function (item) {
    //             child = item;
    //             expect(item.id).toBeDefined();
    //             return parent.getChildren();
    //         }).then(function (children) {
    //             expect(children[children.length-1].id).toBe(child.id);
    //             done();
    //         });
    // });

    // it("can be created with parent & position", function (done) {
    //     var parent = rootFigures[0],
    //         position = 1,
    //         child;
    //         model.Figure.insertAtPosition({
    //             name: "Inserted Figure",
    //             description: "A figure created with a parent",
    //             versionId: 1,
    //             parentId: parent.id
    //         }, position).then(function (item) {
    //             child = item;
    //             expect(item.id).toBeDefined();
    //             return parent.getChildren();
    //         }).then(function (children) {
    //             expect(children[position].id).toBe(child.id);
    //             done();
    //         });
    // });


    // it("can be moved to position", function (done) {
    //     var parent = rootFigures[0],
    //         fromPosition = 0,
    //         toPosition = 2,
    //         child;
        
    //     return parent.getChildren().then(function (children) {
    //         idToMove = children[fromPosition].id;
    //         return model.Figure.moveToPosition(idToMove, toPosition);
    //     }).then(function () {
    //         return parent.getChildren();
    //     }).then(function (children) {

    //         expect(children[toPosition].id).toEqual(idToMove);
    //         done();
    //     });
    // });

    // it("can be moved to next position", function (done) {
    //     var parent = rootFigures[0],
    //         fromPosition = 1,
    //         toPosition = 2,
    //         child;
        
    //     return parent.getChildren().then(function (children) {
    //         idToMove = children[fromPosition].id;
    //         return model.Figure.moveToPosition(idToMove, toPosition);
    //     }).then(function () {
    //         return parent.getChildren();
    //     }).then(function (children) {

    //         expect(children[toPosition].id).toEqual(idToMove);
    //         done();
    //     });
    // });

    // it("can be moved to last position", function (done) {
    //     var parent = rootFigures[0],
    //         fromPosition, toPosition,
    //         child;
        
    //     return parent.getChildren().then(function (children) {
    //         toPosition = children.length - 1;
    //         fromPosition = toPosition - 1;
    //         idToMove = children[fromPosition].id;
    //         return model.Figure.moveToPosition(idToMove, toPosition);
    //     }).then(function () {
    //         return parent.getChildren();
    //     }).then(function (children) {

    //         expect(children[toPosition].id).toEqual(idToMove);
    //         done();
    //     });
    // });


    // it("can be swapped", function (done) {
    //     var parent = rootFigures[0],
    //         indexA = 0,
    //         indexB = 2,
    //         figureA, figureB;
    //     model.Figure.findAll({
    //         where: {
    //             parentId: parent.id
    //         }
    //     }).then(function (figures) {
    //         figureA = figures[indexA];
    //         figureB = figures[indexB];
    //         return model.Figure.swap(figureA.id, figureB.id);
    //     }).then(function (result) {
    //         return model.Figure.findAll({
    //             where: {
    //                 parentId: parent.id
    //             }
    //         });
    //     }).then(function (figures) {
    //         expect(figures[indexA].id).toBe(figureB.id);
    //         expect(figures[indexB].id).toBe(figureA.id);
    //         done();
    //     });
    // });

    

    // it("can switch parents", function (done) {
    //     var parentA = rootFigures[0],
    //         parentB = rootFigures[1],
    //         figureToMove;
        
    //         model.Figure.findAll({
    //             where: {
    //                 parentId: parentA.id
    //             }
    //         }).then(function (figures) {
    //             figureToMove = figures[0];
    //             return figureToMove.update({parentId: parentB.id});
    //         }).then(function (updated) {
    //             figureToMove = updated;
    //             expect(updated.parentId).toBe(parentB.id);
    //             return parentB.getChildren();
    //         }).then(function (siblings) {
    //             expect(siblings[siblings.length-1].id).toEqual(figureToMove.id);
    //             done();
    //         });

    //         done();
    // });

    // it("can move with position and parent", function (done) {
    //     var parentA = rootFigures[0],
    //         parentB = rootFigures[1],
    //         newPosition = 0,
    //         figureToMove;
    //         model.Figure.findAll({
    //             where: {
    //                 parentId: parentA.id
    //             }
    //         }).then(function (figures) {
    //             figureToMove = figures[figures.length-1];
    //             return figureToMove.update({parentId: parentB.id});
    //         }).then(function (updated) {
    //             figureToMove = updated;
    //             return model.Figure.moveToPosition(+figureToMove.id, newPosition);
    //         }).then(function (siblings) {
    //             return parentB.getChildren();
    //         }).then(function (siblings) {
    //             expect(siblings[newPosition].id).toEqual(figureToMove.id);
    //             done();
    //         });
    // });


    // it("can apply json patch", function (done) {
    //     var parent = rootFigures[2],
    //         fromIndex = 1,
    //         toIndex = 4,
    //         toMove, newPrevious, oldPrevious, oldFollower,
    //         operations, order;
    //         model.Figure.findAll({
    //             where: {
    //                 parentId: parent.id
    //             }
    //         }).then(function (figures) {
    //             toMove = figures[fromIndex].id;
    //             oldPrevious = figures[fromIndex - 1] && figures[fromIndex - 1].id || null;
    //             oldFollower = figures[fromIndex + 1] && figures[fromIndex + 1].id || null;

    //             if (fromIndex < toIndex) {
    //                 newFollower = figures[toIndex + 1] && figures[toIndex + 1].id || null;
    //                 newPrevious = figures[toIndex] && figures[toIndex].id || null;
    //             } else {
    //                 newFollower = figures[toIndex] && figures[toIndex].id || null;
    //                 newPrevious = figures[toIndex-1] && figures[toIndex-1].id || null;
    //             }
                


    //             operations = [
    //                 {op: "replace", path: "/" + toMove, value: newPrevious},
    //                 {op: "replace", path: "/" + newFollower, value: toMove},
    //                 {op: "replace", path: "/" + oldFollower, value: oldPrevious}
    //             ];

    //             order = figures.map(function (child) {
    //                 return child.id;
    //             });

    //             return model.Figure.applyPatch(parent.id, operations);
    //         }).then(function (result) {
    //             console.log(order, result.map(function (child) {
    //                 return child.id;
    //             }));
    //             done();
    //         });
    // });

    // it("can be deleted", function (done) {
    //     var parent = rootFigures[2],
    //         indexToDelete = 3,
    //         count, figureToDelete;
    //     model.Figure.findAll({
    //         where: {
    //             parentId: parent.id
    //         }
    //     }).then(function (figures) {
    //         figureToDelete = figures[indexToDelete].id;
    //         count = figures.length;
    //         return model.Figure.destroy({
    //             where: {
    //                 id: figureToDelete
    //             }
    //         });
    //     }).then(function (result) {
    //         return model.Figure.findAll({
    //             where: {
    //                 parentId: parent.id
    //             }
    //         });
    //     }).then(function (figures) {
    //         expect(figures.length).toEqual(count - 1);
    //         expect(figures.map(function (figure) {
    //             return figure.id;
    //         }).indexOf(figureToDelete)).toEqual(-1);
    //         done();
    //     });
    // });

    // it("can be deleted with cascade", function (done) {
    //     var parent = rootFigures[2],
    //         totalCount, toDeleteCount,
    //         figureToDelete;
            
    //     return model.Figure.count().then(function (result) {
    //         totalCount = result;
    //         return model.Figure.count({
    //             where: {
    //                 [Op.or]: {
    //                     id: parent.id,
    //                     parentId: parent.id
    //                 }
    //             }
    //         });
    //     }).then(function (result) {
    //         toDeleteCount = result;
    //         return model.Figure.destroy({
    //             where: {
    //                 id: parent.id
    //             }
    //         });
    //     }).then(function (result) {
    //         return model.Figure.count({
    //             where: {
    //                 [Op.or]: {
    //                     id: parent.id,
    //                     parentId: parent.id
    //                 }
    //             }
    //         });
    //     }).then(function (result) {
    //         expect(result).toEqual(0);
    //         return model.Figure.count();
    //     }).then(function (result) {
    //         expect(result).toEqual(totalCount - toDeleteCount);
    //         done();
    //     });
    // });

    it("can create linestring", function (done) {
        var rawFigure = {
                properties: JSON.stringify({"isResizable":true,"dataURL":"","displayLabelBorder":true,"displayDistanceLabels":false,"displayDistanceTotal":false,"displayMeasurementInLabel":false,"displayNameInLabel":false,"fillColor":"#000000","fillOpacity":0.5,"fontColor":"#000000","fontSize":14,"imageOpacity":1,"isFreeHand":true,"isNewObject":false,"labelStrokeColor":"#000000","labelStrokeOpacity":1,"labelStrokeWidth":1,"labelType":"buffer","preserveAspectRatio":false,"radius":0,"isCenteredOnOrigin":false,"strokeColor":"#000000","strokeOpacity":1,"strokeWidth":2,"units":"metric","type":5,"name":"Polyline","description":"Polyline Figure","hasLabel":false}),
                parentId: null,
                versionId: 1,
                type: 5,
                geometry: JSON.stringify({"type":"LineString","coordinates":[[34.86328125,5.3902791540347765],[38.0712890625,5.783907261125067],[38.4228515625,6.133569684123702],[38.466796875,6.439336758699363],[38.2470703125,7.1811306713952865],[37.060546875,8.660972818186073],[35.478515625,9.788754574536439],[33.80859375,10.567315944564141],[30.9521484375,11.25772210942178],[30.380859375,11.473139752178504],[30.29296875,11.688393136595147],[30.380859375,11.989466381354378],[30.732421875,12.29020402910582],[31.5673828125,12.676360885368638],[35.91796875,14.001879850083677],[36.26953125,14.214978478455771],[36.357421875,14.725591579429542],[35.830078125,15.53160722264882],[34.9951171875,15.785493270562522]]}),
                name: "Polyline"
            },
            position = 3,
            child;
            model.Figure.insertAtPosition(rawFigure, position).then(function (item) {
                child = item;
                expect(item.id).toBeDefined();
                return model.Figure.findAll({
                    where: {
                        versionId: rawFigure.versionId,
                        parentId: null
                    }
                });
            }).then(function (children) {
                expect(children[position].id).toBe(child.id);
                done();
            });
    });

        // it("can be created with parent & position", function (done) {
    //     var parent = rootFigures[0],
    //         position = 1,
    //         child;
    //         model.Figure.insertAtPosition({
    //             name: "Inserted Figure",
    //             description: "A figure created with a parent",
    //             versionId: 1,
    //             parentId: parent.id
    //         }, position).then(function (item) {
    //             child = item;
    //             expect(item.id).toBeDefined();
    //             return parent.getChildren();
    //         }).then(function (children) {
    //             expect(children[position].id).toBe(child.id);
    //             done();
    //         });
    // });


});