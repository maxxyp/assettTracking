var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var zip = require('gulp-zip');
var display = require('./display');
var assign = require('object-assign');
var child_process = require('child_process');
var cheerio = require("cheerio");

const IS_MAC_BUILD_AGENT = /^darwin/.test(process.platform);
const CORDOVA_PATH = path.join(process.cwd(), "node_modules", ".bin", "cordova");

function package(buildConfiguration, appName, buildNumber, done) {

    if (!IS_MAC_BUILD_AGENT) {
        return done();
    }

    var $ = cheerio.load(fs.readFileSync(path.join(process.cwd(), ".." , "config.xml")));
    var iosBundleId = $("widget").attr("id");
    
    var cordovaIPADir = path.join(process.cwd(), "..");
    var opts = assign({ env: assign({ BUILD_NUMBER: buildNumber }, process.env), maxBuffer: 500*1024, stdio: [0,1,2]  });

    child_process.execSync(`cd .. && ${CORDOVA_PATH}` + " platform rm ios --nofetch", opts);
    child_process.execSync(`cd .. && ${CORDOVA_PATH}` + " platform add ios --nofetch", opts);
    child_process.execSync("cd .. && fastlane enterprise", opts);

    var zipDest = `${appName}-${buildConfiguration.platformType}-v${buildNumber}-${buildConfiguration.buildType}.zip`;
    gulp.src(cordovaIPADir + "/*.ipa")
        .pipe(zip(zipDest))
        .pipe(gulp.dest("../packaged/"))
        .on("end", done);
}

module.exports = {
    package: package
};