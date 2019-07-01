import { inject, BindingEngine } from "aurelia-framework";
import { Redirect } from "aurelia-router";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { CatalogService } from "../../../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { EditableViewModel } from "../../models/editableViewModel";
import { ElectricalSafetyViewModel } from "./viewModels/electricalSafetyViewModel";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { ApplianceService } from "../../../business/services/applianceService";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { PropertySafetyService } from "../../../business/services/propertySafetyService";
import { IPropertySafetyService } from "../../../business/services/interfaces/IPropertySafetyService";
import { IApplianceSafetyFactory } from "../../factories/interfaces/IApplianceSafetyFactory";
import { ApplianceSafetyFactory } from "../../factories/applianceSafetyFactory";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { IElectricalApplianceType } from "../../../business/models/reference/IElectricalApplianceType";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { ISftyReasonCat } from "../../../business/models/reference/ISftyReasonCat";
import { ISftyReadingCat } from "../../../business/models/reference/ISftyReadingCat";
import {AppliancePageHelper} from "./appliancePageHelper";
import { BusinessRulesViewModel } from "../../models/businessRulesViewModel";

@inject(JobService, EngineerService, LabelService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService,
    BindingEngine, ApplianceService, PropertySafetyService, ApplianceSafetyFactory)
export class ElectricalSafety extends EditableViewModel {

    public viewModel: ElectricalSafetyViewModel;

    public jobTypeCatalog: IElectricalApplianceType[];
    public mainEarthCheckedLookup: ButtonListItem[];
    public gasBondingCheckedLookup: ButtonListItem[];
    public waterBondingCheckedLookup: ButtonListItem[];
    public otherBondingCheckedLookup: ButtonListItem[];
    public supplementaryBondingOrFullRcdProtectionCheckedLookup: ButtonListItem[];
    public ringContinuityReadingDoneLookup: ButtonListItem[];
    public readingSafeAccordingToTopsLookup: ButtonListItem[];
    public isRcdPresentLookup: ButtonListItem[];

    public leInsulationResistanceReasonWhyNotLookup: ButtonListItem[];
    public neInsulationResistanceReasonWhyNotLookup: ButtonListItem[];
    public lnInsulationResistanceReasonWhyNotLookup: ButtonListItem[];

    public finalEliReadingDoneLookup: ButtonListItem[];
    public circuitRcdRcboProtectedLookup: ButtonListItem[];
    public applianceEarthContinuityReadingDoneLookup: ButtonListItem[];
    public mcbFuseRatingCatalog: ISftyReadingCat[];
    public mcbFuseRatingReasonWhyNotLookup: ButtonListItem[];
    public applianceFuseRatingCatalog: ISftyReadingCat[];
    public applianceFuseRatingReasonWhyNotLookup: ButtonListItem[];

    public isPartPLookup: ButtonListItem[];
    public partPReasonCatalog: ISftyReasonCat[];
    public microwaveLeakageReadingReasonWhyNotLookup: ButtonListItem[];

    public isApplianceHardWiredLookup: ButtonListItem[];
    public workedOnLightingCircuitLookup: ButtonListItem[];
    public cpcInLightingCircuitOkLookup: ButtonListItem[];
    public installationSatisfactoryLookup: ButtonListItem[];
    public applianceSafeLookup: ButtonListItem[];
    public applianceInstallationSatisfactoryLookup: ButtonListItem[];

    public conditionAsLeftLookup: ButtonListItem[];
    public cappedTurnedOffLookup: ButtonListItem[];
    public labelAttachedRemovedLookup: ButtonListItem[];
    public ownedByCustomerLookup: ButtonListItem[];
    public letterLeftLookup: ButtonListItem[];
    public signatureObtainedLookup: ButtonListItem[];

    private _applianceId: string;
    private _bindingEngine: BindingEngine;
    private _propertySubscriptions: Subscription[];
    private _applianceService: IApplianceService;
    private _propertySafetyService: IPropertySafetyService;
    private _applianceSafetyFactory: IApplianceSafetyFactory;

