var gulp = require('gulp');
var buildConfig = require('./util/build-config');
var packaging = require('./util/packaging');

gulp.task('package', function (cb) {
    packaging.package(buildConfig.getBuildConfigurationFromArgs(), buildConfig.buildNumber, cb);
});
