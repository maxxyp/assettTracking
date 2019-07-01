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
define(["require", "exports", "./chargeItemViewModel", "bignumber"], function (require, exports, chargeItemViewModel_1, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeItemLabourViewModel = /** @class */ (function (_super) {
        __extends(ChargeItemLabourViewModel, _super);
        function ChargeItemLabourViewModel() {
            var _this = _super.call(this) || this;
            _this.primeChargeTotal = new bignumber.BigNumber(0);
            _this.subChargeTotal = new bignumber.BigNumber(0);
            return _this;
        }
        Object.defineProperty(ChargeItemLabourViewModel.prototype, "displayItemName", {
            get: function () {
                return this.itemName;
            },
            enumerable: true,
            configurable: true
        });
        return ChargeItemLabourViewModel;
    }(chargeItemViewModel_1.ChargeItemViewModel));
    exports.ChargeItemLabourViewModel = ChargeItemLabourViewModel;
});

//# sourceMappingURL=chargeItemLabourViewModel.js.map
