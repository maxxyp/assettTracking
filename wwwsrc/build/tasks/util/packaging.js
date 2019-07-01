var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var zip = require('gulp-zip');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var es = require('event-stream');
var buildRequire = require('./build-require');
var electron = require('./electron');
var wua = require('./wua');
var ios = require('./ios');
var android = require('./android');
var display = require('./display');

function packageTemplate(buildConfiguration, buildNumber, clientPackagesJson, packageRoot, bust, currentPackageDir) {
    display.log("Creating index.html");

    var initScript = '';
    var varScript = '';

    if (buildConfiguration.platformType === "ios" || buildConfiguration.platformType === "android") {
        initScript += '<script src="cordova.js"></script>\r\n';
        initScript += '<script src="scripts/platformOverrides.js"></script>\r\n';
    }

    if (buildConfiguration.isDevelopment) {
        varScript += '        window.appIsDevelopment = true;\r\n';
    }

    varScript += '        window.appVersion = \'' + buildNumber + '\';\r\n';
    varScript += '        window.appBuildType = \'' + buildConfiguration.buildType + '\';\r\n';

    initScript += buildRequire(clientPackagesJson, packageRoot);

    initScript += '        Promise.config({\r\n';
    initScript += '           warnings: false\r\n';
    initScript += '        });\r\n';
    initScript += varScript;

    if (buildConfiguration.platformType === "ios" || buildConfiguration.platformType === "android") {
        initScript += '        document.addEventListener(\'deviceready\', function() {\r\n';
    }

    initScript += '        require(["aurelia-bootstrapper"]);\r\n';

    if (buildConfiguration.platformType === "ios" || buildConfiguration.platformType === "android") {
        initScript += '        }, false);\r\n';
    }
    initScript += '    </script>\r\n';

    return gulp.src("index.template.html")
        .pipe(replace('@@BUST@@', bust))
        .pipe(replace('<!-- BOOTSTRAP -->', initScript))
        .pipe(rename("index.html"))
        .pipe(gulp.dest(currentPackageDir));
}

function packageAppConfig(buildConfiguration, bust, currentPackageDir) {
    display.log("Packaging app.config");

    return gulp.src("configurations/app.config." + buildConfiguration.buildType + '.json')
        .pipe(rename("app.config.json"))
        .pipe(cleanAppConfig())
        .pipe(gulp.dest(currentPackageDir));

}

function packageCss(buildConfiguration, bust, currentPackageDirCss) {
    display.log("Packaging css");
    if (buildConfiguration.minify) {
        return gulp.src("css/style.css")
            .pipe(rename("style" + bust + ".css"))
            .pipe(cssnano({autoprefixer: false}))
            .pipe(gulp.dest(currentPackageDirCss));
    }
    else {
        return gulp.src("css/style.css")
            .pipe(rename("style" + bust + ".css"))
            .pipe(gulp.dest(currentPackageDirCss));
    }
}

function packageCssMap(currentPackageDirCss) {
    display.log("Packaging css maps");
    return gulp.src("css/style.css.map")
        .pipe(rename("style.css.map"))
        .pipe(gulp.dest(currentPackageDirCss));
}

function packageFonts(currentPackageDirFonts) {
    display.log("Packaging fonts");
    return gulp.src("fonts/**/*")
        .pipe(gulp.dest(currentPackageDirFonts));
}

function packageAssets(appConfigJson, currentPackageDirAssets) {
    display.log("Packaging assets");

    var folders = ["assets/**/*"];

    if (!wua.hasSimulationData(appConfigJson)) {
        folders.push("!assets/scenarios{,/**}");
        folders.push("!assets/schemas{,/**}");
    }

    return gulp.src(folders)
        .pipe(gulp.dest(currentPackageDirAssets));
}

function packageAppBundleJs(buildConfiguration, currentPackageDirApp) {
    display.log("Packaging JavaScript");

    if (buildConfiguration.minify) {
        return gulp.src("app/**/*.js")
            .pipe(uglify({ mangle: { keep_fnames: true } }))
            .pipe(gulp.dest(currentPackageDirApp));
    } else {
        return gulp.src("app/**/*.js")
            .pipe(gulp.dest(currentPackageDirApp));
    }
}

function packageAppBundleJsMap(currentPackageDirApp) {
    display.log("Packaging JavaScript maps");

    return gulp.src("app/**/*.js.map")
        .pipe(gulp.dest(currentPackageDirApp));
}

function packageAppBundleHtml(currentPackageDirApp) {
    display.log("Packaging html");

    return gulp.src("app/**/*.html")
        .pipe(gulp.dest(currentPackageDirApp));
}

function cleanPackageDirectory(packageDirectory) {
    del.sync(packageDirectory, { force: true });
}

function packageLibBundleClientPackages(clientPackagesJson, currentPackageDirLibDest) {
    display.log("Packaging client libraries");

    var tasks = [];

    for (var i = 0; i < clientPackagesJson.items.length; i++) {
        if (clientPackagesJson.items[i].package) {
            tasks.push(gulp.src(clientPackagesJson["root"] + "/" + clientPackagesJson.items[i].package.location + "/**/*.{js,css,html}")
                .pipe(gulp.dest(currentPackageDirLibDest + clientPackagesJson.items[i].package.location)));

        } else {
            var lastSlash = clientPackagesJson.items[i].location.lastIndexOf("/");
            var path = clientPackagesJson.items[i].location.substring(0, lastSlash);
            tasks.push(gulp.src(clientPackagesJson["root"] + "/" + clientPackagesJson.items[i].location + ".js")
                .pipe(gulp.dest(currentPackageDirLibDest + path)));
        }
    }

    return tasks;
}

