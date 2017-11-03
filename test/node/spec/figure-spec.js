const model = require("../../../src/data/model");
require("../../database"); //Fill test database

describe("Figures", function () {

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

});