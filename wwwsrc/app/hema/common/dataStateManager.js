var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dependency-injection", "../business/services/businessRuleService", "../business/services/catalogService", "../business/models/applianceSafetyType", "../business/models/dataState", "../business/models/applianceElectricalSafetyDetail", "../business/models/applianceGasReadingMaster", "../business/models/propertySafetyType"], function (require, exports, aurelia_dependency_injection_1, businessRuleService_1, catalogService_1, applianceSafetyType_1, dataState_1, applianceElectricalSafetyDetail_1, applianceGasReadingMaster_1, propertySafetyType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataStateManager = /** @class */ (function () {
        function DataStateManager(businessRuleService, catalogService) {
            this._businessRuleService = businessRuleService;
            this._catalogService = catalogService;
        }
        DataStateManager.prototype.updateAppliancesDataState = function (job) {
            var _this = this;
            return Promise.map(job.history.appliances, function (appliance) { return _this.updateApplianceDataState(appliance, job); })
                .then(function () { return job.history.dataState = job.history.appliances && job.history.appliances.filter(function (appliance) { return appliance && !appliance.isDeleted && !appliance.isExcluded; }).length
                ? dataState_1.DataState.valid
                : dataState_1.DataState.notVisited; })
                .thenReturn();
        };
        DataStateManager.prototype.updateApplianceDataState = function (appliance, job) {
            var _this = this;
            var getSafetyFlags = function () { return Promise.all([
                _this._businessRuleService.getQueryableRuleGroup("applianceFactory"),
                _this._catalogService.getObjectType(appliance.applianceType)
            ]).then(function (_a) {
                var ruleGroup = _a[0], thisApplianceObjectType = _a[1];
                var applianceSafetyNotRequiredIndicator = ruleGroup.getBusinessRule("applianceSafetyNotRequiredIndicator");
                // if no objectType then err on the side of caution and set safetyRequired to yes
                // todo: I think instprem check can be merged with with but not sure of implications
                // across the rest of the application
                var isSafetyRequiredForThisType = (!thisApplianceObjectType
                    || (thisApplianceObjectType.applianceSafetyNotRequiredIndicator !== applianceSafetyNotRequiredIndicator));
                var liveTasks = (job.tasks || []).filter(function (t) { return !t.isNotDoingTask; });
                var isInvolvedInCurrentJob = 
                // is involved in a live task (or its parent is) ...
                liveTasks.some(function (t) { return t.applianceId === appliance.id || (appliance.parentId && t.applianceId === appliance.parentId); })
                    // ... or is a landlord job and a gas appliance
                    || (job.isLandlordJob && appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.gas);
                return {
                    isInvolvedInCurrentJob: isInvolvedInCurrentJob,
                    isSafetyRequired: isInvolvedInCurrentJob && isSafetyRequiredForThisType && !appliance.isInstPremAppliance,
                    ruleGroup: ruleGroup
                };
            }); };
            var setDontCareIfNotVisited = function (d) {
                if (d.dataState === dataState_1.DataState.notVisited) {
                    d.dataState = dataState_1.DataState.dontCare;
                }
            };
            var setNotVisitedIfDontCare = function (d) {
                if (d.dataState === dataState_1.DataState.dontCare) {
                    d.dataState = dataState_1.DataState.notVisited;
                }
            };
            var setNotVisitedIfNotAlreadyInvalid = function (d) {
                if (d.dataState !== dataState_1.DataState.invalid) {
                    d.dataState = dataState_1.DataState.notVisited;
                }
            };
            var setApplianceDontCare = function () {
                appliance.dataState = dataState_1.DataState.dontCare;
                appliance.safety.applianceGasSafety.dataState = dataState_1.DataState.dontCare;
                appliance.safety.applianceGasReadingsMaster.dataState = dataState_1.DataState.dontCare;
                appliance.safety.applianceElectricalSafetyDetail.dataState = dataState_1.DataState.dontCare;
                appliance.safety.applianceOtherSafety.dataState = dataState_1.DataState.dontCare;
                return Promise.resolve();
            };
            var setApplianceDetails = function (isSafetyRequired) {
                // .WARNING: this method does not just set dataState properties
                //  the business model property isSafetyRequired is also set and used onwards in the application
                appliance.isSafetyRequired = isSafetyRequired;
                var safetyDataStateUpdateFn = isSafetyRequired ? setNotVisitedIfDontCare : setDontCareIfNotVisited;
                safetyDataStateUpdateFn(appliance);
            };
            var tryGasApplianceSafetyUpdating = function (isSafetyRequired) {
                if (appliance.applianceSafetyType !== applianceSafetyType_1.ApplianceSafetyType.gas) {
                    return false;
                }
                /* 1) applianceReadings and gasSafety are tightly linked and have an interplay between themselves
                in terms of dataState.  This interplay involves setting notVisited and dontCare dataStates to drive the user journey.
                If the engineer has entered some safety details for an appliance we cannot start flipping dontCare
                to notVisited and vice versa as part of this todays-work/not-todays-work switching logic in the generalSafetyUpdating() method */
                var isGasSafetyTouched = appliance.safety.applianceGasSafety
                    && (appliance.safety.applianceGasSafety.workedOnAppliance !== undefined
                        || appliance.safety.applianceGasSafety.dataState === dataState_1.DataState.invalid);
                var isReadingsTouched = applianceGasReadingMaster_1.ApplianceGasReadingMaster.isTouched(appliance.safety.applianceGasReadingsMaster);
                // 2) ensure the user fills in a required safety screen
                var isGasSafetyNotTouchedButStillRequired = !isGasSafetyTouched && isSafetyRequired;
                // 3) if an unsafe condition is present, but the user has not entered an unsafe report
                var isKnownUnsafeCondition = appliance.safety.applianceGasSafety.summaryPrelimLpgWarningTrigger
                    || appliance.safety.applianceGasSafety.summarySuppLpgWarningTrigger
                    || (appliance.safety.applianceGasReadingsMaster.preliminaryReadings
                        && appliance.safety.applianceGasReadingsMaster.preliminaryReadings.isUnsafeReadings)
                    || (appliance.safety.applianceGasReadingsMaster.supplementaryReadings
                        && appliance.safety.applianceGasReadingsMaster.supplementaryReadings.isUnsafeReadings);
                var isUnsafeReportPresent = appliance.safety.applianceGasUnsafeDetail && appliance.safety.applianceGasUnsafeDetail.report;
                var isKnownUnsafeButNoReport = isKnownUnsafeCondition && !isUnsafeReportPresent;
                // 4) is flueType specified but not chimneyInstallationAndTests - this happens when flue type changes on the appliance screen
                //  so we need to redirect the user to the gasSafety screen
                var flueTypeHasChanged = appliance.safety.applianceGasSafety.workedOnAppliance
                    && appliance.flueType
                    && appliance.safety.applianceGasSafety.chimneyInstallationAndTests === undefined;
                // 5) landlord job but the applianceMake or applianceModel values have been cleared by the applianceDetails form gcCode field changing
                var certificateMakeAndModelRequired = isGasSafetyTouched
                    && job.isLandlordJob
                    && (!appliance.safety.applianceGasSafety.applianceMake || !appliance.safety.applianceGasSafety.applianceModel);
                // 6) if the user has completed a gas safety screen and then gone and cleared out the final reading ratio screen, the gasSafety.performanceTestsNotDoneReason is wiped out
                //  and the user must then be prompted to go to fill out the performanceTestsNotDoneReason on the gas safety screen
                var isPerformanceTestsNotDoneReasonRequired = isGasSafetyTouched
                    && appliance.safety.applianceGasSafety.workedOnAppliance
                    && appliance.safety.applianceGasSafety.performanceTestsNotDoneReason === undefined
                    && appliance.safety.applianceGasReadingsMaster.preliminaryReadings
                    && appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio === undefined;
                // 7) if the user has completed a gas safety screen and then gone and cleared out the supplementry final reading ratio screen,
                // the gasSafety.performanceTestsNotDoneReasonForSupplementary is wiped out and
                // the user must then be prompted to go to fill out the performanceTestsNotDoneReasonForSupplementary on the gas safety screen
                var isPerformanceTestsNotDoneReasonForSupplementryRequired = isGasSafetyTouched
                    && appliance.safety.applianceGasSafety.workedOnAppliance
                    && appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary === undefined
                    && appliance.safety.applianceGasReadingsMaster.supplementaryBurnerFitted
                    && appliance.safety.applianceGasReadingsMaster.supplementaryReadings
                    && appliance.safety.applianceGasReadingsMaster.supplementaryReadings.readingFinalRatio === undefined;
                // if any of the above conditions hold, then we handle dataState updating here
                var isSafetyHandledHere = isGasSafetyTouched
                    || isReadingsTouched
                    || isGasSafetyNotTouchedButStillRequired
                    || isKnownUnsafeButNoReport
                    || flueTypeHasChanged
                    || certificateMakeAndModelRequired
                    || isPerformanceTestsNotDoneReasonRequired
                    || isPerformanceTestsNotDoneReasonForSupplementryRequired;
                if (isSafetyHandledHere) {
                    if ((isReadingsTouched && !appliance.safety.applianceGasSafety.workedOnAppliance)
                        || isGasSafetyNotTouchedButStillRequired
                        || isKnownUnsafeButNoReport
                        || flueTypeHasChanged
                        || certificateMakeAndModelRequired
                        || isPerformanceTestsNotDoneReasonRequired
                        || isPerformanceTestsNotDoneReasonForSupplementryRequired) {
                        setNotVisitedIfNotAlreadyInvalid(appliance.safety.applianceGasSafety);
                    }
                    // we are in condition 1), the gas safety has been entered but potentially nothing on the readings
                    if (appliance.safety.applianceGasSafety.workedOnAppliance && !isReadingsTouched) {
                        setNotVisitedIfNotAlreadyInvalid(appliance.safety.applianceGasReadingsMaster);
                    }
                }
                return isSafetyHandledHere;
            };
            var tryElectricalApplianceSafetyUpdating = function (isSafetyRequired, ruleGroup) {
                if (appliance.applianceSafetyType !== applianceSafetyType_1.ApplianceSafetyType.electrical) {
                    return false;
                }
                // if the user has started entering some optional safety information for a safety-not-required, he/she
                //  must be allowed to clear the screen and leave the appliance as dontCare.  If we don't do this check the
                //  user is left having to complete the safety screen.
                var isThisASafetyNotRequiredBeingCleared = !isSafetyRequired
                    && !applianceElectricalSafetyDetail_1.ApplianceElectricalSafetyDetail.isTouched(appliance.safety.applianceElectricalSafetyDetail)
                    && appliance.safety.applianceElectricalSafetyDetail.dataState === dataState_1.DataState.invalid;
                if (isThisASafetyNotRequiredBeingCleared) {
                    appliance.safety.applianceElectricalSafetyDetail.dataState = dataState_1.DataState.dontCare;
                }
                // if the user has completed a "electrical wiring" appliance safety report, but then goes to the property safety
                //  screen and changes the system type, we may either have a) an appliance safety page that is green but should not be
                //  or b) an appliance safety page that has an unsafe report based on property safety having an "unable to check" system type,
                //  but which has subsequently been change to e.g. TNS,
                var userNeedsToRevisitTheApplianceSafetyScreen = appliance.safety.applianceElectricalSafetyDetail.electricalApplianceType === ruleGroup.getBusinessRule("electricalWiringElectricalApplianceType")
                    && appliance.safety.applianceElectricalSafetyDetail.systemType
                    && job.propertySafety
                    && job.propertySafety.propertyElectricalSafetyDetail
                    && job.propertySafety.propertyElectricalSafetyDetail.systemType
                    && job.propertySafety.propertyElectricalSafetyDetail.systemType !== appliance.safety.applianceElectricalSafetyDetail.systemType;
                if (userNeedsToRevisitTheApplianceSafetyScreen) {
                    setNotVisitedIfNotAlreadyInvalid(appliance.safety.applianceElectricalSafetyDetail);
                }
                return isThisASafetyNotRequiredBeingCleared || userNeedsToRevisitTheApplianceSafetyScreen;
            };
            var generalSafetyUpdating = function (isSafetyRequired) {
                // at this point scenario specific logic has fired, anything that is left is subject to
                // general switching between appliances for todays work and not todays work, i.e. when appliances
                //  are attached and detached from tasks.
                var safetyDataStateUpdateFn = isSafetyRequired ? setNotVisitedIfDontCare : setDontCareIfNotVisited;
                switch (appliance.applianceSafetyType) {
                    case applianceSafetyType_1.ApplianceSafetyType.electrical:
                        safetyDataStateUpdateFn(appliance.safety.applianceElectricalSafetyDetail);
                        break;
                    case applianceSafetyType_1.ApplianceSafetyType.gas:
                        safetyDataStateUpdateFn(appliance.safety.applianceGasSafety);
                        safetyDataStateUpdateFn(appliance.safety.applianceGasReadingsMaster);
                        break;
                    case applianceSafetyType_1.ApplianceSafetyType.other:
                        safetyDataStateUpdateFn(appliance.safety.applianceOtherSafety);
                        break;
                    default:
                        break;
                }
            };
            return appliance.isDeleted || appliance.isExcluded
                ? setApplianceDontCare()
                : getSafetyFlags()
                    .then(function (safetyFlags) {
                    setApplianceDetails(safetyFlags.isInvolvedInCurrentJob);
                    // run through the rules, if one applies don't run the rest
                    return tryGasApplianceSafetyUpdating(safetyFlags.isSafetyRequired)
                        || tryElectricalApplianceSafetyUpdating(safetyFlags.isSafetyRequired, safetyFlags.ruleGroup)
                        || generalSafetyUpdating(safetyFlags.isSafetyRequired);
                })
                    .thenReturn();
        };
        DataStateManager.prototype.updatePropertySafetyDataState = function (job) {
            var setNotVisitedIfDontCare = function (dataStateProvider) {
                if (dataStateProvider && dataStateProvider.dataState === dataState_1.DataState.dontCare) {
                    dataStateProvider.dataState = dataState_1.DataState.notVisited;
                }
            };
            var setDontCare = function (dataStateProvider) {
                if (dataStateProvider) {
                    dataStateProvider.dataState = dataState_1.DataState.dontCare;
                }
            };
            var setNotVisitedIfValid = function (dataStateProvider) {
                if (dataStateProvider && dataStateProvider.dataState === dataState_1.DataState.valid) {
                    dataStateProvider.dataState = dataState_1.DataState.notVisited;
                }
            };
            switch (job.propertySafetyType) {
                case propertySafetyType_1.PropertySafetyType.gas:
                    setNotVisitedIfDontCare(job.propertySafety.propertyGasSafetyDetail);
                    setDontCare(job.propertySafety.propertyElectricalSafetyDetail);
                    break;
                case propertySafetyType_1.PropertySafetyType.electrical:
                    setDontCare(job.propertySafety.propertyGasSafetyDetail);
                    setNotVisitedIfDontCare(job.propertySafety.propertyElectricalSafetyDetail);
                    break;
                default:
                    break;
            }
            // edge case: if we are reinstating a job to be a landord job, the taskService may have had to clear
            //  gasMeterInstallationSatisfactory, so we need to ensure it is revisited
            if (job.isLandlordJob
                && job.propertySafetyType === propertySafetyType_1.PropertySafetyType.gas
                && job.propertySafety
                && job.propertySafety.propertyGasSafetyDetail
                && !job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory) {
                setNotVisitedIfValid(job.propertySafety.propertyGasSafetyDetail);
            }
        };
        DataStateManager = __decorate([
            aurelia_dependency_injection_1.inject(businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService)
            // crap name - if we manage to centralise the dataState logic in here then we should call it something better
            //  https://blog.codinghorror.com/i-shall-call-it-somethingmanager/
            ,
            __metadata("design:paramtypes", [Object, Object])
        ], DataStateManager);
        return DataStateManager;
    }());
    exports.DataStateManager = DataStateManager;
});

//# sourceMappingURL=dataStateManager.js.map
