define(["require", "exports", "../models/partsBasketViewModel"], function (require, exports, partsBasketViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsBasketFactory = /** @class */ (function () {
        function PartsBasketFactory() {
        }
        PartsBasketFactory.prototype.createPartsBasketViewModel = function (partsBasketBusinessModel) {
            var vm = new partsBasketViewModel_1.PartsBasketViewModel();
            if (partsBasketBusinessModel) {
                vm.lastPartGatheredTime = partsBasketBusinessModel.lastPartGatheredTime;
                vm.deliverPartsToSite = partsBasketBusinessModel.deliverPartsToSite;
                vm.manualPartDetail = Object.assign({}, partsBasketBusinessModel.manualPartDetail);
                vm.dataState = partsBasketBusinessModel.dataState;
                vm.dataStateId = partsBasketBusinessModel.dataStateId;
                partsBasketBusinessModel.partsInBasket.forEach(function (part) {
                    var partAdd = Object.assign({}, part);
                    vm.partsInBasket.push(partAdd);
                });
                partsBasketBusinessModel.partsToOrder.forEach(function (part) {
                    var partAdd = Object.assign({}, part);
                    vm.partsToOrder.push(partAdd);
                });
                vm.showAddPartManually = partsBasketBusinessModel.showAddPartManually;
                vm.showRemainingAddPartManuallyFields = partsBasketBusinessModel.showRemainingAddPartManuallyFields;
                // vm.partsRequired = partsBasketBusinessModel.partsRequired;
                vm.hasAtLeastOneWrongActivityStatus = partsBasketBusinessModel.hasAtLeastOneWrongActivityStatus;
                // vm.taskStatus = partsBasketBusinessModel.taskStatus;
                vm.partsListValidation = "somevalue";
                // vm.partsInBasketRequired = false;
            }
            return vm;
        };
        return PartsBasketFactory;
    }());
    exports.PartsBasketFactory = PartsBasketFactory;
});

//# sourceMappingURL=partsBasketFactory.js.map
