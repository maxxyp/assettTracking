var gulp = require('gulp');
var packager = require('electron-packager');
var eventStream = require('event-stream');
var file = require('gulp-file');
var fs = require('fs');
var path = require('path');
var inject = require('gulp-inject-string');
var zip = require('gulp-zip');
var display = require('./display');
var signing = require('./signing');
var electronInstaller = require('electron-winstaller');
var semverRegex = require('semver-regex');

function setUpElectronShim(buildConfiguration, appName, electronPackageDirWithPlatform, appVersion, cb) {
    var tasks = [];

    tasks.push(gulp.src("./build/electron/**/*")
        .pipe(file('package.json', JSON.stringify({
            name: appName,
            version: appVersion,
            main: "main.js"
        })))
        .pipe(gulp.dest(electronPackageDirWithPlatform + "/resources/app/")));

    tasks.push(gulp.src(electronPackageDirWithPlatform + "/resources/app/index.html")
        .pipe(inject.before('</head>', '<script src="shim.js"></script>\n'))
        .pipe(gulp.dest(electronPackageDirWithPlatform + "/resources/app/")));

    eventStream.merge(tasks)
        .on("end", cb);
}

function package(buildConfiguration, appName, webPackageDir, electronPackageDir, done) {
    var isDirectory = false;
    try {
        isDirectory = fs.statSync(webPackageDir).isDirectory();
    } catch (e) {
        display.error("Please package the app first using 'gulp package'");
        process.exit(1);
    }

    var platform = "win32";
    var arch = "x64";
    // electron supports major, minor, patch only. Strip build number
    var appVersion = buildConfiguration.buildNumber || "1.0.0.0";
    var appVersionSemVer = semverRegex().exec(appVersion)[0];
    var appCompanyName = "British Gas " + new Date().getFullYear();

    /* create an empty package.json or the getNameAndPackage in packager barfs */
    fs.writeFile(webPackageDir + "package.json", JSON.stringify({ "name" : appName, "version": appVersion  }), function(err) {
        if(err) {
            display.error(err);
            process.exit(1);
        } else {
            packager({
                name: appName,
                electronVersion: buildConfiguration.version,
                dir: webPackageDir,
                arch: arch,
                platform: platform,
                appCopyright: appCompanyName,
                appVersion: appVersion,
                buildVersion: appVersion,
                win32metadata: {
                    CompanyName: appCompanyName,
                    ProductName: appName,
                    FileDescription: appName,
                    OriginalFilename: appName + '.exe'
                },
                asar: false,
                overwrite: true,
                icon: "./assets/favicon/favicon.ico",
                out: electronPackageDir
            }, function (err) {
                if (err) {
                    display.error(err);
                    process.exit(1);
                } else {
                    fs.unlink(webPackageDir + "package.json");

                    var electronPackageDirWithPlatform = electronPackageDir + appName + "-" + platform + "-" + arch;

                    setUpElectronShim(buildConfiguration, appName, electronPackageDirWithPlatform, appVersion, function () {
                        signing.signCode(buildConfiguration, electronPackageDir + "**/*.exe", function() {

                            electronInstaller.createWindowsInstaller({
                                appDirectory: electronPackageDirWithPlatform,
                                outputDirectory: "../packaged/electron-installer",
                                version: appVersionSemVer,
                                description: "EWB",
                                authors: appCompanyName,
                                noMsi: false,
                                noDelta: true, // disable for now as we don't have auto updates working.
                                //remoteReleases: "http://localhost:8080/" // change this to the new S3 releases URI. The installer will download a lesser version and create a delta.
                            })
                            .then(() => {
                                signing.signCode(buildConfiguration, "../packaged/" + "setup.exe", function () {
                                    var zipDest = "electron-" + platform + "-" + arch + "-" + buildConfiguration.buildType + ".zip";
                                    display.info("Zipping package to ", zipDest);
                                    var zipStream = gulp.src("../packaged/electron-installer/**/*")
                                        .pipe(zip(zipDest))
                                        .pipe(gulp.dest("../packaged/"))
                                        .on("end", function() {
                                            done();
                                        });
                                    
                                    
                                });
                           
                            });


                            
                        });
                    });
                }
            });
        }
    });
}

module.exports = {
    package: package
};