function zipFiles(buildConfiguration, currentPackageDir, packageRoot, currentZipFile, cb) {
    display.log("Zipping " + currentPackageDir + " to " + packageRoot + currentZipFile);

    return gulp.src(currentPackageDir + '**/*')
        .pipe(zip(currentZipFile))
        .pipe(gulp.dest(packageRoot))
        .on("end", cb);
}

function package(buildConfiguration, buildNumber, cb) {
    var tasks = [];

    display.banner("Packaging " + buildConfiguration.buildType + " for platform " + buildConfiguration.platformType);

    var packagesJson = require('../../../package.json');
    var clientPackagesJson = require('../../../clientPackages.json');
    var appConfigJson = require("../../../configurations/app.config." + buildConfiguration.buildType + '.json');

    var currentPackageDir = (buildConfiguration.platformType === "web" || buildConfiguration.platformType === "electron" ?
            "../packaged/web/" + buildConfiguration.buildType + "/"
            : "../www/");

    var currentPackageDirApp = currentPackageDir + 'app/';
    var packageRoot = "packages";
    var currentPackageDirLibDest = currentPackageDir + packageRoot + '/';
    var currentPackageDirCss = currentPackageDir + 'css/';
    var currentPackageDirFonts = currentPackageDir + 'fonts/';
    var currentPackageDirAssets = currentPackageDir + 'assets/';
    var currentZipFile = buildConfiguration.platformType + "-" + buildConfiguration.buildType + '.zip';
    var bust = (buildConfiguration.platformType === "web" || buildConfiguration.platformType === "electron") ? "-" + buildNumber : "";
    var appName = packagesJson["name"];

    cleanPackageDirectory(currentPackageDir);
    tasks.push(packageTemplate(buildConfiguration, buildNumber, clientPackagesJson, packageRoot, bust, currentPackageDir));
    tasks.push(packageAppConfig(buildConfiguration, bust, currentPackageDir));
    tasks.push(packageCss(buildConfiguration, bust, currentPackageDirCss));
    if (buildConfiguration.sourceMaps) {
        tasks.push(packageCssMap(currentPackageDirCss));
    }
    tasks.push(packageFonts(currentPackageDirFonts));
    tasks.push(packageAssets(appConfigJson, currentPackageDirAssets));
    tasks.push(packageAppBundleJs(buildConfiguration, currentPackageDirApp));
    if (buildConfiguration.sourceMaps) {
        tasks.push(packageAppBundleJsMap(currentPackageDirApp));
    }
    tasks.push(packageAppBundleHtml(currentPackageDirApp));
    tasks.concat(packageLibBundleClientPackages(clientPackagesJson, currentPackageDirLibDest));

    return es.merge(tasks).on("end", function () {
        if (buildConfiguration.platformType === "web") {
            zipFiles(buildConfiguration, currentPackageDir, "../packaged/", currentZipFile, cb);
        } else if (buildConfiguration.platformType === "wua") {
            wua.package(buildConfiguration, appConfigJson, appName, buildNumber, "../packaged/wua/" + buildConfiguration.buildType + "/", cb);
        } else if (buildConfiguration.platformType === "electron") {
            electron.package(buildConfiguration, appName, currentPackageDir, "../packaged/electron/" + buildConfiguration.buildType + "/", cb);
        } else if (buildConfiguration.platformType === "ios") {
            ios.package(buildConfiguration, appName, buildNumber, cb);
        } else if (buildConfiguration.platformType === "android") {
            android.package(buildConfiguration, appName, buildNumber, cb);
        }
        else {
            display.error("No packaging method defined for --platformType=" + buildConfiguration.platformType);
        }
    });
}

function cleanAppConfig() {
    return es.map(function(file, cb) {
        var fileContent = file.contents.toString();

        var appConfigJson = JSON.parse(fileContent);

        stripUnusedEndpointConfiguration(appConfigJson);

        file.contents = new Buffer(JSON.stringify(appConfigJson));

        cb(null, file);
    });
}

function stripUnusedEndpointConfiguration(appConfigJson) {
    if (appConfigJson) {

        for(var propName in appConfigJson) {
            if (propName.indexOf("Endpoint") > 0) {
                var endpointConfiguration = appConfigJson[propName];
                if (endpointConfiguration.clients && endpointConfiguration.routes) {
                    var replacementsClients = [];

                    var usedClients = [];

                    endpointConfiguration.routes.forEach(function(route) {
                        if (usedClients.indexOf(route.client) < 0) {
                            usedClients.push(route.client);
                        }
                    });

                    endpointConfiguration.clients.forEach(function(client) {
                        if (usedClients.indexOf(client.name) >= 0) {
                            replacementsClients.push(client);
                        }
                    });

                    appConfigJson[propName].clients = replacementsClients;
                }
            }
        }
    }
}

module.exports = {
    package: package
};