var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../../core/services/appLauncher"], function (require, exports, aurelia_framework_1, appLauncher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IOS_TEL_URI = "tel:";
    var IOS_SMS_URI = "sms:";
    // dependency on cordova-plugin-inappbrowser
    var PhoneService = /** @class */ (function () {
        function PhoneService(appLauncher) {
            this._appLauncher = appLauncher;
        }
        PhoneService.prototype.hasPhone = function () {
            return this._appLauncher.checkInstalled(IOS_TEL_URI);
        };
        PhoneService.prototype.showPhoneCallUI = function (phone, name) {
            return this._appLauncher.checkInstalled(IOS_TEL_URI)
                .then(function (result) {
                if (!result) {
                    return result;
                }
                cordova.InAppBrowser.open(IOS_TEL_URI + phone.replace(/\s/g, ""), "_system");
                return true;
            });
        };
        PhoneService.prototype.showPhoneSMSUI = function (recipientsPhone, message) {
            return this._appLauncher.checkInstalled(IOS_SMS_URI)
                .then(function (result) {
                if (!result) {
                    return result;
                }
                cordova.InAppBrowser.open(IOS_SMS_URI + recipientsPhone[0].replace(/\s/g, "") + "&body=" + encodeURIComponent(message), "_system");
                return true;
            });
        };
        PhoneService = __decorate([
            aurelia_framework_1.inject(appLauncher_1.AppLauncher),
            __metadata("design:paramtypes", [Object])
        ], PhoneService);
        return PhoneService;
    }());
    exports.PhoneService = PhoneService;
});

//# sourceMappingURL=phoneService.js.map
