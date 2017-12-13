const model = require("../../../logic/model");
const Op = require("sequelize").Op;

describe("Bookmarks", function () {

    it("can be created", function (done) {
        model.Bookmark.create({
            name: "Test Bookmark",
            groupId: 1
        }).then(function (item) {
            expect(item.id).toBeDefined();
            done();
        });
    });

    it("can be created with defaultVersion", function (done) {
        model.Bookmark.create({
            name: "Test Bookmark",
            groupId: 1,
            versions: [{name: "First Version"}]
        }, {
            include: [{
                as: "versions",
                model: model.Version
            }]
            
        }).then(function (item) {
            expect(item.id).toBeDefined();
            expect(item.defaultVersionId).toBeDefined();
            done();
        });
    });

});