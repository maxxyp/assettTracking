/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports", "aurelia-logging", "../../platformHelper"], function (require, exports, Logging, platformHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationService = /** @class */ (function () {
        function ConfigurationService() {
            this._configuration = null;
            this._configFile = "app.config.json";
            this._logger = Logging.getLogger("Configuration");
        }
        ConfigurationService.prototype.getConfiguration = function (childName) {
            return childName ? this._configuration[childName] : this._configuration;
        };
        ConfigurationService.prototype.load = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (!_this._configuration) {
                    /* first try and load an override config from the local state folder */
                    Windows.Storage.ApplicationData.current.localFolder.getFileAsync(_this._configFile).then(function (fileInFolder) {
                        _this.loadFromFile(fileInFolder)
                            .then(function (config) { return resolve(config); });
                    }, function (err) {
                        var packagedConfigFile = platformHelper_1.PlatformHelper.wwwRoot() + "\\" + _this._configFile;
                        /* no local config read the one from the package */
                        Windows.ApplicationModel.Package.current.installedLocation.getFileAsync(packagedConfigFile).then(function (fileInFolder) {
                            _this.loadFromFile(fileInFolder)
                                .then(function (config) { return resolve(config); });
                        }, function (err2) {
                            _this._logger.error("Cannot load configuration file " + packagedConfigFile, err2);
                            resolve(null);
                        });
                    });
                }
                else {
                    resolve(_this._configuration);
                }
            });
        };
        ConfigurationService.prototype.overrideSettings = function (settings) {
            Object.assign(this._configuration, settings);
        };
        ConfigurationService.prototype.loadFromFile = function (fileInFolder) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(function (buffer) {
                    var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                    try {
                        _this._configuration = JSON.parse(dataReader.readString(buffer.length));
                    }
                    catch (err) {
                        _this._logger.error("Cannot parse configuration", err);
                        return resolve(null);
                    }
                    resolve(_this._configuration);
                }, function (err) {
                    _this._logger.error("Cannot read configuration file " + _this._configFile, err);
                    resolve(null);
                });
            });
        };
        return ConfigurationService;
    }());
    exports.ConfigurationService = ConfigurationService;
});

//# sourceMappingURL=configurationService.js.map
