var gulp = require('gulp');
var gutil = require('gulp-util');
var Server = require('karma').Server;
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var filenames = require("gulp-filenames");
var async = require('async');
var del = require('del');
var argv = require('yargs').argv;
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var fs = require('fs');
var through = require('through2');
var Path = require('path');
var display = require('./util/display');
var tslint = require('gulp-tslint');

var lintPrefix = "[" + gutil.colors.cyan("tslint") + "]";

var unitFiles = [
    {pattern: 'app.config.json', watched: false, included: false, served: true, nocache: false},
    {pattern: 'assets/**/*', watched: false, included: false, served: true, nocache: false}
];

var clientPackagesJson = require('../../clientPackages.json');

if (clientPackagesJson) {
    for (var i = 0; i < clientPackagesJson.items.length; i++) {
        if (clientPackagesJson.items[i].includeInKarma) {
            if (!clientPackagesJson.items[i].package) {
                unitFiles.push({
                    pattern: clientPackagesJson["root"] + '/' + (clientPackagesJson.items[i].unitLocation ? clientPackagesJson.items[i].unitLocation : clientPackagesJson.items[i].location) + '.js',
                    watched: false,
                    included: false,
                    served: true,
                    nocache: false
                });
            } else {
                unitFiles.push({
                    pattern: clientPackagesJson["root"] + '/' + clientPackagesJson.items[i].package.location + '/**/*.js',
                    watched: false,
                    included: false,
                    served: true,
                    nocache: false
                });
            }
        }
    }
}

var requireFiles = [
    {pattern: 'clientPackages.json', watched: false, included: false, served: true, nocache: false},
    {pattern: 'tests/unitSetup.js', watched: false, included: true, served: true, nocache: false}
];

unitFiles = unitFiles.concat(requireFiles);

gulp.task('unit-clean', function () {
    return del([
        'tests/unit/**/*.js',
        'tests/unit/**/*.map',
        '../reports/**/*'
    ], {force: true});
});

