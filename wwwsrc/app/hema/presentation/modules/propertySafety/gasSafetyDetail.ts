/// <reference path="./../../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { CatalogService } from "../../../business/services/catalogService";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { IPropertySafetyService } from "../../../business/services/interfaces/IPropertySafetyService";
import { PropertySafetyService } from "../../../business/services/propertySafetyService";
import { PropertyGasSafetyDetail as PropertyGasSafetyDetailBusinessModel } from "../../../business/models/propertyGasSafetyDetail";
import { EventAggregator } from "aurelia-event-aggregator";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { observable } from "aurelia-binding";
import { EditableViewModel } from "../../models/editableViewModel";
import { ValidationService } from "../../../business/services/validationService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { UnsafeReason } from "../../../business/models/unsafeReason";
import { PropertyUnsafeDetail } from "../../../business/models/propertyUnsafeDetail";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";

@inject(CatalogService, LabelService, PropertySafetyService, EventAggregator, DialogService,
    JobService, EngineerService, ValidationService, BusinessRuleService)
export class GasSafetyDetail extends EditableViewModel {

    public iniEliReadingLookup: ButtonListItem[];
    @observable()
    public iniEliReadingSelected: string;
    public noEliReadingsReasonLookup: ButtonListItem[];
    public noEliReadingsReasonSelected: string;
    public safetyAdviceNoticeLeftLookup: ButtonListItem[];
    public safetyAdviceNoticeLeftSelected: boolean;
    public reasonWhyText: string;
    public gasInstallationTightnessTestDoneLookup: ButtonListItem[];
    @observable()
    public gasInstallationTightnessTestDoneSelected: boolean;
    @observable()
    public pressureDrop: number;
    public gasMeterInstallationSatisfactoryLookup: ButtonListItem[];
    @observable()
    public gasMeterInstallationSatisfactorySelected: string;
    public gasMeterInstallationSatisfactoryDisabled: boolean;

    /* unsafe situation */
    public reasons: UnsafeReason[];
    public report: string;
    public conditionAsLeftLookup: ButtonListItem[];
    @observable()
    public conditionAsLeftSelected: string;
    public cappedTurnedOffLookup: ButtonListItem[];
    @observable()
    public cappedTurnedOffSelected: string;
    public cappedTurnedOffSelectedDisabled: boolean;
    public labelAttachedRemovedLookup: ButtonListItem[];
    public labelAttachedRemovedSelected: string;
    public ownedByCustomerLookup: ButtonListItem[];
    public ownedByCustomerSelected: boolean;
    public letterLeftLookup: ButtonListItem[];
    public letterLeftSelected: boolean;
    public signatureObtainedLookup: ButtonListItem[];
    public signatureObtainedSelected: boolean;
    /* unsafe situation */

    public pressureDropDecimalPlaces: number;
    public isLandlordJob: boolean;
    public showUnsafeWarningMsg: boolean;

    private _propertySafetyService: IPropertySafetyService;
    private _pressureDropThreshold: number;
    private _readyToShowToast: boolean;
    private _gasMeterInstallationSatisfactoryNotApplicableOption: string;
    private _gasMeterInstallationSatisfactoryNotApplicableOptionYes: string;
    private _labelAttachedDisableOptions: string[];
    private _cappedTurnedOffDisabledOptions: string[];
    private _gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm: string;
    private _gasSafetyModel: PropertyGasSafetyDetailBusinessModel;
    private _conditionAsLeftDisableOptions: string[];
    private _conditionAsLeftSelectedOptions: string[];
    private _notToCurrentStdConditionAsLeftOptionSelected: string[];
    private _cappedTurnedOffDisabledOptionsForNotToCurrentStd: string[];
    private _labelAttachedDisabledOptionsForNotToCurrentStd: string[];
    private _notToCurrentStdConditionAsLeftOptionSelectedSS: string;
    private _conditionAsLeftImmediatelyDangerousOption: string;
    private _cappedTurnedOffOptionsForWarningMsg: string[];

    constructor(catalogService: ICatalogService,
                labelService: ILabelService,
                propertySafetyService: IPropertySafetyService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                jobService: IJobService,
                engineerService: IEngineerService,
                validationService: IValidationService,
                businessRuleService: IBusinessRuleService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);

