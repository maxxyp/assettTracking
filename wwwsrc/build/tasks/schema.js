var gulp = require('gulp');
var path = require("path");
var fs = require("fs");
var del = require('del');
var colors = require('colors');
var typescriptJsonSchema = require("typescript-json-schema");
var glob = require("glob");
var tjs = typescriptJsonSchema.TJS;
var package = require("../../package.json");
var display = require('./util/display');

const APP_NAME = package.name;
const OUTPUT_PATH = path.join(__dirname, "../../assets/schemas");
const OUTPUT_API_PATH = path.join(OUTPUT_PATH, "api");
const TS_MODELS = path.join(__dirname, "../../app/", APP_NAME, "services/models/**/*.ts");
const SCHEMA_CONFIG_PATH = path.resolve(OUTPUT_PATH, "schema-config.json");
const SCHEMA_PRELOAD_PATH = path.join(OUTPUT_PATH, "schemaList.json");

const ROUTE_INDEX = [];

function writeSchemaToDisk(route, schema) {
    if (ROUTE_INDEX.indexOf(route) === -1) {
        ROUTE_INDEX.push(route.replace(OUTPUT_PATH + "\\", "").replace("\\", "/"));
    }

    var schemaMod = JSON.stringify(schema, null, 2);

    fs.writeFileSync(route, schemaMod);
    fs.writeFileSync(SCHEMA_PRELOAD_PATH, JSON.stringify(ROUTE_INDEX, null, 2));
}

var tjsSettings = tjs.getDefaultArgs();
tjsSettings.generateRequired = true;

gulp.task('clean-schema', function () {
    return del([
        'assets/schemas/**/*.json',
        '!assets/schemas/schema-config.json'
    ]);
});

gulp.task('schema', ['clean-schema'], function() {

    var schemaSpecs = require(SCHEMA_CONFIG_PATH);
    if (!schemaSpecs || schemaSpecs.length === 0) {
        display.error(("Cannot find any schemas at " + SCHEMA_CONFIG_PATH).red);
        process.exit(1);
    }
    
    var typeScriptFiles = glob.sync(TS_MODELS);
    if (!typeScriptFiles || typeScriptFiles.length === 0) {
        display.error(("Cannot find any typescript files in " + TS_MODELS).red);
        process.exit(1);
    }
            
    var models = tjs.getProgramFromFiles(typeScriptFiles);
    schemaSpecs.forEach(function(spec) {
        var isArrayWrapped = spec.typescriptModel.indexOf("[]") > -1;
        if (isArrayWrapped) { // find singular TypeScript Model instead.
            spec.typescriptModel = spec.typescriptModel.replace("[]", "");
        }
        var schema = tjs.generateSchema(models, spec.typescriptModel, tjsSettings);

        if (isArrayWrapped) {
            var modelName = spec.typescriptModel;
            var schemaName = modelName.toLowerCase() + "s-" + spec.type;
            var modelFileName = schemaName + ".json";

            // create the wrapped array schema
            var wrappedSchema = {
                id: schemaName,
                type: "array",
                "$schema": "http://json-schema.org/draft-04/schema",
                items: {
                    "type": "object",
                    "oneOf": [
                        { "$ref": "#/definitions/" + spec.typescriptModel }
                    ]
                },
                definitions: {}
            };
            
            wrappedSchema.definitions = schema.definitions || {};
            wrappedSchema.definitions[spec.typescriptModel] = schema;
            delete schema.definitions;

            display.log("Generated array schema for "
            + schemaName.green + " "
            + "referencing " + modelName.grey);

            writeSchemaToDisk(path.join(OUTPUT_API_PATH, modelFileName), wrappedSchema);
        } else {
            var schemaName = spec.typescriptModel.toLowerCase() + "-" + spec.type;
            var modelFileName = schemaName + ".json";

            display.log("Generated schema for "
            + schemaName.green + " "
            + "mapping " + spec.type + " "
            + "to TypeScript model "
            + spec.typescriptModel.grey);
            schema = Object.assign({ id: schemaName }, schema);
            writeSchemaToDisk(path.join(OUTPUT_API_PATH, modelFileName), schema);
        }
    });
});
