var taskName = process.argv[2];

var tasks = {
    "build": {
        "build": "Build the project, this also clean, " +
                "\n                           typescript-compile, sass, lint and update the" +
                "\n                           index page from the template",
        "clean-build": "Removes the *.js, *.js.map and *.css files",
        "typescript-compile": "Compile the typescript",
        "sass": "Compiles the sass to css",
        "tslint": "Performs a lint on the ts files",
        "copy-template": "Generates a new index.html from index.template.html" +
        "\n                           with app specific content",
        "build-watch": "Background watcher which compiles and lints ts files",
        "release-notes": "Generates html for release notes from markdown"
    },
    "ci": {
        "ci-develop": "Run a complete ci develop build and test",
        "ci-master": "Run a complete ci master build, test and deploy",
        "ci-master-no-deploy": "Run a complete ci master build and test"
    },
    "cordova": {
        "cordova-resources": "Build the cordova image assets into res folder using" +
        "\n                           svgsource/icon.svg as source"
    },
    "documentation": {
        "documentation": "Generates documentation from markdown to pdf from" +
        "\n                           the documentation/src folder"
    },
    "e2e": {
        "e2e": "Run protractor end to end tests" +
        "\n                           optional --grep=\"<filename>\" where <filename> is the" +
        "\n                           name of the .ts file you wish to test\n",
    },
    "package": {
        "package": "Package the current build of the app\n" +
                    "\n            --buildType=[looked up from ciConfig.json]" +
                    "\n                     will specify which version of the app.config.json to use" +
                    "\n                     in the package and change other options like minification\n" +
                    "\n            --platformType=[web/wua/ios/android/electron]" +
                    "\n                     will specify how the output is targetted" +
                    "\n                        web will generate the packaged version in the " +
                    "\n                        packaged/web/<buildtype> folder" +
                    "\n                        electron will generate the packaged version in the " +
                    "\n                        packaged/electron/<buildtype> folder" +
                    "\n                        wua will generate the packaged version in www folder" +
                    "\n                        ios/android will generate the packaged version in www"  +
                    "\n                        folder and also add additional boiler plate into the" +
                    "\n                        index.html page for use by cordova"
    },
    "schema": {
        "schema": "Using the assets/schemas/schema-config.json and" +
        "\n                           appname/services/models/*.ts a json schema is" +
        "\n                           generated",
        "clean-schema": "Removes all the json files from the assets/schemas" +
        "\n                           folder except the schema.config.json"
    },
    "serve": {
        "serve": "Serves the app on http://localhost:9000"
    },
    "unit": {
        "unit-tslint": "Run test lint rules",
        "unit": "Run the units tests and code coverage on the source" +
        "\n                           code, reports are generated in ../reports folder\n" +
        "\n                           optional --grep=\"<filename>\" where <filename> is the" +
        "\n                           name of the .ts file you wish to test\n",
        "unit-debug": "Debug the unit tests using Chrome\n" +
        "\n                           optional --grep=\"<filename>\" where <filename> is the" +
        "\n                           name of the .ts file you wish to test\n",
        "unit-create-missing": "This will create .spec.ts files for any .ts that" +
        "\n                           don't have a matching one"
    },
    "watch": {
        "watch-sync": "Serve the app on http://localhost:9000 and watch" +
        "\n                           changes on *.ts and *.scss files, building and" +
        "\n                           reloading the app when necessary"
    },
    "wua": {
        "wua-project-develop": "Updates the <appname>.develop.jsproj to include any" +
        "\n                           new files, this looks at the wwwsrc folder",
        "wua-project-packaged": "Updates the <appname>.packaged.jsproj to include any" +
        "\n                           new files, this looks the at www folder"
    }
};


if(taskName === "--tasks") {
    for(var taskGroup in tasks) {
        console.log(taskGroup);
        console.log("===================".substr(0, taskGroup.length));
        console.log();
        for(var taskName in tasks[taskGroup]) {
            console.log("  " + (taskName + "                         ").substr(0, 25) + tasks[taskGroup][taskName]);
        }
        console.log();
    }
} else {
    for(var taskGroup in tasks) {
        if(tasks[taskGroup][taskName]) {
            require('./build/tasks/' + taskGroup);
        }
    }
}

