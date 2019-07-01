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
    var IsDate = /** @class */ (function (_super) {
        __extends(IsDate, _super);
        function IsDate() {
            return _super.call(this, null, function (newValue) {
                return newValue && !isNaN(newValue.getTime());
            }, "The date is not valid", "IsDateValidationRule") || this;
        }
        return IsDate;
    }(aurelia_validation_1.ValidationRule));
    exports.IsDate = IsDate;
});

//# sourceMappingURL=isDate.js.map
