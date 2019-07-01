var gulp = require('gulp');
var gm = require('gm').subClass({ imageMagick: true});
var mkdirp = require('mkdirp');
var path = require('path');
var display = require('./util/display');
var argv = require('yargs').argv;

var iconFileLocation = argv.in || "../svgsource/icon.svg";
var iconOutputLocation = argv.out || "res";

var icons = [
    /* Cordova */
    { width: 36, height: 36, background: "#005eb8", output: `../${iconOutputLocation}/icons/android/icon-36-ldpi.png` },
    { width: 48, height: 48, background: "#005eb8", output: `../${iconOutputLocation}/icons/android/icon-48-mdpi.png` },
    { width: 72, height: 72, background: "#005eb8", output: `../${iconOutputLocation}/icons/android/icon-72-hdpi.png` },
    { width: 96, height: 96, background: "#005eb8", output: `../${iconOutputLocation}/icons/android/icon-96-xhdpi.png` },
    { width: 144, height: 144, background: "#005eb8", output: `../${iconOutputLocation}/icons/android/icon-144-xxhdpi.png` },
    { width: 192, height: 192, background: "#005eb8", output: `../${iconOutputLocation}/icons/android/icon-192-xxxhdpi.png` },

    { width: 80, height: 80, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-40-2x.png` },
    { width: 40, height: 40, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-40.png` },
    { width: 100, height: 100, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-50-2x.png` },
    { width: 50, height: 50, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-50.png` },
    { width: 114, height: 114, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-57-2x.png` },
    { width: 57, height: 57, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-57.png` },
    { width: 120, height: 120, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-60-2x.png` },
    { width: 180, height: 180, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-60-3x.png` },
    { width: 60, height: 60, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-60.png` },
    { width: 144, height: 144, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-72-2x.png` },
    { width: 72, height: 72, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-72.png` },
    { width: 152, height: 152, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-76-2x.png` },
    { width: 76, height: 76, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-76.png` },
    { width: 87, height: 87, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-small-3x.png` },
    { width: 58, height: 58, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-small-2x.png` },
    { width: 29, height: 29, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-small.png` },
    { width: 167, height: 167, background: "#005eb8", output: `../${iconOutputLocation}/icons/ios/icon-83.5-2x.png` },

    { width: 150, height: 150, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square150x150Logo.scale-100.png` },
    { width: 360, height: 360, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square150x150Logo.scale-240.png` },
    { width: 30, height: 30, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square30x30Logo.scale-100.png` },
    { width: 310, height: 310, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square310x310Logo.scale-100.png` },
    { width: 44, height: 44, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square44x44Logo.scale-100.png` },
    { width: 106, height: 106, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square44x44Logo.scale-240.png` },
    { width: 70, height: 70, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square70x70Logo.scale-100.png` },
    { width: 71, height: 71, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square71x71Logo.scale-100.png` },
    { width: 240, height: 240, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Square71x71Logo.scale-240.png` },
    { width: 50, height: 50, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/StoreLogo.scale-100.png` },
    { width: 120, height: 120, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/StoreLogo.scale-240.png` },
    { width: 310, height: 150, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Wide310x150Logo.scale-100.png` },
    { width: 744, height: 360, background: "#005eb8", output: `../${iconOutputLocation}/icons/windows/Wide310x150Logo.scale-240.png` },

    /* Windows Universal App */
    { width: 24, height: 24, background: "none", output: `../${iconOutputLocation}/windows/BadgeLogo.scale-100.png` },
    { width: 30, height: 30, background: "none", output: `../${iconOutputLocation}/windows/BadgeLogo.scale-125.png` },
    { width: 36, height: 36, background: "none", output: `../${iconOutputLocation}/windows/BadgeLogo.scale-150.png` },
    { width: 48, height: 48, background: "none", output: `../${iconOutputLocation}/windows/BadgeLogo.scale-200.png` },
    { width: 96, height: 96, background: "none", output: `../${iconOutputLocation}/windows/BadgeLogo.scale-400.png` },
    { width: 150, height: 150, background: "none", output: `../${iconOutputLocation}/windows/Square150x150Logo.scale-100.png` },
    { width: 188, height: 188, background: "none", output: `../${iconOutputLocation}/windows/Square150x150Logo.scale-125.png` },
    { width: 225, height: 225, background: "none", output: `../${iconOutputLocation}/windows/Square150x150Logo.scale-150.png` },
    { width: 300, height: 300, background: "none", output: `../${iconOutputLocation}/windows/Square150x150Logo.scale-200.png` },
    { width: 600, height: 600, background: "none", output: `../${iconOutputLocation}/windows/Square150x150Logo.scale-400.png` },
    { width: 310, height: 310, background: "none", output: `../${iconOutputLocation}/windows/Square310x310Logo.scale-100.png` },
    { width: 388, height: 388, background: "none", output: `../${iconOutputLocation}/windows/Square310x310Logo.scale-125.png` },
    { width: 465, height: 465, background: "none", output: `../${iconOutputLocation}/windows/Square310x310Logo.scale-150.png` },
    { width: 620, height: 620, background: "none", output: `../${iconOutputLocation}/windows/Square310x310Logo.scale-200.png` },
    { width: 1240, height: 1240, background: "none", output: `../${iconOutputLocation}/windows/Square310x310Logo.scale-400.png` },
    { width: 44, height: 44, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.scale-100.png` },
    { width: 55, height: 55, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.scale-125.png` },
    { width: 66, height: 66, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.scale-150.png` },
    { width: 88, height: 88, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.scale-200.png` },
    { width: 176, height: 176, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.scale-400.png` },
    { width: 16, height: 16, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.targetsize-16.png` },
    { width: 24, height: 24, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.targetsize-24.png` },
    { width: 256, height: 256, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.targetsize-256.png` },
    { width: 48, height: 48, background: "none", output: `../${iconOutputLocation}/windows/Square44x44Logo.targetsize-48.png` },
    { width: 71, height: 71, background: "none", output: `../${iconOutputLocation}/windows/Square71x71Logo.scale-100.png` },
    { width: 89, height: 89, background: "none", output: `../${iconOutputLocation}/windows/Square71x71Logo.scale-125.png` },
    { width: 107, height: 107, background: "none", output: `../${iconOutputLocation}/windows/Square71x71Logo.scale-150.png` },
    { width: 142, height: 142, background: "none", output: `../${iconOutputLocation}/windows/Square71x71Logo.scale-200.png` },
    { width: 284, height: 284, background: "none", output: `../${iconOutputLocation}/windows/Square71x71Logo.scale-400.png` },
    { width: 50, height: 50, background: "none", output: `../${iconOutputLocation}/windows/StoreLogo.scale-100.png` },
    { width: 63, height: 63, background: "none", output: `../${iconOutputLocation}/windows/StoreLogo.scale-125.png` },
    { width: 75, height: 75, background: "none", output: `../${iconOutputLocation}/windows/StoreLogo.scale-150.png` },
    { width: 100, height: 100, background: "none", output: `../${iconOutputLocation}/windows/StoreLogo.scale-200.png` },
    { width: 200, height: 200, background: "none", output: `../${iconOutputLocation}/windows/StoreLogo.scale-400.png` },
    { width: 310, height: 150, background: "none", output: `../${iconOutputLocation}/windows/Wide310x150Logo.scale-100.png` },
    { width: 388, height: 188, background: "none", output: `../${iconOutputLocation}/windows/Wide310x150Logo.scale-125.png` },
    { width: 465, height: 225, background: "none", output: `../${iconOutputLocation}/windows/Wide310x150Logo.scale-150.png` },
    { width: 620, height: 300, background: "none", output: `../${iconOutputLocation}/windows/Wide310x150Logo.scale-200.png` },
    { width: 1240, height: 600, background: "none", output: `../${iconOutputLocation}/windows/Wide310x150Logo.scale-400.png` },

    { width: 620, height: 300, background: "none", output: `../${iconOutputLocation}/windows/SplashScreen.scale-100.png` },
    { width: 775, height: 375, background: "none", output: `../${iconOutputLocation}/windows/SplashScreen.scale-125.png` },
    { width: 930, height: 450, background: "none", output: `../${iconOutputLocation}/windows/SplashScreen.scale-150.png` },
    { width: 1240, height: 600, background: "none", output: `../${iconOutputLocation}/windows/SplashScreen.scale-200.png` },
    { width: 2480, height: 1200, background: "none", output: `../${iconOutputLocation}/windows/SplashScreen.scale-400.png` }
];

