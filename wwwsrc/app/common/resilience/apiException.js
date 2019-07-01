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
define(["require", "exports", "../core/models/baseException"], function (require, exports, baseException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApiException = /** @class */ (function (_super) {
        __extends(ApiException, _super);
        function ApiException(context, reference, message, parameters, data, httpStatusCode) {
            var _this = _super.call(this, context, reference, message, parameters, data) || this;
            // if we have been given an httpStatusCode, force it to a string
            _this.httpStatusCode = httpStatusCode !== undefined && httpStatusCode !== null
                ? httpStatusCode + ""
                : undefined;
            return _this;
        }
        return ApiException;
    }(baseException_1.BaseException));
    exports.ApiException = ApiException;
});

//# sourceMappingURL=apiException.js.map
