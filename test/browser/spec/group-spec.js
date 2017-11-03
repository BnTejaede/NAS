describe("Group API", function () {
    
    it("can fetch groups", function (done) {
        sendRequest("http://localhost:8000/group", "GET").then(function (data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it("can fetch group by id", function (done) {
        var groupID = 1;
        sendRequest("http://localhost:8000/group/" + groupID, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.id).toBe(groupID);
            done();
        });
    });
});
    