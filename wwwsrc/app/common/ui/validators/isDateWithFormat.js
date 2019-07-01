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
    var IsDateWithFormat = /** @class */ (function (_super) {
        __extends(IsDateWithFormat, _super);
        function IsDateWithFormat(dateFormat) {
            return _super.call(this, dateFormat, function (newValue, dateStringFormat) {
                return newValue && moment(newValue, dateStringFormat, true).isValid();
            }, "This is not a valid date format for " + dateFormat, "IsDateWithFormatValidationRule") || this;
        }
        return IsDateWithFormat;
    }(aurelia_validation_1.ValidationRule));
    exports.IsDateWithFormat = IsDateWithFormat;
});

//# sourceMappingURL=isDateWithFormat.js.map
