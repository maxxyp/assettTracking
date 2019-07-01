var gulp = require('gulp');
var fs = require('fs');
const exec = require('child_process').exec;
var path = require('path');
var through = require('through2');
var display = require('./display');

var windowsKitFolder = "C:/Program Files (x86)/Windows Kits/10/bin/x64/";

function signCode(buildConfiguration, filesToSign, cb) {
    display.banner("Signing code");

    if (!buildConfiguration.certificate) {
        display.success("Nothing to Sign");
        cb();
    } else {
        gulp.src(filesToSign)
            .pipe(signFiles(buildConfiguration))
            .on("end", cb);
    }
}

function signFiles(buildConfiguration) {
    return through.obj(function (file, enc, cb) {

        var cert = buildConfiguration.certificate,
            signTool = path.resolve(windowsKitFolder + "signtool.exe"),
            certificateLocation = path.resolve("../certificates/" + buildConfiguration.certificate.file),
            command = `"${signTool}" sign /v /fd sha256 /a /f "${certificateLocation}" /p ${cert.key} "${file.path}"`;

        exec(command, function (error, stdout, stderr) {
            if (error) {
                display.error(error);
                process.exit(1);
                return;
            }
            display.log(stdout);

            cb(null, file);
        });
    }, function (cb) {
        display.success("Signing Complete");
        cb();
        this.emit("end");
    });
}
module.exports = {
    signCode: signCode,
    signFiles: signFiles
};