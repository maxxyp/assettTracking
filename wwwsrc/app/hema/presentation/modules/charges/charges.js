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
define(["require", "exports", "../../../business/services/constants/chargeServiceConstants", "../../factories/chargesFactory", "../../../business/services/catalogService", "../../../business/services/businessRuleService", "../../../business/services/validationService", "../../models/editableViewModel", "aurelia-framework", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/engineerService", "../../../business/services/jobService", "./viewModels/chargeMainViewModel", "../../../business/services/charge/chargeService", "../../../business/models/charge/charge", "../../../business/services/constants/catalogConstants", "bignumber", "aurelia-binding", "../../../business/services/charge/chargeCatalogHelperService"], function (require, exports, chargeServiceConstants_1, chargesFactory_1, catalogService_1, businessRuleService_1, validationService_1, editableViewModel_1, aurelia_framework_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, engineerService_1, jobService_1, chargeMainViewModel_1, chargeService_1, charge_1, catalogConstants_1, bignumber, aurelia_binding_1, chargeCatalogHelperService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Charges = /** @class */ (function (_super) {
        __extends(Charges, _super);
        function Charges(labelService, eventAggregator, dialogService, engineerService, jobService, validationService, businessRulesService, catalogService, chargesFactory, chargeService, bindingEngine, chargeCatalogHelper) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._viewModelSubscriptions = [];
            _this._bindingEngine = bindingEngine;
            _this._chargesFactory = chargesFactory;
            _this._chargeService = chargeService;
            _this._chargeCatalogHelper = chargeCatalogHelper;
            _this._CHARGE_NOT_OK = charge_1.Charge.CHARGE_NOT_OK;
            return _this;
        }
        Charges.prototype.deactivateAsync = function () {
            this.removeObservables();
            if (this._chargeUpdateCompletedSub) {
                this._chargeUpdateCompletedSub.dispose();
                this._chargeUpdateCompletedSub = null;
            }
            return Promise.resolve();
        };
        Charges.prototype.activateAsync = function (params) {
            var _this = this;
            this._jobId = params.jobId;
            this.setupEvents();
            return this.buildValidationRules()
                .then(function () { return _this.populateRules(); })
                .then(function () { return _this.loadCatalogs(); })
                .then(function () { return _this.load(); })
                .then(function () {
                if (_this._chargeService.areChargesUptoDate() === true) {
                    _this.showContent();
                }
            });
        };
        Charges.prototype.canDeactivateAsync = function () {
            return Promise.resolve(this._chargeService.areChargesUptoDate());
        };
        Charges.prototype.toggleItem = function (task) {
            if (task) {
                task.show = !task.show;
            }
        };
        Charges.prototype.setDiscount = function (task) {
            var taskId = task.task.id;
            var businessModel = this._chargesFactory.createChargesBusinessModel(this.viewModel);
            var taskIndex = businessModel.tasks.findIndex(function (t) { return t.task.id === taskId; });
            if (task.discountCode) {
                var chargeableTask = this._chargesFactory.createChargeableTaskBusinessModel(task);
                this._chargeService.applyDiscountToTask(chargeableTask, this.discountCatalog, this._discountPercentageCode, this._discountFixedCode, this._noDiscountCode);
                task.discountAmount = chargeableTask.discountAmount;
                task.discountText = chargeableTask.discountText;
                task.discountCode = chargeableTask.discountCode;
                task.netTotal = chargeableTask.netTotal;
                task.grossTotal = chargeableTask.grossTotal;
                task.vat = chargeableTask.vat;
                task.vatCode = chargeableTask.vatCode;
                businessModel.tasks[taskIndex] = chargeableTask;
                this._chargeService.updateTotals(businessModel);
                var viewModel = this._chargesFactory.createChargesViewModel(businessModel);
                this.viewModel.chargeTotal = viewModel.chargeTotal;
                this.viewModel.grossTotal = viewModel.grossTotal;
                this.viewModel.discountAmount = viewModel.discountAmount;
                this.viewModel.netTotal = viewModel.netTotal;
                this.validateAllRules();
            }
            return Promise.resolve();
        };
        Charges.prototype.getPartItemDescription = function (item) {
            var warrantyOrReturn = "";
            var partsLabel = this.getLabel("parts");
            var previousLabel = this.getLabel("previous");
            var status = this.getGoodsItemStatusDescription(item.status);
            if (status) {
                status = status.toLowerCase();
            }
            var description = partsLabel + " " + (item.isFromPreviousActivity ? " - " + previousLabel + " " + status : "");
            if (item.isWarranty && item.warrantyQty > 0) {
                warrantyOrReturn = "x" + item.warrantyQty + " " + this.getLabel("warranty");
            }
            if (item.isReturn && item.returnQty > 0) {
                if (warrantyOrReturn !== "") {
                    warrantyOrReturn = warrantyOrReturn + ", ";
                }
                warrantyOrReturn = warrantyOrReturn + "x" + item.returnQty + " " + this.getLabel("return");
            }
            if (warrantyOrReturn !== "") {
                return description + " - " + warrantyOrReturn;
            }
            return description;
        };
        Charges.prototype.getLabourItemDescription = function (item) {
            return this.getLabel("labour");
        };
        Charges.prototype.getHasCharge = function () {
            var flag = false;
            if (this.viewModel && this.viewModel.netTotal) {
                if (this.viewModel.netTotal.greaterThan(0)) {
                    flag = true;
                }
            }
            return flag;
        };
        Object.defineProperty(Charges.prototype, "noErrors", {
            get: function () {
                var noErrors = true;
                if (this.viewModel && this.viewModel.tasks) {
                    for (var i = 0; i <= this.viewModel.tasks.length - 1; i++) {
                        if (this.viewModel.tasks[i].error) {
                            noErrors = false;
                            break;
                        }
                    }
                }
                return noErrors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Charges.prototype, "hasErrors", {
            get: function () {
                return !this.noErrors;
            },
            enumerable: true,
            configurable: true
        });
        Charges.prototype.readWarning = function () {
            this.viewModel.previousChargeSameApplianceConfirmed = true;
        };
        Object.defineProperty(Charges.prototype, "showChargeOkQuestions", {
            get: function () {
                // if previousCharge make sure user has confirmed the message
                if (this.viewModel && this.viewModel.previousChargeSameAppliance) {
                    return this.viewModel.previousChargeSameApplianceConfirmed;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Charges.prototype.getTotalChargableTime = function (task) {
            var totalChargableTime = 0;
            if (task) {
                totalChargableTime = task.chargeableTime || 0;
                task.previousVisits.forEach(function (pv) { return totalChargableTime += pv.chargeableTime || 0; });
            }
            return totalChargableTime > 1 ? totalChargableTime + " " + this.getLabel("minutes") : totalChargableTime + " " + this.getLabel("minute");
        };
        Charges.prototype.saveModel = function () {
            var _this = this;
            return this.populateRules().then(function () {
                _this.viewModel.dataState = _this.getFinalDataState();
                if (_this.viewModel.chargeComplaintActionCategory === _this._complaintActionCategoryCharge) {
                    _this.viewModel.chargeReasonCode = _this._complaintReasonCodeCharge;
                }
                else {
                    _this.viewModel.chargeReasonCode = undefined;
                }
                var model = _this._chargesFactory.createChargesBusinessModel(_this.viewModel);
                return _this._chargeService.saveCharges(model);
            });
        };
        Charges.prototype.loadModel = function () {
            if (this._chargeService.areChargesUptoDate() === true) {
                return this.loadCharges();
            }
            else {
                this.showBusy(this.getLabel("updatingCharges") + " ...");
                return Promise.resolve();
            }
        };
        Charges.prototype.clearModel = function () {
            this.removeObservables();
            if (this.viewModel) {
                this.viewModel.discountAmount = undefined;
                this.viewModel.chargeOption = undefined;
                this.viewModel.remarks = undefined;
            }
            this.viewModel.tasks.forEach(function (task) {
                task.discountAmount = new bignumber.BigNumber(0);
                task.discountCode = undefined;
                task.discountText = "";
            });
            var businessModel = this._chargesFactory.createChargesBusinessModel(this.viewModel);
            this._chargeService.updateTotals(businessModel);
            this.viewModel = this._chargesFactory.createChargesViewModel(businessModel);
            this.setObservables();
            return Promise.resolve();
        };
        Charges.prototype.getGoodsItemStatusDescription = function (status) {
            if (!status || !this._goodsItemStatusesCatalog) {
                return "";
            }
            var item = this._goodsItemStatusesCatalog.find(function (g) { return g.status === status; });
            if (!item || item.status === "FP") {
                return "";
            }
            return item.description;
        };
        Charges.prototype.setupEvents = function () {
            var _this = this;
            this._chargeUpdateCompletedSub = this._eventAggregator.subscribe(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_COMPLETED, function () {
                if (_this._chargeService.areChargesUptoDate() === true) {
                    _this.loadCharges().then(function () {
                        _this.showContent();
                    });
                }
            });
        };
        Charges.prototype.populateRules = function () {
            var _this = this;
            return this._businessRuleService.getQueryableRuleGroup("chargeService")
                .then(function (ruleGroup) {
                // setup rules
                _this._noDiscountCode = ruleGroup.getBusinessRule("noDiscountCode");
                _this._complaintActionCategoryCharge = ruleGroup.getBusinessRule("complaintActionCategoryCharge");
                _this._complaintReasonCodeCharge = ruleGroup.getBusinessRule("complaintCategoryBillingQuery");
                _this._discountPercentageCode = ruleGroup.getBusinessRule("discountPercentageCode");
                _this._discountFixedCode = ruleGroup.getBusinessRule("discountFixedCode");
            });
        };
        Charges.prototype.setObservables = function () {
            var _this = this;
            var sub1 = this._bindingEngine.propertyObserver(this.viewModel, "chargeOption")
                .subscribe(function (newValue, oldValue) {
                _this.chargeOptionChanged(newValue, oldValue);
            });
            this._viewModelSubscriptions.push(sub1);
            if (this.viewModel && this.viewModel.tasks) {
                this.viewModel.tasks.forEach(function (task) {
                    var sub = _this._bindingEngine.propertyObserver(task, "discountCode")
                        .subscribe(function (newValue, oldValue) {
                        _this.setDiscount(task);
                    });
                    _this._viewModelSubscriptions.push(sub);
                });
            }
        };
        Charges.prototype.removeObservables = function () {
            this._viewModelSubscriptions.forEach(function (s) {
                s.dispose();
                s = null;
            });
            this._viewModelSubscriptions = [];
        };
        Charges.prototype.setHasCharge = function () {
            this.hasCharge = false;
            if (this.viewModel && this.viewModel.netTotal) {
                if (this.viewModel.netTotal.greaterThan(0)) {
                    this.hasCharge = true;
                }
            }
            this.validateAllRules();
        };
        Charges.prototype.loadCharges = function () {
            var _this = this;
            this.removeObservables();
            return this._chargeService.loadCharges(this._jobId)
                .then(function (charges) {
                if (charges) {
                    _this.populateValues(charges);
                    _this.setHasCharge();
                    _this.setInitialDataState(_this.viewModel.dataStateId, _this.viewModel.dataState);
                    _this.setObservables();
                    return Promise.resolve();
                }
                else {
                    return _this._chargeService.applyCharges(_this._jobId)
                        .then(function (jobcharges) {
                        if (jobcharges) {
                            _this.populateValues(jobcharges);
                            if (_this.chargeDisputeCatalog) {
                                _this.setChargeDisputeText(_this.viewModel.chargeComplaintActionCategory);
                                _this.viewModel.chargeComplaintActionCategory = _this.chargeDisputeCatalog[0].id;
                            }
                            _this.setInitialDataState(_this.viewModel.dataStateId, _this.viewModel.dataState);
                        }
                        else {
                            _this.viewModel = new chargeMainViewModel_1.ChargeMainViewModel();
                        }
                        _this.setHasCharge();
                        _this.setObservables();
                    });
                }
            });
        };
        Charges.prototype.loadCatalogs = function () {
            var _this = this;
            var noDiscount = {};
            noDiscount.discountCode = this._noDiscountCode;
            var labelKey = "nodiscount";
            noDiscount.discountDescription = this.labels[labelKey];
            // noDiscount.discountValue = -999;
            // noDiscount.discountCategory = "";
            return Promise.all([
                this._catalogService.getDiscounts(),
                this._catalogService.getChargeOptions(),
                this._catalogService.getChargeDisputes(),
                this._catalogService.getGoodsItemStatuses()
            ]).then(function (_a) {
                var discounts = _a[0], chargeOptions = _a[1], chargeDisputes = _a[2], goodsItemStatuses = _a[3];
                var validDiscounts = _this._chargeCatalogHelper.getValidDiscounts(discounts);
                _this.discountCatalog = [noDiscount].concat(validDiscounts);
                _this.chargeOptionCatalog = _this.toButtonListItemArray(chargeOptions, catalogConstants_1.CatalogConstants.CHARGE_OPTION_ID, catalogConstants_1.CatalogConstants.CHARGE_OPTION_DESCRIPTION);
                _this.chargeDisputeCatalog = chargeDisputes;
                _this._goodsItemStatusesCatalog = goodsItemStatuses;
            });
        };
        Charges.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                {
                    property: "viewModel.chargeComplaintActionCategory",
                    condition: function () { return _this.viewModel && _this.viewModel.chargeOption === _this._CHARGE_NOT_OK; }
                },
                {
                    property: "viewModel.chargeOption",
                    condition: function () { return _this.hasCharge; }
                },
                {
                    property: "viewModel.remarks",
                    condition: function () { return _this.viewModel && _this.viewModel.chargeOption === _this._CHARGE_NOT_OK; }
                },
                {
                    property: "viewModel.previousChargeSameApplianceConfirmed",
                    condition: function () { return _this.previousChargeSameAppliance; },
                    passes: [
                        {
                            test: function () { return _this.viewModel && _this.viewModel.previousChargeSameApplianceConfirmed; },
                            message: null
                        }
                    ]
                }
            ]);
        };
        Charges.prototype.populateValues = function (businessModel) {
            this.viewModel = this._chargesFactory.createChargesViewModel(businessModel);
            businessModel = this._chargesFactory.createChargesBusinessModel(this.viewModel);
            if (businessModel) {
                this._chargeService.updateTotals(businessModel);
            }
            this.viewModel = this._chargesFactory.createChargesViewModel(businessModel);
            this.setChargeDisputeText(this.viewModel.chargeComplaintActionCategory);
        };
        Charges.prototype.chargeOptionChanged = function (newValue, oldValue) {
            if (newValue === this._CHARGE_NOT_OK) {
                this.setChargeDisputeText(this.chargeDisputeCatalog[0].id);
                this.viewModel.chargeComplaintActionCategory = this.chargeDisputeCatalog[0].id;
            }
            return this.validateAllRules();
        };
        Charges.prototype.setChargeDisputeText = function (value) {
            if (value && this.chargeDisputeCatalog) {
                var dispute = this.chargeDisputeCatalog.find(function (x) { return x.id === value; });
                if (dispute) {
                    this.viewModel.chargeDisputeText = dispute.description + " - " + dispute.id;
                }
            }
        };
        __decorate([
            aurelia_binding_1.computedFrom("viewModel.previousChargeSameApplianceConfirmed"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], Charges.prototype, "showChargeOkQuestions", null);
        Charges = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, engineerService_1.EngineerService, jobService_1.JobService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, chargesFactory_1.ChargesFactory, chargeService_1.ChargeService, aurelia_binding_1.BindingEngine, chargeCatalogHelperService_1.ChargeCatalogHelperService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, Object, Object, aurelia_binding_1.BindingEngine, Object])
        ], Charges);
        return Charges;
    }(editableViewModel_1.EditableViewModel));
    exports.Charges = Charges;
});

//# sourceMappingURL=charges.js.map
