const express = require('express');
const app = express();
const json_content = require("./August2.json");

var allowCrossDomain = function(req, res, next) {

    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

app.get('/groups', function (req, res) {

    const data = {"items":[
            {"creator":7,"lastModifiedBy":1103,"owner":7,"id":1183,"name":"Public Standard Group 1","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet, mauris eget consectetur lacinia, magna odio mollis risus, id aliquam dolor quam eu leo. Nam gravida blandit lacus, vitae lacinia enim faucibus vel. Nam diam velit, molestie a odio eu, dictum molestie odio.","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439178,"lastModifiedAt":1492004404373,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1192,"canReceiveRfis":true},
            {"creator":7,"lastModifiedBy":7,"owner":7,"id":1184,"name":"Public Standard Group 2","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet, mauris eget consectetur lacinia, magna odio mollis risus, id aliquam dolor quam eu leo. Nam gravida blandit lacus, vitae lacinia enim faucibus vel. Nam diam velit, molestie a odio eu, dictum molestie odio.","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439189,"lastModifiedAt":1490822035721,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1190,"canReceiveRfis":false},
            {"creator":7,"lastModifiedBy":7,"owner":7,"id":1201,"name":"SEL Test for 8.2","description":"For use in load testing by Tom & Eric **** Do Not touch or add to this Group *****","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439534,"lastModifiedAt":1482863439534,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1213,"canReceiveRfis":false},
            {"creator":7,"lastModifiedBy":7,"owner":7,"id":1203,"name":"SEL Public","description":"A public group for Selenium automated testing","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439642,"lastModifiedAt":1499716274930,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1221,"canReceiveRfis":true}
        ]};
    res.send(data);
});

app.get('/hazard?:groupId', function (req, res) {

    console.log("=== Group ID ===");
    console.log('groupId: ', req.query["groupId"]);

    const data = [{"app_ID":0,"app_IDs":"","autoexpire":"Y","category_ID":"EVENT","charter_Uri":"","comment_Text":"{\"das\":false,\"facebook\":false,\"twitter\":false,\"properties\":{\"pixelCount\":57,\"radiance\":26088}}","create_Date":"1504239454644","creator":"ddp","end_Date":"1507093200000","glide_Uri":"","hazard_ID":16004,"hazard_Name":"Wildfire - SW of Conceicao do Araguaia, Pará - Brazil","last_Update":"1506916889940","latitude":-6.296139781,"longitude":-43.741164113,"master_Incident_ID":"","message_ID":"","org_ID":-1,"severity_ID":"WATCH","snc_url":"","start_Date":"1504224000000","status":"A","type_ID":"WILDFIRE","update_Date":"1506916835197","update_User":"ddp","product_total":"32","uuid":"9954904a-4b9b-459d-a796-d905ece3c959","in_Dashboard":"0","areabrief_url":null,"description":"Significant wildfire activity has been observed in the region."},{"app_ID":0,"app_IDs":"","autoexpire":"Y","category_ID":"EVENT","charter_Uri":"","comment_Text":"{\"das\":true,\"facebook\":true,\"twitter\":true,\"properties\":{\"pixelCount\":21,\"radiance\":10573.3}}","create_Date":"1506916747008","creator":"ddp","end_Date":"1507006800000","glide_Uri":"","hazard_ID":16993,"hazard_Name":"Wildfire - W of Capitan Pablo Lagerenza, Alto Paraguay - Paraguay","last_Update":"1506916893870","latitude":-19.775377012,"longitude":-61.662483746,"master_Incident_ID":"","message_ID":"","org_ID":-1,"severity_ID":"INFORMATION","snc_url":null,"start_Date":"1506902400000","status":"A","type_ID":"WILDFIRE","update_Date":"1506916747008","update_User":"ddp","product_total":"2","uuid":"8b97c7ea-40a6-4a03-8690-bcb063e5925c","in_Dashboard":"0","areabrief_url":null,"description":"Significant wildfire activity has been observed in the region."},{"app_ID":0,"app_IDs":"","autoexpire":"Y","category_ID":"EVENT","charter_Uri":"","comment_Text":"D2P2 auto-generated Earthquake Hazard","create_Date":"1506868185157","creator":"D2P2","end_Date":"1506956154304","glide_Uri":"","hazard_ID":16975,"hazard_Name":"Earthquake - 5.0 - 168km SSE of `Ohonua, Tonga","last_Update":"1506869799723","latitude":-22.8028,"longitude":-174.5287,"master_Incident_ID":"3.1506869734040.1","message_ID":"3.1506869734040","org_ID":-1,"severity_ID":"ADVISORY","snc_url":"http://snc.pdc.org/TEST/cbc6ea51-8b1d-40c8-99dd-512c80948555/index.html","start_Date":"1506866880560","status":"A","type_ID":"EARTHQUAKE","update_Date":"1506869754404","update_User":null,"product_total":"2","uuid":"cbc6ea51-8b1d-40c8-99dd-512c80948555","in_Dashboard":"","areabrief_url":null,"description":"An earthquake occurred with a magnitude of 5.0 at a depth of 10.0 km, Location: 168km SSE of `Ohonua, Tonga reported by USGS at October 01, 14:54:28 GMT.\n\nPDC classifies this event as an \"Advisory\"\nCoordinates:\n  Latitude: -22.8028\n  Longitude: -174.5287\n"}];
    res.send(data);
});

app.get('/folder?:groupId', function (req, res) {

    console.log("=== Group ID ===");
    console.log('groupId: ', req.query["groupId"]);

    const data = {"items":[
            {"creator":7,"lastModifiedBy":1150,"owner":7,"id":1192,"itemType":"FOLDER","title":"Group Root","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":null,"path":"","readOnly":false,"createdAt":1482863439269,"lastModifiedAt":1502139032601},
            {"creator":1152,"lastModifiedBy":1150,"owner":1152,"id":9399,"itemType":"FOLDER","title":"[JLM] Jack Russells","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/[JLM] Jack Russells","readOnly":false,"createdAt":1489696917874,"lastModifiedAt":1490124906989},
            {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":9706,"itemType":"FOLDER","title":"[JLM] Labradores","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/[JLM] Labradores","readOnly":false,"createdAt":1490124790330,"lastModifiedAt":1490124853131},
            {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":28910,"itemType":"FOLDER","title":"GPX","description":"Test GPX","groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/GPX","readOnly":false,"createdAt":1502139042087,"lastModifiedAt":1502139175797}
        ]};

    res.send(data);
});

app.get('/folder/:folderId/attachment', function (req, res) {

    console.log("=== Attachment ===");
    console.log('folderId: ', req.params["folderId"]);

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
    console.log('=== Content ====');
    console.log('parentId: ', req.params["parentId"]);
    console.log('documentId: ', req.params["documentId"]);

    // const data = '{"bookmark_name":"test Bookmark2","bookmark_data":"{\"version\":6,\"type\":\"BOTH\",\"position\":{\"center\":[270.5804443359375,31.079853225906053],\"zoom\":8},\"layers\":{\"HnP_hazards\":{\"isClustering\":true,\"opacity\":1},\"Est_Wind_Impacts_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"Est_Max_Storm_Surge_Heights_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"Est_Rainfall_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"TRMM1day\":{\"isClustering\":false,\"opacity\":0.25},\"Storm_Positions\":{\"isClustering\":false,\"opacity\":1},\"Storm_Segments\":{\"isClustering\":false,\"opacity\":1},\"cones5day\":{\"isClustering\":false,\"opacity\":0.5},\"cones3day\":{\"isClustering\":false,\"opacity\":0.5},\"Google_Hybrid\":{\"isClustering\":false,\"opacity\":1}}}","startup_flag":1,"create_date":1502884839639}';
    // res.send(json_content);
    res.send();
});

app.use(allowCrossDomain);

app.listen(8000, function () {
	console.log('=======================');
	console.log('Server running on 8000!');
    console.log('=======================');
});
