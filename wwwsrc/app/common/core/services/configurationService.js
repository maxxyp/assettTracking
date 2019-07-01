/// <reference path="../../../../typings/app.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../platformServiceBase", "../models/baseException"], function (require, exports, platformServiceBase_1, baseException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationService = /** @class */ (function (_super) {
        __extends(ConfigurationService, _super);
        function ConfigurationService() {
            return _super.call(this, "common/core/services", "ConfigurationService") || this;
        }
        ConfigurationService.prototype.getConfiguration = function (childName) {
            return this._service.getConfiguration(childName);
        };
        ConfigurationService.prototype.load = function () {
            return this.loadModule().then(function (module) {
                return module.load();
            });
        };
        ConfigurationService.prototype.overrideSettings = function (settings) {
            if (!this._service || !this._service.getConfiguration()) {
                throw new baseException_1.BaseException(this, "ConfigurationService", "Overriding configuration settings before the base configuration is loaded", [], null);
            }
            return this._service.overrideSettings(settings);
        };
        return ConfigurationService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.ConfigurationService = ConfigurationService;
});

//# sourceMappingURL=configurationService.js.map
