var express = require('express'),
    app = express(),
    groupsRouter = require("./logic/route/groups"),
    figuresRouter = require("./logic/route/figures"),
    versionsRouter = require("./logic/route/versions"),
    accessControl = require("./logic/access-control"),
    swaggerUi = require('swagger-ui-express'),
    definitions = require("./api/definitions.json").definitions,
    swaggerSpec = require("./swagger");


      

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/group", groupsRouter);
app.use("/figure", figuresRouter);
app.use("/version", versionsRouter);
app.use("/", express.static("form"));
app.use('/app', express.static('app'));

/********************************************
 * TODO Move all of the requests below to routers
 */
  app.get('/hazards?:groupId', function (req, res) {
    
        // console.log("=== Group ID ===");
        // console.log('groupId: ', req.query["groupId"]);
    
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Content-Type", "application/json");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");

        const data = [
            {"app_ID":0,"app_IDs":"","autoexpire":"Y","category_ID":"EVENT","charter_Uri":"","comment_Text":"HIGHWIND-ADVISORY-2017-26","create_Date":"1507209696762","creator":"D2P2","end_Date":"1507262400000","glide_Uri":"","hazard_ID":17052,"hazard_Name":"Highwind - Advisory (Hawaiian Islands)","last_Update":"1507209760742","latitude":21.5,"longitude":-156.0,"master_Incident_ID":"17.1507209655967.9","message_ID":"17.1507209655967","org_ID":-1,"severity_ID":"ADVISORY","snc_url":"http://snc.pdc.org/TEST/3c15bf46-28de-4032-825e-837c7ffa70a6/index.html","start_Date":"1507209300000","status":"A","type_ID":"HIGHWIND","update_Date":"1507209697793","update_User":null,"product_total":"2","uuid":"3c15bf46-28de-4032-825e-837c7ffa70a6","in_Dashboard":"","areabrief_url":null,"description":"The National Weather Service has issued a High Wind Advisory for the Hawaiian Islands.\n\nWind Advisory for strong trade winds.\n\nA very strong high north of the area will produce strong trade winds today. Winds are expected to subside quickly tonight.\n\nWIND ADVISORY IN EFFECT UNTIL 600 PM THIS EVENING\n\nMessage:The National Weather Service in Honolulu has issued a Wind Advisory, which is in effect until 600 PM this evening. \n * TIMING...through this evening. \n * WINDS...northeast to east winds to 45 to 55 mph with gusts to 65 mph. \n * IMPACTS....winds this strong can cause power outages, make driving difficult and swing doors open and shut forcefully. \n\nEnd of Message."},
            {"app_ID":0,"app_IDs":"","autoexpire":"Y","category_ID":"EVENT","charter_Uri":"","comment_Text":"D2P2 auto-generated Earthquake Hazard","create_Date":"1507203429006","creator":"D2P2","end_Date":"1507289829977","glide_Uri":"","hazard_ID":17051,"hazard_Name":"Earthquake - 5.0 - 4km NW of San Pedro, Philippines","last_Update":"1507203513690","latitude":7.3643,"longitude":126.4874,"master_Incident_ID":"3.1507203393785.1","message_ID":"3.1507203393785","org_ID":-1,"severity_ID":"ADVISORY","snc_url":"http://snc.pdc.org/TEST/4163c1e7-8a22-4d30-a8aa-f9d2753ba3e8/index.html","start_Date":"1507202248310","status":"A","type_ID":"EARTHQUAKE","update_Date":"1507203428462","update_User":null,"product_total":"2","uuid":"4163c1e7-8a22-4d30-a8aa-f9d2753ba3e8","in_Dashboard":"","areabrief_url":null,"description":"An earthquake occurred with a magnitude of 5.0 at a depth of 10.0 km, Location: 4km NW of San Pedro, Philippines reported by USGS at October 05, 11:34:57 GMT.\n\nPDC classifies this event as an \"Advisory\"\nCoordinates:\n  Latitude: 7.3643\n  Longitude: 126.4874\n"},
            {"app_ID":0,"app_IDs":"","autoexpire":"Y","category_ID":"EVENT","charter_Uri":"","comment_Text":"201716AL","create_Date":"1507127995001","creator":"D2P2","end_Date":"1507280400000","glide_Uri":"","hazard_ID":17039,"hazard_Name":"Tropical Depression - Sixteen","last_Update":"1507193739646","latitude":13.3,"longitude":-83.3,"master_Incident_ID":"30.1507193668024.1","message_ID":"30.1507193668024","org_ID":-1,"severity_ID":"ADVISORY","snc_url":"http://snc.pdc.org/TEST/fa4057a3-1a01-426d-aa04-4c83ae8e3b56/index.html","start_Date":"1507129200000","status":"A","type_ID":"CYCLONE","update_Date":"1507193692834","update_User":null,"product_total":"5","uuid":"fa4057a3-1a01-426d-aa04-4c83ae8e3b56","in_Dashboard":"","areabrief_url":null,"description":"A message for Tropical Depression - Sixteen was issued by NWS at October 05, 09:00:00 GMT for the Atlantic Ocean.\n\nMaximum Sustained Winds: 30 kt, 35 mph, 56 kph\nWind Gusts of: 40 kt, 46 mph, 74 kph.\n\nPDC classifies this event's severity as тAdvisoryт based on sustained wind speed alone."}];
        res.send(data);
    });
    
    app.get('/folder?:groupId', function (req, res) {
    
        // console.log("=== Group ID ===");
        // console.log('groupId: ', req.query["groupId"]);

        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Content-Type", "application/json");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    
        const data = {"items":[
                {"creator":7,"lastModifiedBy":1150,"owner":7,"id":1192,"itemType":"FOLDER","title":"Group Root","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":null,"path":"","readOnly":false,"createdAt":1482863439269,"lastModifiedAt":1502139032601},
                {"creator":1152,"lastModifiedBy":1150,"owner":1152,"id":9399,"itemType":"FOLDER","title":"[JLM] Jack Russells","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/[JLM] Jack Russells","readOnly":false,"createdAt":1489696917874,"lastModifiedAt":1490124906989},
                {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":9706,"itemType":"FOLDER","title":"[JLM] Labradores","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/[JLM] Labradores","readOnly":false,"createdAt":1490124790330,"lastModifiedAt":1490124853131},
                {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":28910,"itemType":"FOLDER","title":"GPX","description":"Test GPX","groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/GPX","readOnly":false,"createdAt":1502139042087,"lastModifiedAt":1502139175797}
            ]};
    
        res.send(data);
    });
    
    app.get('/folder/:folderId/attachment', function (req, res) {
    
        // console.log("=== Attachment ===");
        // console.log('folderId: ', req.params["folderId"]);

        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Content-Type", "application/json");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    
        const data = {
            "1192": {total: 0, items: [], limit: 0, offset: 0},
            "9399": {"total":2,"items":[
                {"creator":1152,"lastModifiedBy":1152,"owner":1152,"id":9401,"itemType":"DOCLIB_FILE","title":"My Picture.jpg","description":null,"groups":[1183],"userList":[1152],"globalReference":false,"acctRef":null,"groupRef":null,"extension":"jpg","fileSize":12138,"mimeType":"image/jpeg","agency":"None","url":"https://cd12.biosurv.org/BspWebService/rest/folder/9399/attachment/9401/content","readOnly":false,"path":"/Group Root/[JLM] Jack Russells/My Picture.jpg","createdAt":1489696978606,"lastModifiedAt":1489697278392,"parentFolder":9399,"location":{"latitude":20.877,"longitude":-156.678}}
            ],"limit":0,"offset":0},
            "9706": {"total":1,"items":[
                {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":9708,"itemType":"DOCLIB_FILE","title":"laborador_web.jpg","description":null,"groups":[1183],"userList":[1150],"globalReference":false,"acctRef":null,"groupRef":null,"extension":"jpg","fileSize":38385,"mimeType":"image/jpeg","agency":"None","url":"https://cd12.biosurv.org/BspWebService/rest/folder/9706/attachment/9708/content","readOnly":false,"path":"/Group Root/[JLM] Labradores/laborador_web.jpg","createdAt":1490124841957,"lastModifiedAt":1490124853133,"parentFolder":9706,"location":{"latitude":0.0,"longitude":0.0}}
            ],"limit":0,"offset":0},
            "28910": {"total":2,"items":[
                {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":28912,"itemType":"DOCLIB_FILE","title":"St_Louis_Zoo_sample.gpx","description":null,"groups":[1183],"userList":[1150],"globalReference":false,"acctRef":null,"groupRef":null,"extension":"gpx","fileSize":7422,"mimeType":"application/octet-stream","agency":"None","url":"https://cd12.biosurv.org/BspWebService/rest/folder/28910/attachment/28912/content","readOnly":false,"path":"/Group Root/GPX/St_Louis_Zoo_sample.gpx","createdAt":1502139052155,"lastModifiedAt":1502139175801,"parentFolder":28910,"location":{"latitude":20.75789,"longitude":156.389636}},
                {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":28913,"itemType":"DOCLIB_FILE","title":"August2.json","description":null,"groups":[1183],"userList":[1150],"globalReference":false,"acctRef":null,"groupRef":null,"extension":"json","fileSize":27000,"mimeType":"application/json","agency":"None","url":"https://cd12.biosurv.org/BspWebService/rest/folder/28913/attachment/28913/content","readOnly":false,"path":"/Group Root/GPX/August2.json","createdAt":1502139052155,"lastModifiedAt":1502139175801,"parentFolder":28910,"location":{"latitude":20.75789,"longitude":156.389636}}
            ],"limit":0,"offset":0}
        };
    
        res.send(data[req.params["folderId"]]);
    });
    
    app.get('/folder/:parentId/attachment/:documentId/content', function (req, res) {
        // console.log('=== Content ====');
        // console.log('parentId: ', req.params["parentId"]);
        // console.log('documentId: ', req.params["documentId"]);

        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Content-Type", "application/json");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    
        // const data = '{"bookmark_name":"test Bookmark2","bookmark_data":"{\"version\":6,\"type\":\"BOTH\",\"position\":{\"center\":[270.5804443359375,31.079853225906053],\"zoom\":8},\"layers\":{\"HnP_hazards\":{\"isClustering\":true,\"opacity\":1},\"Est_Wind_Impacts_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"Est_Max_Storm_Surge_Heights_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"Est_Rainfall_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"TRMM1day\":{\"isClustering\":false,\"opacity\":0.25},\"Storm_Positions\":{\"isClustering\":false,\"opacity\":1},\"Storm_Segments\":{\"isClustering\":false,\"opacity\":1},\"cones5day\":{\"isClustering\":false,\"opacity\":0.5},\"cones3day\":{\"isClustering\":false,\"opacity\":0.5},\"Google_Hybrid\":{\"isClustering\":false,\"opacity\":1}}}","startup_flag":1,"create_date":1502884839639}';
        // res.send(json_content);
        res.send();
    });
/*
* END Requests to move
/********************************************/

app.listen(8000, function () {
	console.log('=======================');
	console.log('Server running on 8000!');
    console.log('=======================');
});
