import { inject, BindingEngine } from "aurelia-framework";
import { Router, Redirect } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { Subscription } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ApplianceService } from "../../../business/services/applianceService";
import { CatalogService } from "../.././../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { EditableViewModel } from "../../models/editableViewModel";
import { GasSafetyViewModel } from "./viewModels/gasSafetyViewModel";
import { GasUnsafetyViewModel } from "./viewModels/gasUnsafetyViewModel";
import { Appliance } from "../../../business/models/appliance";
import { IApplianceGasSafetyFactory } from "../../factories/interfaces/IApplianceGasSafetyFactory";
import { ApplianceGasSafetyFactory } from "../../factories/applianceGasSafetyFactory";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { ApplianceReading } from "./applianceReading";
import { ObjectHelper } from "../../../../common/core/objectHelper";
import { StringHelper } from "../../../../common/core/stringHelper";
import { DialogService } from "aurelia-dialog";
import { GasApplianceReadingViewModel } from "./viewModels/gasApplianceReadingViewModel";
import { Threading } from "../../../../common/core/threading";
import { GasApplianceReadingsMasterViewModel } from "./viewModels/gasApplianceReadingsMasterViewModel";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { YesNoNa } from "../../../business/models/yesNoNa";
import { AppliancePageHelper } from "./appliancePageHelper";
// import { BaseException } from "../../../../common/core/models/baseException";
import { observable } from "aurelia-binding";

@inject(JobService, EngineerService, LabelService, ApplianceService, Router,
    EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, BindingEngine, ApplianceGasSafetyFactory)
export class GasSafety extends EditableViewModel {
    public gasSafetyViewModel: GasSafetyViewModel;
    public gasUnsafeViewModel: GasUnsafetyViewModel;
    public appliance: Appliance;
    public applianceId: string;
    public jobId: string;
    public isSafe: boolean;
    public unsafeReasonFields: string[];
    public unsafeSituationLookup: { [id: string]: string };
    public isLandlordJob: boolean;

    /* Gas Safety */
    public showPerformanceTestNotDoneReasons: boolean;
    public showPerformanceTestNotDoneReasonsForSupplementary: boolean;
    @observable
    public showApplianceStripped: boolean;
    public showSupplementaryApplianceStripped: boolean;
    public showApplianceTightnessOk: boolean;
    public showVentSizeConfigOk: boolean;
    public showVisuallyCheckRelight: boolean;
    public showSafetyDevice: boolean;
    public showApplianceSafe: boolean;
    public showCurrentStandards: boolean;
    public disableToCurrentStandards: boolean;
    public disableApplianceSafe: boolean;
    public disableConditionAsLeft: boolean;
    public showChimneyInstallationAndTests: boolean;
    public showUnsafeWarningMsg: boolean;

    public performanceTestNotDoneReasonLookup: ButtonListItem[];
    public performanceTestNotDoneReasonLookupForSupplementary: ButtonListItem[];
    public applianceStrippedLookup: ButtonListItem[];
    public didYouWorkOnApplianceLookup: ButtonListItem[];
    public didYouVisuallyCheckLookup: ButtonListItem[];
    public applianceTightnessLookup: ButtonListItem[];
    public chimneyInstallationAndTestsLookup: ButtonListItem[];
    public ventSizeConfigLookup: ButtonListItem[];
    public safetyDeviceLookup: ButtonListItem[];
    public isApplianceSafeLookup: ButtonListItem[];
    public toCurrentStandardsLookup: ButtonListItem[];

    public requestedToTestLookup: ButtonListItem[];
    public ableToTestLookup: ButtonListItem[];

    /* Gas Safety */

    /* Gas Unsafe */
    public conditionAsLeftLookup: ButtonListItem[];
    public cappedTurnedOffLookup: ButtonListItem[];
    public labelAttachedRemovedLookup: ButtonListItem[];
    public ownedByCustomerLookup: ButtonListItem[];
    public letterLeftLookup: ButtonListItem[];
    public signatureObtainedLookup: ButtonListItem[];

    private _showToasts: boolean;
    private _applianceStrippedQuestionBusinessRule: string[];
    private _applianceStrippedQuestionbusinessRuleForSupplementary: string[];
    /* Gas Unsafe */

    private _performanceTestNotDoneReasonExceptions: string[];
    private _flueTypesExceptions: string[];
    private _gasReadings: GasApplianceReadingsMasterViewModel;

