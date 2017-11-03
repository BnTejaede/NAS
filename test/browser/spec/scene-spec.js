describe("Scene API", function () {
    var host = "http://localhost:8000/";

    it("can fetch scenes for a group", function (done) {
        sendRequest(host + "group/1/scene", "GET").then(function (data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it("can fetch scene by group and id", function (done) {
        var groupID = 1,
            sceneID = 1,
            url = host;

            url += "group/" + groupID + "/";
            url += "scene/" + sceneID;

        sendRequest(url, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.id).toBe(sceneID);
            expect(data.groupId).toBe(groupID);
            done();
        });
    });
});