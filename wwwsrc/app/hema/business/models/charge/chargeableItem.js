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
define(["require", "exports", "./chargeableBase", "bignumber"], function (require, exports, chargeableBase_1, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeableItem = /** @class */ (function (_super) {
        __extends(ChargeableItem, _super);
        function ChargeableItem() {
            var _this = _super.call(this) || this;
            _this.netAmount = new bignumber.BigNumber(0);
            _this.description = "";
            _this.vat = new bignumber.BigNumber(0);
            return _this;
        }
        Object.defineProperty(ChargeableItem.prototype, "grossAmount", {
            get: function () {
                return this.calculateGrossAmount(this.netAmount, this.vat);
            },
            enumerable: true,
            configurable: true
        });
        return ChargeableItem;
    }(chargeableBase_1.ChargeableBase));
    exports.ChargeableItem = ChargeableItem;
});

//# sourceMappingURL=chargeableItem.js.map
