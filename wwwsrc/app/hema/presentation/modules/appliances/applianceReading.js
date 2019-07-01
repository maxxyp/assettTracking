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
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../../business/services/labelService", "../../models/editableViewModel", "../../../business/services/jobService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "../../../business/services/applianceService", "./viewModels/gasApplianceReadingViewModel", "../../factories/applianceGasSafetyFactory", "../../../business/models/applianceGasSafety", "../../../business/models/applianceGasUnsafeDetail", "aurelia-binding", "../../../business/services/engineerService", "aurelia-dialog", "./appliancePageHelper", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, labelService_1, editableViewModel_1, jobService_1, validationService_1, businessRuleService_1, catalogService_1, applianceService_1, gasApplianceReadingViewModel_1, applianceGasSafetyFactory_1, applianceGasSafety_1, applianceGasUnsafeDetail_1, aurelia_binding_1, engineerService_1, aurelia_dialog_1, appliancePageHelper_1, aurelia_validation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceReading = /** @class */ (function (_super) {
        __extends(ApplianceReading, _super);
        function ApplianceReading(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, applianceService, applianceGasSafetyFactory, bindingEngine) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._applianceService = applianceService;
            _this._applianceGasSafetyFactory = applianceGasSafetyFactory;
            _this._bindingEngine = bindingEngine;
            _this.showSupplementaryBurner = false;
            _this._localSubscriptions = [];
            _this._supplementarySubscriptions = [];
            return _this;
        }
        ApplianceReading.prototype.canActivateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return appliancePageHelper_1.AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
        };
        ApplianceReading.prototype.activateAsync = function (params) {
            var _this = this;
            this.applianceId = params.applianceId;
            this._unsafeToastTitle = this.getLabel("unsafeSituation");
            if (this._isCleanInstance) {
                return this.loadBusinessRules()
                    .then(function () { return _this.buildBusinessRules(); })
                    .then(function () { return _this._labelService.getGroupWithoutCommon("validationRules"); })
                    .then(function (labels) { return _this.attachLabels(labels); })
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () { return _this.loadCatalogs(); })
                    .then(function () { return _this.load(); })
                    .then(function () { return _this.showContent(); });
            }
            else {
                return this.load();
            }
        };
        ApplianceReading.prototype.deactivateAsync = function () {
            this.clearSubscriptions();
            return Promise.resolve();
        };
        ApplianceReading.prototype.addSupplementaryBurner = function () {
            this.toggleAddBurnerButton();
        };
        ApplianceReading.prototype.removeSupplementaryBurner = function () {
            this.toggleAddBurnerButton();
        };
        ApplianceReading.prototype.burnerPressureChanged = function (newValue, vm, isSupp) {
            vm.burnerPressureUnsafe = newValue === this._burnerPressureUnsafeValue;
            if (vm.burnerPressureUnsafe) {
                var unsafeWarningMessage = isSupp ? this.getLabel("supplementaryBurnerPressureUnsafe") : this.getLabel("burnerPressureUnsafe");
                this.showWarning(this._unsafeToastTitle, unsafeWarningMessage, null, this._unsafeToastDismissTime);
            }
            this.updateSummary(vm);
            this.populatePreliminarySupplementaryIsLpg();
        };
        ApplianceReading.prototype.gasRateReadingChanged = function (newValue, vm, isSupp) {
            vm.gasReadingUnsafe = newValue === this._gasRateUnsafeValue;
            if (vm.gasReadingUnsafe) {
                var unsafeWarningMessage = isSupp ? this.getLabel("supplementaryGasReadingUnsafe") : this.getLabel("gasReadingUnsafe");
                this.showWarning(this._unsafeToastTitle, unsafeWarningMessage, null, this._unsafeToastDismissTime);
            }
            this.updateSummary(vm);
            this.populatePreliminarySupplementaryIsLpg();
        };
        ApplianceReading.prototype.isLpgChanged = function (newValue, vm, isSupp) {
            vm.isLpg = newValue;
            if (vm.isLpg === false) {
                this.showWarning(this._unsafeToastTitle, this.getLabel("isLpg"), null, this._unsafeToastDismissTime);
            }
            this.updateSummary(vm);
            this.populatePreliminarySupplementaryIsLpg();
        };
        ApplianceReading.prototype.readingFirstRatioChanged = function (newValue, vm, isSupp) {
            vm.showWarningFirstRatio = newValue > this._firstRatioWarningThreshold;
            this.updatePerformanceReadings(vm, isSupp);
        };
        ApplianceReading.prototype.readingFinalRatioChanged = function (newValue, vm, isSupp) {
            var valRule = this.getValidationRule(isSupp ? "gasReadings.supplementaryReadings.readingFinalRatio" : "gasReadings.preliminaryReadings.readingFinalRatio");
            vm.finalRatioUnsafe = newValue <= valRule.max && newValue >= valRule.min && newValue > this._finalRatioUnsafeThreshold;
            if (vm.finalRatioUnsafe) {
                var unsafeWarningMessage = isSupp ?
                    this.getLabel("supplementaryFinalRatioUnsafe") :
                    this.getLabel("finalRatioUnsafe");
                this.showWarning(this._unsafeToastTitle, unsafeWarningMessage, null, this._unsafeToastDismissTime);
            }
            this.updatePerformanceReadings(vm, isSupp);
        };
        ApplianceReading.prototype.updatePerformanceReadings = function (vm, isSupp) {
            var workedOnReadings;
            if (vm) {
                if (vm.readingFirstRatio === undefined && vm.readingMinRatio === undefined && vm.readingMaxRatio === undefined && vm.readingFinalRatio === undefined &&
                    vm.readingFirstCO === undefined && vm.readingMinCO === undefined && vm.readingMaxCO === undefined && vm.readingFinalCO === undefined &&
                    vm.readingFirstCO2 === undefined && vm.readingMinCO2 === undefined && vm.readingMaxCO2 === undefined && vm.readingFinalCO2 === undefined) {
                    workedOnReadings = false;
                }
                else {
                    workedOnReadings = true;
                }
                if (isSupp) {
                    this.gasReadings.workedOnSupplementaryPerformanceReadings = workedOnReadings;
                }
                else {
                    this.gasReadings.workedOnPreliminaryPerformanceReadings = workedOnReadings;
                }
                this.updateSummary(vm);
            }
        };
        ApplianceReading.prototype.loadModel = function () {
            var _this = this;
            return this._applianceService.getApplianceSafetyDetails(this.jobId, this.applianceId).then(function (applianceSafety) {
                _this._isGasSafetyWorkedOn = applianceSafety.applianceGasSafety.workedOnAppliance;
                _this.gasReadings = _this._applianceGasSafetyFactory.createApplianceGasReadingsViewModel(applianceSafety.applianceGasReadingsMaster);
                _this.showSupplementaryBurner = applianceSafety.applianceGasReadingsMaster.supplementaryBurnerFitted;
                if (applianceSafety.applianceGasSafety.overrideWorkedOnAppliance === true) {
                    // gas safety can set this to yes, in which chase make main readings mandatory, see validation below
                    _this.gasReadings.workedOnMainReadings = applianceSafety.applianceGasSafety.workedOnAppliance;
                    if (!_this.gasReadings.workedOnMainReadings) {
                        _this.gasReadings.preliminaryReadings.burnerPressure = undefined;
                        _this.gasReadings.preliminaryReadings.gasRateReading = undefined;
                        _this.gasReadings.supplementaryReadings.burnerPressure = undefined;
                        _this.gasReadings.supplementaryReadings.gasRateReading = undefined;
                        _this.showSupplementaryBurner = false;
                    }
                    if (!_this.gasReadings.workedOnPreliminaryPerformanceReadings) {
                        _this.resetPerformanceReadings(_this.gasReadings.preliminaryReadings);
                    }
                    if (!_this.gasReadings.supplementaryReadings) {
                        _this.resetPerformanceReadings(_this.gasReadings.supplementaryReadings);
                    }
                }
                _this.setInitialDataState(applianceSafety.applianceGasReadingsMaster.dataStateId, applianceSafety.applianceGasReadingsMaster.dataState);
                _this.resetSubscriptions();
                _this._haveCleared = false;
            });
        };
        ApplianceReading.prototype.saveModel = function () {
            var _this = this;
            return this._applianceService.getApplianceSafetyDetails(this.jobId, this.applianceId).then(function (applianceSafety) {
                _this.updatePerformanceReadings(_this.gasReadings.preliminaryReadings, false);
                _this.updatePerformanceReadings(_this.gasReadings.supplementaryReadings, true);
                var gasReadingsBusinessModel = _this._applianceGasSafetyFactory.createApplianceGasReadingsBusinessModel(_this.gasReadings);
                gasReadingsBusinessModel.dataState = _this.getFinalDataState();
                applianceSafety.applianceGasReadingsMaster = gasReadingsBusinessModel;
                applianceSafety.applianceGasReadingsMaster.supplementaryBurnerFitted = _this.showSupplementaryBurner;
                if (_this._haveCleared) {
                    applianceSafety.applianceGasSafety = new applianceGasSafety_1.ApplianceGasSafety();
                    applianceSafety.applianceGasUnsafeDetail = new applianceGasUnsafeDetail_1.ApplianceGasUnsafeDetail();
                }
                else {
                    applianceSafety.applianceGasSafety.summaryPrelimLpgWarningTrigger = _this.getSummaryPrelimLpgWarningTrigger();
                    applianceSafety.applianceGasSafety.summarySuppLpgWarningTrigger = _this.getSummarySuppLpgWarningTrigger();
                    applianceSafety.applianceGasSafety.overrideWorkedOnAppliance = false;
                    applianceSafety.applianceGasSafety.performanceTestsNotDoneReason = _this.gasReadings.workedOnPreliminaryPerformanceReadings ?
                        undefined : applianceSafety.applianceGasSafety.performanceTestsNotDoneReason;
                    applianceSafety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary = _this.gasReadings.workedOnSupplementaryPerformanceReadings ?
                        undefined : applianceSafety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary;
                }
                return _this._applianceService.saveApplianceSafetyDetails(_this.jobId, _this.applianceId, applianceSafety, false, false);
            });
        };
        ApplianceReading.prototype.clearModel = function () {
            this.gasReadings = this._applianceGasSafetyFactory.createApplianceGasReadingsViewModel(null);
            this.gasReadings.preliminaryReadings = new gasApplianceReadingViewModel_1.GasApplianceReadingViewModel();
            this.gasReadings.preliminaryReadings.askIfLpg = true;
            this.showSupplementaryBurner = false;
            this._haveCleared = true;
            this._isGasSafetyWorkedOn = false;
            this.resetSubscriptions();
            return Promise.resolve();
        };
        ApplianceReading.prototype.toggleAddBurnerButton = function () {
            this.gasReadings.supplementaryReadings = new gasApplianceReadingViewModel_1.GasApplianceReadingViewModel();
            this.showSupplementaryBurner = !this.showSupplementaryBurner;
            if (this.showSupplementaryBurner) {
                this.gasReadings.supplementaryReadings.isLpg = this.gasReadings.preliminaryReadings.isLpg;
                this.updateSummary(this.gasReadings.supplementaryReadings);
            }
            this.resetSubscriptions(true);
        };
        ApplianceReading.prototype.loadCatalogs = function () {
            var _this = this;
            return Promise.all([this.buildNoYesList(), this.buildNoYesList()])
                .then(function (_a) {
                var yesNoGas = _a[0], yesNoSupp = _a[1];
                _this.gasIsLpgButtons = yesNoGas;
                _this.suppIsLpgButtons = yesNoSupp;
            });
        };
        ApplianceReading.prototype.setObservables = function (vm, subscriptions, supp) {
            var _this = this;
            var sub1 = this._bindingEngine.propertyObserver(vm, "burnerPressure")
                .subscribe(function (newValue) { return _this.burnerPressureChanged(newValue, vm, supp); });
            subscriptions.push(sub1);
            var sub2 = this._bindingEngine.propertyObserver(vm, "gasRateReading")
                .subscribe(function (newValue) { return _this.gasRateReadingChanged(newValue, vm, supp); });
            subscriptions.push(sub2);
            if (supp === false) {
                var sub3 = this._bindingEngine.propertyObserver(vm, "isLpg")
                    .subscribe(function (newValue) { return _this.isLpgChanged(newValue, vm, supp); });
                subscriptions.push(sub3);
            }
            var sub4 = this._bindingEngine.propertyObserver(vm, "readingFirstRatio")
                .subscribe(function (newValue) { return _this.readingFirstRatioChanged(newValue, vm, supp); });
            subscriptions.push(sub4);
            var sub5 = this._bindingEngine.propertyObserver(vm, "readingMaxRatio")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub5);
            var sub6 = this._bindingEngine.propertyObserver(vm, "readingMinRatio")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub6);
            var sub7 = this._bindingEngine.propertyObserver(vm, "readingFinalRatio")
                .subscribe(function (newValue) { return _this.readingFinalRatioChanged(newValue, vm, supp); });
            subscriptions.push(sub7);
            var sub8 = this._bindingEngine.propertyObserver(vm, "readingFirstCO")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub8);
            var sub9 = this._bindingEngine.propertyObserver(vm, "readingMaxCO")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub9);
            var sub10 = this._bindingEngine.propertyObserver(vm, "readingMinCO")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub10);
            var sub11 = this._bindingEngine.propertyObserver(vm, "readingFinalCO")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub11);
            var sub12 = this._bindingEngine.propertyObserver(vm, "readingFirstCO2")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub12);
            var sub13 = this._bindingEngine.propertyObserver(vm, "readingMaxCO2")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub13);
            var sub14 = this._bindingEngine.propertyObserver(vm, "readingMinCO2")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub14);
            var sub15 = this._bindingEngine.propertyObserver(vm, "readingFinalCO2")
                .subscribe(function (newValue) { return _this.updatePerformanceReadings(vm, supp); });
            subscriptions.push(sub15);
        };
        ApplianceReading.prototype.buildBusinessRules = function () {
            this._burnerPressureUnsafeValue = this.getBusinessRule("burnerPressureUnsafeValue");
            this._gasRateUnsafeValue = this.getBusinessRule("gasRateUnsafeValue");
            this._firstRatioWarningThreshold = this.getBusinessRule("firstRatioWarningThreshold");
            this._finalRatioUnsafeThreshold = this.getBusinessRule("finalRatioUnsafeThreshold");
            this._unsafeToastDismissTime = this.getBusinessRule("unsafeToastDismissTime");
            return Promise.resolve();
        };
        ApplianceReading.prototype.buildValidationRules = function () {
            var _this = this;
            var isFinalRatioRequired = function (readings) {
                return readings && (readings.readingFinalRatio !== undefined
                    || readings.readingFirstRatio !== undefined
                    || readings.readingMinRatio !== undefined
                    || readings.readingMaxRatio !== undefined
                    || readings.readingFirstCO !== undefined
                    || readings.readingMinCO !== undefined
                    || readings.readingMaxCO !== undefined
                    || readings.readingFinalCO !== undefined
                    || readings.readingFirstCO2 !== undefined
                    || readings.readingMinCO2 !== undefined
                    || readings.readingMaxCO2 !== undefined
                    || readings.readingFinalCO2 !== undefined);
            };
            return this.buildValidation([
                {
                    property: "gasReadings.preliminaryReadings.burnerPressure",
                    groups: ["readingsRequired"],
                    required: function () { return (_this._isGasSafetyWorkedOn || _this.gasReadings.workedOnPreliminaryPerformanceReadings || _this.gasReadings.workedOnMainReadings)
                        && (_this.gasReadings.preliminaryReadings.isLpg === undefined
                            || _this.gasReadings.preliminaryReadings.isLpg === null)
                        && (_this.gasReadings.preliminaryReadings.gasRateReading === undefined
                            || _this.gasReadings.preliminaryReadings.gasRateReading === null); },
                    passes: [
                        {
                            test: function () {
                                // this tests the min & max value
                                if ((_this.gasReadings.preliminaryReadings.burnerPressure !== null
                                    && (_this.gasReadings.preliminaryReadings.burnerPressure !== undefined))) {
                                    var minValue = _this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].min;
                                    var maxValue = _this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].max;
                                    var betweenValueRule = new aurelia_validation_1.BetweenValueValidationRule(minValue, maxValue);
                                    return betweenValueRule.validate(_this.gasReadings.preliminaryReadings.burnerPressure, undefined);
                                }
                                else {
                                    return true;
                                }
                            },
                            message: function () {
                                var minValue = _this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].min;
                                var maxValue = _this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].max;
                                return _this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                            }
                        }
                    ],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.gasRateReading",
                    groups: ["readingsRequired"],
                    required: function () { return (_this._isGasSafetyWorkedOn || _this.gasReadings.workedOnPreliminaryPerformanceReadings || _this.gasReadings.workedOnMainReadings)
                        && (_this.gasReadings.preliminaryReadings.isLpg === undefined
                            || _this.gasReadings.preliminaryReadings.isLpg === null)
                        && (_this.gasReadings.preliminaryReadings.burnerPressure === undefined
                            || _this.gasReadings.preliminaryReadings.burnerPressure === null); },
                    passes: [
                        {
                            test: function () {
                                // this tests the min & max value
                                if ((_this.gasReadings.preliminaryReadings.gasRateReading !== null
                                    && (_this.gasReadings.preliminaryReadings.gasRateReading !== undefined))) {
                                    var minValue = _this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].min;
                                    var maxValue = _this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].max;
                                    var betweenValueRule = new aurelia_validation_1.BetweenValueValidationRule(minValue, maxValue);
                                    return betweenValueRule.validate(_this.gasReadings.preliminaryReadings.gasRateReading, undefined);
                                }
                                else {
                                    return true;
                                }
                            },
                            message: function () {
                                var minValue = _this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].min;
                                var maxValue = _this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].max;
                                return _this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                            }
                        }
                    ],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.isLpg",
                    groups: ["readingsRequired"],
                    required: function () { return (_this._isGasSafetyWorkedOn || _this.gasReadings.workedOnPreliminaryPerformanceReadings || _this.gasReadings.workedOnMainReadings)
                        && (_this.gasReadings.preliminaryReadings.gasRateReading === undefined
                            || _this.gasReadings.preliminaryReadings.gasRateReading === null)
                        && (_this.gasReadings.preliminaryReadings.burnerPressure === undefined
                            || _this.gasReadings.preliminaryReadings.burnerPressure === null)
                        && !_this.checkIfSupplementaryMainReadingsExists(); },
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingFirstRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingFirstRatio !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingMinRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingMinRatio !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingMaxRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingMaxRatio !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingFirstCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingFirstCO !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingMinCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingMinCO !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingMaxCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingMaxCO !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingFinalCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingFinalCO !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingFirstCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingFirstCO2 !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingMinCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingMinCO2 !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingMaxCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingMaxCO2 !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingFinalCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && _this.gasReadings.preliminaryReadings && _this.gasReadings.preliminaryReadings.readingFinalCO2 !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.burnerPressure",
                    groups: ["readingsRequired"],
                    required: function () { return _this.showSupplementaryBurner
                        && (_this._isGasSafetyWorkedOn || _this.gasReadings.workedOnSupplementaryPerformanceReadings || _this.gasReadings.workedOnMainReadings)
                        && (_this.gasReadings.supplementaryReadings.isLpg === undefined
                            || _this.gasReadings.supplementaryReadings.isLpg === null)
                        && (_this.gasReadings.supplementaryReadings.gasRateReading === undefined
                            || _this.gasReadings.supplementaryReadings.gasRateReading === null); },
                    passes: [
                        {
                            test: function () {
                                // this tests the min & max value
                                if ((_this.gasReadings.supplementaryReadings.burnerPressure !== null
                                    && (_this.gasReadings.supplementaryReadings.burnerPressure !== undefined))) {
                                    var minValue = _this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].min;
                                    var maxValue = _this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].max;
                                    var betweenValueRule = new aurelia_validation_1.BetweenValueValidationRule(minValue, maxValue);
                                    return betweenValueRule.validate(_this.gasReadings.supplementaryReadings.burnerPressure, undefined);
                                }
                                else {
                                    return true;
                                }
                            },
                            message: function () {
                                var minValue = _this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].min;
                                var maxValue = _this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].max;
                                return _this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                            }
                        }
                    ],
                    condition: function () { return _this.showSupplementaryBurner === true && _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.gasRateReading",
                    groups: ["readingsRequired"],
                    required: function () { return _this.showSupplementaryBurner
                        && (_this._isGasSafetyWorkedOn || _this.gasReadings.workedOnSupplementaryPerformanceReadings || _this.gasReadings.workedOnMainReadings)
                        && (_this.gasReadings.supplementaryReadings.isLpg === undefined
                            || _this.gasReadings.supplementaryReadings.isLpg === null)
                        && (_this.gasReadings.supplementaryReadings.burnerPressure === undefined
                            || _this.gasReadings.supplementaryReadings.burnerPressure === null); },
                    passes: [
                        {
                            test: function () {
                                // this tests the min & max value
                                if ((_this.gasReadings.supplementaryReadings.gasRateReading !== null
                                    && (_this.gasReadings.supplementaryReadings.gasRateReading !== undefined))) {
                                    var minValue = _this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].min;
                                    var maxValue = _this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].max;
                                    var betweenValueRule = new aurelia_validation_1.BetweenValueValidationRule(minValue, maxValue);
                                    return betweenValueRule.validate(_this.gasReadings.supplementaryReadings.gasRateReading, undefined);
                                }
                                else {
                                    return true;
                                }
                            },
                            message: function () {
                                var minValue = _this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].min;
                                var maxValue = _this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].max;
                                return _this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                            }
                        }
                    ],
                    condition: function () { return _this.showSupplementaryBurner === true && _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingFirstRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingFirstRatio !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingMinRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingMinRatio !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingMaxRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingMaxRatio !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingFirstCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingFirstCO !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingMinCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingMinCO !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingMaxCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingMaxCO !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingFinalCO",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingFinalCO !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingFirstCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingFirstCO2 !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingMinCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingMinCO2 !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingMaxCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingMaxCO2 !== undefined; }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingFinalCO2",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true &&
                        _this.gasReadings !== undefined && _this.gasReadings.supplementaryReadings && _this.gasReadings.supplementaryReadings.readingFinalCO2 !== undefined; }
                },
                {
                    property: "gasReadings.preliminaryReadings.readingFinalRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.gasReadings !== undefined && isFinalRatioRequired(_this.gasReadings.preliminaryReadings); }
                },
                {
                    property: "gasReadings.supplementaryReadings.readingFinalRatio",
                    groups: ["readingsRequired"],
                    condition: function () { return _this.showSupplementaryBurner === true && isFinalRatioRequired(_this.gasReadings.supplementaryReadings); }
                } // validate if something entered or if first, min or max ratio entered
            ]);
        };
        ApplianceReading.prototype.init = function (vm) {
            // required on first load to set viewModel related props
            vm.burnerPressureUnsafe = vm.burnerPressure === this._burnerPressureUnsafeValue;
            vm.gasReadingUnsafe = vm.gasRateReading === this._gasRateUnsafeValue;
            vm.showWarningFirstRatio = vm.readingFirstRatio > this._firstRatioWarningThreshold;
            vm.finalRatioUnsafe = vm.readingFinalRatio > this._finalRatioUnsafeThreshold;
            this.updateSummary(vm);
        };
        ApplianceReading.prototype.updateSummary = function (vm) {
            if (vm) {
                // is it unsafe
                vm.isUnsafeReadings =
                    vm.burnerPressureUnsafe ||
                        vm.gasReadingUnsafe ||
                        vm.isLpg === false ||
                        vm.finalRatioUnsafe;
                var isAPreliminaryReadingTaken = this.gasReadings && this.gasReadings.preliminaryReadings
                    && (this.gasReadings.preliminaryReadings.burnerPressure !== undefined ||
                        this.gasReadings.preliminaryReadings.gasRateReading !== undefined ||
                        this.gasReadings.preliminaryReadings.isLpg !== undefined);
                var isASupplementaryReadingTaken = this.gasReadings && this.gasReadings.supplementaryReadings
                    && (this.gasReadings.supplementaryReadings.burnerPressure !== undefined ||
                        this.gasReadings.supplementaryReadings.gasRateReading !== undefined ||
                        this.gasReadings.supplementaryReadings.isLpg !== undefined);
                this.gasReadings.workedOnMainReadings = isAPreliminaryReadingTaken || isASupplementaryReadingTaken;
            }
        };
        // despite show.bind still need to reset observables, not sure why
        ApplianceReading.prototype.setupSubscriptions = function (onlySupp) {
            if (onlySupp === void 0) { onlySupp = false; }
            if (this.gasReadings && this.gasReadings.preliminaryReadings && !onlySupp) {
                this.setObservables(this.gasReadings.preliminaryReadings, this._localSubscriptions, false);
                this.init(this.gasReadings.preliminaryReadings);
            }
            if (this.gasReadings && this.gasReadings.supplementaryReadings) {
                this.setObservables(this.gasReadings.supplementaryReadings, this._supplementarySubscriptions, true);
                this.init(this.gasReadings.supplementaryReadings);
            }
            this.populatePreliminarySupplementaryIsLpg();
        };
        ApplianceReading.prototype.clearSubscriptions = function (onlySupp) {
            if (onlySupp === void 0) { onlySupp = false; }
            if (this._localSubscriptions && !onlySupp) {
                this._localSubscriptions.forEach(function (x) {
                    x.dispose();
                    x = null;
                });
            }
            if (this._supplementarySubscriptions && this._supplementarySubscriptions.length > 0) {
                this._supplementarySubscriptions.forEach(function (x) {
                    x.dispose();
                    x = null;
                });
            }
            this._localSubscriptions = [];
            this._supplementarySubscriptions = [];
        };
        ApplianceReading.prototype.resetSubscriptions = function (onlySupp) {
            if (onlySupp === void 0) { onlySupp = false; }
            this.clearSubscriptions(onlySupp);
            this.setupSubscriptions(onlySupp);
        };
        ApplianceReading.prototype.getSummaryPrelimLpgWarningTrigger = function () {
            if (this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.isLpg === false) {
                return true;
            }
            else {
                return false;
            }
        };
        ApplianceReading.prototype.getSummarySuppLpgWarningTrigger = function () {
            if (this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.isLpg === false) {
                return true;
            }
            else {
                return false;
            }
        };
        // todo some refactor work required here, conditional iffs need reviewing/removing,
        // todo using deconstruction and variables to break up and improve readability
        // todo bothReadingsExist and burnerGasPremDoesNotExist are used more than once, maybe replace with get method
        ApplianceReading.prototype.populatePreliminarySupplementaryIsLpg = function () {
            var _a = this.gasReadings, pr = _a.preliminaryReadings, sr = _a.supplementaryReadings;
            var noPreliminaryReadings = pr.burnerPressure === undefined && pr.gasRateReading === undefined;
            var noPreliminaryIsLpg = pr.isLpg === undefined;
            var noSupplementaryReadings = sr.burnerPressure === undefined && sr.gasRateReading === undefined;
            sr.isLpg = (!noPreliminaryIsLpg && this.showSupplementaryBurner && noPreliminaryReadings) ? pr.isLpg : undefined;
            var bothReadingsExist = (this.showSupplementaryBurner && !noSupplementaryReadings && noPreliminaryReadings);
            pr.askIfLpg = bothReadingsExist ? false : noPreliminaryReadings;
            if (pr.askIfLpg === false) {
                pr.isLpg = undefined;
            }
        };
        ApplianceReading.prototype.resetPerformanceReadings = function (vm) {
            vm.readingFirstCO = undefined;
            vm.readingFirstCO2 = undefined;
            vm.readingFirstRatio = undefined;
            vm.readingMaxCO = undefined;
            vm.readingMaxCO2 = undefined;
            vm.readingMaxRatio = undefined;
            vm.readingMinCO = undefined;
            vm.readingMinCO2 = undefined;
            vm.readingMinRatio = undefined;
            vm.readingFinalCO = undefined;
            vm.readingFinalCO2 = undefined;
            vm.readingFinalRatio = undefined;
        };
        ApplianceReading.prototype.checkIfSupplementaryMainReadingsExists = function () {
            return this.gasReadings.supplementaryReadings && !!this.gasReadings.supplementaryReadings.burnerPressure || !!this.gasReadings.supplementaryReadings.gasRateReading;
        };
        ApplianceReading = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, applianceService_1.ApplianceService, applianceGasSafetyFactory_1.ApplianceGasSafetyFactory, aurelia_binding_1.BindingEngine),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, aurelia_binding_1.BindingEngine])
        ], ApplianceReading);
        return ApplianceReading;
    }(editableViewModel_1.EditableViewModel));
    exports.ApplianceReading = ApplianceReading;
});

//# sourceMappingURL=applianceReading.js.map
