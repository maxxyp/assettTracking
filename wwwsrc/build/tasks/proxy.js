const gulp = require('gulp');
const cors_proxy = require('cors-anywhere');
const display = require('./util/display');

gulp.task("proxy", function(done){

    var host = "localhost";
    var port = 8081;

    cors_proxy.createServer({
        originWhitelist: [],    // Allow all origins
        requireHeader: [],      // ['origin', 'x-requested-with'],
        removeHeaders: [],       // ['cookie', 'cookie2']
    }).listen(port, host, function() {
        display.log('Running CORS Anywhere Proxy on ' + host + ':' + port);
    });

});