define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConsumablePart = /** @class */ (function () {
        function ConsumablePart(referenceId, description, quantitiy) {
            this.dateAdded = moment(new Date()).format("YYYY-MM-DD");
            this.referenceId = referenceId;
            this.description = description;
            this.quantity = quantitiy;
            this.deleted = false;
            this.sent = false;
            this.favourite = false;
        }
        return ConsumablePart;
    }());
    exports.ConsumablePart = ConsumablePart;
});

//# sourceMappingURL=consumablePart.js.map
