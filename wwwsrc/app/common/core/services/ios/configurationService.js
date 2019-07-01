/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports", "aurelia-logging"], function (require, exports, Logging) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationService = /** @class */ (function () {
        function ConfigurationService() {
            this._configuration = null;
            this._configFile = cordova.file.applicationDirectory + "www/app.config.json";
            this._logger = Logging.getLogger("Configuration");
        }
        ConfigurationService.prototype.getConfiguration = function (childName) {
            return childName ? this._configuration[childName] : this._configuration;
        };
        ConfigurationService.prototype.load = function () {
            if (!!this._configuration) {
                return Promise.resolve(this._configuration);
            }
            return this.fetchConfigFile();
        };
        ConfigurationService.prototype.overrideSettings = function (settings) {
            Object.assign(this._configuration, settings);
        };
        ConfigurationService.prototype.fetchConfigFile = function () {
            var _this = this;
            return new Promise(function (resolve) {
                window.resolveLocalFileSystemURL(_this._configFile, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            try {
                                _this._configuration = JSON.parse(reader.result);
                            }
                            catch (err) {
                                _this._logger.error("Cannot parse configuration", err);
                                return resolve(null);
                            }
                            resolve(_this._configuration);
                        };
                        reader.readAsText(file);
                    }, function (err) {
                        _this._logger.error("Cannot read configuration file " + _this._configFile, err);
                        resolve(null);
                    });
                }, function (err) {
                    _this._logger.error("Cannot load configuration file " + _this._configFile, err);
                    resolve(null);
                });
            });
        };
        return ConfigurationService;
    }());
    exports.ConfigurationService = ConfigurationService;
});

//# sourceMappingURL=configurationService.js.map