    private _applianceService: IApplianceService;
    private _applianceGasSafetyFactory: IApplianceGasSafetyFactory;
    private _bindingEngine: BindingEngine;
    private _gasSubscriptions: Subscription[];
    private _unsafeToastDismissTime: number;
    private _conditionsAsLeftNotToCurrentStandardsOption: string;
    private _cappedTurnedOffDisabledOptionsForNTCS: string[];
    private _cappedTurnedOffNotApplicableOption: string;
    private _labelARDisabledOptionsForNTCS: string[];
    private _labelARDisabledOptionsForNonNTCS: string[];
    private _didYouWorkOnApplianceNoOption: boolean;
    private _conditionAsLeftImmediatelyDangerousOption: string;
    private _cappedTurnedOffOptionsForWarningMsg: string[];

    public constructor(jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        applianceService: IApplianceService,
        router: Router,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        catalogService: ICatalogService,
        bindingEngine: BindingEngine,
        applianceGasSafetyFactory: IApplianceGasSafetyFactory) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._applianceService = applianceService;
        this._applianceGasSafetyFactory = applianceGasSafetyFactory;
        this._bindingEngine = bindingEngine;
        this.unsafeReasonFields = [];
        this.showUnsafeWarningMsg = false;
        this.showSupplementaryApplianceStripped = false;
        this.showPerformanceTestNotDoneReasonsForSupplementary = false;
    }

    public canActivateAsync(...rest: any[]): Promise<boolean | Redirect> {
        return AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
    }

    public activateAsync(params: { applianceId: string, jobId: string }): Promise<any> {
        this.applianceId = params.applianceId;
        this.jobId = params.jobId;
        if (this._isCleanInstance) {
            return this.loadBusinessRules()
                .then(() => this.buildBusinessRules())
                .then(() => this.buildValidationRules())
                .then(() => this.loadCatalogs())
                .then(() => this._labelService.getGroupWithoutCommon(StringHelper.toCamelCase(ObjectHelper.getClassName(ApplianceReading))))
                .then(labels => this.attachLabels(labels))
                .then(() => this.load())
                .then(() => this.showContent());
        } else {
            return this.load();
        }
    }

    public deactivateAsync(): Promise<void> {
        this._showToasts = false;
        this.removeObservables();
        return Promise.resolve();
    }

    public unsafeSituation(): void {
        if (this.gasSafetyViewModel) {
            this.gasSafetyViewModel.isApplianceSafe = false;
        }
    }

    /* observables start */
    public obserApplianceSafe(newValue: boolean, oldValue: boolean, onload: boolean): void {
        this.isSafe = newValue;

        if (!this.isSafe && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) {
            this.gasUnsafeViewModel.conditionAsLeft = undefined;
            this.gasUnsafeViewModel.cappedTurnedOff = undefined;
            this.gasUnsafeViewModel.labelAttachedRemoved = undefined;
        }

        if (!onload || this.disableApplianceSafe) {
            this.gasSafetyViewModel.toCurrentStandards = newValue === undefined ? undefined : YesNoNa.Yes;
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
    }

    public obserToCurrentStandards(newValue: YesNoNa, oldValue: YesNoNa, onload: boolean): void {
        switch (newValue) {
            case YesNoNa.No:
                this.populateUnsafeReason("toCurrentStandards", false);
                this.disableConditionAsLeft = true;
                this.gasUnsafeViewModel.conditionAsLeft = this._conditionsAsLeftNotToCurrentStandardsOption;
                break;
            case YesNoNa.Na:
                this.populateUnsafeReason("toCurrentStandards", true);
                this.disableConditionAsLeft = false;
                break;
        }
    }

    public obserApplianceTightnessOk(newValue: YesNoNa, oldValue: YesNoNa, onload: boolean): void {
        this.populateUnsafeReason("applianceTightness", (newValue === YesNoNa.No) ? false : true);       
    }

    public obserVentSizeConfigOk(newValue: boolean, oldValue: boolean, onload: boolean): void {
        this.populateUnsafeReason("ventSizeConfig", newValue);         
    }

    public obserSafetyDevice(newValue: YesNoNa, oldValue: YesNoNa, onload: boolean): void {
        this.populateUnsafeReason("safetyDevice", (newValue === YesNoNa.No) ? false : true);        
    }

    public obserDidYouVisuallyCheck(newValue: boolean, oldValue: boolean, onload: boolean): void {
        if (this.gasSafetyViewModel.workedOnAppliance === true) {
            newValue = undefined;
        }
        this.populateUnsafeReason("didYouVisuallyCheck", newValue);
    }

    public obserWorkedOnAppliance(newValue: boolean, oldValue: boolean, onload: boolean): Promise<void> {
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
        } else if (newValue === false) {
            if (!onload) {
                if (this.isApplianceSafetyAndReadingsAreEmpty() === false) {
                    return this.clearReadings().then((clear) => {
                        if (clear === true) {
                            this.clearForWorkOnAppliance(newValue, onload);
                        } else {
                            Threading.nextCycle(() => {
                                this.gasSafetyViewModel.workedOnAppliance = true;
                            });
                        }
                        return Promise.resolve();
                    });
                } else {
                    // no readings and no safet details hence...
                    // dont bother asking question just clear
                    this.clearForWorkOnAppliance(newValue, onload);
                    return Promise.resolve();
                }
            } else {
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
        } else {
            this.gasSafetyViewModel.overrideWorkedOnAppliance = false;
            this.updatePerformanceTestCarriedOutAndApplianceStripped(newValue, onload);
            return Promise.resolve();
        }
    }

    public obserApplianceStripped(newValue: boolean, oldValue: boolean, onload: boolean): void {
        if (newValue === true) {
            this.populateUnsafeReason("applianceStripped", true);
        } else if (newValue === false) {
            if (this._performanceTestNotDoneReasonExceptions) {
                if (this._performanceTestNotDoneReasonExceptions
                    .some(x => x === this.gasSafetyViewModel.performanceTestsNotDoneReason)) {
                    this.populateUnsafeReason("applianceStripped", true);
                } else {
                    this.populateUnsafeReason("applianceStripped", false);
                }
            }
        }
    }

    public obserSupplementaryApplianceStripped(newValue: boolean, oldValue: boolean, onload: boolean): void {
        if (newValue === true) {
            this.populateUnsafeReason("supplementaryApplianceStripped", true);
        } else if (newValue === false) {
            if (this._performanceTestNotDoneReasonExceptions) {
                if (this._performanceTestNotDoneReasonExceptions
                    .some(x => x === this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary)) {
                    this.populateUnsafeReason("supplementaryApplianceStripped", true);
                } else {
                    this.populateUnsafeReason("supplementaryApplianceStripped", false);
                }
            }
        }
    }

    public obserChimneyInstallationAndTests(newValue: YesNoNa, oldValue: YesNoNa, onload: boolean): void {
        this.populateUnsafeReason("chimneyInstallationAndTests", (newValue === YesNoNa.No) ? false : true);        
    }

    public obserPerformanceTestsNotDoneReason(newValue: string, oldValue: string, onload: boolean): void {
        if (newValue !== undefined) {
            if (this._applianceStrippedQuestionBusinessRule) {
                if (this._applianceStrippedQuestionBusinessRule.some(x => x === newValue)) {
                    this.showApplianceStripped = true;
                } else {
                    this.showApplianceStripped = false;
                    this.gasSafetyViewModel.applianceStripped = undefined;
                    this.populateUnsafeReason("applianceStripped", true);
                }
            }
        } else {
            this.gasSafetyViewModel.applianceStripped = undefined;
        }
    }

    public obserPerformanceTestsNotDoneReasonForSupplementary(newValue: string, oldValue: string, onload: boolean): void {
        if (newValue !== undefined) {
            if (this._applianceStrippedQuestionbusinessRuleForSupplementary) {
                if (this._applianceStrippedQuestionbusinessRuleForSupplementary.some(x => x === newValue)) {
                    this.showSupplementaryApplianceStripped = true;
                } else {
                    this.showSupplementaryApplianceStripped = false;
                    this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
                    this.populateUnsafeReason("supplementaryApplianceStripped", true);
                }
            }
        } else {
            this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
        }
    }

    public obserAbleToTest(newValue: boolean, oldValue: boolean): void {
        this.disableWorkedOnApplianceNoButton();
    }

    public obserRequestedTest(newValue: boolean, oldValue: boolean): void {
        this.disableWorkedOnApplianceNoButton();
    }
    /* observables end */

    protected saveModel(): Promise<void> {
        if (this.gasSafetyViewModel.workedOnAppliance === false) {
            this.resetReadingsViewModel();
        }
        this.gasSafetyViewModel.dataState = this.getFinalDataState();

        // need to keep the dataStateId to track. Used object assign to make sure the current dataStateId gets mapped to the new object
        let gasReadings = Object.assign({ dataStateId: this.appliance.safety.applianceGasReadingsMaster.dataStateId }, this._gasReadings);

        // todo: beware - at this point this.appliance is actually a reference to the real appliance model, at this point
        //  we are manipulating the stored model (i.e. saveApplianceSafetyDetails() is effectively just writing already updated model to storage)
        this.appliance.safety.applianceGasReadingsMaster = this._applianceGasSafetyFactory.createApplianceGasReadingsBusinessModel(gasReadings);
        this.appliance.safety.applianceGasSafety = this._applianceGasSafetyFactory.createApplianceGasSafetyBusinessModel(this.gasSafetyViewModel, this.appliance.isSafetyRequired);
        this.appliance.safety.applianceGasUnsafeDetail = this._applianceGasSafetyFactory.createApplianceGasUnsafeBusinessModel(this.gasUnsafeViewModel);

        return this._applianceService.saveApplianceSafetyDetails(this.jobId, this.appliance.id, this.appliance.safety, this._isDirty, false);
    }

    protected loadModel(): Promise<void> {
        return this._jobService.getJob(this.jobId)
            .then((job) => {
                this.isLandlordJob = job.isLandlordJob;

                return this._applianceService.getAppliance(this.jobId, this.applianceId);
            })
            .then((appliance) => {
                this.resetLocalModels();

                if (appliance) {
                    this.appliance = appliance;

                    this.gasSafetyViewModel = this._applianceGasSafetyFactory.createApplianceGasSafetyViewModel(appliance.safety.applianceGasSafety, appliance.isSafetyRequired);
                    this.gasUnsafeViewModel = this._applianceGasSafetyFactory.createApplianceGasUnsafeViewModel(appliance.safety.applianceGasUnsafeDetail);
                    this._gasReadings = this._applianceGasSafetyFactory.createApplianceGasReadingsViewModel(appliance.safety.applianceGasReadingsMaster);
                    this.setInitialDataState(this.gasSafetyViewModel.dataStateId, this.gasSafetyViewModel.dataState);
                } else {
                    this.setNewDataState("appliances");
                }
            })
            .then(() => this.populateUnsafeFieldLabelMap())
            .then(() => this.removeObservables())
            .then(() => this.initGasSafetyStatus())
            .then(() => this.setObservables())
            .then(() => this.updatePerformanceTestCarriedOutAndApplianceStripped(this.gasSafetyViewModel.workedOnAppliance, true))
            .then(() => {
                // get adapt make and model non blocking.
                this._showToasts = true;
            });
    }

    protected clearModel(): Promise<void> {
        this.removeObservables();
        this.resetLocalModels();
        this.resetReadingsViewModel();
        this.initGasSafetyStatus();
        this.setObservables();
        return Promise.resolve();
    }

    protected undoModel(): void {
        this._showToasts = false;
    }

    private loadCatalogs(): Promise<void> {
        let catalogPromises = [
            this._catalogService.getSafetyActions()
                .then(safetyActions => {
                    this.cappedTurnedOffLookup = this.toButtonListItemArray(safetyActions, CatalogConstants.SAFETY_ACTION_ID, CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),

            this._catalogService.getSafetyNoticeTypes()
                .then(safetyNoticeTypes => {
                    this.conditionAsLeftLookup = this.toButtonListItemArray(safetyNoticeTypes, CatalogConstants.SAFETY_NOTICE_TYPE_ID, CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
                }),

            this._catalogService.getSafetyNoticeStatuses()
                .then(safetyNoticeStatus => {
                    this.labelAttachedRemovedLookup = this.toButtonListItemArray(safetyNoticeStatus, CatalogConstants.SAFETY_NOTICE_STATUS_ID, CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                }),

            this._catalogService.getPerformanceTestReasons()
                .then(performanceTestNotDoneReason => {
                    this.performanceTestNotDoneReasonLookup = 
                        this.toButtonListItemArray(performanceTestNotDoneReason.filter(p => p.category === this.getLabel("preliminary")),
                            CatalogConstants.PERFORMANCE_TEST_REASON_ID,
                            CatalogConstants.PERFORMANCE_TEST_REASON_DESCRIPTION);

                    this.performanceTestNotDoneReasonLookupForSupplementary = 
                        this.toButtonListItemArray(performanceTestNotDoneReason.filter(p => p.category === this.getLabel("supplementary")),
                            CatalogConstants.PERFORMANCE_TEST_REASON_ID,
                            CatalogConstants.PERFORMANCE_TEST_REASON_DESCRIPTION);
                })
        ];
        return Promise.all(catalogPromises)
            .then(() =>
                Promise.all([
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesNaList(),
                    this.buildNoYesNaList(),
                    this.buildNoYesList(),
                    this.buildNoYesNaList(),
                    this.buildNoYesList(),

                    this.buildNoNaList(),
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesList()])
                    .then(([
                        applianceStrippedLookup,
                        didYouWorkOnApplianceLookup,
                        didYouVisuallyCheckLookup,
                        applianceTightnessLookup,
                        chimneyInstallationAndTestsLookup,
                        ventSizeConfigLookup,
                        safetyDeviceLookup,
                        isApplianceSafeLookup,
                        toCurrentStandardsLookup,
                        ownedByCustomerLookup,
                        letterLeftLookup,
                        signatureObtainedLookup,
                        requestedToTestLookup,
                        ableToTestLookup
                    ]) => {
                        this.applianceStrippedLookup = applianceStrippedLookup;
                        this.didYouWorkOnApplianceLookup = didYouWorkOnApplianceLookup;
                        this.didYouVisuallyCheckLookup = didYouVisuallyCheckLookup;
                        this.applianceTightnessLookup = applianceTightnessLookup;
                        this.chimneyInstallationAndTestsLookup = chimneyInstallationAndTestsLookup;
                        this.ventSizeConfigLookup = ventSizeConfigLookup;
                        this.safetyDeviceLookup = safetyDeviceLookup;
                        this.isApplianceSafeLookup = isApplianceSafeLookup;
                        this.toCurrentStandardsLookup = toCurrentStandardsLookup;
                        this.ownedByCustomerLookup = ownedByCustomerLookup;
                        this.letterLeftLookup = letterLeftLookup;
                        this.signatureObtainedLookup = signatureObtainedLookup;
                        this.requestedToTestLookup = requestedToTestLookup;
                        this.ableToTestLookup = ableToTestLookup;
                    }));
    }

    private setObservables(): void {
        if (this.gasSafetyViewModel) {
            let sub1 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "workedOnAppliance")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserWorkedOnAppliance(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub1);
            let sub2 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "applianceTightness")
                .subscribe((newValue: YesNoNa, oldValue: YesNoNa) => {
                    this.obserApplianceTightnessOk(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub2);
            let sub3 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "ventSizeConfig")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserVentSizeConfigOk(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub3);
            let sub4 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "safetyDevice")
                .subscribe((newValue: YesNoNa, oldValue: YesNoNa) => {
                    this.obserSafetyDevice(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub4);
            let sub5 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "isApplianceSafe")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserApplianceSafe(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub5);
            let sub6 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "didYouVisuallyCheck")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserDidYouVisuallyCheck(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub6);
            let sub7 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "applianceStripped")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserApplianceStripped(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub7);
            let sub8 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "chimneyInstallationAndTests")
                .subscribe((newValue: YesNoNa, oldValue: YesNoNa) => {
                    this.obserChimneyInstallationAndTests(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub8);
            let sub9 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "performanceTestsNotDoneReason")
                .subscribe((newValue: string, oldValue: string) => {
                    this.obserPerformanceTestsNotDoneReason(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub9);
            let sub10 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "toCurrentStandards")
                .subscribe((newValue: YesNoNa, oldValue: YesNoNa) => {
                    this.obserToCurrentStandards(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub10);
            let sub11 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "ableToTest")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserAbleToTest(newValue, oldValue);
                });
            this._gasSubscriptions.push(sub11);
            let sub12 = this._bindingEngine.propertyObserver(this.gasUnsafeViewModel, "conditionAsLeft")
            .subscribe((newValue: string, oldValue: string) => {
                this.obserConditionAsLeft(newValue, oldValue);
            });
            this._gasSubscriptions.push(sub12);
            let sub13 = this._bindingEngine.propertyObserver(this.gasUnsafeViewModel, "cappedTurnedOff")
                .subscribe((newValue: string, oldValue: string) => {
                    this.obserCappedTurnedOff(newValue, oldValue);
                });
            this._gasSubscriptions.push(sub13);
            let sub14 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "requestedToTest")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserRequestedTest(newValue, oldValue);
                });
            this._gasSubscriptions.push(sub14);
            let sub15 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "performanceTestsNotDoneReasonForSupplementary")
                .subscribe((newValue: string, oldValue: string) => {
                    this.obserPerformanceTestsNotDoneReasonForSupplementary(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub15);
            let sub16 = this._bindingEngine.propertyObserver(this.gasSafetyViewModel, "supplementaryApplianceStripped")
                .subscribe((newValue: boolean, oldValue: boolean) => {
                    this.obserSupplementaryApplianceStripped(newValue, oldValue, false);
                });
            this._gasSubscriptions.push(sub16);
        }
    }

    private initGasSafetyStatus(): void {
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
                } else {
                    this.gasSafetyViewModel.isApplianceSafe = false;
                }
            }

            this.obserApplianceSafe(this.gasSafetyViewModel.isApplianceSafe, undefined, true);
            this.obserToCurrentStandards(this.gasSafetyViewModel.toCurrentStandards, undefined, true);
            this.obserConditionAsLeft(this.gasUnsafeViewModel.conditionAsLeft, undefined);
            this.obserCappedTurnedOff(this.gasUnsafeViewModel.cappedTurnedOff, undefined);
        }
    }

    private isChimneyInstallationRequired(): void {
        if (this.appliance.flueType) {
            this.showChimneyInstallationAndTests = true;

            if (this._flueTypesExceptions) {
                if (!this._flueTypesExceptions.some(x => x === this.appliance.flueType)) {
                    // need to filter the options
                    if (this.chimneyInstallationAndTestsLookup) {
                        this.chimneyInstallationAndTestsLookup.forEach(option => {
                            if (option.value !== YesNoNa.Na) {
                                option.disabled = true;
                            } else {
                                option.disabled = false;
                            }
                        });
                    }
                } else {
                    if (this.gasSafetyViewModel.chimneyInstallationAndTests === YesNoNa.Na) {
                        this.gasSafetyViewModel.chimneyInstallationAndTests = undefined;
                    }

                    this.chimneyInstallationAndTestsLookup.forEach(option => {
                        if (option.value === YesNoNa.Na) {
                            option.disabled = true;
                        } else {
                            option.disabled = false;
                        }
                    });
                }
            }

        } else {
            this.showChimneyInstallationAndTests = false;
        }
    }

    private isCurrentStandardsRequired(): boolean {
        return this.disableToCurrentStandards || (this.gasSafetyViewModel && this.gasSafetyViewModel.isApplianceSafe && this.gasSafetyViewModel.toCurrentStandards !== YesNoNa.Yes);
    }

    private buildValidationRules(): Promise<void> {
        return this.buildValidation([
            { property: "gasSafetyViewModel.workedOnAppliance", condition: () => this.appliance && this.appliance.isSafetyRequired },
            { property: "gasSafetyViewModel.didYouVisuallyCheck", condition: () => this.showVisuallyCheckRelight },
            { property: "gasSafetyViewModel.performanceTestsNotDoneReason", condition: () => this.showPerformanceTestNotDoneReasons },
            { property: "gasSafetyViewModel.applianceStripped", condition: () => this.showApplianceStripped },
            { property: "gasSafetyViewModel.supplementaryApplianceStripped", condition: () => this.showSupplementaryApplianceStripped },
            { property: "gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary", condition: () => this.showPerformanceTestNotDoneReasonsForSupplementary },
            { property: "gasSafetyViewModel.applianceTightness", condition: () => this.showApplianceTightnessOk },
            { property: "gasSafetyViewModel.chimneyInstallationAndTests", condition: () => this.showChimneyInstallationAndTests },
            { property: "gasSafetyViewModel.ventSizeConfig", condition: () => this.showVentSizeConfigOk },
            { property: "gasSafetyViewModel.safetyDevice", condition: () => this.showSafetyDevice },
            { property: "gasSafetyViewModel.isApplianceSafe", condition: () => this.showApplianceSafe },
            {
                property: "gasSafetyViewModel.toCurrentStandards",
                passes: [{
                    test: () => this.isCurrentStandardsRequired(),
                    message: "*"
                }],
                condition: () => this.showCurrentStandards
            },
            { property: "gasUnsafeViewModel.report", condition: () => this.isSafe === false || (this.gasSafetyViewModel && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) },
            { property: "gasUnsafeViewModel.conditionAsLeft", condition: () => this.isSafe === false || (this.gasSafetyViewModel && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) },
            { property: "gasUnsafeViewModel.cappedTurnedOff", condition: () => this.isSafe === false || (this.gasSafetyViewModel && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) },
            { property: "gasUnsafeViewModel.labelAttachedRemoved", condition: () => this.isSafe === false || (this.gasSafetyViewModel && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) },
            { property: "gasUnsafeViewModel.ownedByCustomer", condition: () => this.isSafe === false || (this.gasSafetyViewModel && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) },
            { property: "gasUnsafeViewModel.letterLeft", condition: () => this.isSafe === false || (this.gasSafetyViewModel && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) },
            { property: "gasUnsafeViewModel.signatureObtained", condition: () => this.isSafe === false || (this.gasSafetyViewModel && this.gasSafetyViewModel.toCurrentStandards === YesNoNa.No) },
            { property: "gasSafetyViewModel.applianceMake", condition: () => this.isLandlordJob === true },
            { property: "gasSafetyViewModel.applianceModel", condition: () => this.isLandlordJob === true },
            { property: "gasSafetyViewModel.requestedToTest", condition: () => this.isLandlordJob === true },
            { property: "gasSafetyViewModel.ableToTest", condition: () => this.isLandlordJob === true }
        ]);
    }

    private buildBusinessRules(): void {
        let rule1 = this.getBusinessRule<string>("performanceTestNotDoneReasonExceptions");
        if (rule1) {
            this._performanceTestNotDoneReasonExceptions = rule1.split(",");
        }
        let rule2 = this.getBusinessRule<string>("flueTypesExceptions");
        if (rule2) {
            this._flueTypesExceptions = rule2.split(",");
        }
        let rule3 = this.getBusinessRule<string>("showApplianceStrippedQuestion");
        if (rule3) {
            this._applianceStrippedQuestionBusinessRule = rule3.split(",");
        }

        this._applianceStrippedQuestionbusinessRuleForSupplementary = this.getBusinessRule<string>("showApplianceStrippedQuestionForSupplementary").split(",");

        this._unsafeToastDismissTime = this.getBusinessRule<number>("unsafeToastDismissTime");

        this._conditionsAsLeftNotToCurrentStandardsOption = this.getBusinessRule<string>("conditionsAsLeftNotToCurrentStandardsOption");

        this._cappedTurnedOffDisabledOptionsForNTCS = this.getBusinessRule<string>("cappedTurnedOffDisabledOptionsForNTCS").split(",");

        this._cappedTurnedOffNotApplicableOption = this.getBusinessRule<string>("cappedTurnedOffNotApplicableOption");

        this._labelARDisabledOptionsForNTCS = this.getBusinessRule<string>("labelAttachedRemovedDisabledOptionsForNTCS").split(",");

        this._labelARDisabledOptionsForNonNTCS = this.getBusinessRule<string>("labelAttachedRemovedDisabledOptionsForNonNTCS").split(",");

        this._didYouWorkOnApplianceNoOption = this.getBusinessRule<boolean>("didYouWorkOnApplianceNoOption");

        this._conditionAsLeftImmediatelyDangerousOption = this.getBusinessRule<string>("conditionAsLeftImmediatelyDangerousOption");

        this._cappedTurnedOffOptionsForWarningMsg = this.getBusinessRule<string>("cappedTurnedOffOptionsForWarningMsg").split(",");
    }

    private populateUnsafeReason(fieldName: string, safe: boolean): void {
        if (safe === false) {
            let existingItem = this.unsafeReasonFields.some(u => u === fieldName);
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
        } else if (safe === true) {
            if (this.removeReason(fieldName)) {
                if (fieldName === "toCurrentStandards" || fieldName === "applianceSafe") {
                    this.clearUnSafeSituationFields();
                    return;
                }

                if (this.unsafeReasonFields.length === 0) {
                    this.clearUnSafeSituationFields();
                } else if (this.unsafeReasonFields.length === 1 && this.unsafeReasonFields.indexOf("applianceSafe") > -1) {
                    this.disableApplianceSafe = false;
                }
            }
        }
    }

    private removeReason(fieldName: string): boolean {
        let removed: boolean = false;
        let existingIndex = this.unsafeReasonFields.findIndex(u => u === fieldName);
        if (existingIndex > -1) {
            this.unsafeReasonFields.splice(existingIndex, 1);
            removed = true;
        }
        return removed;
    }

    private populateUnsafeFieldLabelMap(): void {
        this.unsafeSituationLookup = {};
        let fields: string[] = [];
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
        fields.forEach(x => {
            switch (x) {
                case "suppBurnerPressureUnsafe":
                    const suppBurnerPressureUnsafe: string = "suppBurnerPressureUnsafe";
                    this.unsafeSituationLookup[suppBurnerPressureUnsafe] = this.getLabel("supplementaryBurnerPressureUnsafe");                       
                    break;
                case "suppGasReadingUnsafe":
                    const suppGasReadingUnsafe: string = "suppGasReadingUnsafe";
                    this.unsafeSituationLookup[suppGasReadingUnsafe] = this.getLabel("supplementaryGasReadingUnsafe");
                    break;
                case "suppFinalRatioUnsafe":
                    const suppFinalRatioUnsafe: string = "suppFinalRatioUnsafe";
                    this.unsafeSituationLookup[suppFinalRatioUnsafe] = this.getLabel("supplementaryFinalRatioUnsafe");
                    break;
                default:
                    this.unsafeSituationLookup[x] = this.getLabel(x);
                    break;
            }
        });
    }

    private removeObservables(): void {
        if (this._gasSubscriptions) {
            this._gasSubscriptions.forEach(x => {
                if (x) {
                    x.dispose();
                    x = null;
                }
            });
            this._gasSubscriptions = [];
        } else {
            this._gasSubscriptions = [];
        }
    }

    private clearReadings(): Promise<boolean> {
        return this.showConfirmation(this.getLabel("confirmation"), this.getLabel("readingClearQuestion"))
            .then((result) => {
                if (!result.wasCancelled) {
                    this.gasSafetyViewModel.workedOnAppliance = false;
                    this.resetReadingsViewModel();
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            });
    }

    private resetReadingsViewModel(): void {
        this.gasSafetyViewModel.summaryPrelimLpgWarningTrigger = false;
        this._gasReadings = new GasApplianceReadingsMasterViewModel();
        this._gasReadings.preliminaryReadings = new GasApplianceReadingViewModel();
        this._gasReadings.supplementaryReadings = new GasApplianceReadingViewModel();
        this._gasReadings.supplementaryBurnerFitted = false;
        this._gasReadings.workedOnMainReadings = false;
        this._gasReadings.workedOnPreliminaryPerformanceReadings = false;
        this._gasReadings.workedOnSupplementaryPerformanceReadings = false;
    }

    private updatePerformanceTestCarriedOutAndApplianceStripped(didYouWorkedOnAppliance: boolean, onload: boolean): void {
        if (didYouWorkedOnAppliance === true) {
            this.showPerformanceTestNotDoneReasons = !this._gasReadings.workedOnPreliminaryPerformanceReadings;
            this.showApplianceStripped = !this._gasReadings.workedOnPreliminaryPerformanceReadings;
            
            if (this._gasReadings.supplementaryBurnerFitted) {
                this.showPerformanceTestNotDoneReasonsForSupplementary = !this._gasReadings.workedOnSupplementaryPerformanceReadings;
                this.showSupplementaryApplianceStripped = !this._gasReadings.workedOnSupplementaryPerformanceReadings;  
                this.obserPerformanceTestsNotDoneReasonForSupplementary(this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary, undefined, false);
                this.obserSupplementaryApplianceStripped(this.gasSafetyViewModel.supplementaryApplianceStripped, undefined, false);   
            } else {
                this.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = undefined;
                this.gasSafetyViewModel.supplementaryApplianceStripped = undefined;
            }  
            this.obserPerformanceTestsNotDoneReason(this.gasSafetyViewModel.performanceTestsNotDoneReason, undefined, false);
            this.obserApplianceStripped(this.gasSafetyViewModel.applianceStripped, undefined, false);
            
        } else {
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
    }

    private isApplianceSafetyAndReadingsAreEmpty(): boolean {
        let isEmpty: boolean = false;
        if (this.isSafetyEmpty() && this.areReadingsEmpty()) {
            isEmpty = true;
        } else {
            isEmpty = false;
        }
        return isEmpty;
    }

    private isSafetyEmpty(): boolean {
        let isEmpty: boolean = false;
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
    }

    private areReadingsEmpty(): boolean {
        let isEmpty: boolean = false;
        if (this._gasReadings === undefined) {
            isEmpty = true;
        }
        if (!!this._gasReadings.workedOnMainReadings === false &&
            !!this._gasReadings.workedOnPreliminaryPerformanceReadings === false) {
            isEmpty = true;
        }
        return isEmpty;
    }

    private setPerformanceReadingsQuestions(): void {
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
        } else {
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
            } else {
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
    }

    private resetLocalModels(): void {
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
    }

    private clearForWorkOnAppliance(workedOnAppliance: boolean, onload: boolean): void {
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
    }

    private clearUnSafeSituationFields(): void {
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
    }

    private disableButtons(buttonItemList: ButtonListItem[], options: string[]): void {
        if (buttonItemList !== undefined) {
            buttonItemList.forEach(btn => {
                btn.disabled = options.some(option => option === btn.value);
            });
        }
    }

    private obserConditionAsLeft(newValue: string, oldValue: string): void {
        this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();
    }
        
    private obserCappedTurnedOff(newValue: string, oldValue: string): void {
        this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();        
    }

    private showUnsafeWarningMessage(): boolean {
        return this.gasUnsafeViewModel.conditionAsLeft 
                && this.gasUnsafeViewModel.cappedTurnedOff 
                && this.gasUnsafeViewModel.conditionAsLeft === this._conditionAsLeftImmediatelyDangerousOption 
                && this._cappedTurnedOffOptionsForWarningMsg.some(c => this.gasUnsafeViewModel.cappedTurnedOff === c);
    }

    private disableWorkedOnApplianceNoButton(): void {
        let disableNoButton = (value: boolean) => {
            this.didYouWorkOnApplianceLookup.forEach(btn => {
                if (btn.value === this._didYouWorkOnApplianceNoOption) {
                    btn.disabled = value;
                }
            });
        };

        if (this.gasSafetyViewModel.requestedToTest && this.gasSafetyViewModel.ableToTest) {
            this.gasSafetyViewModel.workedOnAppliance = true;
            disableNoButton(true);
        } else {
            disableNoButton(false);
        }
    }
}
