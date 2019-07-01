/// <reference path="../../../typings/app.d.ts" />
define(["require", "exports", "aurelia-logging", "./services/uriSchemeService", "./platformHelper", "./services/configurationService", "./errorHandler", "./services/loggerService", "whatwg-fetch"], function (require, exports, Logging, uriSchemeService_1, platformHelper_1, configurationService_1, errorHandler_1, loggerService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Startup = /** @class */ (function () {
        function Startup() {
        }
        Startup.configure = function (aurelia, resources, plugins) {
            platformHelper_1.PlatformHelper.isDevelopment = window.appIsDevelopment ? window.appIsDevelopment : false;
            platformHelper_1.PlatformHelper.appVersion = window.appVersion ? window.appVersion : "<local>";
            platformHelper_1.PlatformHelper.buildType = window.appBuildType ? window.appBuildType : "dev";
            platformHelper_1.PlatformHelper.isSource = window.appIsSource ? window.appIsSource : false;
            aurelia.use
                .defaultBindingLanguage()
                .defaultResources()
                .router()
                .eventAggregator()
                .plugin("aurelia-validation")
                .plugin("aurelia-dialog", function (config) {
                config.useDefaults().useCSS("");
            });
            if (resources) {
                for (var i = 0; i < resources.length; i++) {
                    aurelia.use.globalResources(platformHelper_1.PlatformHelper.appRoot() + resources[i]);
                }
            }
            if (plugins) {
                for (var i = 0; i < plugins.length; i++) {
                    aurelia.use.plugin(plugins[i]);
                }
            }
            if (platformHelper_1.PlatformHelper.getPlatform() === "wua") {
                aurelia.use.plugin(platformHelper_1.PlatformHelper.appRoot() + "common/core/plugins/historyWua/index");
            }
            else {
                aurelia.use.history();
            }
            var configService = aurelia.container.get(configurationService_1.ConfigurationService);
            var uriSchemeService = aurelia.container.get(uriSchemeService_1.UriSchemeService);
            return errorHandler_1.ErrorHandler.init(aurelia)
                .then(function () { return configService.load(); })
                .then(function () { return aurelia.start(); })
                .then(function () {
                var loggerService = aurelia.container.get(loggerService_1.LoggerService);
                return loggerService.initialize(aurelia, configService.getConfiguration());
            })
                .then(function () {
                var logger = Logging.getLogger("Platform");
                logger.debug("Platform: " + platformHelper_1.PlatformHelper.getPlatform());
                logger.debug("Is Cordova: " + platformHelper_1.PlatformHelper.isCordova());
                logger.debug("Is Mobile: " + platformHelper_1.PlatformHelper.isMobile());
                if (platformHelper_1.PlatformHelper.isCordova()) {
                    logger.debug("Cordova Version: " + platformHelper_1.PlatformHelper.cordovaVersion());
                    logger.debug("Cordova Platform Id: " + platformHelper_1.PlatformHelper.cordovaPlatformId());
                }
                logger.debug("Screen Width: " + window.innerWidth);
                logger.debug("Screen Height: " + window.innerHeight);
                logger.warn("App Version: " + platformHelper_1.PlatformHelper.appVersion);
                uriSchemeService.registerPlatform();
                uriSchemeService.navigateToInitialRoute();
                return aurelia;
            })
                .then(function () { return aurelia.setRoot(); });
        };
        return Startup;
    }());
    exports.Startup = Startup;
});

//# sourceMappingURL=startup.js.map
