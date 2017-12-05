var definition = require("sequelize-json-schema"),
    fs = require("fs-extra"),
    swaggerJSDoc = require('swagger-jsdoc'),
    model = require("./logic/model");



module.exports = (function () {
    //TODO Move to external file
    var swaggerDefinition = {
            info: { // API informations (required)
                title: 'Hello World', // Title (required)
                version: '1.0.0', // Version (required)
                description: 'A sample API', // Description (optional)
            },
            host: 'localhost:3000', // Host (optional)
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
            spec.definitions[key] = definition(model[key]);
        }
    }

    // function mapAttributesAsParameters (properties) {
    //     for (var key in properties) {
    //         mapAttributeAsParameter(properties, key);
    //     }
    // }

    // function mapAttributeAsParameter(properties, propertyName) {
    //     var definition = properties[propertyName];
    //     definition.name = propertyName;
    //     definition.description = propertyName + " of an entity";
    //     definition.in = "formData";
    //     spec.parameters[propertyName] = definition;
    // }


    spec.parameters = {
        name: {
            name: "name",
            description: "Entity Name",
            type: "string",
            in: "formData"
        }
    };

    fs.writeFile("./api/swagger.json", JSON.stringify(spec), function (error) {
        if (error) throw error;
        console.log('Swagger Schema saved to ./api/swagger.json saved!');
    });
    return spec;
})();


