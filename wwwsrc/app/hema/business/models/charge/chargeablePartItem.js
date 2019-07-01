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
define(["require", "exports", "./chargeableItem"], function (require, exports, chargeableItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeablePartItem = /** @class */ (function (_super) {
        __extends(ChargeablePartItem, _super);
        function ChargeablePartItem() {
            var _this = _super.call(this) || this;
            _this.qty = 0;
            _this.stockReferenceId = "";
            _this.isWarranty = false;
            _this.isReturn = false;
            _this.warrantyQty = 0;
            _this.returnQty = 0;
            _this.isFromPreviousActivity = false;
            _this.status = "";
            return _this;
        }
        return ChargeablePartItem;
    }(chargeableItem_1.ChargeableItem));
    exports.ChargeablePartItem = ChargeablePartItem;
});

//# sourceMappingURL=chargeablePartItem.js.map
