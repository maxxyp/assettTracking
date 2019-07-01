/// <reference path="./../../../../../typings/app.d.ts" />
import { observable } from "aurelia-binding";
import { inject } from "aurelia-framework";

import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { CatalogService } from "../../../business/services/catalogService";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { IPropertySafetyService } from "../../../business/services/interfaces/IPropertySafetyService";
import { PropertySafetyService } from "../../../business/services/propertySafetyService";
import { PropertyElectricalSafetyDetail } from "../../../business/models/propertyElectricalSafetyDetail";
import { ValidationService } from "../../../business/services/validationService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EditableViewModel } from "../../models/editableViewModel";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { EventAggregator } from "aurelia-event-aggregator";
import { UnsafeReason } from "../../../business/models/unsafeReason";
import { PropertyUnsafeDetail } from "../../../business/models/propertyUnsafeDetail";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";

@inject(JobService, EngineerService, LabelService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, PropertySafetyService)
export class ElectricalSafetyDetail extends EditableViewModel {

    @observable
    public iniEliReading: number;
    // @observable
    public noEliReadings: boolean;
    public noEliReadingsReason: string;
    public consumerUnitSatisfactoryLookup: ButtonListItem[];
    @observable
    public consumerUnitSatisfactory: boolean;

    public systemTypeLookup: ButtonListItem[];
    @observable
    public systemType: string;

    public rcdPresentLookup: ButtonListItem[];
    @observable
    public rcdPresent: string;

    public eliSafeAccordingToTopsLookup: ButtonListItem[];
    @observable
    public eliSafeAccordingToTops: boolean;
    @observable
    public ttSystemType: string;
    @observable
    public unableToCheckSystemType: string;
    public safeInTopsThreshold: number;
    public showEliSafeAccordingToTops: boolean;

    /* unsafe details */
    public reasons: UnsafeReason[];
    public report: string;
    public conditionAsLeftLookup: ButtonListItem[];
    @observable
    public conditionAsLeftSelected: string;
    public cappedTurnedOffLookup: ButtonListItem[];
    public cappedTurnedOffSelected: string;
    public labelAttachedRemovedLookup: ButtonListItem[];
    public labelAttachedRemovedSelected: string;
    public ownedByCustomerLookup: ButtonListItem[];
    public ownedByCustomerSelected: boolean;
    public letterLeftLookup: ButtonListItem[];
    public letterLeftSelected: boolean;
    public signatureObtainedLookup: ButtonListItem[];
    public signatureObtainedSelected: boolean;
    public unsafeDetailRequired: boolean;
    public iniEliReadingDecimalPlaces: number;
    /* unsafe details */

    public isLandlordJob: boolean;

    private _propertySafetyService: IPropertySafetyService;
    private _readyToShowToast: boolean;

    constructor(jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService,
        propertySafetyService: IPropertySafetyService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);