var splash = [
    { width: 640, height: 480, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-hdpi-landscape.png` },
    { width: 480, height: 640, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-hdpi-portrait.png` },
    { width: 426, height: 320, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-ldpi-landscape.png` },
    { width: 320, height: 426, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-ldpi-portrait.png` },
    { width: 470, height: 320, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-mdpi-landscape.png` },
    { width: 320, height: 470, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-mdpi-portrait.png` },
    { width: 960, height: 720, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-xhdpi-landscape.png` },
    { width: 720, height: 960, background: "#005eb8", output: `../${iconOutputLocation}/screens/android/screen-xhdpi-portrait.png` },

    { width: 1024, height: 768, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-ipad-landscape.png` },
    { width: 2048, height: 1536, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-ipad-landscape-2x.png` },
    { width: 768, height: 1024, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-ipad-portrait.png` },
    { width: 1536, height: 2048, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-ipad-portrait-2x.png` },
    { width: 640, height: 1136, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-iphone-568h-2x.png` },
    { width: 2208, height: 1242, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-iphone-landscape-736h.png` },
    { width: 320, height: 480, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-iphone-portrait.png` },
    { width: 640, height: 960, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-iphone-portrait-2x.png` },
    { width: 750, height: 1334, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-iphone-portrait-667h.png` },
    { width: 1242, height: 2208, background: "#005eb8", output: `../${iconOutputLocation}/screens/ios/screen-iphone-portrait-736h.png` },

    { width: 620, height: 300, background: "#005eb8", output: `../${iconOutputLocation}/screens/windows/SplashScreen.scale-100.png` },
    { width: 1152, height: 1920, background: "#005eb8", output: `../${iconOutputLocation}/screens/windows/SplashScreen.scale-240.png` },
    { width: 1152, height: 1920, background: "#005eb8", output: `../${iconOutputLocation}/screens/windows/SplashScreenPhone.scale-240.png` }
];

function createIcon(options) {

    var minDim = Math.min(options.width, options.height) * 0.34;
    mkdirp(path.dirname(options.output), function () {
        gm(iconFileLocation)
            .background(options.background)
            .resize(minDim, minDim)
            .gravity("Center")
            .extent(options.width, options.height)
            .write(options.output, function (err) {
                if (err) {
                    display.error("Write image failed: " + err);
                } else {
                    display.info("Written", options.output);
                }
            });
    });
}

function createSplash(options) {
    var minDim = Math.min(options.width, options.height) * 0.4;

    mkdirp(path.dirname(options.output), function() {
        gm(iconFileLocation)
            .background(options.background)
            .resize(minDim, minDim)
            .gravity("Center")
            .extent(options.width, options.height)
            .write(options.output, function(err) {
                if (err) {
                    display.error("Write image failed: " + err);
                } else {
                    display.info("Written", options.output);
                }
            });
    });
}

gulp.task("cordova-resources", function () {
    icons.forEach(createIcon);
    splash.forEach(createSplash);
});
