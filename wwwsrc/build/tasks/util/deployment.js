var gulp = require('gulp');
var through = require('through2');
var zip = require('gulp-zip');
var request = require('request');
var fs = require('fs');
var display = require('./display');

const IS_MAC_BUILD_AGENT = /^darwin/.test(process.platform);

// allows self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 

function deployBuild (serverConfig, serverConfiguration, buildConfiguration, appName, buildNumber, branchName, cb) {
    
    if (!IS_MAC_BUILD_AGENT && buildConfiguration.platformType.toLowerCase() === "ios") {
        return cb();
    }

    if (IS_MAC_BUILD_AGENT && buildConfiguration.platformType.toLowerCase() === "wua") {
        return cb();
    }

    display.banner("Deploy Build");
    display.info("Server", serverConfig);
    display.info("App", appName);
    display.info("Build Number", buildNumber);
    display.info("Branch Name", branchName);
    display.info("Build Type", buildConfiguration.buildType);
    display.info("Platform Type", buildConfiguration.platformType);

    var unpack = serverConfiguration.unpack.indexOf(buildConfiguration.buildType) >= 0 && buildConfiguration.platformType === "web" ? "1" : "0";
    display.info("Unpack", unpack);

    var options = {
        server: 'https://' + serverConfiguration.server + ":" + serverConfiguration.deployPort + serverConfiguration.deployBuildEndpoint,
        headers: {
            'Authorization': "Basic " + new Buffer(serverConfiguration.auth.username + ":" + serverConfiguration.auth.password).toString("base64")
        },
        timeoutInMs: 1000 * 300,
        data: {
            version: buildNumber,
            branch: branchName,
            buildType: buildConfiguration.buildType,
            platformType: buildConfiguration.platformType,
            appName: appName,
            unpack: unpack
        },
        callback: function (err, data) {
            if (err) {
                display.error(JSON.stringify(err, null, 2));
                process.exit(1);
            } else {
                if (data.statusCode === 200) {
                    display.success('Upload OK');
                }
                else {
                    display.error('Failed uploading');
                    display.error(JSON.stringify(data, null, 2));
                    process.exit(1);
                }
            }
        }
    };

    var uploadFile;
    if (buildConfiguration.platformType === "web") {
        uploadFile = buildConfiguration.platformType + "-" + buildConfiguration.buildType + '.zip';
    } else if (buildConfiguration.platformType === "wua") {
        uploadFile = "wua/" + buildConfiguration.buildType + "/" + appName + `.${buildConfiguration.projectFile || 'packaged'}` + "/AppPackages/" +
            appName + `.${buildConfiguration.projectFile || 'packaged'}_` + buildNumber + "_AnyCPU_" + buildConfiguration.buildType + "_Test/" +
            appName + `.${buildConfiguration.projectFile || 'packaged'}_` + buildNumber + "_AnyCPU_" + buildConfiguration.buildType + ".appx";
    } else if (buildConfiguration.platformType === "electron") {
        uploadFile = "electron-win32-x64-" + buildConfiguration.buildType + ".zip";
    } else if (buildConfiguration.platformType === "ios") {
        uploadFile =`${appName}-${buildConfiguration.platformType}-v${buildNumber}-${buildConfiguration.buildType}.zip`;
    } else if (buildConfiguration.platformType === "android") {
        uploadFile = "android-" + appName + "-" + buildConfiguration.buildType + ".zip";
    }

    var fileToUpLoad = '../packaged/' + uploadFile
    display.info("File", fileToUpLoad);

    try
    {
        if (fs.statSync(fileToUpLoad).isFile()) {
            return gulp.src(fileToUpLoad)
                .pipe(upload(options))
                .pipe(gulp.dest('../packaged/'))
                .on("end", cb);
        } else {
            display.error("File does not exist");
            process.exit(1);
        }
    }
    catch(err)
    {
        display.error("File does not exist");
        process.exit(1);
    }
}

function deployReports(server, serverConfiguration, appName, buildNumber, cb) {
    display.banner("Deploy Report");
    display.info("Server", server);
    display.info("App", appName);
    display.info("Build Number", buildNumber);

    var options = {
        server: 'https://' + serverConfiguration.server + ":" + serverConfiguration.deployPort + serverConfiguration.deployReportEndpoint,
         headers: {
            'Authorization': "Basic " + new Buffer(serverConfiguration.auth.username + ":" + serverConfiguration.auth.password).toString("base64")
        },
        timeoutInMs: 1000 * 300,
        data: {
            version: buildNumber,
            appName: appName
        },
        callback: function (err, data) {
            if (err) {
                display.error(JSON.stringify(err, null, 2));
                process.exit(1);
            } else {
                if (data.statusCode === 200) {
                    display.success('Upload OK');
                }
                else {
                    display.error('Failed uploading');
                    display.error(JSON.stringify(data, null, 2));
                    process.exit(1);
                }
            }

        }
    };

    return gulp.src('../packaged/reports.zip')
        .pipe(upload(options))
        .pipe(gulp.dest('../packaged/'))
        .on("end", cb);
}


function deployComplete(server, serverConfiguration, appName, buildNumber, cb) {
    display.banner("Deploy Complete");
    display.info("Server", server);
    display.info("App", appName);
    display.info("Build Number", buildNumber);

    var options = {
        server: 'https://' + serverConfiguration.server + ":" + serverConfiguration.deployPort + serverConfiguration.deployCompleteEndpoint,
        headers: {
            'Authorization': "Basic " + new Buffer(serverConfiguration.auth.username + ":" + serverConfiguration.auth.password).toString("base64")
        },
        timeoutInMs: 1000 * 300,
        data: {
            version: buildNumber,
            appName: appName
        },
        callback: function (err, data) {
            if (err) {
                display.error(JSON.stringify(err));
                process.exit(1);
            } else {
                if (data.statusCode === 200) {
                    display.success('Upload OK');
                    cb();
                }
                else {
                    display.error('Failed uploading');
                    display.error(JSON.stringify(data, null, 2));
                    process.exit(1);
                }
            }
        }
    };

    var r = request.defaults();
    var data = options.data || {};

    r.post(options.server, {
        formData: data,
        json: true,
        headers: options.headers
    }, function (err, data, res) {
        options.callback(err, data, res);
    });
}


function upload(options) {
    if (!options) {
        options = {};
    }

    var callback = options.callback || function () { };

    return through.obj(function (file, enc, next) {
        if (!file.isBuffer()) {
            display.error("File not found to upload " + file.path);
            process.exit(1);
        }
        var self = this;

        var r = request.defaults();
        var data = options.data || {};
        data.file = fs.createReadStream(file.path);

        r.post(options.server, {
            formData: data,
            json: true,
            headers: options.headers
        }, function (err, data, res) {
            if (callback) {
                callback(err, data, res);
            }
            self.push(file);
            next();
        });
    });
}

module.exports = {
    deployBuild: deployBuild,
    deployReports: deployReports,
    deployComplete: deployComplete
};