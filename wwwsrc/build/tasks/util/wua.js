var gulp = require('gulp');
var filenames = require("gulp-filenames");
var fs = require('fs');
var replace = require('gulp-replace');
var es = require('event-stream');
var cheerio = require('gulp-cheerio');
var prettify = require('gulp-prettify');
const exec = require('child_process').exec;
var path = require('path');
var through = require('through2');
var display = require('./display');
var signing = require('./signing');

const IS_MAC_BUILD_AGENT = /^darwin/.test(process.platform);

var clientPackagesFilenames = [];
var clientDtsFilenames = [];

var msBuildFolders = [
    "C:/Program Files (x86)/Microsoft Visual Studio/2017/Professional/MSBuild/15.0/Bin/",
    "C:/Program Files (x86)/Microsoft Visual Studio/2017/Enterprise/MSBuild/15.0/Bin/",
    "C:/Program Files (x86)/Microsoft Visual Studio/2017/Community/MSBuild/15.0/Bin/",
    "C:/Program Files (x86)/MSBuild/14.0/Bin/"
];

function developBuildFoldersClientPackages(clientPackagesJson, cb) {
    var tasks = [];

    for (var i = 0; i < clientPackagesJson.items.length; i++) {
        tasks.push(processPackage(clientPackagesJson, i, clientPackagesJson.items[i]));
        if (clientPackagesJson.items[i].dts) {
            clientDtsFilenames.push(clientPackagesJson.items[i].dts);
        }
    }

    es.merge(tasks)
        .on("end", cb);
}

function processPackage(clientPackagesJson, index, item) {
    if (item.package) {
        return gulp.src(clientPackagesJson["root"] + "/" + item.package.location + "/**/*.{js,css,html}")
            .pipe(filenames("client_package_filenames" + index))
            .pipe(gulp.dest('../wwwsrc/' + clientPackagesJson["root"] + "/" + item.package.location))
            .on('end', function () {
                var cpf = filenames.get("client_package_filenames" + index);
                for (var j = 0; j < cpf.length; j++) {
                    cpf[j] = item.package.location + "/" + cpf[j];
                }
                clientPackagesFilenames = clientPackagesFilenames.concat(cpf);
            });

    } else {
        var lastSlash = item.location.lastIndexOf("/");
        var path = item.location.substring(0, lastSlash);
        return gulp.src(clientPackagesJson["root"] + "/" + item.location + ".js")
            .pipe(filenames("client_package_filenames" + index))
            .pipe(gulp.dest('../wwwsrc/' + clientPackagesJson["root"] + "/" + path))
            .on('end', function () {
                var cpf = filenames.get("client_package_filenames" + index);
                for (var j = 0; j < cpf.length; j++) {
                    cpf[j] = path + "/" + cpf[j];
                }
                clientPackagesFilenames = clientPackagesFilenames.concat(cpf);
            });
    }
}

function updateManifestPublisher(buildConfiguration, cb) {
    display.banner("Updating manifest publisher");

    gulp.src('../*.appxmanifest')
        .pipe(cheerio({
            parserOptions: {
                xmlMode: true
            },
            run: function ($, file) {
                if (buildConfiguration.certificate) {
                    $("Package Identity").attr("Publisher", buildConfiguration.certificate.name);
                }
            }
        }))
        .pipe(prettify({indent_size: 2}))
        .pipe(gulp.dest('../'))
        .on("end", cb);
}

