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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MaterialAdjustmentsArrays = /** @class */ (function () {
        function MaterialAdjustmentsArrays(yesterDaysReturns) {
            this.collections = [];
            this.inboundMaterialRequests = [];
            this.outboundMaterialRequests = [];
            this.inboundMaterialTransfers = [];
            this.outboundMaterialTransfers = [];
            this.returns = [];
            this.yesterdaysReturns = yesterDaysReturns || [];
        }
        return MaterialAdjustmentsArrays;
    }());
    exports.MaterialAdjustmentsArrays = MaterialAdjustmentsArrays;
    var MaterialAdjustments = /** @class */ (function (_super) {
        __extends(MaterialAdjustments, _super);
        function MaterialAdjustments(engineerId, yesterDaysReturns) {
            var _this = _super.call(this, yesterDaysReturns) || this;
            _this.engineerId = engineerId;
            return _this;
        }
        return MaterialAdjustments;
    }(MaterialAdjustmentsArrays));
    exports.MaterialAdjustments = MaterialAdjustments;
});

//# sourceMappingURL=materialAdjustments.js.map
