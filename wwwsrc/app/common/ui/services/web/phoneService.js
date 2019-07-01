define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PhoneService = /** @class */ (function () {
        function PhoneService() {
        }
        PhoneService.prototype.hasPhone = function () {
            return Promise.resolve(true);
        };
        PhoneService.prototype.showPhoneCallUI = function (phone, name) {
            return new Promise(function (resolve, reject) {
                if (phone) {
                    window.open("tel:" + phone, "_blank");
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        };
        PhoneService.prototype.showPhoneSMSUI = function (recipientsPhone, message) {
            return new Promise(function (resolve, reject) {
                if (recipientsPhone && recipientsPhone.length > 0) {
                    window.open("sms:" + recipientsPhone[0], "_blank");
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        };
        return PhoneService;
    }());
    exports.PhoneService = PhoneService;
});

//# sourceMappingURL=phoneService.js.map
