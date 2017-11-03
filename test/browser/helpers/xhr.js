function sendRequest(url, method, object) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(),
        body = object ? requestBodyForObject(object) : null;

        xhr.open(method, url);
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(body);
    });
}

const ignoredProperties = {
    id: true,
    groupID: true
}

function requestBodyForObject (object) {
    var keys = Object.keys(object),
        body = "";
    
    keys.forEach(function (key) {
        if (!ignoredProperties[key]) {
            body += "&" + key + "=" + object[key];
        }
    });

    return body.substring(1);
}