function updateManifestCapabilities(appConfig, appName, cb) {
    display.banner("Updating manifest capabilities");

    var schemaName = '<Extensions>' +
        '<uap:Extension Category="windows.protocol">' +
        '<uap:Protocol Name="' + appName + '">' +
        '<uap:DisplayName>' + appName + '</uap:DisplayName>' +
        '</uap:Protocol>' +
        '</uap:Extension>' +
        '</Extensions>';

    gulp.src('../*.appxmanifest')
        .pipe(cheerio({
            parserOptions: {
                xmlMode: true
            },
            run: function ($, file) {
                if ($('Package Applications Application').find($('Extensions')).length === 0) {
                    $("Package Applications Application").append(schemaName);
                } else {
                    $("Package Applications Application Extensions").replaceWith(schemaName);
                }

                var wuaconfig = null;

                try {
                    wuaconfig = require("../../../wuaconfig.json");
                    wuaconfig.uapCapabilities = wuaconfig.uapCapabilities || [];
                    wuaconfig.capabilities = wuaconfig.capabilities || [];

                } catch (e) {
                }

                try {
                    if (wuaconfig && wuaconfig.uapCapabilities && appConfig) {
                        var isSimulationMode = hasSimulationData(appConfig);

                        var pos = wuaconfig.uapCapabilities.indexOf("removableStorage");
                        if (isSimulationMode) {
                            if (pos < 0) {
                                wuaconfig.uapCapabilities.push("removableStorage");
                            }
                        } else {
                            if (pos >= 0) {
                                wuaconfig.uapCapabilities.splice(pos, 1);
                            }
                        }
                    }
                } catch (e) {
                }

                $("Package Applications Application uap\\:VisualElements").attr("BackgroundColor", wuaconfig && wuaconfig.background || "transparent");

                if (wuaconfig) {
                    var capabilities = "<Capabilities><Capability Name=\"internetClient\" />";
                    (wuaconfig.uapCapabilities || []).forEach(function (cap) {
                        capabilities += "<uap:Capability Name=" + cap + " />";
                    });
                    (wuaconfig.capabilities || []).forEach(function (cap) {
                        capabilities += "<DeviceCapability Name=" + cap + " />";
                    });

                    if ($('Package').find($('Capabilities')).length === 0) {
                        $("Package").append(capabilities);
                    } else {
                        $("Package Capabilities").replaceWith(capabilities);
                    }

                }
            }
        }))
        .pipe(prettify({indent_size: 2}))
        .pipe(gulp.dest('../'))
        .on("end", cb);
}

function buildProjectPackaged(buildConfiguration, appName, cb) {
    display.banner("Building project packaged");

    var replacePattern = /<\/AppxManifest>[\s\S]+<\/ItemGroup>/gmi;
    var projectFiles = "</AppxManifest>\r\n";

    projectFiles += "    <None Include=\"*.pfx\" />\r\n";
    projectFiles += "    <Content Include=\"res\\**\\*.png\" />\r\n";
    projectFiles += "    <Content Include=\"www\\**\\*\" />\r\n";

    projectFiles += "  <\/ItemGroup>";

    gulp.src("../" + appName + `.${buildConfiguration.projectFile || 'packaged'}.jsproj`)
        .pipe(replace(replacePattern, projectFiles))
        .pipe(gulp.dest("../"))
        .on("end", cb);
}

