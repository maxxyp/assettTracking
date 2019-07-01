import { inject } from "aurelia-dependency-injection";
import { BusinessRuleService } from "../business/services/businessRuleService";
import { CatalogService } from "../business/services/catalogService";
import { IBusinessRuleService } from "../business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../business/services/interfaces/ICatalogService";
import { QueryableBusinessRuleGroup } from "../business/models/businessRules/queryableBusinessRuleGroup";
import { ApplianceSafetyType } from "../business/models/applianceSafetyType";
import { DataState } from "../business/models/dataState";
import { ApplianceElectricalSafetyDetail } from "../business/models/applianceElectricalSafetyDetail";
import { ApplianceGasReadingMaster } from "../business/models/applianceGasReadingMaster";
import { DataStateProvider } from "../business/models/dataStateProvider";
import { Job } from "../business/models/job";
import { Appliance } from "../business/models/appliance";
import { PropertySafetyType } from "../business/models/propertySafetyType";
import { IDataStateManager } from "./IDataStateManager";

@inject(BusinessRuleService, CatalogService)
// crap name - if we manage to centralise the dataState logic in here then we should call it something better
//  https://blog.codinghorror.com/i-shall-call-it-somethingmanager/
export class DataStateManager implements IDataStateManager {
    protected _businessRuleService: IBusinessRuleService;
    protected _catalogService: ICatalogService;

    constructor(businessRuleService: IBusinessRuleService,
                catalogService: ICatalogService) {

        this._businessRuleService = businessRuleService;
        this._catalogService = catalogService;
    }

    public updateAppliancesDataState(job: Job): Promise<void> {
        return Promise.map(job.history.appliances, appliance => this.updateApplianceDataState(appliance, job))
            .then(() => job.history.dataState = job.history.appliances && job.history.appliances.filter(appliance => appliance && !appliance.isDeleted && !appliance.isExcluded).length
                                                    ? DataState.valid
                                                    : DataState.notVisited)
            .thenReturn();
    }

