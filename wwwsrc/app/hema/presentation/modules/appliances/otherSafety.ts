import { BindingEngine, inject } from "aurelia-framework";
import { Router, Redirect } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { Subscription } from "aurelia-event-aggregator";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { EditableViewModel } from "../../models/editableViewModel";
import { OtherSafetyViewModel } from "./viewModels/otherSafetyViewModel";
import { OtherUnsafetyViewModel } from "./viewModels/otherUnsafetyViewModel";
import { Appliance } from "../../../business/models/appliance";
import { IApplianceOtherSafetyFactory } from "../../factories/interfaces/IApplianceOtherSafetyFactory";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { YesNoNa } from "../../../business/models/yesNoNa";
import { JobService } from "../../../business/services/jobService";
import { EngineerService } from "../../../business/services/engineerService";
import { LabelService } from "../../../business/services/labelService";
import { ApplianceService } from "../../../business/services/applianceService";
import { ValidationService } from "../../../business/services/validationService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { CatalogService } from "../../../business/services/catalogService";
import { ApplianceOtherSafetyFactory } from "../../factories/applianceOtherSafetyFactory";
import { AppliancePageHelper } from "./appliancePageHelper";
import { UnsafeReason } from "../../../business/models/unsafeReason";
import { ISafetyNoticeStatus } from "../../../business/models/reference/ISafetyNoticeStatus";

@inject(JobService, EngineerService, LabelService, ApplianceService, Router,
    EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, BindingEngine, ApplianceOtherSafetyFactory)
export class OtherSafety extends EditableViewModel {
    public otherSafetyViewModel: OtherSafetyViewModel;
    public otherUnsafeViewModel: OtherUnsafetyViewModel;
    public appliance: Appliance;
    public applianceId: string;
    public jobId: string;
    // public unsafeReasonLabels: string[];

    public didYouWorkOnApplianceLookup: ButtonListItem[];
    public didYouVisuallyCheckLookup: ButtonListItem[];
    public isApplianceSafeLookup: ButtonListItem[];
    public toCurrentStandardsLookup: ButtonListItem[];

    public conditionAsLeftLookup: ButtonListItem[];
    public cappedTurnedOffLookup: ButtonListItem[];
    public labelAttachedRemovedLookup: ButtonListItem[];
    public ownedByCustomerLookup: ButtonListItem[];
    public letterLeftLookup: ButtonListItem[];
    public signatureObtainedLookup: ButtonListItem[];

    public disableToCurrentStandards: boolean;
    public disableApplianceSafe: boolean;

    public unsafeReasons: UnsafeReason[];

    private _showToasts: boolean;

    private _applianceService: IApplianceService;
    private _applianceOtherSafetyFactory: IApplianceOtherSafetyFactory;
    private _bindingEngine: BindingEngine;
    private _otherSafetySubscriptions: Subscription[];
    private _safetyNoticeStatus: ISafetyNoticeStatus[];

