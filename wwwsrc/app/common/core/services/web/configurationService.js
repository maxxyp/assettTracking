/// <reference path="../../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-logging", "aurelia-framework", "../../platformHelper", "../../httpClient"], function (require, exports, Logging, aurelia_framework_1, platformHelper_1, httpClient_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationService = /** @class */ (function () {
        function ConfigurationService(httpClient) {
            this._configuration = null;
            this._httpClient = httpClient;
            this._logger = Logging.getLogger("Configuration");
            this._configFile = platformHelper_1.PlatformHelper.loaderPrefix + "app.config.json";
        }
        ConfigurationService.prototype.getConfiguration = function (childName) {
            return childName ? this._configuration[childName] : this._configuration;
        };
        ConfigurationService.prototype.load = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (!_this._configuration) {
                    _this._httpClient.fetch(_this._configFile)
                        .then(function (response) { return response.json(); })
                        .then(function (json) {
                        _this._configuration = json;
                        resolve(_this._configuration);
                    }).catch(function (err) {
                        _this._logger.error("Cannot parse configuration", err);
                        resolve(null);
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
        ConfigurationService = __decorate([
            aurelia_framework_1.inject(httpClient_1.HttpClient),
            __metadata("design:paramtypes", [Object])
        ], ConfigurationService);
        return ConfigurationService;
    }());
    exports.ConfigurationService = ConfigurationService;
});

//# sourceMappingURL=configurationService.js.map