function buildProjectDevelop(appName, clientPackagesJson, cb) {
    display.banner("Building project develop");

    var replacePattern = /<\/AppxManifest>[\s\S]+<\/ItemGroup>/gmi;
    var projectFiles = "</AppxManifest>\r\n";

    projectFiles += "    <None Include=\"*.pfx\" />\r\n";
    projectFiles += "    <Content Include=\"res\\**\\*.png\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\app.config.json\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\index.html\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\assets\\**\\*\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\fonts\\**\\*\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\css\\**\\*\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\app\\**\\*.html\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\app\\**\\*.js\" />\r\n";
    projectFiles += "    <Content Include=\"wwwsrc\\app\\**\\*.js.map\" />\r\n";
    projectFiles += "    <TypeScriptCompile Include=\"wwwsrc\\app\\**\\*.ts\" />\r\n";
    projectFiles += "    <TypeScriptCompile Include=\"wwwsrc\\typings\\**\\*.ts\" />\r\n";
    projectFiles += "    <TypeScriptCompile Include=\"wwwsrc\\tests\\e2e\\**\\*.ts\" />\r\n";

    developBuildFoldersClientPackages(clientPackagesJson, function () {
        for (var i = 0; i < clientPackagesFilenames.length; i++) {
            projectFiles += "    <Content Include=\"wwwsrc\\" + clientPackagesJson["root"] + "\\" + clientPackagesFilenames[i].replace(/\//g, "\\") + "\" />\r\n";
        }

        for (var j = 0; j < clientDtsFilenames.length; j++) {
            projectFiles += "    <TypeScriptCompile Include=\"wwwsrc\\" + clientPackagesJson["root"] + "\\" + clientDtsFilenames[j].replace(/\//g, "\\") + "\" />\r\n";
        }

        projectFiles += "  <\/ItemGroup>";

        gulp.src("../" + appName + ".develop.jsproj")
            .pipe(replace(replacePattern, projectFiles))
            .pipe(gulp.dest("../"))
            .on("end", cb);
    });
}

function updateManifestVersion(buildNumber, cb) {
    display.banner("Updating manifest version");

    var replacement = " Version=\"" + buildNumber + "\"";

    gulp.src('../*.appxmanifest')
        .pipe(replace(/ Version=".*?"/g, replacement))
        .pipe(gulp.dest('../'))
        .on("end", cb);
}

function msBuild(buildConfiguration, appName, outDir, cb) {
    if (outDir.substr(0, 3) === "../") {
        outDir = outDir.substr(3);
    }

    let msBuildFolder = "";

    for (let i = 0; i < msBuildFolders.length; i++) {
        console.log(`Looking for MS Build in ${msBuildFolders[i]}`);
        if (fs.existsSync(msBuildFolders[i] + "msbuild.exe")) {
            console.log(`MS Build found in ${msBuildFolders[i]}`);
            msBuildFolder = msBuildFolders[i];
            break;
        }
    }

    console.log(`MS Build is ${msBuildFolder}msbuild.exe`);

    var command = "\"" + msBuildFolder + "msbuild.exe" + "\"";

    var args = [
        '..\\' + appName + `.${buildConfiguration.projectFile || 'packaged'}.jsproj`,
        '/p:Configuration=' + buildConfiguration.buildType,
        '/p:OutDir=' + outDir
    ];

    display.info("Exec MSBuild", command + " " + args.join(" "));

    exec(command + " " + args.join(" "), {maxBuffer: 1024 * 5000}, function (err, stdout, stderr) {
        if (err) {
            display.error(err);
            process.exit(1);
        } else {
            display.log(stdout);
            cb();
        }
    });
}

function package(buildConfiguration, appConfig, appName, buildNumber, outDir, cb) {
    if (IS_MAC_BUILD_AGENT) {
        return cb();
    }

    buildProjectPackaged(buildConfiguration, appName, function () {
        updateManifestVersion(buildNumber, function () {
            updateManifestPublisher(buildConfiguration, function () {
                updateManifestCapabilities(appConfig, appName, function () {
                    msBuild(buildConfiguration, appName, outDir, function () {
                        signing.signCode(buildConfiguration, outDir + "**/*.appx", cb);
                    })
                });
            });
        })
    });
}

function hasSimulationData(appConfigJson) {
    if (appConfigJson) {
        if (appConfigJson["simulationMode"] === true) {
            return true;
        } else {
            for(var propName in appConfigJson) {
                if (propName.indexOf("Endpoint") > 0) {
                    var endpointConfiguration = appConfigJson[propName];
                    if (endpointConfiguration.clients && endpointConfiguration.routes) {
                        var simClient = endpointConfiguration.clients.find(function(client) {
                            return client.type === "simulation";
                        });

                        if (simClient) {
                            simClientUsed = endpointConfiguration.routes.filter(function(route) {
                                    return route.client === simClient.name;
                                }).length > 0;

                            if (simClientUsed) {
                                return simClientUsed;
                            }
                        }
                    }
                }
            }

            return false;
        }
    } else {
        return false;
    }
}

module.exports = {
    buildProjectPackaged: buildProjectPackaged,
    buildProjectDevelop: buildProjectDevelop,
    package: package,
    hasSimulationData: hasSimulationData
};