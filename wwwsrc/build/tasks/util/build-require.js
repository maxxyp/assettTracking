function buildRequireConfig(clientPackagesJson, destRoot) {
    var initScript = '';

    var addScripts = [];
    var addElements = [];
    var addPackages = [];
    for (var i = 0; i < clientPackagesJson.items.length; i++) {
        if (clientPackagesJson.items[i].scriptInclude) {
            addScripts.push(clientPackagesJson.items[i]);
        } else if (clientPackagesJson.items[i].includeInIndex) {
            if (clientPackagesJson.items[i].package) {
                addPackages.push(clientPackagesJson.items[i]);
            } else {
                addElements.push(clientPackagesJson.items[i]);
            }
        }
    }

    for (var j = 0; j < addScripts.length; j++) {
        initScript += '        <script src="' + destRoot + '/' + addScripts[j].location + '.js"></script>\r\n';
    }

    initScript += '        <script>\r\n';
    initScript += '        var baseUrl = window.location.origin + window.location.pathname.replace("index.html", "");\r\n';
    initScript += '        require.config({\r\n';
    initScript += '           baseUrl: baseUrl + "app",\r\n';
    initScript += '           paths: {\r\n';

    for (var k = 0; k < addElements.length; k++) {
        initScript += '               \'' + addElements[k].name + '\': \'../' + destRoot + '/' + addElements[k].location + '\'';

        if (k < addElements.length - 1) {
            initScript += ',';
        }

        initScript += '\r\n';
    }
    initScript += '           },\r\n';
    initScript += '           packages: [\r\n';
    for (var l = 0; l < addPackages.length; l++) {
        initScript += '               {\r\n';
        initScript += '                  name: \'' + addPackages[l].name + '\',\r\n';
        initScript += '                  location: \'../' + destRoot + '/' + addPackages[l].package.location + '\',\r\n';
        initScript += '                  main: \'' + addPackages[l].package.main + '\'\r\n';
        initScript += '               }';

        if (l < addPackages.length - 1) {
            initScript += ',';
        }

        initScript += '\r\n';
    }
    initScript += '           ]\r\n';
    initScript += '        });\r\n';
    return initScript;
}

module.exports = buildRequireConfig;