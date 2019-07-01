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
define(["require", "exports", "./chargeableItem", "./primeSubCharge"], function (require, exports, chargeableItem_1, primeSubCharge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeableLabourItem = /** @class */ (function (_super) {
        __extends(ChargeableLabourItem, _super);
        function ChargeableLabourItem() {
            var _this = _super.call(this) || this;
            _this.chargePair = new primeSubCharge_1.PrimeSubCharge(0, 0);
            _this.isFixed = false;
            return _this;
        }
        return ChargeableLabourItem;
    }(chargeableItem_1.ChargeableItem));
    exports.ChargeableLabourItem = ChargeableLabourItem;
});

//# sourceMappingURL=chargeableLabourItem.js.map
