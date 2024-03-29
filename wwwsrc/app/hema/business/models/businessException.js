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
define(["require", "exports", "../../../common/core/models/baseException"], function (require, exports, baseException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BusinessException = /** @class */ (function (_super) {
        __extends(BusinessException, _super);
        function BusinessException(context, reference, message, parameters, data) {
            return _super.call(this, context, reference, message, parameters, data) || this;
        }
        return BusinessException;
    }(baseException_1.BaseException));
    exports.BusinessException = BusinessException;
});

//# sourceMappingURL=businessException.js.map
