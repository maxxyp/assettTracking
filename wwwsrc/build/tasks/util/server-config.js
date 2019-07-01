var minimist = require('minimist');
var ciConfigJson = require('../../../ciConfig.json');
var display = require('./display');

function getServerConfigurationFromArgs() {
    var knownOptions = {
        string: ['serverEnv'],
        default: {serverEnv: null}
    };

    var options = minimist(process.argv.slice(2), knownOptions);

    return getServerConfiguration(options.serverEnv);
}

function getServerConfiguration(serverEnv) {
    var config;

    if (!serverEnv) {
        display.error("You must specify a serverEnv command line parameter");
        process.exit(1);
    }
    else if (ciConfigJson &&
        ciConfigJson.servers &&
        ciConfigJson.servers[serverEnv]) {

        config = ciConfigJson.servers[serverEnv];
    } else {
        display.error("ciConfig.json does not contain a server configuration for serverEnv '" + serverEnv + "'");
        process.exit(1);
    }

    return {
        serverEnv: serverEnv,
        server: config.server,
        deployPort: config.deployPort,
        deployBuildEndpoint: config.deployBuildEndpoint,
        deployReportEndpoint: config.deployReportEndpoint,
        deployCompleteEndpoint: config.deployCompleteEndpoint,
        unpack: config.unpack,
        proxyServer: config.proxyServer,
        proxyEnabled: config.proxyEnabled
    }
}

module.exports = {
    getServerConfiguration: getServerConfiguration,
    getServerConfigurationFromArgs: getServerConfigurationFromArgs
};