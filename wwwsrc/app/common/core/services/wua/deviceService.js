/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeviceService = /** @class */ (function () {
        function DeviceService() {
        }
        DeviceService.prototype.getDeviceId = function () {
            if (!this._id) {
                if (Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.System.Profile.HardwareIdentification")) {
                    var token = Windows.System.Profile.HardwareIdentification.getPackageSpecificToken(null);
                    if (token && token.id) {
                        this._id = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(token.id);
                        this._id = this.base64EncodeUrl(this._id);
                    }
                }
            }
            return Promise.resolve(this._id);
        };
        DeviceService.prototype.getDeviceType = function () {
            var deviceType = "";
            var clientDeviceInformation = new Windows.Security.ExchangeActiveSyncProvisioning.EasClientDeviceInformation();
            if (clientDeviceInformation) {
                deviceType = clientDeviceInformation.systemProductName;
            }
            return Promise.resolve(deviceType);
        };
        DeviceService.prototype.base64EncodeUrl = function (str) {
            return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=+$/, "");
        };
        return DeviceService;
    }());
    exports.DeviceService = DeviceService;
});

//# sourceMappingURL=deviceService.js.map
