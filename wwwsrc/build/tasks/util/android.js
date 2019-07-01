var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var zip = require('gulp-zip');
var display = require('./display');
var assign = require('object-assign');
var child_process = require('child_process');

const CORDOVA_PATH = path.join(process.cwd(), "node_modules", ".bin", "cordova");

function package(buildConfiguration, appName, buildNumber, done) {
    
    var cordovaPlatformDir = path.join(process.cwd(), "..", "platforms", "android");
    var opts = assign({ env: assign({ BUILD_NUMBER: buildNumber }, process.env), maxBuffer: 500*1024 });


    child_process.exec(CORDOVA_PATH + " platform rm android", opts, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error 1: ${error}`);
            return;
        }

        child_process.exec(CORDOVA_PATH + " platform add android", opts, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error 2: ${error}`);
                return;
            }

            child_process.exec(CORDOVA_PATH + " build", opts, (error) => {
                if (error) {
                    console.error(`exec error 3: ${error}`);
                    return;
                }

                var zipDest = "android-" +  appName + "-" + buildConfiguration.buildType + ".zip";
                gulp.src(cordovaPlatformDir + "/**/*")
                    .pipe(zip(zipDest))
                    .pipe(gulp.dest("../packaged/"))
                    .on("end", done);
            });

        });
    });
}

module.exports = {
    package: package
};