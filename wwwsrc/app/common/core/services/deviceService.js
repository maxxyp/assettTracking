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
define(["require", "exports", "../platformServiceBase"], function (require, exports, platformServiceBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeviceService = /** @class */ (function (_super) {
        __extends(DeviceService, _super);
        function DeviceService() {
            return _super.call(this, "common/core/services", "DeviceService") || this;
        }
        DeviceService.prototype.getDeviceId = function () {
            return this.loadModule().then(function (module) {
                return module.getDeviceId();
            });
        };
        DeviceService.prototype.getDeviceType = function () {
            return this.loadModule().then(function (module) {
                return module.getDeviceType();
            });
        };
        return DeviceService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.DeviceService = DeviceService;
});

//# sourceMappingURL=deviceService.js.map
