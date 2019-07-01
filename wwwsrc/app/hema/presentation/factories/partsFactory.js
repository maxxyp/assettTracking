define(["require", "exports", "../../business/models/partNotUsedReturn", "../../business/models/partWarrantyReturn", "../modules/parts/viewModels/todaysPartViewModel", "../../business/models/dataState", "bignumber"], function (require, exports, partNotUsedReturn_1, partWarrantyReturn_1, todaysPartViewModel_1, dataState_1, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsFactory = /** @class */ (function () {
        function PartsFactory() {
        }
        PartsFactory.prototype.createTodaysPartViewModel = function (part, task) {
            var vm = new todaysPartViewModel_1.TodaysPartViewModel();
            vm.part = part;
            vm.partPrice = new bignumber.BigNumber(part.price);
            vm.task = task;
            vm.isWarrantyCollapsedOnLoad = part.warrantyReturn.isWarrantyReturn === undefined;
            vm.isReturnCollapsedOnLoad = part.notUsedReturn.quantityToReturn === undefined
                && part.notUsedReturn.reasonForReturn === undefined;
            vm.warrantyReturn = new partWarrantyReturn_1.PartWarrantyReturn();
            vm.notUsedReturn = new partNotUsedReturn_1.PartNotUsedReturn();
            Object.assign(vm.warrantyReturn, part.warrantyReturn);
            Object.assign(vm.notUsedReturn, part.notUsedReturn);
            vm.dataStateIndicator = dataState_1.DataState.notVisited;
            return vm;
        };
        return PartsFactory;
    }());
    exports.PartsFactory = PartsFactory;
});

//# sourceMappingURL=partsFactory.js.map
