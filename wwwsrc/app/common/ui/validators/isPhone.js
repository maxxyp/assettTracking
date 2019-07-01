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
define(["require", "exports", "aurelia-validation"], function (require, exports, aurelia_validation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsPhone = /** @class */ (function (_super) {
        __extends(IsPhone, _super);
        function IsPhone() {
            return _super.call(this, null, function (newValue) {
                newValue = newValue.replace(/\(|\)|\s+|-/gi, "");
                var regularExpression = /^0(?:1\d{8,9}|[23]\d{9}|7(?:[45789]\d{8}|624\d{6}))$/;
                return regularExpression.test(newValue);
            }, "The phone is not in a valid format", "IsPhoneValidationRule") || this;
        }
        return IsPhone;
    }(aurelia_validation_1.ValidationRule));
    exports.IsPhone = IsPhone;
});

//# sourceMappingURL=isPhone.js.map