        this._catalogService = catalogService;
        this._propertySafetyService = propertySafetyService;
        this.consumerUnitSatisfactoryLookup = [];
        this.systemTypeLookup = [];
        this.rcdPresentLookup = [];
        this.eliSafeAccordingToTopsLookup = [];
    }

    public iniEliReadingChanged(): void {
        this.populateElectricalUnsafeReasons(this._readyToShowToast);
        this.setEliSafeAccordingToTops();
    }

    public conditionAsLeftSelectedChanged(): void {

        if (this.conditionAsLeftSelected) {
            // set the first one since its only got "A" in it
            this.labelAttachedRemovedSelected = this.labelAttachedRemovedLookup[0].value;
        } else {
            this.labelAttachedRemovedSelected = "";
        }
    }

    public systemTypeChanged(): void {
        this.populateElectricalUnsafeReasons(this._readyToShowToast);
        this.setEliSafeAccordingToTops();
    }

    public rcdPresentChanged(): void {
        this.populateElectricalUnsafeReasons(this._readyToShowToast);
    }

    public eliSafeAccordingToTopsChanged(): void {
        this.populateElectricalUnsafeReasons(this._readyToShowToast);
    }

    public ttSystemTypeChanged(): void {
        this.setEliSafeAccordingToTops();
    }

    public consumerUnitSatisfactoryChanged(): void {
        this.populateElectricalUnsafeReasons(this._readyToShowToast);
    }

    public activateAsync(): Promise<void> {
        return this.loadBusinessRules()
            .then(() => this.buildBusinessRules())
            .then(() => this.buildValidationRules())
            .then(() => this.loadCatalogs())
            .then(() => this.load())
            .then(() => this.showContent());
    }

    public toggleNoEliReadings(): void {
        this.noEliReadings = !this.noEliReadings;
        this.iniEliReading = null;
        this.populateElectricalUnsafeReasons(true);
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

                this.iniEliReading = safetyDetail.propertyElectricalSafetyDetail.eliReading;
                this.noEliReadingsReason = safetyDetail.propertyElectricalSafetyDetail.eliReadingReason;
                this.noEliReadings = safetyDetail.propertyElectricalSafetyDetail.noEliReadings;
                this.consumerUnitSatisfactory = safetyDetail.propertyElectricalSafetyDetail.consumerUnitSatisfactory;
                this.systemType = safetyDetail.propertyElectricalSafetyDetail.systemType;
                this.rcdPresent = safetyDetail.propertyElectricalSafetyDetail.rcdPresent;
                this.eliSafeAccordingToTops = safetyDetail.propertyElectricalSafetyDetail.eliSafeAccordingToTops;
                this.setInitialDataState(safetyDetail.propertyElectricalSafetyDetail.dataStateId, safetyDetail.propertyElectricalSafetyDetail.dataState);

                if (safetyDetail && safetyDetail.propertyUnsafeDetail) {
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

                return this.populateElectricalUnsafeReasons(this._readyToShowToast)
                    .then(() => { this._readyToShowToast = true; });
            });
    }

    protected saveModel(): Promise<void> {
        if (!this.hasReason()) {
            this.clearUnsafeDetail();
        }
        let safetyDetailModel = new PropertyElectricalSafetyDetail();
        safetyDetailModel.eliReading = this.iniEliReading;
        safetyDetailModel.noEliReadings = this.noEliReadings;
        safetyDetailModel.eliReadingReason = this.noEliReadingsReason;
        safetyDetailModel.consumerUnitSatisfactory = this.consumerUnitSatisfactory;
        safetyDetailModel.systemType = this.systemType;
        safetyDetailModel.rcdPresent = this.rcdPresent;
        safetyDetailModel.eliSafeAccordingToTops = this.eliSafeAccordingToTops;

        safetyDetailModel.dataState = this.getFinalDataState();

        let unsafeDetailModel: PropertyUnsafeDetail = new PropertyUnsafeDetail();

        unsafeDetailModel.cappedTurnedOff = this.cappedTurnedOffSelected;
        unsafeDetailModel.conditionAsLeft = this.conditionAsLeftSelected;
        unsafeDetailModel.labelAttachedRemoved = this.labelAttachedRemovedSelected;
        unsafeDetailModel.ownedByCustomer = this.ownedByCustomerSelected;
        unsafeDetailModel.signatureObtained = this.signatureObtainedSelected;
        unsafeDetailModel.letterLeft = this.letterLeftSelected;
        unsafeDetailModel.report = this.report;
        unsafeDetailModel.reasons = this.reasons ? this.reasons.map(r => r.catalogId) : [];

        return this._propertySafetyService.saveElectricalSafetyDetails(this.jobId, safetyDetailModel, unsafeDetailModel);
    }

    protected clearModel(): Promise<void> {
        this._readyToShowToast = false;
        // .DF_1582 noEliReadings must be cleared before iniEliReading due to the change handler on iniEliReadings
        //  firing off populateElectricalUnsafeReasons(). If we don't do this, when populateElectricalUnsafeReasons() gets fired
        //  it will use the old version of noEliReadings and register a false positive unsafe reason.
        this.noEliReadings = undefined;
        this.iniEliReading = undefined;

        this.noEliReadingsReason = undefined;

        this.consumerUnitSatisfactory = undefined;
        this.systemType = undefined;
        this.rcdPresent = undefined;
        this.eliSafeAccordingToTops = undefined;
        this.report = undefined;
        this.showEliSafeAccordingToTops = false;

        this.clearUnsafeDetail();
        this.clearReasons();

        this._readyToShowToast = true;
        return Promise.resolve();
    }

    private loadCatalogs(): Promise<void> {
        let catalogPromises = [
            this._catalogService.getSafetyActions()
                .then(safetyActions => {
                    this.cappedTurnedOffLookup = this.toButtonListItemArray(safetyActions, CatalogConstants.SAFETY_ACTION_ID, CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),

            this._catalogService.getSafetyNoticeTypes()
                .then(safetyNoticeTypes => {
                    let availableNoticeTypeCodes = this.getBusinessRule<string>("availableConditionAsLeftCodes").split(",");
                    let availableNoticeTypes = safetyNoticeTypes.filter(safetyNoticeType => availableNoticeTypeCodes.indexOf(safetyNoticeType.noticeType) > -1);

                    this.conditionAsLeftLookup = this.toButtonListItemArray(availableNoticeTypes, CatalogConstants.SAFETY_NOTICE_TYPE_ID, CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
                }),

            this._catalogService.getSafetyNoticeStatuses()
                .then(safetyNoticeStatuses => {

                    let availableNoticeStatusCodes = this.getBusinessRule<string>("availableLabelAttachedCodes").split(",");
                    let availableNoticeStatuses = safetyNoticeStatuses.filter(safetyNoticeStatus => availableNoticeStatusCodes.indexOf(safetyNoticeStatus.noticeStatus) > -1);

                    this.labelAttachedRemovedLookup = this.toButtonListItemArray(availableNoticeStatuses, CatalogConstants.SAFETY_NOTICE_STATUS_ID, CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                }),

            this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_RCD_PRESENT)
                .then(safetyReasonCats => {
                    this.rcdPresentLookup = this.toButtonListItemArray(safetyReasonCats, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),

            this._catalogService.getElectricalSystemTypes()
                .then(electricalSystemTypes => {
                    this.systemTypeLookup = this.toButtonListItemArray(electricalSystemTypes, CatalogConstants.ELECTRICAL_SYSTEM_TYPE_ID, CatalogConstants.ELECTRICAL_SYSTEM_TYPE_DESCRIPTION);
                }),

            this.buildNoYesList().then(yesNo => this.consumerUnitSatisfactoryLookup = yesNo),
            this.buildNoYesList().then(yesNo => this.eliSafeAccordingToTopsLookup = yesNo),
            this.buildNoYesList().then(yesNo => this.ownedByCustomerLookup = yesNo),
            this.buildNoYesList().then(yesNo => this.letterLeftLookup = yesNo),
            this.buildNoYesList().then(yesNo => this.signatureObtainedLookup = yesNo),
        ];

        return Promise.all(catalogPromises).then(() => { });
    }

    private hasReason(): boolean {
        return this.reasons && this.reasons.length > 0;
    }

    private populateElectricalUnsafeReasons(isToastRequired: boolean): Promise<void> {
        const rcdPresentThreshold: number = this.getBusinessRule<number>("rcdPresentThreshold");
        let safetyDetail: PropertyElectricalSafetyDetail = new PropertyElectricalSafetyDetail();
        safetyDetail.consumerUnitSatisfactory = this.consumerUnitSatisfactory;
        safetyDetail.systemType = this.systemType;
        safetyDetail.noEliReadings = this.noEliReadings;
        safetyDetail.rcdPresent = this.rcdPresent;
        safetyDetail.eliReading = this.iniEliReading;
        safetyDetail.eliSafeAccordingToTops = this.eliSafeAccordingToTops;

        return this._propertySafetyService.populateElectricalUnsafeReasons(safetyDetail,
            this.unableToCheckSystemType,
            this.ttSystemType,
            rcdPresentThreshold,
            this.safeInTopsThreshold)
            .then((reasons) => {
                let currentWarnings: string[] = [];

                if (this.reasons) {
                    this.reasons.forEach(reason => {
                        currentWarnings.push(reason.label);
                    });
                }

                this.reasons = reasons;

                if (this.reasons) {
                    /* If there are reasons that we didn't have before then show a toast for them */
                    this.reasons.forEach(reason => {
                        reason.label = this.getParameterisedLabel(reason.lookupId + "Unsafe", reason.params);
                        if (isToastRequired && currentWarnings.indexOf(reason.label) === -1) {
                            this.showWarning(this.getLabel("unsafeToast"), reason.label);
                        }
                    });
                }
            });
    }

    private clearUnsafeDetail(): void {
        this.conditionAsLeftSelected = undefined;
        this.cappedTurnedOffSelected = undefined;
        this.labelAttachedRemovedSelected = undefined;
        this.ownedByCustomerSelected = undefined;
        this.letterLeftSelected = undefined;
        this.signatureObtainedSelected = undefined;
    }

    private clearReasons(): void {
        this.reasons = [];
    }

    private buildBusinessRules(): void {
        this.ttSystemType = this.getBusinessRule<string>("ttSystemType");
        this.unableToCheckSystemType = this.getBusinessRule<string>("unableToCheckSystemType");
        this.safeInTopsThreshold = this.getBusinessRule<number>("safeInTopsThreshold");
        this.iniEliReadingDecimalPlaces = this.getBusinessRule<number>("iniEliReadingDecimalPlaces");

    }

    private buildValidationRules(): Promise<void> {
        return this.buildValidation([
            { property: "iniEliReading", condition: () => !this.noEliReadings },
            {
                property: "rcdPresent",
                condition: () => (this.systemType === this.ttSystemType) && !this.noEliReadings
            },
            {
                property: "eliSafeAccordingToTops",
                condition: () => (this.systemType !== this.ttSystemType) && (this.iniEliReading > this.safeInTopsThreshold)
            },
            { property: "conditionAsLeftSelected", condition: () => this.hasReason() },
            { property: "cappedTurnedOffSelected", condition: () => this.hasReason() },
            { property: "labelAttachedRemovedSelected", condition: () => this.hasReason() },
            { property: "ownedByCustomerSelected", condition: () => this.hasReason() },
            { property: "letterLeftSelected", condition: () => this.hasReason() },
            { property: "signatureObtainedSelected", condition: () => this.hasReason() },
            { property: "report", condition: () => this.hasReason() }
        ]);
    }

    private setEliSafeAccordingToTops(): void {
        this.showEliSafeAccordingToTops = false;

        if (this.systemType && this.ttSystemType && this.iniEliReading !== undefined && this.safeInTopsThreshold) {
            if (this.systemType !== this.ttSystemType && this.iniEliReading > this.safeInTopsThreshold) {
                this.showEliSafeAccordingToTops = true;
            } else {
                this.eliSafeAccordingToTops = undefined;
            }
        }
    }
}
