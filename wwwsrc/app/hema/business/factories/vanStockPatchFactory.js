define(["require", "exports", "../models/vanStockPatch"], function (require, exports, vanStockPatch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VanStockPatchFactory = /** @class */ (function () {
        function VanStockPatchFactory() {
        }
        VanStockPatchFactory.prototype.createVanStockPatchBusinessModel = function (vanStockPatchApiModel) {
            var vanStockPatchBusinessModel = new vanStockPatch_1.VanStockPatch();
            if (vanStockPatchApiModel) {
                vanStockPatchBusinessModel.patchCode = vanStockPatchApiModel.patchCode;
                vanStockPatchBusinessModel.engineers = vanStockPatchApiModel.engineers;
            }
            return vanStockPatchBusinessModel;
        };
        VanStockPatchFactory.prototype.createVanStockPatchListBusinessModel = function (vanStockPatchListApiModel) {
            var vanStockPatchListItemBusinessModel = [];
            if (vanStockPatchListApiModel) {
                vanStockPatchListItemBusinessModel = vanStockPatchListApiModel;
            }
            return vanStockPatchListItemBusinessModel;
        };
        return VanStockPatchFactory;
    }());
    exports.VanStockPatchFactory = VanStockPatchFactory;
});

//# sourceMappingURL=vanStockPatchFactory.js.map
