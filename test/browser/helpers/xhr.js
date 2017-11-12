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
        value, body = "";
    
    keys.forEach(function (key) {
        if (!ignoredProperties[key]) {
            value = object[key];
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            body += "&" + key + "=" + value;
        }
    });

    return body.substring(1);
}