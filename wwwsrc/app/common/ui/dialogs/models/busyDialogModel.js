define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BusyDialogModel = /** @class */ (function () {
        function BusyDialogModel() {
        }
        BusyDialogModel.prototype.linkClicked = function () {
            if (this.linkCallback) {
                this.linkCallback();
            }
        };
        return BusyDialogModel;
    }());
    exports.BusyDialogModel = BusyDialogModel;
});

//# sourceMappingURL=busyDialogModel.js.map
