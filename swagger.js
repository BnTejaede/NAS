var swaggerizeModel = require("sequelize-json-schema"),
    fs = require("fs-extra"),
    swaggerJSDoc = require('swagger-jsdoc'),
    model = require("./logic/model");

var SPECIAL_PARAMETERS = {
    group: [{
        name: "city",
        description: "City in which group is based",
        type: "string",
        in: "formData"
    },{
        name: "country",
        description: "Country in which group is based",
        type: "string",
        in: "formData"
    }],
    version: [{
        name: "layers",
        description: "Comma separated list of layer IDs. e.g. 'Google_Hybrid,HnP_Hazards,Recent_Earthquakes'",
        type: "string",
        in: "formData"
    },{
        name: "figures",
        description: "Stringified JSON representing the full figure treee",
        type: "string",
        in: "formData"
    }],
    figure: [{
        swaggerName: "figureType",
        name: "type",
        description: "Numeric ID of the figures type",
        type: "integer",
        in: "formData"
    },{
        swaggerName: "figurePrevious",
        name: "previousId",
        description: "Numeric ID of the Figure behind which to insert this figure",
        type: "string",
        in: "formData"
    },{
        swaggerName: "figureParent",
        name: "parentId",
        description: "Numeric ID of the Folder in which to insert this figure",
        type: "string",
        in: "formData"
    },{
        name: "geometry",
        description: "Stringified geoJSON representing the figure geometry",
        type: "string",
        in: "formData"
    },{
        swaggerName: "figureProperties",
        name: "properties",
        description: "Stringified properties object as defined by Contour",
        type: "string",
        in: "formData"
    },{
        swaggerName: "patchOperations",
        name: "operations",
        description: "Array of JSON patch operations to apply to Figure.children. http://jsonpatch.com/   \n e.g. [{\"op\":\"replace\",\"path\":\"/12\",\"value\":3},{\"op\":\"replace\",\"path\":\"/7\",\"value\":null},{\"op\":\"replace\",\"path\":\"/3\",\"value\":6}]",
        type: "string",
        in: "formData"
    }]
};


module.exports = (function () {
    //TODO Move to external file
    var swaggerDefinition = {
            info: { // API informations (required)
                title: 'Biosurveillance Bookmarks', // Title (required)
                version: '1.0.0', // Version (required)
                description: 'API to allow collaborative, versioned annotations of geospatial areas.', // Description (optional)
            },
            host: 'http://localhost:8000', // Host (optional)
            basePath: '/', // Base path (optional)
        },
        jsDocOptions = {
            // Import swaggerDefinitions
            swaggerDefinition: swaggerDefinition,
            // Path to the API docs
            apis: ['./logic/route/*.js']
        },
        excludedKeys = {
            sequelize: true,
            Sequelize: true
        },
        spec = swaggerJSDoc(jsDocOptions);

    for (var key in model) {
        if (!excludedKeys[key]) {
            spec.definitions[key] = swaggerizeModel(model[key]);
            mapParametersForType(spec.parameters, key);
        }
    }

    fs.writeFile("./api/swagger.json", JSON.stringify(spec), function (error) {
        if (error) throw error;
        console.log('Swagger Schema saved to ./api/swagger.json saved!');
    });
    return spec;
})();

function mapParametersForType(parameters, typeName) {
    typeName = typeName.toLowerCase();
    mapGenericParametersForType(parameters, typeName);
    mapSpecialParametersForType(parameters, typeName);
}

function mapGenericParametersForType(parameters, typeName) {
    var parameterName;

    parameterName = typeName + "Id";
    parameters[parameterName] = {
        name: parameterName,
        type: "integer",
        in: "path",
        required: true,
        description: "Numeric ID of the " + typeName
    };

    parameterName = typeName + "Name";
    parameters[parameterName] = {
        name: "name",
        description: "Name of " + typeName,
        type: "string",
        in: "formData"
    };

    parameterName = typeName + "Description";
    parameters[parameterName] = {
        name: "description",
        description: "Description of " + typeName,
        type: "string",
        in: "formData"
    };
}

function mapSpecialParametersForType (parameters, typeName) {
    var allForType = SPECIAL_PARAMETERS[typeName] || [];
    allForType.forEach(function (parameter) {
        var name = parameter.swaggerName || parameter.name;
        delete parameter.swaggerName;
        parameters[name] = parameter;
    });
}


