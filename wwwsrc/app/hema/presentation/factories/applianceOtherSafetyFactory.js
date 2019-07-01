define(["require", "exports", "../../business/models/applianceOtherUnsafeDetail", "../modules/appliances/viewModels/otherSafetyViewModel", "../modules/appliances/viewModels/otherUnsafetyViewModel", "../../business/models/applianceOtherSafety"], function (require, exports, applianceOtherUnsafeDetail_1, otherSafetyViewModel_1, otherUnsafetyViewModel_1, applianceOtherSafety_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceOtherSafetyFactory = /** @class */ (function () {
        function ApplianceOtherSafetyFactory() {
        }
        ApplianceOtherSafetyFactory.prototype.createApplianceOtherSafetyBusinessModel = function (vm) {
            if (!vm) {
                vm = new otherSafetyViewModel_1.OtherSafetyViewModel();
            }
            var model = new applianceOtherSafety_1.ApplianceOtherSafety();
            model.visuallyCheckRelight = vm.didYouVisuallyCheck;
            model.isApplianceSafe = vm.isApplianceSafe;
            model.toCurrentStandards = vm.toCurrentStandards;
            model.workedOnAppliance = vm.workedOnAppliance;
            model.dataState = vm.dataState;
            model.dataStateId = vm.dataStateId;
            return model;
        };
        ApplianceOtherSafetyFactory.prototype.createApplianceOtherSafetyViewModel = function (model) {
            var vm = new otherSafetyViewModel_1.OtherSafetyViewModel();
            if (!model) {
                model = new applianceOtherSafety_1.ApplianceOtherSafety();
            }
            vm.didYouVisuallyCheck = model.visuallyCheckRelight;
            vm.isApplianceSafe = model.isApplianceSafe;
            vm.workedOnAppliance = model.workedOnAppliance;
            vm.toCurrentStandards = model.toCurrentStandards;
            vm.dataState = model.dataState;
            vm.dataStateId = model.dataStateId;
            return vm;
        };
        ApplianceOtherSafetyFactory.prototype.createApplianceOtherUnsafeBusinessModel = function (vm) {
            if (!vm) {
                vm = new otherUnsafetyViewModel_1.OtherUnsafetyViewModel();
            }
            var model = new applianceOtherUnsafeDetail_1.ApplianceOtherUnsafeDetail();
            model.report = vm.report;
            model.cappedTurnedOff = vm.cappedTurnedOff;
            model.conditionAsLeft = vm.conditionAsLeft;
            model.labelAttachedRemoved = vm.labelAttachedRemoved;
            model.letterLeft = vm.letterLeft;
            model.ownedByCustomer = vm.ownedByCustomer;
            model.signatureObtained = vm.signatureObtained;
            return model;
        };
        ApplianceOtherSafetyFactory.prototype.createApplianceOtherUnsafeViewModel = function (model) {
            var vm = new otherUnsafetyViewModel_1.OtherUnsafetyViewModel();
            if (!model) {
                model = new applianceOtherUnsafeDetail_1.ApplianceOtherUnsafeDetail();
            }
            vm.report = model.report;
            vm.cappedTurnedOff = model.cappedTurnedOff;
            vm.conditionAsLeft = model.conditionAsLeft;
            vm.labelAttachedRemoved = model.labelAttachedRemoved;
            vm.letterLeft = model.letterLeft;
            vm.ownedByCustomer = model.ownedByCustomer;
            vm.signatureObtained = model.signatureObtained;
            return vm;
        };
        return ApplianceOtherSafetyFactory;
    }());
    exports.ApplianceOtherSafetyFactory = ApplianceOtherSafetyFactory;
});

//# sourceMappingURL=applianceOtherSafetyFactory.js.map
