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
define(["require", "exports", "../../core/platformServiceBase"], function (require, exports, platformServiceBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PhoneService = /** @class */ (function (_super) {
        __extends(PhoneService, _super);
        function PhoneService() {
            return _super.call(this, "common/ui/services", "PhoneService") || this;
        }
        PhoneService.prototype.hasPhone = function () {
            return this.loadModule().then(function (module) {
                return module.hasPhone();
            });
        };
        PhoneService.prototype.showPhoneCallUI = function (phone, name) {
            return this.loadModule().then(function (module) {
                return module.showPhoneCallUI(phone, name);
            });
        };
        PhoneService.prototype.showPhoneSMSUI = function (recipientsPhone, message) {
            return this.loadModule().then(function (module) {
                return module.showPhoneSMSUI(recipientsPhone, message);
            });
        };
        return PhoneService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.PhoneService = PhoneService;
});

//# sourceMappingURL=phoneService.js.map
