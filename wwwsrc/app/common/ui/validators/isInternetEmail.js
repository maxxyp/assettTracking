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
    var IsInternetEmail = /** @class */ (function (_super) {
        __extends(IsInternetEmail, _super);
        function IsInternetEmail() {
            return _super.call(this, null, function (newValue) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newValue);
            }, "The email is not in a valid format", "IsInternetEmailValidationRule") || this;
        }
        return IsInternetEmail;
    }(aurelia_validation_1.ValidationRule));
    exports.IsInternetEmail = IsInternetEmail;
});

//# sourceMappingURL=isInternetEmail.js.map