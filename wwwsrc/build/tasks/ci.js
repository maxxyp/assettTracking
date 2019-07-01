var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var deployment = require('./util/deployment');
var packaging = require('./util/packaging');
var buildConfig = require('./util/build-config');
var packageJson = require('../../package.json');
var ciConfig = require('../../ciConfig.json');
var es = require('event-stream');
var zip = require('gulp-zip');
var display = require('./util/display');
var argv = require('yargs').argv;

require('./build');
require('./unit');
// require('./e2e');
require('./documentation');

gulp.task('ci-clean', function() {
    display.banner("CI Clean");

    return del([
        '../packaged/',
        '../platforms/',
        '../reports/',
        '../bin/',
        '../bld/'
    ], { force: true });
});

gulp.task('ci-reports-deploy', function(done) {
    var servers = [];

    for(var server in ciConfig.servers) {
        servers.push({ server: server, config: ciConfig.servers[server]});
    }

    var counter = 0;
    var doNextReport = function() {
        if (counter < servers.length) {
            deployment.deployReports(servers[counter].server, servers[counter].config, packageJson["name"], buildConfig.buildNumber, function() {
                counter++;
                doNextReport();
            });
        } else {
            done();
        }
    };

    doNextReport();
});

gulp.task('ci-config-build', function(done) {
    var configs = [];

    for (var buildType in ciConfig.builds) {
        for (var platformType in ciConfig.builds[buildType].platforms) {
            ciConfig.builds[buildType].platforms[platformType].buildType = buildType;
            ciConfig.builds[buildType].platforms[platformType].platformType = platformType;
            configs.push(ciConfig.builds[buildType].platforms[platformType]);
        }
    }

    var counter = 0;
    var doNextBuild = function() {
        if (counter < configs.length) {
            packaging.package(configs[counter], buildConfig.buildNumber, function() {
                counter++;
                doNextBuild();
            });
        } else {
            done();
        }
    };

    doNextBuild();
});

gulp.task('ci-config-deploy', function(done) {
    var deploys = [];

    for (var buildType in ciConfig.builds) {
        for (var platformType in ciConfig.builds[buildType].platforms) {
            for(var server in ciConfig.servers) {
                ciConfig.builds[buildType].platforms[platformType].buildType = buildType;
                ciConfig.builds[buildType].platforms[platformType].platformType = platformType;

                deploys.push({ server: server, buildConfiguration: ciConfig.builds[buildType].platforms[platformType] });
            }
        }
    }

    var counter = 0;
    var doNextDeploy = function() {
        if (counter < deploys.length) {
            deployment.deployBuild(deploys[counter].server, ciConfig.servers[deploys[counter].server], deploys[counter].buildConfiguration, packageJson["name"], buildConfig.buildNumber, buildConfig.branchName, function() {
                counter++;
                doNextDeploy();
            });
        } else {
            done();
        }
    };

    doNextDeploy();
});

gulp.task('ci-complete-deploy', function(done) {
    var servers = [];

    for(var server in ciConfig.servers) {
        servers.push({ server: server, config: ciConfig.servers[server]});
    }

    var counter = 0;
    var doNextComplete = function() {
        if (counter < servers.length) {
            deployment.deployComplete(servers[counter].server, servers[counter].config, packageJson["name"], buildConfig.buildNumber, function() {
                counter++;
                doNextComplete();
            });
        } else {
            done();
        }
    };

    doNextComplete();
});

gulp.task('ci-zip-reports', function () {
    return gulp.src("../reports/**/*")
        .pipe(zip("reports.zip"))
        .pipe(gulp.dest("../packaged/"));
});

gulp.task('ci-master', function(done) {
    runSequence('ci-clean', 'tslint', 'build', 'unit-tslint', 'unit', 'ci-zip-reports', 'ci-reports-deploy', 'ci-config-build', 'ci-config-deploy', 'ci-complete-deploy', done);
});

gulp.task('ci-master-no-deploy', function(done) {
    runSequence('ci-clean', 'tslint', 'build', 'unit-tslint', 'unit', 'ci-zip-reports', 'ci-config-build', done);
});

gulp.task('ci-master-no-deploy', function(done) {
    runSequence('ci-clean', 'tslint', 'build', 'unit-tslint', 'unit', /*'e2e',*/ 'ci-zip-reports', 'ci-config-build', done);
});

gulp.task('ci-master-no-deploy', function(done) {
    runSequence('ci-clean', 'tslint', 'build', 'unit-tslint', 'unit', /*'e2e',*/ 'ci-zip-reports', 'ci-config-build', done);
});

gulp.task('ci-develop', function(done) {
    runSequence('tslint', 'build', 'unit-tslint', 'unit', done);
});