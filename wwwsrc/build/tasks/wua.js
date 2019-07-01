var gulp = require('gulp');
var wua = require('./util/wua');

gulp.task('wua-project-packaged', function (cb) {
    var packageJson = require('../../package.json');
    wua.buildProjectPackaged(packageJson["name"], cb)
});

gulp.task('wua-project-develop', function(cb) {
    var clientPackagesJson = require('../../clientPackages.json');
    var packageJson = require('../../package.json');
    wua.buildProjectDevelop(packageJson["name"], clientPackagesJson, cb)
});