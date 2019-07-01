var argv = require('yargs').argv;

var unitFiles = [
    {pattern: 'app.config.json', watched: false, included: false, served: true, nocache: false},
    {pattern: 'assets/**/*', watched: false, included: false, served: true, nocache: false}
];

var clientPackagesJson = require('./clientPackages.json');

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


var wildcard = "**/*";

if (argv.grep) { // support subsets gulp unit --grep "errorHandler" or --grep "common/" for a folder
    if (argv.grep.indexOf("/") > 0) {
        wildcard = argv.grep + "**/";
    } else {
        wildcard = "**/" + argv.grep;
    }
}

unitFiles.push({
    pattern: 'app/**/*.js',
    watched: true,
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
    watched: true,
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

module.exports = function(config) {
    config.set({
        basePath: '',
        port: 9876 + Math.floor((Math.random() * 100) + 1),
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        captureTimeout: 60000,
        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 60000,
        files: unitFiles,
        singleRun: false,
        reporters: ['progress'],
        browsers: ['ChromeHeadless'],
        frameworks: ['requirejs', 'jasmine', 'sinon']
    });
};
