/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports", "../../guid"], function (require, exports, guid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeviceService = /** @class */ (function () {
        function DeviceService() {
        }
        DeviceService.prototype.getDeviceId = function () {
            if (!this._id) {
                this._id = window.localStorage.getItem("uniqueDeviceId");
                if (!this._id) {
                    this._id = guid_1.Guid.newGuid();
                    window.localStorage.setItem("uniqueDeviceId", this._id);
                }
            }
            return Promise.resolve(this._id);
        };
        DeviceService.prototype.getDeviceType = function () {
            return Promise.resolve(navigator.userAgent);
        };
        return DeviceService;
    }());
    exports.DeviceService = DeviceService;
});

//# sourceMappingURL=deviceService.js.map
