describe("Version API", function () {
    var host = "http://localhost:8000/";
    
    it("can fetch versions for a scene and group", function (done) {
        sendRequest(host + "group/1/scene/1/version", "GET").then(function (data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it("can fetch version for group, scene, and id", function (done) {
        var groupID = 1,
            sceneID = 1,
            versionID = 1,
            url = host;

            url += "group/" + groupID + "/";
            url += "scene/" + sceneID + "/";
            url += "version/" + versionID;

        sendRequest(url, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.id).toBe(versionID);
            expect(data.sceneId).toBe(sceneID);
            done();
        });
    });

    it("can fetch versions from root", function (done) {
        sendRequest(host + "version", "GET").then(function (data) {
            expect(data).toBeDefined();
            done();
        });
    });

});