gulp.task('unit-build-setup', ['unit-clean'], function () {
    var tsProject = ts.createProject('tsconfig.json');

    return gulp.src(['tests/unitSetup.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(gulp.dest('tests/'));
});

gulp.task('unit-tslint', function(){
    var wildcard = "**/*";
    var buildOutputFolder = "";

    if (argv.grep) { // support subsets gulp unit --grep "errorHandler" or --grep "common/" for a folder
        if (argv.grep.indexOf("/") > 0) {
            wildcard = argv.grep + "**/";
            buildOutputFolder = argv.grep + "/";
        } else {
            wildcard = "**/" + argv.grep;
        }
    }

    var lintErrorCount = 0;

    return gulp.src(['tests/unit/' + wildcard + '*.ts'])
        .pipe(tslint())
        .pipe(tslint.report(function(failures, file, options) {
            failures.forEach(function (failure) {
                gutil.log(lintPrefix, gutil.colors.red("error"), tslint.proseErrorFormat(failure));
                lintErrorCount++;
            });
        }, {
            emitError: false
        })).on("end", function() {
            if (lintErrorCount > 0) {
                gutil.log(lintPrefix, "There were " +  lintErrorCount + " errors, exiting.");
                process.exit(1);
            }
        });
});

gulp.task('unit-build', ['unit-build-setup'], function () {
    var tsProject = ts.createProject('tsconfig.json', { noImplicitAny: false });
    var tsPrefix = "[" + gutil.colors.cyan("typescript") + "]";
    var tsErrorCount = 0;

    var reporter = {
        error: function (error) {
            gutil.log(tsPrefix, error.message);
            tsErrorCount++;
        },
        finish: function() {
            if (tsErrorCount > 0) {
                gutil.log(tsPrefix, "There were " +  tsErrorCount + " errors, exiting.");
                process.exit(1);
            }
        }
    };

    var wildcard = "**/*";
    var buildOutputFolder = "";

    if (argv.grep) { // support subsets gulp unit --grep "errorHandler" or --grep "common/" for a folder
        if (argv.grep.indexOf("/") > 0) {
            wildcard = argv.grep + "**/";
            buildOutputFolder = argv.grep + "/";
        } else {
            wildcard = "**/" + argv.grep;
        }
    }

    unitFiles.push({
        pattern: 'app/**/*.js',
        watched: false,
        included: false,
        served: true,
        nocache: false
    });
    unitFiles.push({
        pattern: 'app/**/*.js.map',
        watched: false,
        included: false,
        served: true,
        nocache: false
    });
    unitFiles.push({
        pattern: 'tests/unit/' + wildcard + '*.js',
        watched: false,
        included: false,
        served: true,
        nocache: false
    });
    unitFiles.push({
        pattern: 'tests/unit/' + wildcard + '*.js.map',
        watched: false,
        included: false,
        served: true,
        nocache: false
    });

    let lintErrorCount = 0;


    return gulp.src(['tests/unit/' + wildcard + '*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject(reporter))
        .js.pipe(sourcemaps.write(".", {includeContent: true, sourceRoot: '' }))
        .pipe(gulp.dest('tests/unit/' + buildOutputFolder));
});

gulp.task('unit-serve', function (done) {
    var serverOpts = {
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: true,
        reporters: ['progress', 'story', 'html', 'coverage'],
        browsers: ['ChromeHeadless'],
        files: unitFiles,
        frameworks: ['requirejs', 'jasmine', 'sinon']
    };

    if (argv["unit-test-reporter"]) {
        serverOpts.reporters.push(argv["unit-test-reporter"]);
    }

    var server = new Server(serverOpts, function (exitCode) {
        if (exitCode === 0) {
            done();
        } else {
            process.exit(exitCode);
        }
    });

    server.start();
});

gulp.task('unit-debug', ['unit-build'], function (done) {
    var serverOpts = {
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: false,
        reporters: ['progress'],
        browsers: ['Chrome'],
        files: unitFiles,
        frameworks: ['requirejs', 'jasmine', 'sinon']
    };

    var server = new Server(serverOpts, function (exitCode) {
        if (exitCode === 0) {
            done();
        } else {
            process.exit(exitCode);
        }
    });

    server.start();
});

gulp.task('remap-istanbul', function () {
    return gulp.src('../reports/coverage/coverage-final.json')
        .pipe(remapIstanbul({
            reports: {
                'json': '../reports/coverage/coverage-remapped.json',
                'html': '../reports/coverage'
            }
        }));
});

gulp.task('unit', function (done) {
    display.banner("Unit Tests");

    var parallelTasks = ['unit-build', 'unit-tslint', 'unit-serve', 'remap-istanbul'];
    !argv.lint && parallelTasks.splice(parallelTasks.indexOf('unit-tslint'), 1);

    runSequence.apply(runSequence, parallelTasks.concat(done));
});

gulp.task('unit-create-missing', function () {
    var wildcard = "*.ts";

    if (argv.grep) {
        wildcard = argv.grep + "*.ts";
    }

    return gulp.src('app/**/' + wildcard)
        .pipe(writeEmptyTest());
});

function writeEmptyTest() {
    return through.obj(function (file, enc, next) {
        if (!file.isBuffer()) return next();

        var specFilename = file.path.replace("\\app\\", "\\tests\\unit\\").replace(".ts", ".spec.ts");
        var fname = Path.basename(specFilename).replace(".spec.ts", "");

        // Don't generate tests for interfaces or plugin index pages
        if (Path.basename(specFilename)[0] !== "I" && fname !== "index") {
            try {
                fs.statSync(specFilename);
            } catch (e) {
                var className = fname.substr(0, 1).toUpperCase() + fname.substr(1);

                var appdts = Path.relative(specFilename, "typings\\app.d.ts").replace(/\\/g, "/").substr(3);
                var classPath = Path.relative(specFilename, file.path).replace(/\\/g, "/").replace(".ts", "").substr(3);

                var newContent = '/// <reference path="' + appdts + '" />' + "\r\n";
                newContent += "\r\n";
                newContent += 'import {' + className + '} from "' + classPath + '";' + "\r\n";
                newContent += "\r\n";
                newContent += 'describe("the ' + className + ' module", () => {' + "\r\n";
                newContent += '    let ' + fname + ': ' + className + ';' + "\r\n";
                newContent += '    let sandbox: Sinon.SinonSandbox;' + "\r\n";
                newContent += "\r\n";
                newContent += '    beforeEach(() => {' + "\r\n";
                newContent += '        sandbox = sinon.sandbox.create();' + "\r\n";
                newContent += '        ' + fname + ' = new ' + className + '();' + "\r\n";
                newContent += '    });' + "\r\n";
                newContent += "\r\n";
                newContent += '    afterEach(() => {' + "\r\n";
                newContent += '        sandbox.restore();' + "\r\n";
                newContent += '    });' + "\r\n";
                newContent += "\r\n";
                newContent += '    it("can be created", () => {' + "\r\n";
                newContent += '        expect(' + fname + ').toBeDefined();' + "\r\n";
                newContent += '    });' + "\r\n";
                newContent += '});' + "\r\n";

                display.info("Creating", specFilename);
                try {
                    mkdir(Path.dirname(specFilename));
                } catch(e) {
                }
                fs.writeFileSync(specFilename, newContent);
            }
        }
        next();
    });
}

function mkdir(path, root) {

    var dirs = path.split('\\'), dir = dirs.shift(), root = (root || '') + dir + '\\';

    try { fs.mkdirSync(root); }
    catch (e) {
        //dir wasn't made, something went wrong
        if(!fs.statSync(root).isDirectory()) throw new Error(e);
    }

    return !dirs.length || mkdir(dirs.join('\\'), root);
}
