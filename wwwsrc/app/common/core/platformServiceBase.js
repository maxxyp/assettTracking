/// <reference path="../../../typings/app.d.ts" />
define(["require", "exports", "../../common/core/platformHelper", "aurelia-dependency-injection"], function (require, exports, platformHelper_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlatformServiceBase = /** @class */ (function () {
        function PlatformServiceBase(serviceFolder, serviceName) {
            this._serviceFolder = serviceFolder;
            this._serviceName = serviceName;
            this._service = null;
        }
        PlatformServiceBase.prototype.setService = function (service) {
            this._service = service;
        };
        PlatformServiceBase.prototype.loadModule = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this._service) {
                    resolve(_this._service);
                }
                else {
                    platformHelper_1.PlatformHelper.loadModule(_this._serviceFolder, _this.toCamelCase(_this._serviceName))
                        .then(function (module) {
                        _this._service = aurelia_dependency_injection_1.Container.instance.invoke(module[_this._serviceName]);
                        resolve(_this._service);
                    })
                        .catch(function () {
                        reject(null);
                    });
                }
            });
        };
        PlatformServiceBase.prototype.toCamelCase = function (name) {
            return name.substr(0, 1).toLowerCase() + name.substr(1);
        };
        return PlatformServiceBase;
    }());
    exports.PlatformServiceBase = PlatformServiceBase;
});

//# sourceMappingURL=platformServiceBase.js.map
