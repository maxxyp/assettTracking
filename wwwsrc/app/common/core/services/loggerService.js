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
define(["require", "exports", "../platformServiceBase", "aurelia-framework", "./constants/logLevel"], function (require, exports, platformServiceBase_1, aurelia_framework_1, logLevel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // interface for managing logging.
    // responisble to loading platform specific log appenders to be found in /wua /ios
    var LoggerService = /** @class */ (function (_super) {
        __extends(LoggerService, _super);
        function LoggerService() {
            return _super.call(this, "common/core/services", "LoggerService") || this;
        }
        LoggerService.prototype.initialize = function (aurelia, config) {
            this.setLogLevel(config.logLevel);
            return this.loadModule()
                .then(function (module) { return module.initialize(aurelia, config); });
        };
        LoggerService.prototype.getLogs = function () {
            return this.loadModule().then(function (module) {
                return module.getLogs();
            });
        };
        LoggerService.prototype.setLogLevel = function (logLevel) {
            if (logLevel) {
                switch (logLevel) {
                    case logLevel_1.LogLevel.DEBUG:
                        aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.debug);
                        break;
                    case logLevel_1.LogLevel.INFO:
                        aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.info);
                        break;
                    case logLevel_1.LogLevel.WARN:
                        aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.warn);
                        break;
                    case logLevel_1.LogLevel.ERROR:
                        aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.error);
                        break;
                    default:
                        aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.info);
                        break;
                }
            }
        };
        return LoggerService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.LoggerService = LoggerService;
});

//# sourceMappingURL=loggerService.js.map
