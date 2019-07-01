var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../models/editableViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/jobService", "../../../business/services/engineerService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "../../../business/services/partService", "../../../business/services/taskService", "../../../business/models/dataState", "../../../../common/core/objectHelper", "../../../presentation/factories/partsFactory", "../../../business/services/constants/chargeServiceConstants", "aurelia-binding", "../../../business/services/constants/catalogConstants"], function (require, exports, aurelia_framework_1, editableViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, jobService_1, engineerService_1, validationService_1, businessRuleService_1, catalogService_1, partService_1, taskService_1, dataState_1, objectHelper_1, partsFactory_1, chargeServiceConstants_1, aurelia_binding_1, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TodaysParts = /** @class */ (function (_super) {
        __extends(TodaysParts, _super);
        function TodaysParts(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, partService, taskService, bindingEngine, partsFactory) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this.validationRules = {};
            _this._partService = partService;
            _this._taskService = taskService;
            _this._bindingEngine = bindingEngine;
            _this._partsFactory = partsFactory;
            _this.isFullScreen = window.isFullScreen;
            return _this;
        }
        TodaysParts.prototype.activateAsync = function () {
            var _this = this;
            if (this._isCleanInstance) {
                return this.loadBusinessRules()
                    .then(function () { return _this.loadCatalogs(); })
                    .then(function () { return _this.load(); })
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () { return _this.showContent(); });
            }
            else {
                return this.load()
                    .then(function () { return _this.buildValidationRules(); });
            }
        };
        TodaysParts.prototype.deactivateAsync = function () {
            this._partSubscriptions.forEach(function (subscription) { return subscription.dispose(); });
            this._partSubscriptions = [];
            return Promise.resolve();
        };
        TodaysParts.prototype.setSameRefAsOriginal = function (warrantyReturn, part) {
            warrantyReturn.removedPartStockReferenceId = part.stockReferenceId;
        };
        TodaysParts.prototype.validationUpdated = function (validationCombinedResult) {
            // to keep row indicators up to date, we hook in here to see if any given part has changed its validation state
            var _this = this;
            var getPartDataState = function (partKey) {
                var thisPartPropertyResults = Object.keys(validationCombinedResult.propertyResults)
                    .map(function (key) { return validationCombinedResult.propertyResults[key]; })
                    .filter(function (propertyResult) { return propertyResult.property.lastIndexOf(partKey) === 0; });
                return thisPartPropertyResults.some(function (propertyResult) { return !propertyResult.isValid; })
                    ? dataState_1.DataState.invalid
                    : dataState_1.DataState.valid;
            };
            if (validationCombinedResult && validationCombinedResult.groups) {
                validationCombinedResult.groups
                    .filter(function (groupKey) { return groupKey.indexOf("[") !== 1; })
                    .forEach(function (partKey) {
                    var partDataState = getPartDataState(partKey);
                    var todaysPartViewModel = objectHelper_1.ObjectHelper.getPathValue(_this, partKey);
                    todaysPartViewModel.dataStateIndicator = partDataState;
                });
            }
        };
        TodaysParts.prototype.loadModel = function () {
            var _this = this;
            return Promise.all([
                this._partService.getTodaysParts(this.jobId),
                this._taskService.getTasks(this.jobId)
            ])
                .then(function (_a) {
                var partsToday = _a[0], tasks = _a[1];
                var stockReferencePrefixesToStopWarrantyReturn = _this.getBusinessRule("stockReferencePrefixesToStopWarrantyReturn");
                _this._stockReferencePrefixesToStopWarrantyReturn = (stockReferencePrefixesToStopWarrantyReturn && stockReferencePrefixesToStopWarrantyReturn.indexOf(",") !== -1) ?
                    stockReferencePrefixesToStopWarrantyReturn.split(",") :
                    [stockReferencePrefixesToStopWarrantyReturn];
                _this.parts = [];
                if (partsToday.parts && tasks) {
                    partsToday.parts.forEach(function (part) {
                        var task = tasks.find(function (t) { return t.id === part.taskId; });
                        var vm = _this._partsFactory.createTodaysPartViewModel(part, task);
                        vm.isWarrantyReturnOptionAvailable = (_this._stockReferencePrefixesToStopWarrantyReturn.indexOf(part.stockReferenceId.substring(0, 1)) === -1);
                        _this.parts.push(vm);
                    });
                }
                _this.setInitialDataState(partsToday.dataStateId, partsToday.dataState);
                _this.addPartChangeHanders();
            });
        };
        TodaysParts.prototype.saveModel = function () {
            var _this = this;
            var partsArugment = this.parts.map(function (part) { return ({
                partId: part.part.id,
                notusedReturn: part.notUsedReturn,
                warrantyReturn: part.warrantyReturn
            }); });
            return this._partService.saveTodaysPartsReturns(this.jobId, this.getFinalDataState(), partsArugment)
                .then(function () {
                if (_this._isDirty) {
                    _this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, _this.jobId);
                }
            });
        };
        TodaysParts.prototype.clearModel = function () {
            this.parts.forEach(function (part) {
                part.warrantyReturn.isWarrantyReturn = undefined;
                part.warrantyReturn.quantityToClaimOrReturn = undefined;
                part.warrantyReturn.reasonForClaim = undefined;
                part.warrantyReturn.removedPartStockReferenceId = undefined;
                part.notUsedReturn.quantityToReturn = undefined;
                part.notUsedReturn.reasonForReturn = undefined;
            });
            return Promise.resolve();
        };
        TodaysParts.prototype.addPartChangeHanders = function () {
            var _this = this;
            this._partSubscriptions = [];
            this.parts.forEach(function (part) {
                _this._partSubscriptions.push(_this._bindingEngine
                    .propertyObserver(part.warrantyReturn, "isWarrantyReturn")
                    .subscribe(function () { return _this.isWarrantyChangeHandler(part.warrantyReturn); }));
                _this._partSubscriptions.push(_this._bindingEngine
                    .propertyObserver(part.warrantyReturn, "quantityToClaimOrReturn")
                    .subscribe(function (newValue, oldValue) { return _this.warrantyQuantityChangeHandler(newValue, oldValue, part); }));
                _this._partSubscriptions.push(_this._bindingEngine
                    .propertyObserver(part.notUsedReturn, "reasonForReturn")
                    .subscribe(function () { return _this.returnReasonChangeHandler(part.notUsedReturn); }));
                _this._partSubscriptions.push(_this._bindingEngine
                    .propertyObserver(part.notUsedReturn, "quantityToReturn")
                    .subscribe(function (newValue, oldValue) { return _this.notUsedReturnQuantityChangeHandler(newValue, oldValue, part); }));
            });
        };
        TodaysParts.prototype.isWarrantyChangeHandler = function (warrantyReturn) {
            if (warrantyReturn.isWarrantyReturn && !warrantyReturn.quantityToClaimOrReturn) {
                warrantyReturn.quantityToClaimOrReturn = 1;
            }
        };
        TodaysParts.prototype.warrantyQuantityChangeHandler = function (newValue, oldValue, part) {
            newValue = newValue || 0;
            oldValue = oldValue || 0;
            var partQuantity = part.part.quantity || 0;
            var isQuantityIncreasing = newValue > oldValue;
            var isQuantityValid = newValue <= partQuantity;
            var isOtherQuantityStillValid = partQuantity >= newValue + (part.notUsedReturn.quantityToReturn || 0);
            if (isQuantityIncreasing && isQuantityValid && !isOtherQuantityStillValid) {
                var newValidOtherQuantity = partQuantity - newValue;
                part.notUsedReturn.quantityToReturn = newValidOtherQuantity;
                if (newValidOtherQuantity === 0) {
                    part.notUsedReturn.reasonForReturn = undefined;
                }
            }
        };
        TodaysParts.prototype.returnReasonChangeHandler = function (notusedReturn) {
            if (notusedReturn.reasonForReturn && !notusedReturn.quantityToReturn) {
                notusedReturn.quantityToReturn = 1;
            }
        };
        TodaysParts.prototype.notUsedReturnQuantityChangeHandler = function (newValue, oldValue, part) {
            newValue = newValue || 0;
            oldValue = oldValue || 0;
            var partQuantity = part.part.quantity || 0;
            var isQuantityIncreasing = newValue > oldValue;
            var isQuantityValid = newValue <= partQuantity;
            // ">" rather than ">=" so that if warrantyReturn.quantityToClaimOrReturn is 0 or undefined, warranty is set to false
            var isOtherQuantityStillValid = partQuantity > newValue + (part.warrantyReturn.quantityToClaimOrReturn || 0);
            if (isQuantityIncreasing && isQuantityValid && !isOtherQuantityStillValid) {
                var newValidOtherQuantity = partQuantity - newValue;
                part.warrantyReturn.quantityToClaimOrReturn = newValidOtherQuantity;
                if (newValidOtherQuantity === 0) {
                    part.warrantyReturn.isWarrantyReturn = false;
                }
            }
            if (newValue === 0) {
                part.notUsedReturn.reasonForReturn = undefined;
            }
        };
        TodaysParts.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation(this.parts.reduce(function (prev, curr, idx) {
                prev = prev.concat(_this.buildPartsToOrderListItemValidationRules(idx));
                return prev;
            }, []));
        };
        TodaysParts.prototype.buildPartsToOrderListItemValidationRules = function (index) {
            var _this = this;
            var itemRules = [];
            /*
             #13979 When the user hits the screen for the first time the tab-level indicator and all part-level indicators should be notVisited.
             As soon as one part is touched, the validation layer will turn the tab indicator to red (or green, if only one part).  The indicator for the touched part
             should go valid or invalid, and we need all other not visited parts' indicators to go red to match how the validation framework has
             set the tab indicator.  (i.e. once the tab indicator has gone red, it looks wrong that the other parts are all orange still).
             To provide this behaviour, we use the following rule which lets us make each part invalid as soon as one part is touched.
             */
            itemRules.push({
                property: "parts[" + index + "]",
                condition: function () { return _this.parts[index].notUsedReturn.quantityToReturn === undefined
                    && _this.parts[index].warrantyReturn.isWarrantyReturn === undefined; },
                passes: [{ test: function () { return false; }, message: null }],
                // parts group required to make sure all parts validation fired off whenever on part changes
                // parts[${index}] group required to isolate which part is changing within this.validationUpdated(...) method
                groups: ["parts", "parts[" + index + "]"],
            });
            itemRules.push({
                property: "parts[" + index + "].notUsedReturn.quantityToReturn",
                basedOn: "parts.notUsedReturn.quantityToReturn",
                condition: function () { return _this.parts[index].notUsedReturn.reasonForReturn !== undefined; },
                groups: ["parts", "parts[" + index + "]"]
            });
            itemRules.push({
                property: "parts[" + index + "].notUsedReturn.reasonForReturn",
                basedOn: "parts.notUsedReturn.reasonForReturn",
                condition: function () { return !!_this.parts[index].notUsedReturn.quantityToReturn; },
                groups: ["parts", "parts[" + index + "]"],
            });
            // this rule is required so that a change in isWarrantyReturn is picked up in our this.validationUpdated(...) method logic
            //  (even though we do need direct validation on this property)
            itemRules.push({
                property: "parts[" + index + "].warrantyReturn.isWarrantyReturn",
                basedOn: "parts.warrantyReturn.isWarrantyReturn",
                condition: function () { return _this.parts[index].warrantyReturn.isWarrantyReturn !== undefined; },
                groups: ["parts", "parts[" + index + "]"]
            });
            itemRules.push({
                property: "parts[" + index + "].warrantyReturn.quantityToClaimOrReturn",
                basedOn: "parts.warrantyReturn.quantityToClaimOrReturn",
                condition: function () { return !!_this.parts[index].warrantyReturn.isWarrantyReturn; },
                groups: ["parts", "parts[" + index + "]"]
            });
            itemRules.push({
                property: "parts[" + index + "].warrantyReturn.removedPartStockReferenceId",
                basedOn: "parts.warrantyReturn.removedPartStockReferenceId",
                condition: function () { return !!_this.parts[index].warrantyReturn.isWarrantyReturn; },
                groups: ["parts", "parts[" + index + "]"]
            });
            itemRules.push({
                property: "parts[" + index + "].warrantyReturn.reasonForClaim",
                basedOn: "parts.warrantyReturn.reasonForClaim",
                condition: function () { return !!_this.parts[index].warrantyReturn.isWarrantyReturn; },
                groups: ["parts", "parts[" + index + "]"]
            });
            return itemRules;
        };
        TodaysParts.prototype.loadCatalogs = function () {
            var _this = this;
            return Promise.all([
                this.buildNoYesList()
                    .then(function (yesNoList) {
                    _this.yesNoLookup = yesNoList;
                }),
                this._catalogService.getPartsNotUsedReasons()
                    .then(function (partNotUsedReasons) {
                    _this.returnReasonLookup = _this.toButtonListItemArray(partNotUsedReasons, catalogConstants_1.CatalogConstants.PARTS_NOT_USED_REASON_ID, catalogConstants_1.CatalogConstants.PARTS_NOT_USED_REASON_DESCRIPTION);
                })
            ]).return(null);
        };
        TodaysParts = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, partService_1.PartService, taskService_1.TaskService, aurelia_binding_1.BindingEngine, partsFactory_1.PartsFactory),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, aurelia_binding_1.BindingEngine, Object])
        ], TodaysParts);
        return TodaysParts;
    }(editableViewModel_1.EditableViewModel));
    exports.TodaysParts = TodaysParts;
});

//# sourceMappingURL=todaysParts.js.map
