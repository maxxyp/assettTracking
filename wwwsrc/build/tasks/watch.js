var gulp = require('gulp');
var watch = require('gulp-watch');
var bs = require('browser-sync').create();
var reload = bs.reload;
require('./build');

gulp.task('watch-reload', ['typescript-compile'], function() {
    reload({stream:false});
});

gulp.task('watch', function() {
    gulp.watch('app/**/*.ts', ['watch-reload']);
    gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('watch-sync', ['watch'], function() {
    var rootDir = __dirname;
    var parts = rootDir.split("\\");
    parts.pop();
    parts.pop();
    rootDir = parts.join("\\");

    bs.init({
        open: true,
        port: 9000,
        https: true,
        server: {
            baseDir: [rootDir],
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            },
            index: "index.html"
        },
        files: [
            'css/**/*.css'],
        browser: ["chrome"]
        //browser: ["firefox"]
    });
});

