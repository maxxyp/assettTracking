var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../models/charge/charge", "aurelia-dependency-injection", "../services/businessRuleService", "../services/catalogService"], function (require, exports, charge_1, aurelia_dependency_injection_1, businessRuleService_1, catalogService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeFactory = /** @class */ (function () {
        function ChargeFactory(businessRuleService, catalogService) {
            this._businessRuleService = businessRuleService;
            this._catalogService = catalogService;
        }
        ChargeFactory.prototype.createChargeBusinessModel = function (taskApiModel) {
            return new charge_1.Charge();
        };
        ChargeFactory.prototype.createChargeApiModel = function (chargeableTasks, updateApiTasks) {
            var _this = this;
            return this._businessRuleService.getQueryableRuleGroup("chargeFactory").then(function (queryableGroup) {
                _this._incompleteStatuses = queryableGroup.getBusinessRuleList("incompleteStatuses");
                var taskPromises = updateApiTasks.map(function (updateApiTask) {
                    var chargeableTask = chargeableTasks.find(function (ct) {
                        // if newRFA search by fieldTaskId instead of taskId
                        if (ct.task.isNewRFA) {
                            return ct.task.fieldTaskId === updateApiTask.fieldTaskId;
                        }
                        return ct.task.id === updateApiTask.id;
                    });
                    if (chargeableTask && _this._incompleteStatuses.indexOf(chargeableTask.task.status) > -1) {
                        return Promise.resolve(updateApiTask);
                    }
                    return _this.mapChargeToTask(updateApiTask, chargeableTask);
                });
                return Promise.all(taskPromises).then(function (results) {
                    // see DF_1494, if zero charge job, still need to include subsequentJobIndicator per task for api support.
                    // if more than one task, need to flag first item as prime charge
                    // primary logic is in chargeService, but that's only for *chargeable tasks*. No charge tasks
                    // would not be added to chargeableTasks in the job business model.
                    var existsPrime = results.some(function (t) { return t.subsequentJobIndicator !== undefined && t.subsequentJobIndicator === false; });
                    if (existsPrime) {
                        return results;
                    }
                    results.forEach(function (task, index) {
                        // no incomplete statuses then set sub indicator, otherwise do not send across at all
                        if (_this._incompleteStatuses.indexOf(task.status) === -1) {
                            task.subsequentJobIndicator = index > 0;
                        }
                    });
                    return results;
                });
            });
        };
        ChargeFactory.prototype.mapChargeToTask = function (taskApiModel, chargeableTask) {
            var _this = this;
            // initialise task api
            taskApiModel.chargeExcludingVAT = 0;
            taskApiModel.vatAmount = 0;
            if (!taskApiModel.chargeType) {
                return Promise.resolve(taskApiModel);
            }
            return this._catalogService.getChargeType(taskApiModel.chargeType).then(function (ct) {
                taskApiModel.vatCode = ct.vatCode;
                if (!chargeableTask || !chargeableTask.task) {
                    taskApiModel.subsequentJobIndicator = true; // api still expects this even when cancelled.
                    return Promise.resolve(taskApiModel);
                }
                taskApiModel.subsequentJobIndicator = chargeableTask.isSubsequent;
                if (!chargeableTask.task.isCharge) {
                    return Promise.resolve(taskApiModel);
                }
                if (chargeableTask.discountAmount) {
                    taskApiModel.discountAmount = chargeableTask.discountAmount.times(100).toNumber();
                }
                if (chargeableTask.netTotal) {
                    taskApiModel.chargeExcludingVAT = chargeableTask.netTotal.times(100).toNumber();
                }
                if (chargeableTask.vat) {
                    taskApiModel.vatAmount = chargeableTask.calculatedVatAmount.times(1000).toNumber();
                }
                if (chargeableTask.labourItem) {
                    taskApiModel.standardLabourChargeIndicator = !!chargeableTask.labourItem.isFixed;
                }
                if (chargeableTask.labourItem && chargeableTask.labourItem.netAmount) {
                    taskApiModel.totalLabourCharged = chargeableTask.labourItem.netAmount.times(100).toNumber();
                }
                return _this._businessRuleService.getQueryableRuleGroup("chargeService")
                    .then(function (ruleGroup) {
                    var noDiscountCode = ruleGroup.getBusinessRule("noDiscountCode");
                    if (chargeableTask.discountCode !== noDiscountCode) {
                        taskApiModel.discountCode = chargeableTask.discountCode;
                    }
                    return Promise.resolve(taskApiModel);
                });
            });
        };
        ChargeFactory = __decorate([
            aurelia_dependency_injection_1.inject(businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, Object])
        ], ChargeFactory);
        return ChargeFactory;
    }());
    exports.ChargeFactory = ChargeFactory;
});

//# sourceMappingURL=chargeFactory.js.map
