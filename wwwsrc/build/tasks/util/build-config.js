var minimist = require('minimist');
var ciConfigJson = require('../../../ciConfig.json');
var packageJson = require('../../../package.json');
var display = require('./display');

function generateBuildNumber(packageVersion) {

    if (!packageVersion) {
        packageVersion = "1.0.0";
    }

    let versionParts = (packageVersion).split(".");
    let generatedVersion = [];

    generatedVersion[0] = versionParts[0] || 1;                 // major
    generatedVersion[1] = versionParts[1] || 0;                 // minor
    generatedVersion[2] = process.env.BUILD_BUILDNUMBER || 0;   // patch
    generatedVersion[3] = 0;                                    // microsoft use - always 0

    return generatedVersion.join(".");
}

function getBuildConfigurationFromArgs() {
    var knownOptions = {
        string: ['buildType', 'platformType'],
        default: {buildType: null, platformType: null}
    };

    var options = minimist(process.argv.slice(2), knownOptions);

    return getBuildConfiguration(options.buildType, options.platformType);
}

function getBuildConfiguration(buildType, platformType) {
    var config;

    if (!buildType) {
        display.error("You must specify a buildType command line parameter");
        process.exit(1);
    }
    else if (!platformType) {
        display.error("You must specify a platformType command line parameter");
        process.exit(1);
    }
    else if (ciConfigJson &&
        ciConfigJson.builds &&
        ciConfigJson.builds[buildType] &&
        ciConfigJson.builds[buildType].platforms &&
        ciConfigJson.builds[buildType].platforms[platformType]) {

        config = ciConfigJson.builds[buildType].platforms[platformType];
    } else {
        display.error("ciConfig.json does not contain a builds configuration for buildType '" + buildType + "' with platform '" + platformType + "'");
        process.exit(1);
    }

    return {
        buildType: buildType,
        platformType: platformType,
        minify: config.minify,
        sourceMaps: config.sourceMaps,
        isDevelopment: config.isDevelopment,
        certificate: config.certificate,
        projectFile: config.projectFile,
        version: config.version
    }
}

module.exports = {
    getBuildConfiguration: getBuildConfiguration,
    getBuildConfigurationFromArgs: getBuildConfigurationFromArgs,
    buildNumber: generateBuildNumber(packageJson.version),
    branchName: process.env.BUILD_SOURCEBRANCHNAME || "unknown"
};