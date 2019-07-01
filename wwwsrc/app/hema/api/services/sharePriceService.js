/// <reference path="../../../../typings/app.d.ts" />
define(["require", "exports", "aurelia-http-client", "./constants/sharePriceServiceConstants", "../../../common/resilience/apiException"], function (require, exports, aurelia_http_client_1, sharePriceServiceConstants_1, apiException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SHARE_PRICE_ENDPOINT = sharePriceServiceConstants_1.SharePriceServiceConstants.SHARE_PRICE_ENDPOINT;
    var SharePriceService = /** @class */ (function () {
        function SharePriceService() {
            this._httpClient = new aurelia_http_client_1.HttpClient();
        }
        SharePriceService.prototype.getSharePrice = function () {
            var _this = this;
            return this._httpClient.get(SHARE_PRICE_ENDPOINT)
                .then(function (response) {
                var tickers;
                try {
                    tickers = JSON.parse(response.response.replace("//", ""));
                    return tickers[0];
                }
                catch (e) {
                    throw e;
                }
            })
                .catch(function (error) {
                throw new apiException_1.ApiException(_this, "getSharePrice", "There was an error obtaining the share price", null, error, null);
            });
        };
        return SharePriceService;
    }());
    exports.SharePriceService = SharePriceService;
});

//# sourceMappingURL=sharePriceService.js.map
