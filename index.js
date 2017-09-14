const express = require('express');
const app = express();
const json_content = require("./August2.json");

app.get('/groups', function (req, res) {

    const data = {"items":[
            {"creator":7,"lastModifiedBy":1103,"owner":7,"id":1183,"name":"Public Standard Group 1","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet, mauris eget consectetur lacinia, magna odio mollis risus, id aliquam dolor quam eu leo. Nam gravida blandit lacus, vitae lacinia enim faucibus vel. Nam diam velit, molestie a odio eu, dictum molestie odio.","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439178,"lastModifiedAt":1492004404373,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1192,"canReceiveRfis":true},
            {"creator":7,"lastModifiedBy":7,"owner":7,"id":1184,"name":"Public Standard Group 2","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet, mauris eget consectetur lacinia, magna odio mollis risus, id aliquam dolor quam eu leo. Nam gravida blandit lacus, vitae lacinia enim faucibus vel. Nam diam velit, molestie a odio eu, dictum molestie odio.","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439189,"lastModifiedAt":1490822035721,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1190,"canReceiveRfis":false},
            {"creator":7,"lastModifiedBy":7,"owner":7,"id":1201,"name":"SEL Test for 8.2","description":"For use in load testing by Tom & Eric **** Do Not touch or add to this Group *****","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439534,"lastModifiedAt":1482863439534,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1213,"canReceiveRfis":false},
            {"creator":7,"lastModifiedBy":7,"owner":7,"id":1203,"name":"SEL Public","description":"A public group for Selenium automated testing","pdcBookmarkUrl":null,"fouo":false,"imageDocumentId":null,"accessType":"PUBLIC","discoverable":true,"publicReadable":false,"openMembership":true,"startDate":null,"itemType":"GROUP","createdAt":1482863439642,"lastModifiedAt":1499716274930,"organization":{"website":"http://www.zombo.com","address":{"address1":"404 Main Street","address2":"Building JS","city":"Baltimore","county":null,"state":"Maryland","country":"USA","zipcode":"21201"},"primaryEmail":"info@email.com","secondaryEmail":"support@email.com","primaryPhone":"555-555-5555","secondaryPhone":"555.555.5555","facebookHandle":"facebook","twitterHandle":"twitter","googlePlusHandle":"google"},"docLibFolder":1221,"canReceiveRfis":true}
        ]};
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.send(data);
});

app.get('/folder/:groupId', function (req, res) {

    console.log(req.params["groupId"]);

    const data = {"items":[
            {"creator":7,"lastModifiedBy":1150,"owner":7,"id":1192,"itemType":"FOLDER","title":"Group Root","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":null,"path":"","readOnly":false,"createdAt":1482863439269,"lastModifiedAt":1502139032601},
            {"creator":1152,"lastModifiedBy":1150,"owner":1152,"id":9399,"itemType":"FOLDER","title":"[JLM] Jack Russells","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/[JLM] Jack Russells","readOnly":false,"createdAt":1489696917874,"lastModifiedAt":1490124906989},
            {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":9706,"itemType":"FOLDER","title":"[JLM] Labradores","description":null,"groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/[JLM] Labradores","readOnly":false,"createdAt":1490124790330,"lastModifiedAt":1490124853131},
            {"creator":1150,"lastModifiedBy":1150,"owner":1150,"id":28910,"itemType":"FOLDER","title":"GPX","description":"Test GPX","groups":[1183],"userList":[],"globalReference":false,"parentFolder":1192,"path":"/GPX","readOnly":false,"createdAt":1502139042087,"lastModifiedAt":1502139175797}
        ]};
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.send(data);
});

app.get('/:folderId/attachment', function (req, res) {

    console.log('attachment: ', req.params["folderId"]);

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

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.send(data[req.params["folderId"]]);
});

app.get('/content', function (req, res) {

    // const data = '{"bookmark_name":"test Bookmark2","bookmark_data":"{\"version\":6,\"type\":\"BOTH\",\"position\":{\"center\":[270.5804443359375,31.079853225906053],\"zoom\":8},\"layers\":{\"HnP_hazards\":{\"isClustering\":true,\"opacity\":1},\"Est_Wind_Impacts_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"Est_Max_Storm_Surge_Heights_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"Est_Rainfall_TAOS\":{\"isClustering\":false,\"opacity\":0.5},\"TRMM1day\":{\"isClustering\":false,\"opacity\":0.25},\"Storm_Positions\":{\"isClustering\":false,\"opacity\":1},\"Storm_Segments\":{\"isClustering\":false,\"opacity\":1},\"cones5day\":{\"isClustering\":false,\"opacity\":0.5},\"cones3day\":{\"isClustering\":false,\"opacity\":0.5},\"Google_Hybrid\":{\"isClustering\":false,\"opacity\":1}}}","startup_flag":1,"create_date":1502884839639}';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    // res.send(json_content);
    res.send();
});

app.listen(8000, function () {
	console.log('Server running on 8000!');
});
