var gutil = require('gulp-util');

function banner(text) {
    console.log(gutil.colors.green("******************************************************************************"));
    console.log(gutil.colors.green("* " + text));
    console.log(gutil.colors.green("******************************************************************************"));
}

function log(text) {
    gutil.log(text);
}

function info(caption, text) {
    gutil.log("[" + gutil.colors.cyan(caption) + "]", text);
}

function error(text) {
    gutil.log(gutil.colors.red(text));
}

function success(text) {
    gutil.log(gutil.colors.blue(text));
}


module.exports = {
    banner: banner,
    log: log,
    info: info,
    error: error,
    success: success
};