var gulp = require('gulp');
var gutil = require('gulp-util');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var del = require('del');
var tslint = require('gulp-tslint');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var buildRequire = require('./util/build-require');
var display = require('./util/display');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var name = require('gulp-rename');
var md = require('gulp-remarkable');

var singleExit = true;
var tsErrorCount = 0;
var lintErrorCount = 0;
var tsPrefix = "[" + gutil.colors.cyan("typescript") + "]";
var lintPrefix = "[" + gutil.colors.cyan("tslint") + "]";

gulp.task('typescript-compile', function() {
    var tsProject = ts.createProject('tsconfig.json');

    var reporter = {
        error: function (error) {
            gutil.log(tsPrefix, error.message);
            tsErrorCount++;
        },
        finish: function() {
            if(singleExit && tsErrorCount > 0) {
                gutil.log(tsPrefix, "There were " +  tsErrorCount + " errors, exiting.");
                process.exit(1);
            }
        }
    };

    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject(reporter)).js
        // .pipe(uglify({ mangle: { keep_fnames: true } }))
        .pipe(sourcemaps.write(".", { includeContent: true, sourceRoot : "" }))
        .pipe(gulp.dest("app"));
});

gulp.task('sass', function() {
    return gulp.src('sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: [
            'last 2 versions', 'safari >= 7', 'ios >= 7'
        ]})]))
        .pipe(sourcemaps.write(".", { sourceRoot: '', includeContent: true }))
        .pipe(gulp.dest('css'));
});

gulp.task('tslint', function() {
    return gulp.src('app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report(function(failures, file, options) {
            failures.forEach(function (failure) {
                gutil.log(lintPrefix, gutil.colors.red("error"), tslint.proseErrorFormat(failure));
                lintErrorCount++;
            });
        }, {
            emitError: false
        })).on("end", function() {
            if (singleExit && lintErrorCount > 0) {
                gutil.log(lintPrefix, "There were " +  lintErrorCount + " errors, exiting.");
                process.exit(1);
            }
        });
});

gulp.task('copy-template', function () {
    var packageJson = require('../../package.json');
    var varScript =
        '        window.appIsDevelopment = true;\r\n' +
        '        window.appIsSource = true;\r\n' +
        '        window.appBuildType = \'dev\';\r\n' +
        '        window.isFullScreen = false;\r\n' +
        '        window.appVersion = \'' + packageJson.version + '.0\';\r\n';

    var loadScript = "";
    var clientPackagesJson = require('../../clientPackages.json');

    var initScript = buildRequire(clientPackagesJson, clientPackagesJson.root);

    initScript += '        Promise.config({\r\n';
    initScript += '            warnings: false,\r\n';
    initScript += '            longStackTraces: true\r\n';
    initScript += '        });\r\n';
    initScript += varScript;
    initScript += '        require(["aurelia-bootstrapper"]);\r\n';
    initScript += '    </script>\r\n';

    return gulp.src("index.template.html")
        .pipe(replace('@@BUST@@', ''))
        .pipe(replace('<!-- BOOTSTRAP -->', loadScript + initScript))
        .pipe(rename("index.html"))
        .pipe(gulp.dest("."));
});

gulp.task('clean-build', function() {
    return del([
        'app/**/*.js',
        'app/**/*.map',
        'css/**/*'
    ]);
});

gulp.task('release-notes', function() {
    return gulp.src('./assets/document_templates/release-notes.md')
    .pipe(md({preset: 'commonmark'}))
    .pipe(name('release-notes.html'))
    .pipe(gulp.dest('./assets/document_templates'));
});

gulp.task('build', function(callback) {
    display.banner("Build");

    singleExit = false;

    var parallelTasks = ['typescript-compile', 'tslint', 'sass', 'copy-template', 'release-notes'];
    !argv.lint && parallelTasks.splice(parallelTasks.indexOf('tslint'), 1);

    runSequence('clean-build', parallelTasks, function() {
        if(tsErrorCount > 0) {
            gutil.log(tsPrefix, "There were " +  tsErrorCount + " errors, exiting.");
        }

        if (lintErrorCount > 0) {
            gutil.log(lintPrefix, "There were " +  lintErrorCount + " errors, exiting.");
        }

        if (tsErrorCount > 0 || lintErrorCount > 0) {
            process.exit(1);
        }

        callback();
    });
});

gulp.task('build-watch', function() {
    var tsProject = ts.createProject('tsconfig.json');

    gulp.watch('app/**/*.ts')
        .on('change', function (file) {

            var filename = file.path.substring(file.path.lastIndexOf("\\") + 1);
            var folder = file.path.substring(0, file.path.lastIndexOf("\\") + 1);

            display.log("");
            display.log("-----------------------------------------------------------------------------");
            display.log("");
            display.info("Changed", filename);
            display.log("");

            gulp.src(file.path)
                .pipe(sourcemaps.init())
                .pipe(ts(tsProject)).js
                .pipe(sourcemaps.write(".", { sourceRoot: '', includeContent: true }))
                .pipe(gulp.dest(folder))
                .on('end', function(err) {
                    display.success("TypeScript compile done.");
                });

            gulp.src(file.path)
                .pipe(tslint())
                .pipe(tslint.report("prose", {
                    emitError: false
                }))
                .on('end', function(err) {
                    display.success("TSLint done.");
                });
        });
});