    public constructor(
        jobService: IJobService,
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
        applianceOtherSafetyFactory: IApplianceOtherSafetyFactory) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._applianceService = applianceService;
        this._applianceOtherSafetyFactory = applianceOtherSafetyFactory;
        this._bindingEngine = bindingEngine;
        // this.unsafeReasonLabels = [];
        this.unsafeReasons = [];
        this.disableApplianceSafe = false;
        this._safetyNoticeStatus = [];
    }

    public canActivateAsync(...rest: any[]): Promise<boolean | Redirect> {
        return AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
    }

    public activateAsync(params: { applianceId: string, jobId: string }): Promise<any> {
        this.applianceId = params.applianceId;
        this.jobId = params.jobId;
        if (this._isCleanInstance) {
            return this.loadBusinessRules()
                .then(() => this.buildValidationRules())
                .then(() => this.loadCatalogs())
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
        if (this.otherSafetyViewModel) {
            this.otherSafetyViewModel.isApplianceSafe = false;
        }
    }

    protected saveModel(): Promise<void> {
        this.otherSafetyViewModel.dataState = this.getFinalDataState();
        this.appliance.safety.applianceOtherSafety = this._applianceOtherSafetyFactory.createApplianceOtherSafetyBusinessModel(this.otherSafetyViewModel, this.appliance.isSafetyRequired);
        this.appliance.safety.applianceOtherUnsafeDetail = this._applianceOtherSafetyFactory.createApplianceOtherUnsafeBusinessModel(this.otherUnsafeViewModel);
        return this._applianceService.saveApplianceSafetyDetails(this.jobId, this.appliance.id, this.appliance.safety, false, false);
    }

    protected loadModel(): Promise<void> {
        return this._applianceService.getAppliance(this.jobId, this.applianceId)
            .then((appliance) => {
                if (appliance) {
                    this.appliance = appliance;

                    this.otherSafetyViewModel = this._applianceOtherSafetyFactory.createApplianceOtherSafetyViewModel(appliance.safety.applianceOtherSafety, appliance.isSafetyRequired);
                    this.otherUnsafeViewModel = this._applianceOtherSafetyFactory.createApplianceOtherUnsafeViewModel(appliance.safety.applianceOtherUnsafeDetail);
                    this.setInitialDataState(this.otherSafetyViewModel.dataStateId, this.otherSafetyViewModel.dataState);
                } else {
                    this.setNewDataState("appliances");
                }
            })
            .then(() => this.removeObservables())
            .then(() => this.initOtherSafetyStatus())
            .then(() => this.setObservables())
            .then(() => {
                this._showToasts = true;
            });
    }

    protected clearModel(): Promise<void> {
        this.removeObservables();
        this.resetLocalModels();
        this.initOtherSafetyStatus();
        this.otherSafetyViewModel.workedOnAppliance = undefined;
        this.setObservables();

        return this.validateAllRules();
    }

    private hasMandatoryUnsafeReasons(): boolean {
        return this.unsafeReasons && this.unsafeReasons.filter(x => x.isMandatory).length > 0;
    }

    private hasAtLeastOneUnsafeFieldPopulated(): boolean {
        if (this.otherUnsafeViewModel &&
            (this.otherUnsafeViewModel.conditionAsLeft || this.otherUnsafeViewModel.cappedTurnedOff || this.otherUnsafeViewModel.labelAttachedRemoved
                || this.otherUnsafeViewModel.ownedByCustomer || this.otherUnsafeViewModel.letterLeft || this.otherUnsafeViewModel.signatureObtained
                || this.otherUnsafeViewModel.report)) {
            return true;
        }

        return false;
    }

    private populateUnsafeReasons(isToastRequired: boolean): Promise<void> {

        let latestUnsafeReasons: UnsafeReason[] = [];

        // worked on appliance unsafe check

        // visually check relight unsafe check
        if (this.otherSafetyViewModel.didYouVisuallyCheck === false) {
            latestUnsafeReasons.push(new UnsafeReason("didYouVisuallyCheck", null, null, true));
        }

        // is appliance safe unsafe check
        if (this.otherSafetyViewModel.isApplianceSafe === false) {
            latestUnsafeReasons.push(new UnsafeReason("isApplianceSafe", null, null, true));
        }

        // current standards unsafe check
        if (this.otherSafetyViewModel.toCurrentStandards === YesNoNa.No) {
            latestUnsafeReasons.push(new UnsafeReason("toCurrentStandards", null, null, true));
        }

        let currentWarnings: string[] = [];

        if (this.unsafeReasons) {
            this.unsafeReasons.forEach(reason => {
                currentWarnings.push(reason.label);
            });
        }

        this.unsafeReasons = latestUnsafeReasons;

        if (this.unsafeReasons.length > 0) {
            /* If there are reasons that we didn't have before then show a toast for them */
            this.unsafeReasons.forEach(reason => {
                reason.label = this.getLabel(reason.lookupId);
                if (isToastRequired && currentWarnings.indexOf(reason.label) === -1 && this._showToasts) {
                    this.showWarning(this.getLabel("unsafeSituation"), reason.label);
                }
            });
        } else {
            // clear unsafe fields if there are no unsafe reasons
            this.clearUnSafeFields();
        }

        return this.validateAllRules();
    }

    private obserWorkedOnAppliance(newValue: boolean, onload: boolean): void {

        if (newValue === false && !onload) {
            this.clearForWorkOnAppliance(onload);
        }
    }

    private obserApplianceSafe(newValue: boolean, oldValue: boolean, onload: boolean): void {
        this.populateUnsafeReasons(true);

        if (this.otherSafetyViewModel.isApplianceSafe === false) {
            this.otherSafetyViewModel.toCurrentStandards = YesNoNa.Yes;
            this.disableToCurrentStandards = true;
        } else if (!onload) {
            this.otherSafetyViewModel.toCurrentStandards = undefined;
            this.disableToCurrentStandards = false;
        }
    }

    private obserToCurrentStandards(newValue: YesNoNa, oldValue: YesNoNa): void {
        this.populateUnsafeReasons(true);
    }

    private obserDidYouVisuallyCheck(newValue: boolean, onload: boolean): void {
        if (newValue !== undefined) {
            this.populateUnsafeReasons(true);
            this.otherSafetyViewModel.isApplianceSafe = (newValue) ? this.otherSafetyViewModel.isApplianceSafe : false;
            this.disableApplianceSafe = !newValue;
        }
    }

    private obserConditionAsLeft(newValue: string, oldValue: string, onload: boolean): void {
        switch (newValue) {
            case "ID": // opt IMMEDIATELY DANGEROUS
            case "AR": // opt AT RISK
                this.filterLabelAttachedRemovedLookup("A");
                break;
            case "SS": // opt NOT TO CURRENT STD
            case "XC": // opt NOT COMMISSIONED
                this.filterLabelAttachedRemovedLookup("N");
                break;
            default:
                this.filterLabelAttachedRemovedLookup(undefined);
                break;
        }

        if (!!newValue
            && !onload
            && !!this.otherUnsafeViewModel.labelAttachedRemoved
            && this.labelAttachedRemovedLookup.some(x => x.value !== this.otherUnsafeViewModel.labelAttachedRemoved)) {
            this.otherUnsafeViewModel.labelAttachedRemoved = undefined;
        }
    }

    private filterLabelAttachedRemovedLookup(cat: string): void {
        if (cat) {
            this.labelAttachedRemovedLookup = this.toButtonListItemArray(this._safetyNoticeStatus.filter(x => x.safetyNoticeStatusCategory === cat),
                CatalogConstants.SAFETY_NOTICE_STATUS_ID, CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
        } else {
            this.labelAttachedRemovedLookup = this.toButtonListItemArray(this._safetyNoticeStatus,
                CatalogConstants.SAFETY_NOTICE_STATUS_ID, CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
        }
    }

    private setObservables(): void {
        if (this.otherSafetyViewModel) {
            this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "workedOnAppliance")
                .subscribe((newValue: boolean) => {
                    this.obserWorkedOnAppliance(newValue, false);
                }));
            this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "isApplianceSafe")
                .subscribe((newValue: boolean) => {
                    this.obserApplianceSafe(newValue, false, false);
                }));

            this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "toCurrentStandards")
                .subscribe((newValue: YesNoNa) => {
                    this.obserToCurrentStandards(newValue, YesNoNa.Na);
                }));
            this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "didYouVisuallyCheck")
                .subscribe((newValue: boolean) => {
                    this.obserDidYouVisuallyCheck(newValue, false);
                }));

            this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherUnsafeViewModel, "conditionAsLeft")
                .subscribe((newValue: string, oldValue: string) => {
                    this.obserConditionAsLeft(newValue, oldValue, false);
                }));
        }
    }

    private initOtherSafetyStatus(): void {
        if (this.otherSafetyViewModel) {
            this.obserWorkedOnAppliance(this.otherSafetyViewModel.workedOnAppliance, true);
            this.obserDidYouVisuallyCheck(this.otherSafetyViewModel.didYouVisuallyCheck, true);
            this.obserApplianceSafe(this.otherSafetyViewModel.isApplianceSafe, true, true);
            this.obserToCurrentStandards(this.otherSafetyViewModel.toCurrentStandards, null);
            this.obserConditionAsLeft(this.otherUnsafeViewModel.conditionAsLeft, null, true);
        }
    }

    private isCurrentStandardsRequired(): boolean {
        if (this.disableToCurrentStandards === true) {
            return false;
        } else if (this.otherSafetyViewModel && this.appliance && this.appliance.isSafetyRequired
            && (this.otherSafetyViewModel.isApplianceSafe === false || this.otherSafetyViewModel.toCurrentStandards !== YesNoNa.Yes)) {
            return true;
        }

        return false;
    }

    private loadCatalogs(): Promise<void> {
        return Promise.all([
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
                    this._safetyNoticeStatus = safetyNoticeStatus;
                }),
            this.buildNoYesList().then(noYes => this.didYouWorkOnApplianceLookup = noYes),
            this.buildNoYesList().then(noYes => this.didYouVisuallyCheckLookup = noYes),
            this.buildNoYesList().then(noYes => this.isApplianceSafeLookup = noYes),
            this.buildNoNaList().then(noNaList => this.toCurrentStandardsLookup = noNaList),
            this.buildNoYesList().then(noYes => this.ownedByCustomerLookup = noYes),
            this.buildNoYesList().then(noYes => this.letterLeftLookup = noYes),
            this.buildNoYesList().then(noYes => this.signatureObtainedLookup = noYes)
        ])
            .then(() => this.filterLabelAttachedRemovedLookup(undefined));
    }

    private hasAtLeastOneFieldPopulated(): boolean {
        if (this.otherSafetyViewModel &&
            ((this.otherSafetyViewModel.workedOnAppliance !== null && this.otherSafetyViewModel.workedOnAppliance !== undefined)
                || (this.otherSafetyViewModel.didYouVisuallyCheck !== null && this.otherSafetyViewModel.didYouVisuallyCheck !== undefined)
                || (this.otherSafetyViewModel.isApplianceSafe !== null && this.otherSafetyViewModel.isApplianceSafe !== undefined)
                || (this.otherSafetyViewModel.toCurrentStandards !== null && this.otherSafetyViewModel.toCurrentStandards !== undefined))) {
            return true;
        }

        return false;
    }

    private buildValidationRules(): Promise<void> {
        return this.buildValidation([
            {
                property: "otherSafetyViewModel.workedOnAppliance", condition: () => (this.otherSafetyViewModel && this.appliance && this.appliance.isSafetyRequired)
                    || this.hasAtLeastOneFieldPopulated()
            },
            {
                property: "otherSafetyViewModel.didYouVisuallyCheck", condition: () => (this.otherSafetyViewModel && this.appliance && this.appliance.isSafetyRequired)
                    || this.hasAtLeastOneFieldPopulated()
            },
            {
                property: "otherSafetyViewModel.isApplianceSafe", condition: () => (this.otherSafetyViewModel && this.appliance && this.appliance.isSafetyRequired)
                    || this.hasAtLeastOneFieldPopulated()
            },
            {
                property: "otherSafetyViewModel.toCurrentStandards", condition: () => (this.isCurrentStandardsRequired())
                    || this.hasAtLeastOneFieldPopulated()
            },
            { property: "otherUnsafeViewModel.report", condition: () => this.hasMandatoryUnsafeReasons() || this.hasAtLeastOneUnsafeFieldPopulated() },
            { property: "otherUnsafeViewModel.conditionAsLeft", condition: () => this.hasMandatoryUnsafeReasons() || this.hasAtLeastOneUnsafeFieldPopulated() },
            { property: "otherUnsafeViewModel.cappedTurnedOff", condition: () => this.hasMandatoryUnsafeReasons() || this.hasAtLeastOneUnsafeFieldPopulated() },
            { property: "otherUnsafeViewModel.labelAttachedRemoved", condition: () => this.hasMandatoryUnsafeReasons() || this.hasAtLeastOneUnsafeFieldPopulated() },
            { property: "otherUnsafeViewModel.ownedByCustomer", condition: () => this.hasMandatoryUnsafeReasons() || this.hasAtLeastOneUnsafeFieldPopulated() },
            { property: "otherUnsafeViewModel.letterLeft", condition: () => this.hasMandatoryUnsafeReasons() || this.hasAtLeastOneUnsafeFieldPopulated() },
            { property: "otherUnsafeViewModel.signatureObtained", condition: () => this.hasMandatoryUnsafeReasons() || this.hasAtLeastOneUnsafeFieldPopulated() },
        ]);
    }

    private removeObservables(): void {
        if (this._otherSafetySubscriptions) {
            this._otherSafetySubscriptions.forEach(x => {
                if (x) {
                    x.dispose();
                }
            });
        }
        this._otherSafetySubscriptions = [];
    }

    private resetLocalModels(): void {
        this.otherSafetyViewModel.didYouVisuallyCheck = undefined;
        this.otherSafetyViewModel.isApplianceSafe = undefined;
        this.otherSafetyViewModel.toCurrentStandards = undefined;
        this.clearUnSafeFields();
    }

    private clearUnSafeFields(): void {
        this.unsafeReasons = [];
        this.otherUnsafeViewModel.report = undefined;
        this.otherUnsafeViewModel.conditionAsLeft = undefined;
        this.otherUnsafeViewModel.labelAttachedRemoved = undefined;
        this.otherUnsafeViewModel.ownedByCustomer = undefined;
        this.otherUnsafeViewModel.letterLeft = undefined;
        this.otherUnsafeViewModel.signatureObtained = undefined;
        this.otherUnsafeViewModel.cappedTurnedOff = undefined;
    }

    private clearForWorkOnAppliance(onload: boolean): void {
        this.removeObservables();
        this.resetLocalModels();
        this.initOtherSafetyStatus();
        this.setObservables();
    }
}
