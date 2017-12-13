describe("Bookmark API", function () {
    var host = "http://localhost:8000/";

    it("can fetch bookmarks for a group", function (done) {
        sendRequest(host + "group/1/bookmark", "GET").then(function (data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it("can fetch bookmark by group and id", function (done) {
        var groupID = 1,
            bookmarkID = 1,
            url = host;

            url += "group/" + groupID + "/";
            url += "bookmark/" + bookmarkID;

        sendRequest(url, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.id).toBe(bookmarkID);
            expect(data.groupId).toBe(groupID);
            done();
        });
    });
});