    public updateApplianceDataState(appliance: Appliance, job: Job): Promise<void> {

        let getSafetyFlags = () => Promise.all([
            this._businessRuleService.getQueryableRuleGroup("applianceFactory"),
            this._catalogService.getObjectType(appliance.applianceType)
        ]).then(([ruleGroup, thisApplianceObjectType]) => {
            let applianceSafetyNotRequiredIndicator = ruleGroup.getBusinessRule<string>("applianceSafetyNotRequiredIndicator");

            // if no objectType then err on the side of caution and set safetyRequired to yes
            // todo: I think instprem check can be merged with with but not sure of implications

            // across the rest of the application
            let isSafetyRequiredForThisType = (!thisApplianceObjectType
                || (thisApplianceObjectType.applianceSafetyNotRequiredIndicator !== applianceSafetyNotRequiredIndicator));

            let liveTasks = (job.tasks || []).filter(t => !t.isNotDoingTask);

            let isInvolvedInCurrentJob =
                // is involved in a live task (or its parent is) ...
                liveTasks.some(t => t.applianceId === appliance.id || (appliance.parentId && t.applianceId === appliance.parentId))
                // ... or is a landlord job and a gas appliance
                || (job.isLandlordJob && appliance.applianceSafetyType === ApplianceSafetyType.gas);

            return {
                isInvolvedInCurrentJob,
                isSafetyRequired: isInvolvedInCurrentJob && isSafetyRequiredForThisType && !appliance.isInstPremAppliance,
                ruleGroup
            };
        });

        let setDontCareIfNotVisited = (d: DataStateProvider) => {
            if (d.dataState === DataState.notVisited) {
                d.dataState = DataState.dontCare;
            }
        };

        let setNotVisitedIfDontCare = (d: DataStateProvider) => {
            if (d.dataState === DataState.dontCare) {
                d.dataState = DataState.notVisited;
            }
        };

        let setNotVisitedIfNotAlreadyInvalid = (d: DataStateProvider) => {
            if (d.dataState !== DataState.invalid) {
                d.dataState = DataState.notVisited;
            }
        };

        let setApplianceDontCare = () => {
            appliance.dataState = DataState.dontCare;
            appliance.safety.applianceGasSafety.dataState = DataState.dontCare;
            appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;

            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.dontCare;
            appliance.safety.applianceOtherSafety.dataState = DataState.dontCare;
            return Promise.resolve();
        };

        let setApplianceDetails = (isSafetyRequired: boolean) => {
            // .WARNING: this method does not just set dataState properties
            //  the business model property isSafetyRequired is also set and used onwards in the application
            appliance.isSafetyRequired = isSafetyRequired;

            let safetyDataStateUpdateFn = isSafetyRequired ? setNotVisitedIfDontCare : setDontCareIfNotVisited;
            safetyDataStateUpdateFn(appliance);
        };

        let tryGasApplianceSafetyUpdating = (isSafetyRequired: boolean) => {

            if (appliance.applianceSafetyType !== ApplianceSafetyType.gas) {
                return false;
            }

            /* 1) applianceReadings and gasSafety are tightly linked and have an interplay between themselves
            in terms of dataState.  This interplay involves setting notVisited and dontCare dataStates to drive the user journey.
            If the engineer has entered some safety details for an appliance we cannot start flipping dontCare
            to notVisited and vice versa as part of this todays-work/not-todays-work switching logic in the generalSafetyUpdating() method */
            let isGasSafetyTouched = appliance.safety.applianceGasSafety
                                        && (appliance.safety.applianceGasSafety.workedOnAppliance !== undefined
                                            || appliance.safety.applianceGasSafety.dataState === DataState.invalid);

            let isReadingsTouched = ApplianceGasReadingMaster.isTouched(appliance.safety.applianceGasReadingsMaster);

            // 2) ensure the user fills in a required safety screen
            let isGasSafetyNotTouchedButStillRequired = !isGasSafetyTouched && isSafetyRequired;

            // 3) if an unsafe condition is present, but the user has not entered an unsafe report
            let isKnownUnsafeCondition = appliance.safety.applianceGasSafety.summaryPrelimLpgWarningTrigger
                || appliance.safety.applianceGasSafety.summarySuppLpgWarningTrigger
                || (appliance.safety.applianceGasReadingsMaster.preliminaryReadings
                        && appliance.safety.applianceGasReadingsMaster.preliminaryReadings.isUnsafeReadings)
                || (appliance.safety.applianceGasReadingsMaster.supplementaryReadings
                        && appliance.safety.applianceGasReadingsMaster.supplementaryReadings.isUnsafeReadings);

            let isUnsafeReportPresent = appliance.safety.applianceGasUnsafeDetail && appliance.safety.applianceGasUnsafeDetail.report;
            let isKnownUnsafeButNoReport = isKnownUnsafeCondition && !isUnsafeReportPresent;

            // 4) is flueType specified but not chimneyInstallationAndTests - this happens when flue type changes on the appliance screen
            //  so we need to redirect the user to the gasSafety screen
            let flueTypeHasChanged = appliance.safety.applianceGasSafety.workedOnAppliance
                                        && appliance.flueType
                                        && appliance.safety.applianceGasSafety.chimneyInstallationAndTests === undefined;

            // 5) landlord job but the applianceMake or applianceModel values have been cleared by the applianceDetails form gcCode field changing
            let certificateMakeAndModelRequired = isGasSafetyTouched
                                                    && job.isLandlordJob
                                                    && (!appliance.safety.applianceGasSafety.applianceMake || !appliance.safety.applianceGasSafety.applianceModel);

            // 6) if the user has completed a gas safety screen and then gone and cleared out the final reading ratio screen, the gasSafety.performanceTestsNotDoneReason is wiped out
            //  and the user must then be prompted to go to fill out the performanceTestsNotDoneReason on the gas safety screen
            let isPerformanceTestsNotDoneReasonRequired = isGasSafetyTouched
                                                            && appliance.safety.applianceGasSafety.workedOnAppliance
                                                            && appliance.safety.applianceGasSafety.performanceTestsNotDoneReason === undefined
                                                            && appliance.safety.applianceGasReadingsMaster.preliminaryReadings
                                                            && appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio === undefined;

             // 7) if the user has completed a gas safety screen and then gone and cleared out the supplementry final reading ratio screen,
             // the gasSafety.performanceTestsNotDoneReasonForSupplementary is wiped out and
             // the user must then be prompted to go to fill out the performanceTestsNotDoneReasonForSupplementary on the gas safety screen
            let isPerformanceTestsNotDoneReasonForSupplementryRequired = isGasSafetyTouched
                                                            && appliance.safety.applianceGasSafety.workedOnAppliance
                                                            && appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary === undefined
                                                            && appliance.safety.applianceGasReadingsMaster.supplementaryBurnerFitted
                                                            && appliance.safety.applianceGasReadingsMaster.supplementaryReadings
                                                            && appliance.safety.applianceGasReadingsMaster.supplementaryReadings.readingFinalRatio === undefined;

            // if any of the above conditions hold, then we handle dataState updating here
            let isSafetyHandledHere = isGasSafetyTouched
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

        let tryElectricalApplianceSafetyUpdating = (isSafetyRequired: boolean, ruleGroup: QueryableBusinessRuleGroup) => {
            if (appliance.applianceSafetyType !== ApplianceSafetyType.electrical) {
                return false;
            }
            // if the user has started entering some optional safety information for a safety-not-required, he/she
            //  must be allowed to clear the screen and leave the appliance as dontCare.  If we don't do this check the
            //  user is left having to complete the safety screen.
            let isThisASafetyNotRequiredBeingCleared = !isSafetyRequired
                && !ApplianceElectricalSafetyDetail.isTouched(appliance.safety.applianceElectricalSafetyDetail)
                && appliance.safety.applianceElectricalSafetyDetail.dataState === DataState.invalid;

            if (isThisASafetyNotRequiredBeingCleared) {
                appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.dontCare;
            }

            // if the user has completed a "electrical wiring" appliance safety report, but then goes to the property safety
            //  screen and changes the system type, we may either have a) an appliance safety page that is green but should not be
            //  or b) an appliance safety page that has an unsafe report based on property safety having an "unable to check" system type,
            //  but which has subsequently been change to e.g. TNS,
            let userNeedsToRevisitTheApplianceSafetyScreen =
                appliance.safety.applianceElectricalSafetyDetail.electricalApplianceType === ruleGroup.getBusinessRule<string>("electricalWiringElectricalApplianceType")
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

        let generalSafetyUpdating = (isSafetyRequired: boolean) => {
            // at this point scenario specific logic has fired, anything that is left is subject to
            // general switching between appliances for todays work and not todays work, i.e. when appliances
            //  are attached and detached from tasks.
            let safetyDataStateUpdateFn = isSafetyRequired ? setNotVisitedIfDontCare : setDontCareIfNotVisited;
            switch (appliance.applianceSafetyType) {
                case ApplianceSafetyType.electrical:
                    safetyDataStateUpdateFn(appliance.safety.applianceElectricalSafetyDetail);
                    break;
                case ApplianceSafetyType.gas:
                    safetyDataStateUpdateFn(appliance.safety.applianceGasSafety);
                    safetyDataStateUpdateFn(appliance.safety.applianceGasReadingsMaster);
                    break;
                case ApplianceSafetyType.other:
                    safetyDataStateUpdateFn(appliance.safety.applianceOtherSafety);
                    break;
                default:
                    break;
            }
        };

        return appliance.isDeleted || appliance.isExcluded
                ? setApplianceDontCare()
                : getSafetyFlags()
                    .then(safetyFlags => {

                        setApplianceDetails(safetyFlags.isInvolvedInCurrentJob);
                        // run through the rules, if one applies don't run the rest
                        return tryGasApplianceSafetyUpdating(safetyFlags.isSafetyRequired)
                                || tryElectricalApplianceSafetyUpdating(safetyFlags.isSafetyRequired, safetyFlags.ruleGroup)
                                || generalSafetyUpdating(safetyFlags.isSafetyRequired);
                    })
                    .thenReturn();
    }

    public updatePropertySafetyDataState(job: Job): void {

        let setNotVisitedIfDontCare = (dataStateProvider: DataStateProvider) => {
            if (dataStateProvider && dataStateProvider.dataState === DataState.dontCare) {
                dataStateProvider.dataState = DataState.notVisited;
            }
        };

        let setDontCare = (dataStateProvider: DataStateProvider) => {
            if (dataStateProvider) {
                dataStateProvider.dataState = DataState.dontCare;
            }
        };

        let setNotVisitedIfValid = (dataStateProvider: DataStateProvider) => {
            if (dataStateProvider && dataStateProvider.dataState === DataState.valid) {
                dataStateProvider.dataState = DataState.notVisited;
            }
        };

        switch (job.propertySafetyType) {
            case PropertySafetyType.gas:
                setNotVisitedIfDontCare(job.propertySafety.propertyGasSafetyDetail);
                setDontCare(job.propertySafety.propertyElectricalSafetyDetail);
            break;
            case PropertySafetyType.electrical:
                setDontCare(job.propertySafety.propertyGasSafetyDetail);
                setNotVisitedIfDontCare(job.propertySafety.propertyElectricalSafetyDetail);
            break;
            default:
            break;
        }

        // edge case: if we are reinstating a job to be a landord job, the taskService may have had to clear
        //  gasMeterInstallationSatisfactory, so we need to ensure it is revisited
        if (job.isLandlordJob
            && job.propertySafetyType === PropertySafetyType.gas
            && job.propertySafety
            && job.propertySafety.propertyGasSafetyDetail
            && !job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory) {
                setNotVisitedIfValid(job.propertySafety.propertyGasSafetyDetail);
            }

    }
}
