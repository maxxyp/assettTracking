define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AdaptAttributeConstants = /** @class */ (function () {
        function AdaptAttributeConstants() {
        }
        AdaptAttributeConstants.WITHDRAWN = {
            attributeType: "appVersionStatus",
            attributeValue: "Withdrawn"
        };
        AdaptAttributeConstants.FOLIO = {
            attributeType: "appVersionStatus",
            attributeValue: "Issued - Folio Only"
        };
        AdaptAttributeConstants.SERVICE_LISTED = {
            attributeType: "serviceListed",
            attributeValue: "True"
        };
        AdaptAttributeConstants.REDUCED_PARTS_LIST = {
            attributeType: "reducedPartsList",
            attributeValue: "True"
        };
        AdaptAttributeConstants.SAFETY_NOTICE = {
            attributeType: "safetyNotice",
            attributeValue: "True"
        };
        AdaptAttributeConstants.CEASED_PRODUCTION = {
            attributeType: "ceasedProduction",
        };
        return AdaptAttributeConstants;
    }());
    exports.AdaptAttributeConstants = AdaptAttributeConstants;
});

//# sourceMappingURL=adaptAttributeConstants.js.map
