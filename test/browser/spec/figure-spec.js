describe("Figure API", function () {
    var host = "http://localhost:8000/";
    
    it("can fetch figures for group, scene, and version", function (done) {
        sendRequest(host + "group/1/scene/1/version/1/figure", "GET").then(function (data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it("can fetch figure for group, scene, version, and id", function (done) {
        var groupID = 1,
            sceneID = 1,
            versionID = 1,
            figureID = 1,
            url = host;

            url += "group/" + groupID + "/";
            url += "scene/" + sceneID + "/";
            url += "version/" + versionID + "/";
            url += "figure/" + figureID;

        sendRequest(url, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.id).toBe(figureID);
            expect(data.versionId).toBe(versionID);
            done();
        });
    });

    it("can fetch all figures from root", function (done) {
        var url = host + "figure";

        sendRequest(url, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.items).toBeDefined();
            expect(data.items.length).toBeGreaterThan(0);
            done();
        });
    });

    it("can fetch figure from root", function (done) {
        var figureID = 5,
            url = host + "figure/" + figureID;

        sendRequest(url, "GET").then(function (data) {
            
            expect(data).toBeDefined();
            expect(data.id).toBe(figureID);
            done();
        });
    });

    it("can edit figure at root", function (done) {
        var figureID = 5,
            url = host + "figure/" + figureID,
            rand = "Figure " + (Math.random() * 10).toFixed(3);
            

        sendRequest(url, "GET").then(function (data) {
            data.name = rand;
            return sendRequest(url, "PUT", data);
        }).then(function (result) {
            return sendRequest(url, "GET");
        }).then(function (data) {
            expect(data.name).toEqual(rand);
            done();
        });     
    });

    it("can move figure with position", function (done) {
        var groupID = 1,
            sceneID = 1,
            versionID = 1,
            allFigureURL = host,
            url = host + "figure/",
            newPosition = 2,
            figureID,
            toMove;

            allFigureURL += "group/" + groupID + "/";
            allFigureURL += "scene/" + sceneID + "/";
            allFigureURL += "version/" + versionID + "/";
            allFigureURL += "figure/";

        sendRequest(allFigureURL, "GET").then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[0];
                toMove = root.children[1];
            
            url += toMove.id;
            figureID = toMove.id;
            return sendRequest(url, "PUT", {
                position: newPosition
            });
        }).then(function (data) {
            return sendRequest(allFigureURL, "GET");
        }).then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[0],
                moved = root.children[newPosition];

            expect(moved).toBeDefined();
            expect(moved.id).toEqual(figureID);
            done();
        });

    });

    it("can move figure with position & name", function (done) {
        var groupID = 1,
            sceneID = 1,
            versionID = 1,
            allFigureURL = host,
            url = host + "figure/",
            newPosition = 2,
            newName = "Edited Name",
            figureID,
            toMove;

            allFigureURL += "group/" + groupID + "/";
            allFigureURL += "scene/" + sceneID + "/";
            allFigureURL += "version/" + versionID + "/";
            allFigureURL += "figure/";

        sendRequest(allFigureURL, "GET").then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[0];
                toMove = root.children[1];
            
            url += toMove.id;
            figureID = toMove.id;
            return sendRequest(url, "PUT", {
                position: newPosition,
                name: newName
            });
        }).then(function (data) {
            return sendRequest(allFigureURL, "GET");
        }).then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[0],
                moved = root.children[newPosition];

            expect(moved).toBeDefined();
            expect(moved.id).toEqual(figureID);
            expect(moved.name).toEqual(newName);
            done();
        });

    });

    it("can move figure with position & parent", function (done) {
        var groupID = 1,
            sceneID = 1,
            versionID = 1,
            allFigureURL = host,
            url = host + "figure/",
            newPosition = 0,
            newParent,
            figureID,
            toMove;

            allFigureURL += "group/" + groupID + "/";
            allFigureURL += "scene/" + sceneID + "/";
            allFigureURL += "version/" + versionID + "/";
            allFigureURL += "figure/";

        sendRequest(allFigureURL, "GET").then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[0];
                toMove = root.children[1];
            
            newParent = roots[1];
            url += toMove.id;
            figureID = toMove.id;
            return sendRequest(url, "PUT", {
                position: newPosition,
                parentId: newParent.id
            });
        }).then(function (data) {
            return sendRequest(allFigureURL, "GET");
        }).then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[1],
                moved = root.children[newPosition];
        

            expect(moved).toBeDefined();
            expect(moved.id).toEqual(figureID);
            done();
        });

    });


    it("can reorder children", function (done) {
            var groupID = 1,
                sceneID = 1,
                versionID = 1,
                allFigureURL = host,
                url = host + "figure/",
                fromIndex = 1,
                toIndex = 4,
                toMove, newPrevious, oldPrevious, oldFollower,
                operations, order;

            allFigureURL += "group/" + groupID + "/";
            allFigureURL += "scene/" + sceneID + "/";
            allFigureURL += "version/" + versionID + "/";
            allFigureURL += "figure/";


        sendRequest(allFigureURL, "GET").then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[2];

            toMove = root.children[fromIndex].id;
            oldPrevious = root.children[fromIndex - 1] && root.children[fromIndex - 1].id || null;
            oldFollower = root.children[fromIndex + 1] && root.children[fromIndex + 1].id || null;
            if (fromIndex < toIndex) {
                newFollower = root.children[toIndex+1] && root.children[toIndex+1].id || null;
                newPrevious = root.children[toIndex] && root.children[toIndex].id || null;
            } else {
                newFollower = root.children[toIndex] && root.children[toIndex].id || null;
                newPrevious = root.children[toIndex-1] && root.children[toIndex-1].id || null;
            }
            
            
            operations = [
                {op: "replace", path: "/" + toMove, value: newPrevious},
                {op: "replace", path: "/" + newFollower, value: toMove},
                {op: "replace", path: "/" + oldFollower, value: oldPrevious}
            ];
            order = root.children.map(function (child) {
                return child.id;
            });
            url += root.id;
            return sendRequest(url, "PATCH", {
                operations: operations
            });
        }).then(function (response) {
            console.log("Response", order + " -- > " + response.order);
            expect(response).toBeDefined();
            done();
        });
            

                     
    });

});