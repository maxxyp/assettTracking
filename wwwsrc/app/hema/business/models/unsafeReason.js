define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnsafeReason = /** @class */ (function () {
        function UnsafeReason(lookupId, catalogId, params, isMandatory) {
            if (isMandatory === void 0) { isMandatory = true; }
            this.lookupId = lookupId;
            this.catalogId = catalogId;
            this.params = params;
            this.isMandatory = isMandatory;
        }
        return UnsafeReason;
    }());
    exports.UnsafeReason = UnsafeReason;
});

//# sourceMappingURL=unsafeReason.js.map
