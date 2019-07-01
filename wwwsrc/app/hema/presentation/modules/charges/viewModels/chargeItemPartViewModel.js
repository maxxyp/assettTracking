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
define(["require", "exports", "./chargeItemViewModel"], function (require, exports, chargeItemViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeItemPartViewModel = /** @class */ (function (_super) {
        __extends(ChargeItemPartViewModel, _super);
        function ChargeItemPartViewModel() {
            var _this = _super.call(this) || this;
            _this.isFromPreviousActivity = false;
            return _this;
        }
        Object.defineProperty(ChargeItemPartViewModel.prototype, "displayItemName", {
            get: function () {
                var displayItem = this.itemName;
                if (this.qty && displayItem && this.qty > 0) {
                    displayItem = displayItem + " x" + this.qty;
                }
                return displayItem;
            },
            enumerable: true,
            configurable: true
        });
        return ChargeItemPartViewModel;
    }(chargeItemViewModel_1.ChargeItemViewModel));
    exports.ChargeItemPartViewModel = ChargeItemPartViewModel;
});

//# sourceMappingURL=chargeItemPartViewModel.js.map