        this._propertySafetyService = propertySafetyService;
        this.iniEliReadingLookup = [];
        this.noEliReadingsReasonLookup = [];
        this.gasMeterInstallationSatisfactoryLookup = [];
        this.gasMeterInstallationSatisfactoryDisabled = false;
        this.cappedTurnedOffSelectedDisabled = false;
        this.showUnsafeWarningMsg = false;
    }

    private static numericComparisonSorter(): (a: any, b: any) => number {
        return (a, b) => {
            let aVal = +a[CatalogConstants.SAFETY_READING_CAT_DESCRIPTION].replace("<", "0").replace(">", "100");
            let bVal = +b[CatalogConstants.SAFETY_READING_CAT_DESCRIPTION].replace("<", "0").replace(">", "100");

            if (aVal > bVal) {
                return 1;
            }
            if (aVal < bVal) {
                return -1;
            }
            return 0;
        };
    }

    public activateAsync(): Promise<any> {
        return this.loadBusinessRules()
            .then(() => this.buildValidationRules())
            .then(() => this.buildBusinessRules())
            .then(() => this.loadCatalogs())
            .then(() => this.load())
            .then(() => this.removeOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOption))
            .then(() => this.showContent());
    }

    public iniEliReadingSelectedChanged(newValue: string, oldValue: string): Promise<void> {
        return this.populateGasUnsafeReasons(this._readyToShowToast);
    }

    public gasInstallationTightnessTestDoneSelectedChanged(newValue: boolean, oldValue: boolean): Promise<void> {
        if (newValue === null || newValue === undefined || this.gasInstallationTightnessTestDoneSelected === false) {
            this.pressureDrop = undefined;
            this.gasMeterInstallationSatisfactoryDisabled = false;
        }

        if (newValue === false) {
            this.conditionAsLeftSelected = undefined;
            this.cappedTurnedOffSelected = undefined;
            this.labelAttachedRemovedSelected = undefined;
            this.removeOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionYes);
            this.removeOptionFromConditionAsLeftLookup(this._notToCurrentStdConditionAsLeftOptionSelectedSS);
        } else if (newValue === true) {
            return this.resetOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm)
                .then(() => this.resetOptionFromConditionAsLeftLookup())
                .then(() => this.populateGasUnsafeReasons(this._readyToShowToast));
        }
        return this.resetOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm)
            .then(() => this.populateGasUnsafeReasons(this._readyToShowToast));
    }

    public pressureDropChanged(newValue: number, oldValue: number): Promise<void> {

        if (newValue > this._pressureDropThreshold) {
            this.conditionAsLeftSelected = undefined;
            this.cappedTurnedOffSelected = undefined;
            this.labelAttachedRemovedSelected = undefined;
            this.gasMeterInstallationSatisfactorySelected = "No";
            this.gasMeterInstallationSatisfactoryDisabled = true;
        } else {
            this.gasMeterInstallationSatisfactoryDisabled = false;
        }

        // disable ConditionAsLeft buttons SS, XC if pressuredrop > 8.
        this.conditionAsLeftLookup.map(btn => {
            btn.disabled = (this._conditionAsLeftDisableOptions.indexOf(btn.value) > -1 && newValue > this._pressureDropThreshold);
        });

        return this.populateGasUnsafeReasons(this._readyToShowToast);
    }

    public gasMeterInstallationSatisfactorySelectedChanged(newValue: string, oldValue: string): Promise<void> {

        return this.populateGasUnsafeReasons(this._readyToShowToast);
    }

    public conditionAsLeftSelectedChanged(newValue: string): void {
        // disable Not Applicable CappedTurnedOff Option button when ConditionAsLeft selected value is equal to anyone of these (AR, ID, XC).
        // disable Capped, Not Capped, TuredOff, Not TurnedOff CappedTurnedOff Option buttons when ConditionAsLeft selected value is equal to Not to current std.
        this.cappedTurnedOffLookup.forEach(btn => {
            btn.disabled = (this._conditionAsLeftSelectedOptions.some(option => option === newValue) && this._cappedTurnedOffDisabledOptions.indexOf(btn.value) > -1) ||
                (this._notToCurrentStdConditionAsLeftOptionSelected.some(option => option === newValue) &&
                    this._cappedTurnedOffDisabledOptionsForNotToCurrentStd.indexOf(btn.value) > -1);

            this.cappedTurnedOffSelected = (btn.disabled && btn.value === this.cappedTurnedOffSelected) ? undefined : this.cappedTurnedOffSelected;
        });

        // disable all the CappedTurnedOff label attached/removed Option buttons except Attached option when ConditionAsLeft selected value is equal to anyone of these (AR, ID, XC).
        // disable Attached and Not attached label attached/removed Option buttons when ConditionAsLeft selected value is equal to Not to current std.
        this.labelAttachedRemovedLookup.forEach(btn => {
            btn.disabled = (this._conditionAsLeftSelectedOptions.some(option => option === newValue) && this._labelAttachedDisableOptions.indexOf(btn.value) > -1) ||
                (this._notToCurrentStdConditionAsLeftOptionSelected.some(option => option === newValue) &&
                    this._labelAttachedDisabledOptionsForNotToCurrentStd.indexOf(btn.value) > -1);
            this.labelAttachedRemovedSelected = (btn.disabled && btn.value === this.labelAttachedRemovedSelected) ? undefined : this.labelAttachedRemovedSelected;
        });

        this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();
    }

    public cappedTurnedOffSelectedChanged(newValue: string): void {
        this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();
    }

    public get isNoEliReadingTaken(): boolean {
        return this.iniEliReadingSelected === CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN;
    }

    protected loadModel(): Promise<void> {
        return this._jobService.getJob(this.jobId)
            .then((job) => {
                if (job) {
                    this.isLandlordJob = job.isLandlordJob;
                } else {
                    this.isLandlordJob = false;
                }
            })
            .then(() => this._propertySafetyService.getPropertySafetyDetails(this.jobId))
            .then((safetyDetail) => {
                this._readyToShowToast = false;
                if (safetyDetail) {
                    if (safetyDetail.propertyGasSafetyDetail) {
                        this.iniEliReadingSelected = safetyDetail.propertyGasSafetyDetail.eliReading;
                        this.gasInstallationTightnessTestDoneSelected = safetyDetail.propertyGasSafetyDetail.gasInstallationTightnessTestDone;
                        this.gasMeterInstallationSatisfactorySelected = safetyDetail.propertyGasSafetyDetail.gasMeterInstallationSatisfactory;
                        this.noEliReadingsReasonSelected = safetyDetail.propertyGasSafetyDetail.eliReadingReason;
                        this.reasonWhyText = safetyDetail.propertyGasSafetyDetail.safetyAdviseNoticeLeftReason;
                        this.pressureDrop = safetyDetail.propertyGasSafetyDetail.pressureDrop;
                        this.safetyAdviceNoticeLeftSelected = safetyDetail.propertyGasSafetyDetail.safetyAdviseNoticeLeft;
                        this._gasSafetyModel = safetyDetail.propertyGasSafetyDetail;
                        this.setInitialDataState(safetyDetail.propertyGasSafetyDetail.dataStateId, safetyDetail.propertyGasSafetyDetail.dataState);
                    } else {
                        this._gasSafetyModel = new PropertyGasSafetyDetailBusinessModel();
                    }

                    if (safetyDetail.propertyUnsafeDetail) {
                        this.report = safetyDetail.propertyUnsafeDetail.report;
                        this.conditionAsLeftSelected = safetyDetail.propertyUnsafeDetail.conditionAsLeft;
                        this.cappedTurnedOffSelected = safetyDetail.propertyUnsafeDetail.cappedTurnedOff;
                        this.labelAttachedRemovedSelected = safetyDetail.propertyUnsafeDetail.labelAttachedRemoved;
                        this.ownedByCustomerSelected = safetyDetail.propertyUnsafeDetail.ownedByCustomer;
                        this.letterLeftSelected = safetyDetail.propertyUnsafeDetail.letterLeft;
                        this.signatureObtainedSelected = safetyDetail.propertyUnsafeDetail.signatureObtained;
                    } else {
                        this.clearUnsafeDetail();
                    }
                } else {
                    this._gasSafetyModel = new PropertyGasSafetyDetailBusinessModel();
                    this.clearUnsafeDetail();
                }

                return this.populateGasUnsafeReasons(this._readyToShowToast)
                    .then(() => {
                        this._readyToShowToast = true;
                    });
            });
    }

    protected saveModel(): Promise<void> {
        if (this.reasons && this.reasons.length === 0) {
            this.clearUnsafeDetail();
        }

        this._gasSafetyModel.eliReading = this.iniEliReadingSelected;
        this._gasSafetyModel.eliReadingReason = this.isNoEliReadingTaken ? this.noEliReadingsReasonSelected : undefined;
        this._gasSafetyModel.gasInstallationTightnessTestDone = this.gasInstallationTightnessTestDoneSelected;
        this._gasSafetyModel.gasMeterInstallationSatisfactory = this.gasMeterInstallationSatisfactorySelected;
        this._gasSafetyModel.pressureDrop = this.pressureDrop;
        this._gasSafetyModel.safetyAdviseNoticeLeft = this.safetyAdviceNoticeLeftSelected;
        this._gasSafetyModel.safetyAdviseNoticeLeftReason = this.reasonWhyText;

        let gasUnsafeDetailModel: PropertyUnsafeDetail = new PropertyUnsafeDetail();

        gasUnsafeDetailModel.cappedTurnedOff = this.cappedTurnedOffSelected;
        gasUnsafeDetailModel.conditionAsLeft = this.conditionAsLeftSelected;
        gasUnsafeDetailModel.labelAttachedRemoved = this.labelAttachedRemovedSelected;
        gasUnsafeDetailModel.ownedByCustomer = this.ownedByCustomerSelected;
        gasUnsafeDetailModel.signatureObtained = this.signatureObtainedSelected;
        gasUnsafeDetailModel.letterLeft = this.letterLeftSelected;
        gasUnsafeDetailModel.report = this.report;
        gasUnsafeDetailModel.reasons = this.reasons ? this.reasons.map(r => r.catalogId) : [];

        this._gasSafetyModel.dataState = this.getFinalDataState();

        return this._propertySafetyService.saveGasSafetyDetails(this.jobId, this._gasSafetyModel, gasUnsafeDetailModel);
    }

    protected clearModel(): Promise<void> {
        this._readyToShowToast = false;
        this.iniEliReadingSelected = undefined;
        this.gasInstallationTightnessTestDoneSelected = undefined;
        this.gasMeterInstallationSatisfactorySelected = undefined;
        this.noEliReadingsReasonSelected = undefined;
        this.reasonWhyText = undefined;
        this.pressureDrop = undefined;
        this.safetyAdviceNoticeLeftSelected = undefined;

        this.clearReasons();

        this.clearUnsafeDetail();
        this._readyToShowToast = true;
        return this.resetOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm);
    }

    private buildBusinessRules(): Promise<void> {
        this._pressureDropThreshold = this.getBusinessRule<number>("pressureDropThreshold");
        this.pressureDropDecimalPlaces = this.getBusinessRule<number>("pressureDropDecimalPlaces");
        this._gasMeterInstallationSatisfactoryNotApplicableOption = this.getBusinessRule<string>("gasMeterInstallationSatisfactoryNotApplicableOption");
        this._gasMeterInstallationSatisfactoryNotApplicableOptionYes = this.getBusinessRule<string>("gasMeterInstallationSatisfactoryNotApplicableOptionYes");
        this._labelAttachedDisableOptions = (this.getBusinessRule<string>("labelAttachedDisableOptions") || "").split(",");
        this._cappedTurnedOffDisabledOptions = (this.getBusinessRule<string>("cappedTurnedOffDisabledOptions") || "").split(",");
        this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm = (this.getBusinessRule<string>("gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm") || "");
        this._conditionAsLeftDisableOptions = (this.getBusinessRule<string>("conditionAsLeftDisableOptions") || "").split(",");
        this._conditionAsLeftSelectedOptions = (this.getBusinessRule<string>("conditionAsLeftSelectedOptions") || "").split(",");
        this._notToCurrentStdConditionAsLeftOptionSelected = (this.getBusinessRule<string>("notToCurrentStdConditionAsLeftOptionSelected") || "").split(",");
        this._cappedTurnedOffDisabledOptionsForNotToCurrentStd = (this.getBusinessRule<string>("cappedTurnedOffDisabledOptionsForNotToCurrentStd") || "").split(",");
        this._labelAttachedDisabledOptionsForNotToCurrentStd = (this.getBusinessRule<string>("labelAttachedDisabledOptionsForNotToCurrentStd") || "").split(",");
        this._notToCurrentStdConditionAsLeftOptionSelectedSS = (this.getBusinessRule<string>("notToCurrentStdConditionAsLeftOptionSelectedSS") || "");

        return this._businessRuleService.getQueryableRuleGroup("gasSafety").then((gasSafetyRuleGroup) => {
            this._conditionAsLeftImmediatelyDangerousOption = gasSafetyRuleGroup.getBusinessRule<string>("conditionAsLeftImmediatelyDangerousOption");
            this._cappedTurnedOffOptionsForWarningMsg = gasSafetyRuleGroup.getBusinessRule<string>("cappedTurnedOffOptionsForWarningMsg").split(",");
        });
    }

    private removeOptionFromGasMeterInstallationSatisfactoryLookup(option: string): void {
        if (this.isLandlordJob || this.gasInstallationTightnessTestDoneSelected) {
            let buttonListItem = this.gasMeterInstallationSatisfactoryLookup
                .find(btnListItem => (btnListItem.value === option));
            if (buttonListItem) {
                let index = this.gasMeterInstallationSatisfactoryLookup.indexOf(buttonListItem);
                if (index !== -1) {
                    this.gasMeterInstallationSatisfactoryLookup.splice(index, 1);
                }
            }
        }
    }

    // repopulate list and then remove the item as per removeOptionFromGasMeterInstallationSatisfactoryLookup
    private resetOptionFromGasMeterInstallationSatisfactoryLookup(option: string): Promise<void> {
        this.gasMeterInstallationSatisfactoryLookup = [];
        return this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_GAS_INST_SAT)
            .then((lookup) => {
                this.gasMeterInstallationSatisfactoryLookup = this.toButtonListItemArray(lookup,
                    CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION,
                    CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);

                this.removeOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOption);
            });

    }

    private removeOptionFromConditionAsLeftLookup(option: string): void {
        if (this.isLandlordJob) {
            let buttonListItem = this.conditionAsLeftLookup
                .find(btnListItem => (btnListItem.value === option));
            if (buttonListItem) {
                let index = this.conditionAsLeftLookup.indexOf(buttonListItem);
                if (index !== -1) {
                    this.conditionAsLeftLookup.splice(index, 1);
                }
            }
        }
    }

    // repopulate list and then remove the item as per removeOptionFromConditionAsLeftLookup
    private resetOptionFromConditionAsLeftLookup(): Promise<void> {
        this.conditionAsLeftLookup = [];
        return this._catalogService.getSafetyNoticeTypes()
            .then(safetyNoticeTypes => {
                this.conditionAsLeftLookup = this.toButtonListItemArray(safetyNoticeTypes,
                    CatalogConstants.SAFETY_NOTICE_TYPE_ID,
                    CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
            });
    }

    private loadCatalogs(): Promise<void> {
        let catalogPromises = [
            this._catalogService.getSafetyActions()
                .then(safetyActions => {
                    this.cappedTurnedOffLookup = this.toButtonListItemArray(safetyActions, CatalogConstants.SAFETY_ACTION_ID, CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),
            this.resetOptionFromConditionAsLeftLookup(),
            this._catalogService.getSafetyNoticeStatuses()
                .then(safetyNoticeStatus => {
                    this.labelAttachedRemovedLookup = this.toButtonListItemArray(safetyNoticeStatus, CatalogConstants.SAFETY_NOTICE_STATUS_ID, CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                })
        ];
        return Promise.all(catalogPromises)
            .then(() =>
                Promise.all([
                    this._catalogService.getSafetyReadingCats(CatalogConstants.SAFETY_READING_CAT_GROUP_INIT_ELI_READING),
                    this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_ELI_READ_WHY_NOT),
                    this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_GAS_INST_SAT),
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesList(),
                    this.buildNoYesList()])
                    .then((promiseResults) => {

                        let iniEliReadingCatalog: any[] = promiseResults[0];
                        let noEliReadingCatalog: any[] = promiseResults[1];
                        let gasMeterInstallationSatisfactoryCatalog: any[] = promiseResults[2];

                        this.iniEliReadingLookup = this.toButtonListItemArray(iniEliReadingCatalog,
                            CatalogConstants.SAFETY_READING_CAT_ID,
                            CatalogConstants.SAFETY_READING_CAT_DESCRIPTION,
                            GasSafetyDetail.numericComparisonSorter());

                        // the catalog itself doesn't have a value for "no eli readings taken"
                        const noEliReadingslabelKey = "noEliReadings";
                        this.iniEliReadingLookup.push(new ButtonListItem(this.labels[noEliReadingslabelKey], CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN, false));

                        this.noEliReadingsReasonLookup = this.toButtonListItemArray(noEliReadingCatalog,
                            CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION,
                            CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);

                        this.gasMeterInstallationSatisfactoryLookup = this.toButtonListItemArray(gasMeterInstallationSatisfactoryCatalog,
                            CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION,
                            CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);

                        this.safetyAdviceNoticeLeftLookup = promiseResults[3];
                        this.gasInstallationTightnessTestDoneLookup = promiseResults[4];

                        this.ownedByCustomerLookup = promiseResults[5];
                        this.letterLeftLookup = promiseResults[6];
                        this.signatureObtainedLookup = promiseResults[7];
                    }));
    }

    private populateGasUnsafeReasons(isToastRequired: boolean): Promise<void> {
        const pressureDropThreshold: number = this.getBusinessRule<number>("pressureDropThreshold");
        const installationSatisfactoryNoType: string = this.getBusinessRule<string>("gasInstallationNotSatisfactoryNoType");
        const installationSatisfactoryNoMeterType: string = this.getBusinessRule<string>("gasInstallationNotSatisfactoryNoMeterType");

        return this._propertySafetyService.populateGasUnsafeReasons(this.pressureDrop,
            this.gasMeterInstallationSatisfactorySelected,
            pressureDropThreshold,
            installationSatisfactoryNoType,
            installationSatisfactoryNoMeterType,
            this.iniEliReadingSelected === CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN)
            .then((latestUnsafeReasons) => {

                let currentWarnings: string[] = [];

                if (this.reasons) {
                    this.reasons.forEach(reason => {
                        currentWarnings.push(reason.label);
                    });
                }

                this.reasons = latestUnsafeReasons;

                if (this.reasons) {
                    /* If there are reasons that we didn't have before then show a toast for them */
                    this.reasons.forEach(reason => {
                        reason.label = this.getParameterisedLabel(reason.lookupId + "Unsafe", reason.params);
                        if (isToastRequired && currentWarnings.indexOf(reason.label) === -1) {
                            this.showWarning(this.getLabel("unsafeToast"), reason.label);
                        }
                    });
                }
            })
            .then(() => this.validateAllRules());
    }

    private clearUnsafeDetail(): void {
        this.report = undefined;
        this.conditionAsLeftSelected = undefined;
        this.cappedTurnedOffSelected = undefined;
        this.labelAttachedRemovedSelected = undefined;
        this.ownedByCustomerSelected = undefined;
        this.letterLeftSelected = undefined;
        this.signatureObtainedSelected = undefined;
    }

    private clearReasons(): void {
        this.reasons = [];
        this.gasMeterInstallationSatisfactoryDisabled = false;
    }

    private shouldValidateReportFields(): boolean {
        let isAMandatoryUnsafeReasonPresent = this.reasons && this.reasons.filter(x => x.isMandatory).length > 0;
        let isAnyUnsafeReasonPresent = this.reasons && this.reasons.length > 0;
        let isAnyReportFieldCompleted = !!(this.conditionAsLeftSelected || this.cappedTurnedOffSelected || this.labelAttachedRemovedSelected
            || this.ownedByCustomerSelected || this.letterLeftSelected || this.signatureObtainedSelected
            || this.report);

        return isAMandatoryUnsafeReasonPresent || (isAnyUnsafeReasonPresent && isAnyReportFieldCompleted);
    }

    private buildValidationRules(): Promise<void> {
        return this.buildValidation([
            {property: "reasonWhyText", condition: () => this.safetyAdviceNoticeLeftSelected === true},
            {property: "pressureDrop", condition: () => this.gasInstallationTightnessTestDoneSelected === true},
            {
                property: "noEliReadingsReasonSelected",
                condition: () => this.iniEliReadingSelected === CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN
            },
            {
                property: "conditionAsLeftSelected",
                groups: ["unsafeReport"],
                condition: () => this.shouldValidateReportFields()
            },
            {
                property: "cappedTurnedOffSelected",
                groups: ["unsafeReport"],
                condition: () => this.shouldValidateReportFields()
            },
            {
                property: "labelAttachedRemovedSelected",
                groups: ["unsafeReport"],
                condition: () => this.shouldValidateReportFields()
            },
            {
                property: "ownedByCustomerSelected",
                groups: ["unsafeReport"],
                condition: () => this.shouldValidateReportFields()
            },
            {
                property: "letterLeftSelected",
                groups: ["unsafeReport"],
                condition: () => this.shouldValidateReportFields()
            },
            {
                property: "signatureObtainedSelected",
                groups: ["unsafeReport"],
                condition: () => this.shouldValidateReportFields()
            },
            {property: "report", groups: ["unsafeReport"], condition: () => this.shouldValidateReportFields()}
        ]);
    }

    private showUnsafeWarningMessage(): boolean {
        return this.conditionAsLeftSelected
            && this.cappedTurnedOffSelected
            && this.conditionAsLeftSelected === this._conditionAsLeftImmediatelyDangerousOption
            && this._cappedTurnedOffOptionsForWarningMsg.some(c => this.cappedTurnedOffSelected === c);
    }
}
