var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../models/sharePrice/ticker", "../../api/services/sharePriceService"], function (require, exports, aurelia_framework_1, ticker_1, sharePriceService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SharePriceService = /** @class */ (function () {
        function SharePriceService(sharePriceService) {
            this._sharePriceService = sharePriceService;
        }
        SharePriceService.prototype.getSharePrice = function () {
            var _this = this;
            return this._sharePriceService.getSharePrice()
                .then(function (res) { return _this.mapToModel(res); });
        };
        SharePriceService.prototype.mapToModel = function (apiTicker) {
            var ticker = new ticker_1.Ticker();
            ticker.change = apiTicker.c;
            ticker.date = new Date(apiTicker.lt_dts);
            ticker.exchange = apiTicker.e;
            ticker.percentageChange = apiTicker.cp;
            ticker.price = apiTicker.l;
            ticker.symbol = apiTicker.t;
            return ticker;
        };
        SharePriceService = __decorate([
            aurelia_framework_1.inject(sharePriceService_1.SharePriceService),
            __metadata("design:paramtypes", [Object])
        ], SharePriceService);
        return SharePriceService;
    }());
    exports.SharePriceService = SharePriceService;
});

//# sourceMappingURL=sharePriceService.js.map
