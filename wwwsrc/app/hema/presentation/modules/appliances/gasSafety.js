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
define(["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../../business/services/labelService", "../../../business/services/jobService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/applianceService", "../.././../business/services/catalogService", "../../models/editableViewModel", "../../factories/applianceGasSafetyFactory", "../../../business/services/engineerService", "./applianceReading", "../../../../common/core/objectHelper", "../../../../common/core/stringHelper", "aurelia-dialog", "./viewModels/gasApplianceReadingViewModel", "../../../../common/core/threading", "./viewModels/gasApplianceReadingsMasterViewModel", "../../../business/services/constants/catalogConstants", "../../../business/models/yesNoNa", "./appliancePageHelper", "aurelia-binding"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, labelService_1, jobService_1, validationService_1, businessRuleService_1, applianceService_1, catalogService_1, editableViewModel_1, applianceGasSafetyFactory_1, engineerService_1, applianceReading_1, objectHelper_1, stringHelper_1, aurelia_dialog_1, gasApplianceReadingViewModel_1, threading_1, gasApplianceReadingsMasterViewModel_1, catalogConstants_1, yesNoNa_1, appliancePageHelper_1, aurelia_binding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GasSafety = /** @class */ (function (_super) {
        __extends(GasSafety, _super);
        function GasSafety(jobService, engineerService, labelService, applianceService, router, eventAggregator, dialogService, validationService, businessRulesService, catalogService, bindingEngine, applianceGasSafetyFactory) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._applianceService = applianceService;
            _this._applianceGasSafetyFactory = applianceGasSafetyFactory;
            _this._bindingEngine = bindingEngine;
            _this.unsafeReasonFields = [];
            _this.showUnsafeWarningMsg = false;
            _this.showSupplementaryApplianceStripped = false;
            _this.showPerformanceTestNotDoneReasonsForSupplementary = false;
            return _this;
        }
        GasSafety.prototype.canActivateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return appliancePageHelper_1.AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
        };
        GasSafety.prototype.activateAsync = function (params) {
            var _this = this;
            this.applianceId = params.applianceId;
            this.jobId = params.jobId;
            if (this._isCleanInstance) {
                return this.loadBusinessRules()
                    .then(function () { return _this.buildBusinessRules(); })
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () { return _this.loadCatalogs(); })
                    .then(function () { return _this._labelService.getGroupWithoutCommon(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(applianceReading_1.ApplianceReading))); })
                    .then(function (labels) { return _this.attachLabels(labels); })
                    .then(function () { return _this.load(); })
                    .then(function () { return _this.showContent(); });
            }
            else {
                return this.load();
            }
        };
        GasSafety.prototype.deactivateAsync = function () {
            this._showToasts = false;
            this.removeObservables();
            return Promise.resolve();
        };
        GasSafety.prototype.unsafeSituation = function () {
            if (this.gasSafetyViewModel) {
                this.gasSafetyViewModel.isApplianceSafe = false;
            }
        };
        /* observables start */
        GasSafety.prototype.obserApplianceSafe = function (newValue, oldValue, onload) {
            this.isSafe = newValue;
            if (!this.isSafe && this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No) {
                this.gasUnsafeViewModel.conditionAsLeft = undefined;
                this.gasUnsafeViewModel.cappedTurnedOff = undefined;
                this.gasUnsafeViewModel.labelAttachedRemoved = undefined;
            }
            if (!onload || this.disableApplianceSafe) {
                this.gasSafetyViewModel.toCurrentStandards = newValue === undefined ? undefined : yesNoNa_1.YesNoNa.Yes;
            }
            this.disableToCurrentStandards = this.isSafe === false;
            if (this.disableToCurrentStandards) {
                this.disableConditionAsLeft = false;
                this.populateUnsafeReason("toCurrentStandards", true);
            }
            if (newValue !== undefined) {
                this.populateUnsafeReason("applianceSafe", newValue);
            }
            if (newValue === true) {
                this.showCurrentStandards = this.gasSafetyViewModel.isApplianceSafe !== false || this.gasSafetyViewModel.toCurrentStandards !== undefined;
            }
            if (!onload && oldValue === undefined) {
                this.showApplianceSafe = true;
                this.showCurrentStandards = this.gasSafetyViewModel.isApplianceSafe !== false || this.gasSafetyViewModel.toCurrentStandards !== undefined;
            }
            if (newValue !== undefined && this.showApplianceSafe === false) {
                this.showApplianceSafe = true;
                this.showCurrentStandards = this.gasSafetyViewModel.isApplianceSafe !== false || this.gasSafetyViewModel.toCurrentStandards !== undefined;
            }
        };
        GasSafety.prototype.obserToCurrentStandards = function (newValue, oldValue, onload) {
            switch (newValue) {
                case yesNoNa_1.YesNoNa.No:
                    this.populateUnsafeReason("toCurrentStandards", false);
                    this.disableConditionAsLeft = true;
                    this.gasUnsafeViewModel.conditionAsLeft = this._conditionsAsLeftNotToCurrentStandardsOption;
                    break;
                case yesNoNa_1.YesNoNa.Na:
                    this.populateUnsafeReason("toCurrentStandards", true);
                    this.disableConditionAsLeft = false;
                    break;
            }
        };
        GasSafety.prototype.obserApplianceTightnessOk = function (newValue, oldValue, onload) {
            this.populateUnsafeReason("applianceTightness", (newValue === yesNoNa_1.YesNoNa.No) ? false : true);
        };
        GasSafety.prototype.obserVentSizeConfigOk = function (newValue, oldValue, onload) {
            this.populateUnsafeReason("ventSizeConfig", newValue);
        };
        GasSafety.prototype.obserSafetyDevice = function (newValue, oldValue, onload) {
            this.populateUnsafeReason("safetyDevice", (newValue === yesNoNa_1.YesNoNa.No) ? false : true);
        };
        GasSafety.prototype.obserDidYouVisuallyCheck = function (newValue, oldValue, onload) {
            if (this.gasSafetyViewModel.workedOnAppliance === true) {
                newValue = undefined;
            }
            this.populateUnsafeReason("didYouVisuallyCheck", newValue);
        };
        GasSafety.prototype.obserWorkedOnAppliance = function (newValue, oldValue, onload) {
            var _this = this;
            if (newValue === true) {
                this.showSafetyDevice = true;
                this.showApplianceTightnessOk = true;
                this.showApplianceStripped = true;
                this.showVentSizeConfigOk = true;
                this.showVisuallyCheckRelight = false;
                this.disableApplianceSafe = false;
                this.disableConditionAsLeft = false;
                this.showApplianceSafe = true;
                this.showCurrentStandards = true;
                this.isChimneyInstallationRequired();
                this.updatePerformanceTestCarriedOutAndApplianceStripped(newValue, onload);
                this.gasSafetyViewModel.overrideWorkedOnAppliance = false;
                this.gasSafetyViewModel.didYouVisuallyCheck = undefined;
                return Promise.resolve();
            }
            else if (newValue === false) {
                if (!onload) {
                    if (this.isApplianceSafetyAndReadingsAreEmpty() === false) {
                        return this.clearReadings().then(function (clear) {
                            if (clear === true) {
                                _this.clearForWorkOnAppliance(newValue, onload);
                            }
                            else {
                                threading_1.Threading.nextCycle(function () {
                                    _this.gasSafetyViewModel.workedOnAppliance = true;
                                });
                            }
                            return Promise.resolve();
                        });
                    }
                    else {
                        // no readings and no safet details hence...
                        // dont bother asking question just clear
                        this.clearForWorkOnAppliance(newValue, onload);
                        return Promise.resolve();
                    }
                }
                else {
                    this.showVisuallyCheckRelight = true;
                    this.showApplianceSafe = true;
                    this.showCurrentStandards = true;
                    this.showPerformanceTestNotDoneReasons = false;
                    this.showApplianceStripped = false;
                    this.showPerformanceTestNotDoneReasonsForSupplementary = false;
                    this.showSupplementaryApplianceStripped = false;
                    this.gasSafetyViewModel.performanceTestsNotDoneReason = undefined;
                    this.gasSafetyViewModel.applianceStripped = undefined;
                    this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
                    this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                    this.showApplianceTightnessOk = false;
                    this.showVentSizeConfigOk = false;
                    this.showSafetyDevice = false;
                    this.gasSafetyViewModel.overrideWorkedOnAppliance = true;
                    this.showChimneyInstallationAndTests = false;
                    this.updatePerformanceTestCarriedOutAndApplianceStripped(newValue, onload);
                    return Promise.resolve();
                }
            }
            else {
                this.gasSafetyViewModel.overrideWorkedOnAppliance = false;
                this.updatePerformanceTestCarriedOutAndApplianceStripped(newValue, onload);
                return Promise.resolve();
            }
        };
        GasSafety.prototype.obserApplianceStripped = function (newValue, oldValue, onload) {
            var _this = this;
            if (newValue === true) {
                this.populateUnsafeReason("applianceStripped", true);
            }
            else if (newValue === false) {
                if (this._performanceTestNotDoneReasonExceptions) {
                    if (this._performanceTestNotDoneReasonExceptions
                        .some(function (x) { return x === _this.gasSafetyViewModel.performanceTestsNotDoneReason; })) {
                        this.populateUnsafeReason("applianceStripped", true);
                    }
                    else {
                        this.populateUnsafeReason("applianceStripped", false);
                    }
                }
            }
        };
        GasSafety.prototype.obserSupplementaryApplianceStripped = function (newValue, oldValue, onload) {
            var _this = this;
            if (newValue === true) {
                this.populateUnsafeReason("supplementaryApplianceStripped", true);
            }
            else if (newValue === false) {
                if (this._performanceTestNotDoneReasonExceptions) {
                    if (this._performanceTestNotDoneReasonExceptions
                        .some(function (x) { return x === _this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary; })) {
                        this.populateUnsafeReason("supplementaryApplianceStripped", true);
                    }
                    else {
                        this.populateUnsafeReason("supplementaryApplianceStripped", false);
                    }
                }
            }
        };
        GasSafety.prototype.obserChimneyInstallationAndTests = function (newValue, oldValue, onload) {
            this.populateUnsafeReason("chimneyInstallationAndTests", (newValue === yesNoNa_1.YesNoNa.No) ? false : true);
        };
        GasSafety.prototype.obserPerformanceTestsNotDoneReason = function (newValue, oldValue, onload) {
            if (newValue !== undefined) {
                if (this._applianceStrippedQuestionBusinessRule) {
                    if (this._applianceStrippedQuestionBusinessRule.some(function (x) { return x === newValue; })) {
                        this.showApplianceStripped = true;
                    }
                    else {
                        this.showApplianceStripped = false;
                        this.gasSafetyViewModel.applianceStripped = undefined;
                        this.populateUnsafeReason("applianceStripped", true);
                    }
                }
            }
            else {
                this.gasSafetyViewModel.applianceStripped = undefined;
            }
        };
        GasSafety.prototype.obserPerformanceTestsNotDoneReasonForSupplementary = function (newValue, oldValue, onload) {
            if (newValue !== undefined) {
                if (this._applianceStrippedQuestionbusinessRuleForSupplementary) {
                    if (this._applianceStrippedQuestionbusinessRuleForSupplementary.some(function (x) { return x === newValue; })) {
                        this.showSupplementaryApplianceStripped = true;
                    }
                    else {
                        this.showSupplementaryApplianceStripped = false;
                        this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                        this.populateUnsafeReason("supplementaryApplianceStripped", true);
                    }
                }
            }
            else {
                this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
            }
        };
        GasSafety.prototype.obserAbleToTest = function (newValue, oldValue) {
            this.disableWorkedOnApplianceNoButton();
        };
        GasSafety.prototype.obserRequestedTest = function (newValue, oldValue) {
            this.disableWorkedOnApplianceNoButton();
        };
        /* observables end */
        GasSafety.prototype.saveModel = function () {
            if (this.gasSafetyViewModel.workedOnAppliance === false) {
                this.resetReadingsViewModel();
            }
            this.gasSafetyViewModel.dataState = this.getFinalDataState();
            // need to keep the dataStateId to track. Used object assign to make sure the current dataStateId gets mapped to the new object
            var gasReadings = Object.assign({ dataStateId: this.appliance.safety.applianceGasReadingsMaster.dataStateId }, this._gasReadings);
            // todo: beware - at this point this.appliance is actually a reference to the real appliance model, at this point
            //  we are manipulating the stored model (i.e. saveApplianceSafetyDetails() is effectively just writing already updated model to storage)
            this.appliance.safety.applianceGasReadingsMaster = this._applianceGasSafetyFactory.createApplianceGasReadingsBusinessModel(gasReadings);
            this.appliance.safety.applianceGasSafety = this._applianceGasSafetyFactory.createApplianceGasSafetyBusinessModel(this.gasSafetyViewModel, this.appliance.isSafetyRequired);
            this.appliance.safety.applianceGasUnsafeDetail = this._applianceGasSafetyFactory.createApplianceGasUnsafeBusinessModel(this.gasUnsafeViewModel);
            return this._applianceService.saveApplianceSafetyDetails(this.jobId, this.appliance.id, this.appliance.safety, this._isDirty, false);
        };
        GasSafety.prototype.loadModel = function () {
            var _this = this;
            return this._jobService.getJob(this.jobId)
                .then(function (job) {
                _this.isLandlordJob = job.isLandlordJob;
                return _this._applianceService.getAppliance(_this.jobId, _this.applianceId);
            })
                .then(function (appliance) {
                _this.resetLocalModels();
                if (appliance) {
                    _this.appliance = appliance;
                    _this.gasSafetyViewModel = _this._applianceGasSafetyFactory.createApplianceGasSafetyViewModel(appliance.safety.applianceGasSafety, appliance.isSafetyRequired);
                    _this.gasUnsafeViewModel = _this._applianceGasSafetyFactory.createApplianceGasUnsafeViewModel(appliance.safety.applianceGasUnsafeDetail);
                    _this._gasReadings = _this._applianceGasSafetyFactory.createApplianceGasReadingsViewModel(appliance.safety.applianceGasReadingsMaster);
                    _this.setInitialDataState(_this.gasSafetyViewModel.dataStateId, _this.gasSafetyViewModel.dataState);
                }
                else {
                    _this.setNewDataState("appliances");
                }
            })
                .then(function () { return _this.populateUnsafeFieldLabelMap(); })
                .then(function () { return _this.removeObservables(); })
                .then(function () { return _this.initGasSafetyStatus(); })
                .then(function () { return _this.setObservables(); })
                .then(function () { return _this.updatePerformanceTestCarriedOutAndApplianceStripped(_this.gasSafetyViewModel.workedOnAppliance, true); })
                .then(function () {
                // get adapt make and model non blocking.
                _this._showToasts = true;
            });
        };
        GasSafety.prototype.clearModel = function () {
            this.removeObservables();
            this.resetLocalModels();
            this.resetReadingsViewModel();
            this.initGasSafetyStatus();
            this.setObservables();
            return Promise.resolve();
        };
        GasSafety.prototype.undoModel = function () {
            this._showToasts = false;
        };
        GasSafety.prototype.loadCatalogs = function () {
            var _this = this;
            var catalogPromises = [
                this._catalogService.getSafetyActions()
                    .then(function (safetyActions) {
                    _this.cappedTurnedOffLookup = _this.toButtonListItemArray(safetyActions, catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID, catalogConstants_1.CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeTypes()
                    .then(function (safetyNoticeTypes) {
                    _this.conditionAsLeftLookup = _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeStatuses()
                    .then(function (safetyNoticeStatus) {
                    _this.labelAttachedRemovedLookup = _this.toButtonListItemArray(safetyNoticeStatus, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                }),
                this._catalogService.getPerformanceTestReasons()
                    .then(function (performanceTestNotDoneReason) {
                    _this.performanceTestNotDoneReasonLookup =
                        _this.toButtonListItemArray(performanceTestNotDoneReason.filter(function (p) { return p.category === _this.getLabel("preliminary"); }), catalogConstants_1.CatalogConstants.PERFORMANCE_TEST_REASON_ID, catalogConstants_1.CatalogConstants.PERFORMANCE_TEST_REASON_DESCRIPTION);
                    _this.performanceTestNotDoneReasonLookupForSupplementary =
                        _this.toButtonListItemArray(performanceTestNotDoneReason.filter(function (p) { return p.category === _this.getLabel("supplementary"); }), catalogConstants_1.CatalogConstants.PERFORMANCE_TEST_REASON_ID, catalogConstants_1.CatalogConstants.PERFORMANCE_TEST_REASON_DESCRIPTION);
                })
            ];
            return Promise.all(catalogPromises)
                .then(function () {
                return Promise.all([
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesNaList(),
                    _this.buildNoYesNaList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesNaList(),
                    _this.buildNoYesList(),
                    _this.buildNoNaList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList()
                ])
                    .then(function (_a) {
                    var applianceStrippedLookup = _a[0], didYouWorkOnApplianceLookup = _a[1], didYouVisuallyCheckLookup = _a[2], applianceTightnessLookup = _a[3], chimneyInstallationAndTestsLookup = _a[4], ventSizeConfigLookup = _a[5], safetyDeviceLookup = _a[6], isApplianceSafeLookup = _a[7], toCurrentStandardsLookup = _a[8], ownedByCustomerLookup = _a[9], letterLeftLookup = _a[10], signatureObtainedLookup = _a[11], requestedToTestLookup = _a[12], ableToTestLookup = _a[13];
                    _this.applianceStrippedLookup = applianceStrippedLookup;
                    _this.didYouWorkOnApplianceLookup = didYouWorkOnApplianceLookup;
                    _this.didYouVisuallyCheckLookup = didYouVisuallyCheckLookup;
                    _this.applianceTightnessLookup = applianceTightnessLookup;
                    _this.chimneyInstallationAndTestsLookup = chimneyInstallationAndTestsLookup;
                    _this.ventSizeConfigLookup = ventSizeConfigLookup;
                    _this.safetyDeviceLookup = safetyDeviceLookup;
                    _this.isApplianceSafeLookup = isApplianceSafeLookup;
                    _this.toCurrentStandardsLookup = toCurrentStandardsLookup;
                    _this.ownedByCustomerLookup = ownedByCustomerLookup;
                    _this.letterLeftLookup = letterLeftLookup;
                    _this.signatureObtainedLookup = signatureObtainedLookup;
                    _this.requestedToTestLookup = requestedToTestLookup;
                    _this.ableToTestLookup = ableToTestLookup;
                });
            });
        };
        GasSafety.prototype.setObservables = function () {
            var _this = this;
            if (this.gasSafetyViewModel) {
                var sub1 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "workedOnAppliance")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserWorkedOnAppliance(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub1);
                var sub2 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "applianceTightness")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserApplianceTightnessOk(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub2);
                var sub3 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "ventSizeConfig")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserVentSizeConfigOk(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub3);
                var sub4 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "safetyDevice")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserSafetyDevice(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub4);
                var sub5 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "isApplianceSafe")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserApplianceSafe(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub5);
                var sub6 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "didYouVisuallyCheck")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserDidYouVisuallyCheck(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub6);
                var sub7 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "applianceStripped")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserApplianceStripped(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub7);
                var sub8 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "chimneyInstallationAndTests")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserChimneyInstallationAndTests(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub8);
                var sub9 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "performanceTestsNotDoneReason")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserPerformanceTestsNotDoneReason(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub9);
                var sub10 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "toCurrentStandards")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserToCurrentStandards(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub10);
                var sub11 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "ableToTest")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserAbleToTest(newValue, oldValue);
                });
                this._gasSubscriptions.push(sub11);
                var sub12 = this._bindingEngine.propertyObserver(this.gasUnsafeViewModel, "conditionAsLeft")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserConditionAsLeft(newValue, oldValue);
                });
                this._gasSubscriptions.push(sub12);
                var sub13 = this._bindingEngine.propertyObserver(this.gasUnsafeViewModel, "cappedTurnedOff")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserCappedTurnedOff(newValue, oldValue);
                });
                this._gasSubscriptions.push(sub13);
                var sub14 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "requestedToTest")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserRequestedTest(newValue, oldValue);
                });
                this._gasSubscriptions.push(sub14);
                var sub15 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "performanceTestsNotDoneReasonForSupplementary")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserPerformanceTestsNotDoneReasonForSupplementary(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub15);
                var sub16 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "supplementaryApplianceStripped")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserSupplementaryApplianceStripped(newValue, oldValue, false);
                });
                this._gasSubscriptions.push(sub16);
            }
        };
        GasSafety.prototype.initGasSafetyStatus = function () {
            if (this.gasSafetyViewModel) {
                if (this._gasReadings.workedOnMainReadings === true || this._gasReadings.workedOnPreliminaryPerformanceReadings === true) {
                    this.gasSafetyViewModel.workedOnAppliance = true;
                }
                if (this.isLandlordJob) {
                    this.obserAbleToTest(this.gasSafetyViewModel.ableToTest, undefined);
                    this.obserRequestedTest(this.gasSafetyViewModel.requestedToTest, undefined);
                }
                this.obserWorkedOnAppliance(this.gasSafetyViewModel.workedOnAppliance, undefined, true);
                this.obserDidYouVisuallyCheck(this.gasSafetyViewModel.didYouVisuallyCheck, undefined, true);
                this.obserChimneyInstallationAndTests(this.gasSafetyViewModel.chimneyInstallationAndTests, undefined, true);
                this.obserVentSizeConfigOk(this.gasSafetyViewModel.ventSizeConfig, undefined, true);
                this.obserSafetyDevice(this.gasSafetyViewModel.safetyDevice, undefined, true);
                this.obserApplianceTightnessOk(this.gasSafetyViewModel.applianceTightness, undefined, true);
                if (this.isApplianceSafetyAndReadingsAreEmpty() === false) {
                    this.showApplianceSafe = true;
                    this.setPerformanceReadingsQuestions();
                }
                if (this.gasSafetyViewModel.summaryPrelimLpgWarningTrigger) {
                    this.populateUnsafeReason("isLpg", false);
                }
                if (this._gasReadings.preliminaryReadings) {
                    if (this._gasReadings.preliminaryReadings.burnerPressureUnsafe) {
                        this.populateUnsafeReason("burnerPressureUnsafe", false);
                    }
                    if (this._gasReadings.preliminaryReadings.gasReadingUnsafe) {
                        this.populateUnsafeReason("gasReadingUnsafe", false);
                    }
                    if (this._gasReadings.preliminaryReadings.finalRatioUnsafe) {
                        this.populateUnsafeReason("finalRatioUnsafe", false);
                    }
                }
                if (this._gasReadings.supplementaryReadings) {
                    if (this._gasReadings.supplementaryReadings.burnerPressureUnsafe) {
                        this.populateUnsafeReason("suppBurnerPressureUnsafe", false);
                    }
                    if (this._gasReadings.supplementaryReadings.gasReadingUnsafe) {
                        this.populateUnsafeReason("suppGasReadingUnsafe", false);
                    }
                    if (this._gasReadings.supplementaryReadings.finalRatioUnsafe) {
                        this.populateUnsafeReason("suppFinalRatioUnsafe", false);
                    }
                }
                if (this._gasReadings.preliminaryReadings && this._gasReadings.preliminaryReadings.isUnsafeReadings) {
                    if (!!this._gasReadings.preliminaryReadings.isUnsafeReadings === false
                        && !!this._gasReadings.supplementaryReadings.isUnsafeReadings === false) {
                        if (this.isSafetyEmpty() === true) {
                            this.gasSafetyViewModel.isApplianceSafe = undefined;
                        }
                    }
                    else {
                        this.gasSafetyViewModel.isApplianceSafe = false;
                    }
                }
                this.obserApplianceSafe(this.gasSafetyViewModel.isApplianceSafe, undefined, true);
                this.obserToCurrentStandards(this.gasSafetyViewModel.toCurrentStandards, undefined, true);
                this.obserConditionAsLeft(this.gasUnsafeViewModel.conditionAsLeft, undefined);
                this.obserCappedTurnedOff(this.gasUnsafeViewModel.cappedTurnedOff, undefined);
            }
        };
        GasSafety.prototype.isChimneyInstallationRequired = function () {
            var _this = this;
            if (this.appliance.flueType) {
                this.showChimneyInstallationAndTests = true;
                if (this._flueTypesExceptions) {
                    if (!this._flueTypesExceptions.some(function (x) { return x === _this.appliance.flueType; })) {
                        // need to filter the options
                        if (this.chimneyInstallationAndTestsLookup) {
                            this.chimneyInstallationAndTestsLookup.forEach(function (option) {
                                if (option.value !== yesNoNa_1.YesNoNa.Na) {
                                    option.disabled = true;
                                }
                                else {
                                    option.disabled = false;
                                }
                            });
                        }
                    }
                    else {
                        if (this.gasSafetyViewModel.chimneyInstallationAndTests === yesNoNa_1.YesNoNa.Na) {
                            this.gasSafetyViewModel.chimneyInstallationAndTests = undefined;
                        }
                        this.chimneyInstallationAndTestsLookup.forEach(function (option) {
                            if (option.value === yesNoNa_1.YesNoNa.Na) {
                                option.disabled = true;
                            }
                            else {
                                option.disabled = false;
                            }
                        });
                    }
                }
            }
            else {
                this.showChimneyInstallationAndTests = false;
            }
        };
        GasSafety.prototype.isCurrentStandardsRequired = function () {
            return this.disableToCurrentStandards || (this.gasSafetyViewModel && this.gasSafetyViewModel.isApplianceSafe && this.gasSafetyViewModel.toCurrentStandards !== yesNoNa_1.YesNoNa.Yes);
        };
        GasSafety.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                { property: "gasSafetyViewModel.workedOnAppliance", condition: function () { return _this.appliance && _this.appliance.isSafetyRequired; } },
                { property: "gasSafetyViewModel.didYouVisuallyCheck", condition: function () { return _this.showVisuallyCheckRelight; } },
                { property: "gasSafetyViewModel.performanceTestsNotDoneReason", condition: function () { return _this.showPerformanceTestNotDoneReasons; } },
                { property: "gasSafetyViewModel.applianceStripped", condition: function () { return _this.showApplianceStripped; } },
                { property: "gasSafetyViewModel.supplementaryApplianceStripped", condition: function () { return _this.showSupplementaryApplianceStripped; } },
                { property: "gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary", condition: function () { return _this.showPerformanceTestNotDoneReasonsForSupplementary; } },
                { property: "gasSafetyViewModel.applianceTightness", condition: function () { return _this.showApplianceTightnessOk; } },
                { property: "gasSafetyViewModel.chimneyInstallationAndTests", condition: function () { return _this.showChimneyInstallationAndTests; } },
                { property: "gasSafetyViewModel.ventSizeConfig", condition: function () { return _this.showVentSizeConfigOk; } },
                { property: "gasSafetyViewModel.safetyDevice", condition: function () { return _this.showSafetyDevice; } },
                { property: "gasSafetyViewModel.isApplianceSafe", condition: function () { return _this.showApplianceSafe; } },
                {
                    property: "gasSafetyViewModel.toCurrentStandards",
                    passes: [{
                            test: function () { return _this.isCurrentStandardsRequired(); },
                            message: "*"
                        }],
                    condition: function () { return _this.showCurrentStandards; }
                },
                { property: "gasUnsafeViewModel.report", condition: function () { return _this.isSafe === false || (_this.gasSafetyViewModel && _this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No); } },
                { property: "gasUnsafeViewModel.conditionAsLeft", condition: function () { return _this.isSafe === false || (_this.gasSafetyViewModel && _this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No); } },
                { property: "gasUnsafeViewModel.cappedTurnedOff", condition: function () { return _this.isSafe === false || (_this.gasSafetyViewModel && _this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No); } },
                { property: "gasUnsafeViewModel.labelAttachedRemoved", condition: function () { return _this.isSafe === false || (_this.gasSafetyViewModel && _this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No); } },
                { property: "gasUnsafeViewModel.ownedByCustomer", condition: function () { return _this.isSafe === false || (_this.gasSafetyViewModel && _this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No); } },
                { property: "gasUnsafeViewModel.letterLeft", condition: function () { return _this.isSafe === false || (_this.gasSafetyViewModel && _this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No); } },
                { property: "gasUnsafeViewModel.signatureObtained", condition: function () { return _this.isSafe === false || (_this.gasSafetyViewModel && _this.gasSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No); } },
                { property: "gasSafetyViewModel.applianceMake", condition: function () { return _this.isLandlordJob === true; } },
                { property: "gasSafetyViewModel.applianceModel", condition: function () { return _this.isLandlordJob === true; } },
                { property: "gasSafetyViewModel.requestedToTest", condition: function () { return _this.isLandlordJob === true; } },
                { property: "gasSafetyViewModel.ableToTest", condition: function () { return _this.isLandlordJob === true; } }
            ]);
        };
        GasSafety.prototype.buildBusinessRules = function () {
            var rule1 = this.getBusinessRule("performanceTestNotDoneReasonExceptions");
            if (rule1) {
                this._performanceTestNotDoneReasonExceptions = rule1.split(",");
            }
            var rule2 = this.getBusinessRule("flueTypesExceptions");
            if (rule2) {
                this._flueTypesExceptions = rule2.split(",");
            }
            var rule3 = this.getBusinessRule("showApplianceStrippedQuestion");
            if (rule3) {
                this._applianceStrippedQuestionBusinessRule = rule3.split(",");
            }
            this._applianceStrippedQuestionbusinessRuleForSupplementary = this.getBusinessRule("showApplianceStrippedQuestionForSupplementary").split(",");
            this._unsafeToastDismissTime = this.getBusinessRule("unsafeToastDismissTime");
            this._conditionsAsLeftNotToCurrentStandardsOption = this.getBusinessRule("conditionsAsLeftNotToCurrentStandardsOption");
            this._cappedTurnedOffDisabledOptionsForNTCS = this.getBusinessRule("cappedTurnedOffDisabledOptionsForNTCS").split(",");
            this._cappedTurnedOffNotApplicableOption = this.getBusinessRule("cappedTurnedOffNotApplicableOption");
            this._labelARDisabledOptionsForNTCS = this.getBusinessRule("labelAttachedRemovedDisabledOptionsForNTCS").split(",");
            this._labelARDisabledOptionsForNonNTCS = this.getBusinessRule("labelAttachedRemovedDisabledOptionsForNonNTCS").split(",");
            this._didYouWorkOnApplianceNoOption = this.getBusinessRule("didYouWorkOnApplianceNoOption");
            this._conditionAsLeftImmediatelyDangerousOption = this.getBusinessRule("conditionAsLeftImmediatelyDangerousOption");
            this._cappedTurnedOffOptionsForWarningMsg = this.getBusinessRule("cappedTurnedOffOptionsForWarningMsg").split(",");
        };
        GasSafety.prototype.populateUnsafeReason = function (fieldName, safe) {
            if (safe === false) {
                var existingItem = this.unsafeReasonFields.some(function (u) { return u === fieldName; });
                if (!existingItem) {
                    this.unsafeReasonFields.push(fieldName);
                    if (fieldName !== "toCurrentStandards" && fieldName !== "applianceSafe") {
                        this.gasSafetyViewModel.isApplianceSafe = false;
                        this.disableApplianceSafe = true;
                    }
                }
                if (this.gasSafetyViewModel.isApplianceSafe === false) {
                    // update conditionAsLeftLookup options
                    this.disableButtons(this.conditionAsLeftLookup, [this._conditionsAsLeftNotToCurrentStandardsOption]);
                    // update cappedTurnedOffLookup options
                    this.disableButtons(this.cappedTurnedOffLookup, [this._cappedTurnedOffNotApplicableOption]);
                    // update labelAttachedRemovedLookup options
                    this.disableButtons(this.labelAttachedRemovedLookup, this._labelARDisabledOptionsForNonNTCS);
                }
                if (fieldName === "toCurrentStandards") {
                    // update cappedTurnedOffLookup options if toCurrentStandards NO option is chosen
                    this.disableButtons(this.cappedTurnedOffLookup, this._cappedTurnedOffDisabledOptionsForNTCS);
                    // update labelAttachedRemovedLookup options if toCurrentStandards NO option is chosen
                    this.disableButtons(this.labelAttachedRemovedLookup, this._labelARDisabledOptionsForNTCS);
                }
                if (this._showToasts) {
                    this.showWarning(this.getLabel("unsafeSituation"), this.unsafeSituationLookup[fieldName], null, this._unsafeToastDismissTime);
                }
            }
            else if (safe === true) {
                if (this.removeReason(fieldName)) {
                    if (fieldName === "toCurrentStandards" || fieldName === "applianceSafe") {
                        this.clearUnSafeSituationFields();
                        return;
                    }
                    if (this.unsafeReasonFields.length === 0) {
                        this.clearUnSafeSituationFields();
                    }
                    else if (this.unsafeReasonFields.length === 1 && this.unsafeReasonFields.indexOf("applianceSafe") > -1) {
                        this.disableApplianceSafe = false;
                    }
                }
            }
        };
        GasSafety.prototype.removeReason = function (fieldName) {
            var removed = false;
            var existingIndex = this.unsafeReasonFields.findIndex(function (u) { return u === fieldName; });
            if (existingIndex > -1) {
                this.unsafeReasonFields.splice(existingIndex, 1);
                removed = true;
            }
            return removed;
        };
        GasSafety.prototype.populateUnsafeFieldLabelMap = function () {
            var _this = this;
            this.unsafeSituationLookup = {};
            var fields = [];
            fields.push("applianceTightness");
            fields.push("didYouVisuallyCheck");
            fields.push("applianceStripped");
            fields.push("supplementaryApplianceStripped");
            fields.push("chimneyInstallationAndTests");
            fields.push("ventSizeConfig");
            fields.push("isLpg");
            fields.push("burnerPressureUnsafe");
            fields.push("gasReadingUnsafe");
            fields.push("finalRatioUnsafe");
            fields.push("suppBurnerPressureUnsafe");
            fields.push("suppGasReadingUnsafe");
            fields.push("suppFinalRatioUnsafe");
            fields.push("safetyDevice");
            fields.push("toCurrentStandards");
            fields.push("applianceSafe");
            fields.forEach(function (x) {
                switch (x) {
                    case "suppBurnerPressureUnsafe":
                        var suppBurnerPressureUnsafe = "suppBurnerPressureUnsafe";
                        _this.unsafeSituationLookup[suppBurnerPressureUnsafe] = _this.getLabel("supplementaryBurnerPressureUnsafe");
                        break;
                    case "suppGasReadingUnsafe":
                        var suppGasReadingUnsafe = "suppGasReadingUnsafe";
                        _this.unsafeSituationLookup[suppGasReadingUnsafe] = _this.getLabel("supplementaryGasReadingUnsafe");
                        break;
                    case "suppFinalRatioUnsafe":
                        var suppFinalRatioUnsafe = "suppFinalRatioUnsafe";
                        _this.unsafeSituationLookup[suppFinalRatioUnsafe] = _this.getLabel("supplementaryFinalRatioUnsafe");
                        break;
                    default:
                        _this.unsafeSituationLookup[x] = _this.getLabel(x);
                        break;
                }
            });
        };
        GasSafety.prototype.removeObservables = function () {
            if (this._gasSubscriptions) {
                this._gasSubscriptions.forEach(function (x) {
                    if (x) {
                        x.dispose();
                        x = null;
                    }
                });
                this._gasSubscriptions = [];
            }
            else {
                this._gasSubscriptions = [];
            }
        };
        GasSafety.prototype.clearReadings = function () {
            var _this = this;
            return this.showConfirmation(this.getLabel("confirmation"), this.getLabel("readingClearQuestion"))
                .then(function (result) {
                if (!result.wasCancelled) {
                    _this.gasSafetyViewModel.workedOnAppliance = false;
                    _this.resetReadingsViewModel();
                    return Promise.resolve(true);
                }
                else {
                    return Promise.resolve(false);
                }
            });
        };
        GasSafety.prototype.resetReadingsViewModel = function () {
            this.gasSafetyViewModel.summaryPrelimLpgWarningTrigger = false;
            this._gasReadings = new gasApplianceReadingsMasterViewModel_1.GasApplianceReadingsMasterViewModel();
            this._gasReadings.preliminaryReadings = new gasApplianceReadingViewModel_1.GasApplianceReadingViewModel();
            this._gasReadings.supplementaryReadings = new gasApplianceReadingViewModel_1.GasApplianceReadingViewModel();
            this._gasReadings.supplementaryBurnerFitted = false;
            this._gasReadings.workedOnMainReadings = false;
            this._gasReadings.workedOnPreliminaryPerformanceReadings = false;
            this._gasReadings.workedOnSupplementaryPerformanceReadings = false;
        };
        GasSafety.prototype.updatePerformanceTestCarriedOutAndApplianceStripped = function (didYouWorkedOnAppliance, onload) {
            if (didYouWorkedOnAppliance === true) {
                this.showPerformanceTestNotDoneReasons = !this._gasReadings.workedOnPreliminaryPerformanceReadings;
                this.showApplianceStripped = !this._gasReadings.workedOnPreliminaryPerformanceReadings;
                if (this._gasReadings.supplementaryBurnerFitted) {
                    this.showPerformanceTestNotDoneReasonsForSupplementary = !this._gasReadings.workedOnSupplementaryPerformanceReadings;
                    this.showSupplementaryApplianceStripped = !this._gasReadings.workedOnSupplementaryPerformanceReadings;
                    this.obserPerformanceTestsNotDoneReasonForSupplementary(this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary, undefined, false);
                    this.obserSupplementaryApplianceStripped(this.gasSafetyViewModel.supplementaryApplianceStripped, undefined, false);
                }
                else {
                    this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
                    this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                }
                this.obserPerformanceTestsNotDoneReason(this.gasSafetyViewModel.performanceTestsNotDoneReason, undefined, false);
                this.obserApplianceStripped(this.gasSafetyViewModel.applianceStripped, undefined, false);
            }
            else {
                this.showPerformanceTestNotDoneReasons = false;
                this.showApplianceStripped = false;
                this.showPerformanceTestNotDoneReasonsForSupplementary = false;
                this.showSupplementaryApplianceStripped = false;
                if (!onload) {
                    this.gasSafetyViewModel.applianceStripped = undefined;
                    this.gasSafetyViewModel.performanceTestsNotDoneReason = undefined;
                    this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
                    this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                }
            }
        };
        GasSafety.prototype.isApplianceSafetyAndReadingsAreEmpty = function () {
            var isEmpty = false;
            if (this.isSafetyEmpty() && this.areReadingsEmpty()) {
                isEmpty = true;
            }
            else {
                isEmpty = false;
            }
            return isEmpty;
        };
        GasSafety.prototype.isSafetyEmpty = function () {
            var isEmpty = false;
            if (this.gasSafetyViewModel === undefined) {
                isEmpty = true;
            }
            if (this.gasSafetyViewModel.applianceStripped === undefined &&
                this.gasSafetyViewModel.applianceTightness === undefined &&
                this.gasSafetyViewModel.chimneyInstallationAndTests === undefined &&
                this.gasSafetyViewModel.didYouVisuallyCheck === undefined &&
                this.gasSafetyViewModel.isApplianceSafe === undefined &&
                this.gasSafetyViewModel.performanceTestsNotDoneReason === undefined &&
                this.gasSafetyViewModel.ventSizeConfig === undefined &&
                (this.gasSafetyViewModel.workedOnAppliance === undefined || this.gasSafetyViewModel.workedOnAppliance === false)) {
                isEmpty = true;
            }
            return isEmpty;
        };
        GasSafety.prototype.areReadingsEmpty = function () {
            var isEmpty = false;
            if (this._gasReadings === undefined) {
                isEmpty = true;
            }
            if (!!this._gasReadings.workedOnMainReadings === false &&
                !!this._gasReadings.workedOnPreliminaryPerformanceReadings === false) {
                isEmpty = true;
            }
            return isEmpty;
        };
        GasSafety.prototype.setPerformanceReadingsQuestions = function () {
            if (this._gasReadings.workedOnPreliminaryPerformanceReadings === true) {
                this.gasSafetyViewModel.performanceTestsNotDoneReason = undefined;
                this.gasSafetyViewModel.applianceStripped = undefined;
                this.showPerformanceTestNotDoneReasons = false;
                this.showApplianceStripped = false;
                if (this._gasReadings.supplementaryBurnerFitted && this._gasReadings.workedOnSupplementaryPerformanceReadings === true) {
                    this.showPerformanceTestNotDoneReasonsForSupplementary = false;
                    this.showSupplementaryApplianceStripped = false;
                    this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
                    this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                }
            }
            else {
                if (this.gasSafetyViewModel.workedOnAppliance === true) {
                    this.obserPerformanceTestsNotDoneReason(this.gasSafetyViewModel.performanceTestsNotDoneReason, undefined, true);
                    this.obserApplianceStripped(this.gasSafetyViewModel.applianceStripped, undefined, true);
                    this.showPerformanceTestNotDoneReasons = true;
                    this.showApplianceStripped = true;
                    if (this._gasReadings.supplementaryBurnerFitted) {
                        this.showPerformanceTestNotDoneReasonsForSupplementary = true;
                        this.showSupplementaryApplianceStripped = true;
                        this.obserPerformanceTestsNotDoneReasonForSupplementary(this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary, undefined, true);
                        this.obserSupplementaryApplianceStripped(this.gasSafetyViewModel.supplementaryApplianceStripped, undefined, true);
                    }
                }
                else {
                    this.gasSafetyViewModel.performanceTestsNotDoneReason = undefined;
                    this.gasSafetyViewModel.applianceStripped = undefined;
                    this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
                    this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                    this.showPerformanceTestNotDoneReasons = false;
                    this.showApplianceStripped = false;
                    this.showPerformanceTestNotDoneReasonsForSupplementary = false;
                    this.showSupplementaryApplianceStripped = false;
                }
            }
        };
        GasSafety.prototype.resetLocalModels = function () {
            if (this.gasSafetyViewModel) {
                this.gasSafetyViewModel.applianceMake = undefined;
                this.gasSafetyViewModel.applianceModel = undefined;
                this.gasSafetyViewModel.workedOnAppliance = undefined;
                this.gasSafetyViewModel.applianceTightness = undefined;
                this.gasSafetyViewModel.ventSizeConfig = undefined;
                this.gasSafetyViewModel.chimneyInstallationAndTests = undefined;
                this.gasSafetyViewModel.safetyDevice = undefined;
                this.gasSafetyViewModel.didYouVisuallyCheck = undefined;
                this.gasSafetyViewModel.isApplianceSafe = undefined;
                this.gasSafetyViewModel.toCurrentStandards = undefined;
                this.gasSafetyViewModel.performanceTestsNotDoneReason = undefined;
                this.gasSafetyViewModel.applianceStripped = undefined;
                this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
                this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                this.gasSafetyViewModel.requestedToTest = undefined;
                this.gasSafetyViewModel.ableToTest = undefined;
                this.clearUnSafeSituationFields();
            }
            this.isSafe = undefined;
            this.disableApplianceSafe = false;
            this.showVisuallyCheckRelight = false;
            this.showApplianceSafe = false;
            this.showCurrentStandards = false;
            this.showApplianceTightnessOk = false;
            this.showVentSizeConfigOk = false;
            this.showSafetyDevice = false;
            this.showChimneyInstallationAndTests = false;
            this.showPerformanceTestNotDoneReasons = false;
            this.showApplianceStripped = false;
            this.showPerformanceTestNotDoneReasonsForSupplementary = false;
            this.showSupplementaryApplianceStripped = false;
            this.unsafeReasonFields = [];
        };
        GasSafety.prototype.clearForWorkOnAppliance = function (workedOnAppliance, onload) {
            this.removeObservables();
            this.gasSafetyViewModel.applianceTightness = undefined;
            this.gasSafetyViewModel.ventSizeConfig = undefined;
            this.gasSafetyViewModel.chimneyInstallationAndTests = undefined;
            this.gasSafetyViewModel.safetyDevice = undefined;
            this.gasSafetyViewModel.didYouVisuallyCheck = undefined;
            this.gasSafetyViewModel.isApplianceSafe = undefined;
            this.gasSafetyViewModel.toCurrentStandards = undefined;
            this.gasSafetyViewModel.performanceTestsNotDoneReason = undefined;
            this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
            this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
            this.clearUnSafeSituationFields();
            this.disableApplianceSafe = false;
            this.initGasSafetyStatus();
            this.setObservables();
            this.showVisuallyCheckRelight = true;
            this.showApplianceStripped = true;
            this.showApplianceTightnessOk = false;
            this.showVentSizeConfigOk = false;
            this.showSafetyDevice = false;
            this.showApplianceSafe = true;
            this.gasSafetyViewModel.overrideWorkedOnAppliance = true;
            this.updatePerformanceTestCarriedOutAndApplianceStripped(workedOnAppliance, onload);
        };
        GasSafety.prototype.clearUnSafeSituationFields = function () {
            this.unsafeReasonFields = [];
            if (this.gasUnsafeViewModel) {
                this.gasUnsafeViewModel.report = undefined;
                this.gasUnsafeViewModel.conditionAsLeft = undefined;
                this.gasUnsafeViewModel.cappedTurnedOff = undefined;
                this.gasUnsafeViewModel.labelAttachedRemoved = undefined;
                this.gasUnsafeViewModel.ownedByCustomer = undefined;
                this.gasUnsafeViewModel.letterLeft = undefined;
                this.gasUnsafeViewModel.signatureObtained = undefined;
            }
        };
        GasSafety.prototype.disableButtons = function (buttonItemList, options) {
            if (buttonItemList !== undefined) {
                buttonItemList.forEach(function (btn) {
                    btn.disabled = options.some(function (option) { return option === btn.value; });
                });
            }
        };
        GasSafety.prototype.obserConditionAsLeft = function (newValue, oldValue) {
            this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();
        };
        GasSafety.prototype.obserCappedTurnedOff = function (newValue, oldValue) {
            this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();
        };
        GasSafety.prototype.showUnsafeWarningMessage = function () {
            var _this = this;
            return this.gasUnsafeViewModel.conditionAsLeft
                && this.gasUnsafeViewModel.cappedTurnedOff
                && this.gasUnsafeViewModel.conditionAsLeft === this._conditionAsLeftImmediatelyDangerousOption
                && this._cappedTurnedOffOptionsForWarningMsg.some(function (c) { return _this.gasUnsafeViewModel.cappedTurnedOff === c; });
        };
        GasSafety.prototype.disableWorkedOnApplianceNoButton = function () {
            var _this = this;
            var disableNoButton = function (value) {
                _this.didYouWorkOnApplianceLookup.forEach(function (btn) {
                    if (btn.value === _this._didYouWorkOnApplianceNoOption) {
                        btn.disabled = value;
                    }
                });
            };
            if (this.gasSafetyViewModel.requestedToTest && this.gasSafetyViewModel.ableToTest) {
                this.gasSafetyViewModel.workedOnAppliance = true;
                disableNoButton(true);
            }
            else {
                disableNoButton(false);
            }
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Boolean)
        ], GasSafety.prototype, "showApplianceStripped", void 0);
        GasSafety = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, applianceService_1.ApplianceService, aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, aurelia_framework_1.BindingEngine, applianceGasSafetyFactory_1.ApplianceGasSafetyFactory),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, aurelia_framework_1.BindingEngine, Object])
        ], GasSafety);
        return GasSafety;
    }(editableViewModel_1.EditableViewModel));
    exports.GasSafety = GasSafety;
});

//# sourceMappingURL=gasSafety.js.map
