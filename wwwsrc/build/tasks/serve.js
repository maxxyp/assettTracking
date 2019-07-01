const gulp = require('gulp');
const browserSync = require('browser-sync');
const display = require('./util/display');
const compress = require('compression');
const argv = require('yargs').argv;
const apiInterceptor = require('./util/api-interceptor');

const DEFAULT_PORT = 9000;

function corsHeader() {
    return function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    }
}

gulp.task('serve', function(done) {
    var middleware = [corsHeader()];

    if (argv.env) {
        middleware = middleware.concat(apiInterceptor());
    }

    if (!argv.compression) {
        middleware.push(compress());
        display.log("GZip compression enabled");
    } else {
        display.log("GZip compression disabled");
    }

    let port = process.env.PORT || argv.port || DEFAULT_PORT;

    browserSync({
        open: false,
		online: true,
        port: port,
        https: true,
        server: {
            baseDir: ['.'],
            middleware: middleware
        }
    }, done);
});
