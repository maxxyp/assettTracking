/// <reference path="../../../../typings/app.d.ts" />
define(["require", "exports", "../modules/charges/viewModels/chargeTaskViewModel", "../modules/charges/viewModels/chargeMainViewModel", "../../business/models/charge/chargeableTask", "bignumber", "../../business/models/charge/charge", "../modules/charges/viewModels/chargeItemLabourViewModel", "../modules/charges/viewModels/chargeItemPartViewModel", "../../business/models/charge/primeSubCharge"], function (require, exports, chargeTaskViewModel_1, chargeMainViewModel_1, chargeableTask_1, bignumber, charge_1, chargeItemLabourViewModel_1, chargeItemPartViewModel_1, primeSubCharge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargesFactory = /** @class */ (function () {
        function ChargesFactory() {
        }
        ChargesFactory.prototype.createChargesBusinessModel = function (vm) {
            var _this = this;
            var model = new charge_1.Charge();
            model.complaintActionCategoryCharge = vm.chargeComplaintActionCategory;
            model.chargeOption = vm.chargeOption;
            model.complaintReasonCodeCharge = vm.chargeReasonCode;
            model.dataState = vm.dataState;
            model.dataStateId = vm.dataStateId;
            model.discountAmount = vm.discountAmount;
            model.jobId = vm.jobId;
            model.remarks = vm.remarks;
            model.previousChargeSameAppliance = vm.previousChargeSameAppliance;
            model.previousChargeSameApplianceConfirmed = vm.previousChargeSameApplianceConfirmed;
            if (vm.netTotal) {
                model.netTotal = vm.netTotal;
            }
            if (vm.chargeTotal) {
                model.chargeTotal = vm.chargeTotal;
            }
            if (vm.totalVatAmount) {
                model.totalVatAmount = vm.totalVatAmount;
            }
            var tasks = [];
            vm.tasks.forEach(function (x) {
                var chargeableTask = _this.createChargeableTaskBusinessModel(x);
                tasks.push(chargeableTask);
            });
            model.tasks = tasks;
            return model;
        };
        ChargesFactory.prototype.createChargeableTaskBusinessModel = function (vm) {
            var chargeableTask = new chargeableTask_1.ChargeableTask();
            chargeableTask.task = vm.task;
            chargeableTask.isLabourCharge = vm.isLabour;
            chargeableTask.isPartsCharge = vm.isParts;
            chargeableTask.chargeDescription = vm.chargeDescription;
            chargeableTask.vat = vm.vat;
            chargeableTask.vatCode = vm.vatCode;
            chargeableTask.fixedPriceQuotationAmount = vm.fixedPriceQuotationAmount;
            chargeableTask.error = vm.error;
            chargeableTask.errorDescription = vm.errorDescription;
            chargeableTask.discountAmount = vm.discountAmount;
            chargeableTask.discountCode = vm.discountCode;
            chargeableTask.discountText = vm.discountText;
            chargeableTask.isSubsequent = vm.isSubsequent;
            vm.partItems.forEach(function (y) {
                chargeableTask.addPartItem(y.itemName, y.netAmount, y.isReturn, y.isWarranty, y.qty, 0, "", y.returnQty, y.warrantyQty, y.isFromPreviousActivity, y.status);
            });
            if (vm.labourItem) {
                var labourItem = vm.labourItem;
                chargeableTask.labourItem.netAmount = new bignumber.BigNumber(labourItem.netAmount);
                var chargePair = new primeSubCharge_1.PrimeSubCharge(0, 0);
                if (labourItem.primeChargeTotal) {
                    chargePair.primeCharge = new bignumber.BigNumber(labourItem.primeChargeTotal);
                }
                if (labourItem.subChargeTotal) {
                    chargePair.subsequentCharge = new bignumber.BigNumber(labourItem.subChargeTotal);
                }
                chargeableTask.updateLabourItem(labourItem.itemName, chargePair, labourItem.isFixed);
            }
            return chargeableTask;
        };
        ChargesFactory.prototype.createChargesViewModel = function (model) {
            var _this = this;
            var vm = new chargeMainViewModel_1.ChargeMainViewModel();
            vm.jobId = model.jobId;
            vm.chargeComplaintActionCategory = model.complaintActionCategoryCharge;
            vm.chargeOption = model.chargeOption;
            vm.dataState = model.dataState;
            vm.dataStateId = model.dataStateId;
            vm.previousChargeSameAppliance = model.previousChargeSameAppliance;
            vm.previousChargeSameApplianceConfirmed = model.previousChargeSameApplianceConfirmed;
            vm.remarks = model.remarks;
            if (model.discountAmount) {
                vm.discountAmount = new bignumber.BigNumber(model.discountAmount);
            }
            if (model.grossTotal) {
                vm.grossTotal = new bignumber.BigNumber(model.grossTotal);
            }
            if (model.netTotal) {
                vm.netTotal = new bignumber.BigNumber(model.netTotal);
            }
            if (model.chargeTotal) {
                vm.chargeTotal = new bignumber.BigNumber(model.chargeTotal);
            }
            if (model.totalVatAmount) {
                vm.totalVatAmount = new bignumber.BigNumber(model.totalVatAmount);
            }
            vm.tasks = [];
            if (model && model.tasks) {
                model.tasks.forEach(function (x) {
                    var taskVm = _this.createChargeableTaskViewModel(x);
                    vm.tasks.push(taskVm);
                });
            }
            return vm;
        };
        ChargesFactory.prototype.createChargeableTaskViewModel = function (task) {
            var taskVm = new chargeTaskViewModel_1.ChargeTaskViewModel();
            taskVm.isLabour = task.isLabourCharge;
            taskVm.isParts = task.isPartsCharge;
            taskVm.task = task.task;
            taskVm.chargeDescription = task.chargeDescription;
            taskVm.fixedPriceQuotationAmount = task.fixedPriceQuotationAmount;
            taskVm.error = task.error;
            taskVm.errorDescription = task.errorDescription;
            taskVm.discountAmount = task.discountAmount;
            taskVm.discountCode = task.discountCode;
            taskVm.discountText = task.discountText;
            taskVm.isSubsequent = task.isSubsequent;
            if (task.vat) {
                taskVm.vat = task.vat;
            }
            if (task.vatCode) {
                taskVm.vatCode = task.vatCode;
            }
            if (task.grossTotal) {
                taskVm.grossTotal = task.grossTotal;
            }
            if (task.netTotal) {
                taskVm.netTotal = task.netTotal;
            }
            taskVm.partItems = [];
            task.partItems.forEach(function (partItem) {
                var item = new chargeItemPartViewModel_1.ChargeItemPartViewModel();
                item.itemName = partItem.description;
                item.vat = taskVm.vat;
                // requirement assumption: VAT for task is same as individual task item
                item.vat = partItem.vat;
                if (partItem.netAmount) {
                    item.netAmount = partItem.netAmount;
                }
                if (partItem.grossAmount) {
                    item.grossAmount = partItem.grossAmount;
                }
                item.qty = partItem.qty;
                item.isWarranty = partItem.isWarranty;
                item.isReturn = partItem.isReturn;
                item.warrantyQty = partItem.warrantyQty;
                item.returnQty = partItem.returnQty;
                item.isFromPreviousActivity = partItem.isFromPreviousActivity;
                item.status = partItem.status;
                taskVm.partItems.push(item);
            });
            if (task.labourItem) {
                var labourItem = task.labourItem;
                var item = new chargeItemLabourViewModel_1.ChargeItemLabourViewModel();
                item.itemName = labourItem.description;
                item.vat = taskVm.vat;
                // requirement assumption: VAT for task is same as individual task item
                item.vat = labourItem.vat;
                if (labourItem.netAmount) {
                    item.netAmount = labourItem.netAmount;
                }
                if (labourItem.grossAmount) {
                    item.grossAmount = labourItem.grossAmount;
                }
                item.primeChargeTotal = labourItem.chargePair.primeCharge;
                item.subChargeTotal = labourItem.chargePair.subsequentCharge;
                taskVm.labourItem = item;
            }
            return taskVm;
        };
        return ChargesFactory;
    }());
    exports.ChargesFactory = ChargesFactory;
});

//# sourceMappingURL=chargesFactory.js.map