    public constructor(
        jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        catalogService: ICatalogService,
        bindingEngine: BindingEngine,
        applianceService: IApplianceService,
        propertySafetyService: IPropertySafetyService,
        applianceSafetyFactory: IApplianceSafetyFactory) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._bindingEngine = bindingEngine;
        this._propertySubscriptions = [];
        this._applianceService = applianceService;
        this._propertySafetyService = propertySafetyService;
        this._applianceSafetyFactory = applianceSafetyFactory;

        this.validationRules = {};
    }

    public canActivateAsync(...rest: any[]): Promise<boolean | Redirect> {
        return AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
    }

    public activateAsync(params: { applianceId: string, jobId: string }): Promise<any> {
        this._applianceId = params.applianceId;

        if (this._isCleanInstance) {
            return this.loadBusinessRules()
                .then(() => this.loadCatalogs())
                .then(() => this.load())
                .then(() => this.buildValidationRules())
                .then(() => this.showContent());
        } else {
            return this.load();
        }
    }

    public deactivateAsync(): Promise<void> {
        this.disposeSubscriptions();
        return Promise.resolve();
    }

    public toggleLeInsulationResistanceShowReasonWhyNot(): Promise<void> {
        this.viewModel.showLeInsulationResistanceReasonWhyNot = !this.viewModel.showLeInsulationResistanceReasonWhyNot;
        return this.validateAllRules();
    }

    public toggleNeInsulationResistanceShowReasonWhyNot(): Promise<void> {
        this.viewModel.showNeInsulationResistanceReasonWhyNot = !this.viewModel.showNeInsulationResistanceReasonWhyNot;
        return this.validateAllRules();
    }

    public toggleLnInsulationResistanceShowReasonWhyNot(): Promise<void> {
        this.viewModel.showLnInsulationResistanceReasonWhyNot = !this.viewModel.showLnInsulationResistanceReasonWhyNot;
        return this.validateAllRules();
    }

    public toggleMcbFuseRatingShowReasonWhyNot(): Promise<void> {
        this.viewModel.showMcbFuseRatingReasonWhyNot = !this.viewModel.showMcbFuseRatingReasonWhyNot;
        return this.validateAllRules();
    }

    public toggleApplianceFuseRatingShowReasonWhyNot(): Promise<void> {
        this.viewModel.showApplianceFuseRatingReasonWhyNot = !this.viewModel.showApplianceFuseRatingReasonWhyNot;
        return this.validateAllRules();
    }

    public toggleMicrowaveLeakageReadingShowReasonWhyNot(): Promise<void> {
        this.viewModel.showMicrowaveLeakageReadingReasonWhyNot = !this.viewModel.showMicrowaveLeakageReadingReasonWhyNot;
        return this.validateAllRules();
    }

    protected loadModel(): Promise<void> {
        return this._applianceService.getApplianceSafetyDetails(this.jobId, this._applianceId)
            .then((applianceSafety) => {
                if (applianceSafety && (applianceSafety.applianceElectricalSafetyDetail || applianceSafety.applianceElectricalUnsafeDetail)) {
                    // there are some safety info already there, load those
                    this.viewModel = this._applianceSafetyFactory.createElectricalSafetyViewModel(applianceSafety, this.businessRules);
                    this.initialiseViewModel();
                    this.setInitialDataState(applianceSafety.applianceElectricalSafetyDetail.dataStateId, applianceSafety.applianceElectricalSafetyDetail.dataState);
                } else {
                    this.viewModel = new ElectricalSafetyViewModel(this.businessRules);
                    this.initialiseViewModel();
                    this.setNewDataState("appliances");
                }

                return this._propertySafetyService.getPropertySafetyDetails(this.jobId);
            })
            .then((propertySafety) => {
                // get the property safety info and save it to local
                if (propertySafety && propertySafety.propertyElectricalSafetyDetail) {
                    this.viewModel.systemType = propertySafety.propertyElectricalSafetyDetail.systemType;
                }

                return this._applianceService.getAppliance(this.jobId, this._applianceId);
            })
            .then((appliance) => {
                // get the type of appliance to figure out the type e.g. Electrical, whiteGoods, Microwave etc
                return this._catalogService.getApplianceElectricalType(appliance.applianceType);
            })
            .then((applianceElectricalType) => {
                if (applianceElectricalType && !this.viewModel.electricalApplianceType) {
                    this.viewModel.electricalApplianceType = applianceElectricalType.applianceElectricalType;
                }
            });
    }

    protected saveModel(): Promise<void> {
        let applianceElectricalSafetyDetail = this._applianceSafetyFactory.createApplianceElectricalSafetyDetail(this.viewModel);
        let applianceElectricalUnsafeDetail = this._applianceSafetyFactory.createApplianceElectricalUnsafeDetail(this.viewModel);

        applianceElectricalSafetyDetail.dataState = this.getFinalDataState();

        return this._applianceService.saveElectricalSafetyDetails(this.jobId, this._applianceId, applianceElectricalSafetyDetail, applianceElectricalUnsafeDetail, this._isDirty);
    }

    protected clearModel(): Promise<void> {
        let systemType = this.viewModel.systemType;
        let electricalApplianceType = this.viewModel.electricalApplianceType;

        this.viewModel = new ElectricalSafetyViewModel(this.businessRules);
        this.initialiseViewModel();
        this.viewModel.systemType = systemType;
        this.viewModel.electricalApplianceType = electricalApplianceType;

        return this.buildValidationRules();
    }

    private initialiseViewModel(): void {
        this.disposeSubscriptions();

        this.viewModel.getPropertiesToBind().forEach(propertyKey => {
            this._propertySubscriptions.push(this._bindingEngine
                .propertyObserver(this.viewModel, propertyKey)
                .subscribe((newValue, oldValue) => {
                    this.viewModel.recalculateflowState(propertyKey);
                }));
        });

        this._propertySubscriptions.push(this._bindingEngine
            .propertyObserver(this.viewModel, "availableConditionAsLefts")
            .subscribe((newValue, oldValue) => {
                this.handleAvailableConditionAsLeftsChanged();
            })
        );

        this._propertySubscriptions.push(this._bindingEngine
            .propertyObserver(this.viewModel, "availableLabelAttachedRemovedLookups")
            .subscribe((newValue, oldValue) => {
                this.handleAvailableLabelAttachedRemovedChanged();
            })
        );

        this._propertySubscriptions.push(this._bindingEngine
            .propertyObserver(this.viewModel, "unsafeReasons")
            .subscribe((newValue, oldValue) => {
                this.handleUnsafeReasonChanged(newValue, oldValue);
            })
        );

        this.viewModel.recalculateflowState();
    }

    private handleAvailableLabelAttachedRemovedChanged(): void {
                this.labelAttachedRemovedLookup.forEach(btn => {
           btn.disabled = !this.viewModel.availableLabelAttachedRemovedLookups.some(a => btn.value === a);
                });
    }

    private handleAvailableConditionAsLeftsChanged(): void {
        this.conditionAsLeftLookup.forEach(btn => {
            btn.disabled = !this.viewModel.availableConditionAsLefts.some(a => btn.value === a);
        });
    }

    private handleUnsafeReasonChanged(newValues: { field: string, mandatory: boolean }[], oldValues: { field: string, mandatory: boolean }[]): void {
        let showWarning = (key: string) => this.showWarning(
            this.getLabel("unsafeSituation"),
            this.getLabel(key + "Unsafe"),
            null,
            this.getBusinessRule<number>("unsafeToastDismissTime"));

        newValues.filter(newValue => !oldValues.some(oldValue => oldValue.field === newValue.field && !!newValue.mandatory === !!oldValue.mandatory))
            .forEach(newValue => showWarning(newValue.field));

    }

    private disposeSubscriptions(): void {
        if (this._propertySubscriptions) {
            this._propertySubscriptions.forEach(subscription => subscription.dispose());
            this._propertySubscriptions = [];
        }
    }

    private loadCatalogs(): Promise<void> {

        let catalogPromises = [
            this.buildYesNoList()
                .then(btns => this.isApplianceHardWiredLookup = btns),
            this.buildYesNoList()
                .then(btns => this.workedOnLightingCircuitLookup = btns),
            this.buildYesNoList()
                .then(btns => this.cpcInLightingCircuitOkLookup = btns),
            this.buildYesNoList()
                .then(btns => this.installationSatisfactoryLookup = btns),
            this.buildYesNoList()
                .then(btns => this.applianceSafeLookup = btns),
            this.buildYesNoList()
                .then(btns => this.applianceInstallationSatisfactoryLookup = btns),
            this.buildYesNoList()
                .then(btns => this.readingSafeAccordingToTopsLookup = btns),
            this.buildYesNoList()
                .then(btns => this.isRcdPresentLookup = btns),
            this.buildYesNoList()
                .then(btns => this.ownedByCustomerLookup = btns),
            this.buildYesNoList()
                .then(btns => this.letterLeftLookup = btns),
            this.buildYesNoList()
                .then(btns => this.signatureObtainedLookup = btns),
            this.buildYesNoList()
                .then(btns => this.isPartPLookup = btns),
            this.buildYesNoList()
                .then(btns => this.finalEliReadingDoneLookup = btns),
            this.buildYesNoList()
                .then(btns => this.applianceEarthContinuityReadingDoneLookup = btns),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_LE_RESISTANCE_TAKEN)
                .then(safetyNoticeTypes => {
                    this.leInsulationResistanceReasonWhyNotLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_NE_RESISTANCE_TAKEN)
                .then(safetyNoticeTypes => {
                    this.neInsulationResistanceReasonWhyNotLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_LN_RESISTANCE_TAKEN)
                .then(safetyNoticeTypes => {
                    this.lnInsulationResistanceReasonWhyNotLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_CIRCUIT_PROTECT)
                .then(safetyNoticeTypes => {
                    this.circuitRcdRcboProtectedLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getYesNoNotCheckeds()
                .then(catalog => {
                    this.mainEarthCheckedLookup =
                        this.toButtonListItemArray(catalog, CatalogConstants.YES_NO_NOTCHECKED_ID, CatalogConstants.YES_NO_NOTCHECKED_DESCRIPTION);
                }),

            this._catalogService.getYesNoNotCheckeds()
                .then(catalog => {
                    this.gasBondingCheckedLookup =
                        this.toButtonListItemArray(catalog, CatalogConstants.YES_NO_NOTCHECKED_ID, CatalogConstants.YES_NO_NOTCHECKED_DESCRIPTION);
                }),

            this._catalogService.getYesNoNotCheckeds()
                .then(catalog => {
                    this.waterBondingCheckedLookup =
                        this.toButtonListItemArray(catalog, CatalogConstants.YES_NO_NOTCHECKED_ID, CatalogConstants.YES_NO_NOTCHECKED_DESCRIPTION);
                }),

            this._catalogService.getYesNoNotCheckedNas()
                .then(catalog => {
                    this.otherBondingCheckedLookup =
                        this.toButtonListItemArray(catalog, CatalogConstants.YES_NO_NOTCHECKED_NA_ID, CatalogConstants.YES_NO_NOTCHECKED_NA_DESCRIPTION);
                }),

            this._catalogService.getYesNoNotCheckedNas()
                .then(catalog => {
                    this.supplementaryBondingOrFullRcdProtectionCheckedLookup =
                        this.toButtonListItemArray(catalog, CatalogConstants.YES_NO_NOTCHECKED_NA_ID, CatalogConstants.YES_NO_NOTCHECKED_NA_DESCRIPTION);
                }),

            this._catalogService.getPassFailNas()
                .then(catalog => {
                    this.ringContinuityReadingDoneLookup =
                        this.toButtonListItemArray(catalog, CatalogConstants.PASS_FAIL_NA_ID, CatalogConstants.PASS_FAIL_NA_DESCRIPTION);
                }),

            this._catalogService.getSafetyNoticeTypes()
                .then(safetyNoticeTypes => {
                    this.conditionAsLeftLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_NOTICE_TYPE_ID, CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
                }),

            this._catalogService.getSafetyActions()
                .then(safetyActions => {
                    this.cappedTurnedOffLookup =
                        this.toButtonListItemArray(safetyActions, CatalogConstants.SAFETY_ACTION_ID, CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),

            this._catalogService.getSafetyNoticeStatuses()
                .then(safetyNoticeStatus => {
                    this.labelAttachedRemovedLookup =
                        this.toButtonListItemArray(safetyNoticeStatus, CatalogConstants.SAFETY_NOTICE_STATUS_ID, CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_MCB_FUSE_RAT_NOT_CHKD_REAS)
                .then(safetyNoticeTypes => {
                    this.mcbFuseRatingReasonWhyNotLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_APPLN_FUSE_RAT_NOT_CHKD_REAS)
                .then(safetyNoticeTypes => {
                    this.applianceFuseRatingReasonWhyNotLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_LEAKAGE_TEST_NOT_DONE_REAS)
                .then(safetyNoticeTypes => {
                    this.microwaveLeakageReadingReasonWhyNotLookup =
                        this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getSafetyReadingCats(CatalogConstants.SAFETY_READING_CAT_GROUP_MCB_FUSE_RAT_VALS)
                .then(safetyReadings => {
                    this.mcbFuseRatingCatalog = this.toSortedArray(safetyReadings, BusinessRulesViewModel.numericSorter(CatalogConstants.SAFETY_READING_CAT_DESCRIPTION));
                }),

            this._catalogService.getSafetyReadingCats(CatalogConstants.SAFETY_READING_CAT_GROUP_FUSE_RATE_VALS)
                .then(safetyReadings => {
                    this.applianceFuseRatingCatalog = this.toSortedArray(safetyReadings, BusinessRulesViewModel.numericSorter(CatalogConstants.SAFETY_READING_CAT_DESCRIPTION));
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_PART_P_REAS)
                .then(safetyNoticeTypes => {
                    this.partPReasonCatalog = safetyNoticeTypes;
                }),

            this._catalogService.getElectricalApplianceTypes()
                .then(catalog => this.jobTypeCatalog = catalog)
        ];

        return Promise.all(catalogPromises).then(() => { });
    }

    private buildValidationRules(): Promise<void> {
        return this.buildValidation([
            { property: "viewModel.mainEarthChecked", condition: () => this.viewModel.mainEarthCheckedVisible },
            { property: "viewModel.gasBondingChecked", condition: () => this.viewModel.gasBondingCheckedVisible },
            { property: "viewModel.waterBondingChecked", condition: () => this.viewModel.gasBondingCheckedVisible },
            { property: "viewModel.otherBondingChecked", condition: () => this.viewModel.otherBondingCheckedVisible },
            { property: "viewModel.supplementaryBondingOrFullRcdProtectionChecked", condition: () => this.viewModel.supplementaryBondingOrFullRcdProtectionCheckedVisible },
            { property: "viewModel.ringContinuityReadingDone", condition: () => this.viewModel.ringContinuityReadingDoneVisible },
            { property: "viewModel.leInsulationResistance", condition: () => this.viewModel.leInsulationResistanceVisible && !this.viewModel.showLeInsulationResistanceReasonWhyNot },
            { property: "viewModel.leInsulationResistanceReasonWhyNot", condition: () => this.viewModel.leInsulationResistanceReasonWhyNotVisible },
            { property: "viewModel.neInsulationResistance", condition: () => this.viewModel.neInsulationResistanceVisible && !this.viewModel.showNeInsulationResistanceReasonWhyNot },
            { property: "viewModel.neInsulationResistanceReasonWhyNot", condition: () => this.viewModel.neInsulationResistanceReasonWhyNotVisible },
            { property: "viewModel.lnInsulationResistance", condition: () => this.viewModel.lnInsulationResistanceVisible && !this.viewModel.showLnInsulationResistanceReasonWhyNot },
            { property: "viewModel.lnInsulationResistanceReasonWhyNot", condition: () => this.viewModel.lnInsulationResistanceReasonWhyNotVisible },
            { property: "viewModel.finalEliReadingDone", condition: () => this.viewModel.finalEliReadingDoneVisible },
            { property: "viewModel.finalEliReading", condition: () => this.viewModel.finalEliReadingVisible },
            { property: "viewModel.readingSafeAccordingToTops", condition: () => this.viewModel.readingSafeAccordingToTopsVisible },
            { property: "viewModel.isRcdPresent", condition: () => this.viewModel.isRcdPresentVisible },
            { property: "viewModel.circuitRcdRcboProtected", condition: () => this.viewModel.circuitRcdRcboProtectedVisible },
            { property: "viewModel.rcdTripTimeReading", condition: () => this.viewModel.rcdTripTimeReadingVisible },
            { property: "viewModel.rcboTripTimeReading", condition: () => this.viewModel.rcboTripTimeReadingVisible },
            { property: "viewModel.applianceEarthContinuityReadingDone", condition: () => this.viewModel.applianceEarthContinuityReadingDoneVisible },
            { property: "viewModel.applianceEarthContinuityReading", condition: () => this.viewModel.applianceEarthContinuityReadingVisible },
            { property: "viewModel.isApplianceHardWired", condition: () => this.viewModel.isApplianceHardWiredVisible },
            { property: "viewModel.mcbFuseRating", condition: () => this.viewModel.mcbFuseRatingVisible && !this.viewModel.showMcbFuseRatingReasonWhyNot },
            { property: "viewModel.mcbFuseRatingReasonWhyNot", condition: () => this.viewModel.mcbFuseRatingReasonWhyNotVisible },
            { property: "viewModel.applianceFuseRating", condition: () => this.viewModel.applianceFuseRatingVisible && !this.viewModel.showApplianceFuseRatingReasonWhyNot },
            { property: "viewModel.applianceFuseRatingReasonWhyNot", condition: () => this.viewModel.applianceFuseRatingReasonWhyNotVisible },
            { property: "viewModel.isPartP", condition: () => this.viewModel.isPartPVisible },
            { property: "viewModel.partPReason", condition: () => this.viewModel.partPReasonVisible },
            { property: "viewModel.workedOnLightingCircuit", condition: () => this.viewModel.workedOnLightingCircuitVisible },
            { property: "viewModel.cpcInLightingCircuitOk", condition: () => this.viewModel.cpcInLightingCircuitOkVisible },
            { property: "viewModel.installationSatisfactory", condition: () => this.viewModel.installationSatisfactoryVisible },
            { property: "viewModel.microwaveLeakageReading", condition: () => this.viewModel.microwaveLeakageReadingVisible && !this.viewModel.showMicrowaveLeakageReadingReasonWhyNot },
            { property: "viewModel.microwaveLeakageReadingReasonWhyNot", condition: () => this.viewModel.microwaveLeakageReadingReasonWhyNotVisible },
            { property: "viewModel.applianceSafe", condition: () => this.viewModel.applianceSafeVisible },
            { property: "viewModel.applianceInstallationSatisfactory", condition: () => this.viewModel.applianceInstallationSatisfactoryVisible },
            { property: "viewModel.report", condition: () => this.viewModel.reportFieldsMandatory },
            { property: "viewModel.conditionAsLeft", condition: () => this.viewModel.reportFieldsMandatory },
            { property: "viewModel.cappedTurnedOff", condition: () => this.viewModel.reportFieldsMandatory },
            { property: "viewModel.labelAttachedRemoved", condition: () => this.viewModel.reportFieldsMandatory },
            { property: "viewModel.ownedByCustomer", condition: () => this.viewModel.reportFieldsMandatory },
            { property: "viewModel.letterLeft", condition: () => this.viewModel.reportFieldsMandatory },
            { property: "viewModel.signatureObtained", condition: () => this.viewModel.reportFieldsMandatory }
        ]);
    }
}
