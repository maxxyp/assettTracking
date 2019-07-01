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
define(["require", "exports", "moment", "aurelia-validation"], function (require, exports, moment, aurelia_validation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsDateGreaterThan = /** @class */ (function (_super) {
        __extends(IsDateGreaterThan, _super);
        function IsDateGreaterThan(compareDate) {
            return _super.call(this, compareDate, function (newValue) {
                return moment(newValue).isAfter(compareDate);
            }, "The date should be greater than " + moment(compareDate).format("DD-MM-YYYY"), "IsDateGreaterThanValidationRule") || this;
        }
        return IsDateGreaterThan;
    }(aurelia_validation_1.ValidationRule));
    exports.IsDateGreaterThan = IsDateGreaterThan;
});

//# sourceMappingURL=isDateGreaterThan.js.map
