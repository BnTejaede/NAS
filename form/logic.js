

var forms, select, currentPage;
window.onload = function () {
    var i, n, form;

    forms = document.querySelectorAll("form");
    for (i = 0, n = forms.length; i < n; i++) {
        form = forms[i];
        if (form.attachEvent) {
            form.attachEvent("submit", processForm);
        } else {
            form.addEventListener("submit", processForm);
        }
    }

    select = document.querySelector("select");
    currentPage = visiblePage();
    select.addEventListener("change", function (event) {
        currentPage.style.display = "";
        currentPage = visiblePage();
        currentPage.style.display = "block";
        console.log("Select.addEventListener", select.value);
    });
};

function visiblePage () {
    var id = select.value + "-page";
    return document.getElementById(id);
}

function processForm(e) {
    var form = e.target,
        object = parseProperties(form),
        method = form.getAttribute("method"),
        url = form.getAttribute("action");

    e.preventDefault();
    if (method === "PUT") {
        url += "/" + object.id;
    }


    sendRequest(url, method, object, function (response) {
        console.log("Response", response);
    });
    /* do what you want with the form */

    // You must return false to prevent the default form behavior
    return false;
}



function parseProperties(form) {
    var inputs = form.querySelectorAll("input[type='text']"),
        properties = {},
        i, n, input, key;

    for (i = 0, n = inputs.length; i < n; i++) {
        input = inputs[i];
        key = input.getAttribute("name");
        properties[key] = input.value;
    }
    return properties;
}

function sendRequest(url, method, object, callback) {
    var xhr = new XMLHttpRequest(),
        isEdit = method === "PUT",
        body = requestBodyForObject(object),
        url = replaceURLTokens(url, object);

    console.log("SendRequest", object, body, url);
    xhr.open(method, url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText));
        }
    }

    
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(body);
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

function replaceURLTokens (url, object) {
    var keys = Object.keys(object),
        token;

    keys.forEach(function (key) {
        token = "${" + key + "}";
        url = url.replace(token, object[key]);
    });

    return url;
}


