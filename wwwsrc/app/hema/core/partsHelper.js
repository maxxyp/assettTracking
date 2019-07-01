define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsHelper = /** @class */ (function () {
        function PartsHelper() {
        }
        PartsHelper.filterPartsNotUsedReasonsForAssetTracking = function (reasons) {
            var returnReasonCodeFilterOut = ["WG", "OK", "DP", "NR"];
            var result = reasons
                .filter(function (x) { return returnReasonCodeFilterOut.indexOf(x.reasonCode) < 0; });
            var reason1 = { reasonCode: "ME", partsNotUsedReasonDescription: "Material expired" };
            result.unshift(reason1);
            var reason2 = { reasonCode: "MR", partsNotUsedReasonDescription: "Material recalled" };
            result.unshift(reason2);
            var reason3 = { reasonCode: "MW", partsNotUsedReasonDescription: "Material under warranty" };
            result.unshift(reason3);
            var reason4 = { reasonCode: "MD", partsNotUsedReasonDescription: "Material damaged" };
            result.unshift(reason4);
            return result;
        };
        return PartsHelper;
    }());
    exports.PartsHelper = PartsHelper;
});

//# sourceMappingURL=partsHelper.js.map
