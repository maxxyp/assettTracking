var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-binding"], function (require, exports, aurelia_binding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeTaskViewModel = /** @class */ (function () {
        function ChargeTaskViewModel() {
        }
        Object.defineProperty(ChargeTaskViewModel.prototype, "canApplyDiscount", {
            get: function () {
                return !this.error && !this.hasFixedPriceQuotation && this.netTotal && this.netTotal.greaterThan(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeTaskViewModel.prototype, "hasFixedPriceQuotation", {
            get: function () {
                return this.fixedPriceQuotationAmount && this.fixedPriceQuotationAmount.greaterThan(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeTaskViewModel.prototype, "displayDiscountAmount", {
            get: function () {
                if (this.discountAmount && this.discountAmount.greaterThan(0)) {
                    return "-\u00A3" + this.discountAmount.toFixed(2);
                }
                else {
                    return "";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeTaskViewModel.prototype, "discountGreaterThanAmount", {
            get: function () {
                if (!this.discountAmount) {
                    return false;
                }
                var total = this.netTotal;
                if (this.vat) {
                    total = total.plus(total.times(this.vat).dividedBy(1000));
                }
                return this.discountAmount.greaterThan(total);
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_binding_1.computedFrom("error", "hasFixedPriceQuotation", "netTotal"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], ChargeTaskViewModel.prototype, "canApplyDiscount", null);
        __decorate([
            aurelia_binding_1.computedFrom("fixedPriceQuotationAmount"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], ChargeTaskViewModel.prototype, "hasFixedPriceQuotation", null);
        __decorate([
            aurelia_binding_1.computedFrom("discountAmount"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], ChargeTaskViewModel.prototype, "displayDiscountAmount", null);
        __decorate([
            aurelia_binding_1.computedFrom("discountAmount", "netTotal", "vat"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], ChargeTaskViewModel.prototype, "discountGreaterThanAmount", null);
        return ChargeTaskViewModel;
    }());
    exports.ChargeTaskViewModel = ChargeTaskViewModel;
});

//# sourceMappingURL=chargeTaskViewModel.js.map
