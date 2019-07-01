/// <reference path="./../../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {IPropertySafetyService} from "../../../business/services/interfaces/IPropertySafetyService";
import {PropertySafetyService} from "../../../business/services/propertySafetyService";
import {LabelService} from "../../../business/services/labelService";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {BaseViewModel} from "../../models/baseViewModel";
import {JobService} from "../../../business/services/jobService";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {ICatalogService} from "../../../business/services/interfaces/ICatalogService";
import {CatalogService} from "../../../business/services/catalogService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {ISftyReasonCat} from "../../../business/models/reference/ISftyReasonCat";
import {CatalogConstants} from "../../../business/services/constants/catalogConstants";

@inject(LabelService, EventAggregator, DialogService, PropertySafetyService, JobService, CatalogService)
export class PreviousSafetyDetail extends BaseViewModel {

    public hasData: boolean;

    public report: string;
    public lastVisitDate: string;
    public safetyNoticeNotLeftReason: string;
    public unsafeSituation: string;
    public conditionAsLeft: string;
    public cappedTurnedOff: string;
    public labelAttached: string;
    public ownedByCustomer: string;
    public letterLeft: string;
    public signatureObtained: string;

    private _propertySafetyService: IPropertySafetyService;
    private _jobId: string;
    private _jobService: IJobService;
    private _catalogService: ICatalogService;

    private _unsafeReasonLookup: ISftyReasonCat[];

    constructor(
                labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                propertySafetyService: IPropertySafetyService,
                jobService: IJobService,
                catalogService: ICatalogService) {
        super(labelService, eventAggregator, dialogService);

        this._propertySafetyService = propertySafetyService;
        this._jobService = jobService;
        this._catalogService = catalogService;
    }

    public activateAsync(params: { jobId: string }): Promise<any> {
        this._jobId = params.jobId;
        return this._jobService.getJob(this._jobId).then(job => {
            this.hasData = !!(job.propertySafety && (job.propertySafety.previousPropertySafetyDetail));
            this.showContent();
        });
    }

    public attachedAsync(): Promise<void> {
        return this.loadCatalogs().then(() => {
            return this._propertySafetyService.getPropertySafetyDetails(this._jobId)
                .then((safetyDetail) => {
                    let previousPropertySafety = safetyDetail.previousPropertySafetyDetail;
                    if (!previousPropertySafety) {
                        return;
                    }

                    this.lastVisitDate = previousPropertySafety.lastVisitDate;
                    this.safetyNoticeNotLeftReason = previousPropertySafety.safetyNoticeNotLeftReason;
                    this.report = previousPropertySafety.report;

                    if (previousPropertySafety.reasons) {
                        let reasonDescriptions: string[] = [];
                        previousPropertySafety.reasons.forEach(x => {
                            let unsafeReasonResult = this._unsafeReasonLookup.find(c => c.safetyReasonCategoryCode === x);
                            if (unsafeReasonResult && unsafeReasonResult.safetyReasonCategoryReason) {
                                reasonDescriptions.push(unsafeReasonResult.safetyReasonCategoryReason);
                            }
                        });
                        this.unsafeSituation = reasonDescriptions.join(",");
                    }

                    this._catalogService.getSafetyNoticeType(previousPropertySafety.conditionAsLeft)
                        .then((conditionAsLeftResult) => {
                            if (conditionAsLeftResult) {
                                this.conditionAsLeft = conditionAsLeftResult.safetyNoticeTypeDescription;
                            }
                        });

                    this._catalogService.getSafetyAction(previousPropertySafety.cappedOrTurnedOff)
                        .then((cappedTurnedOffResult) => {
                            if (cappedTurnedOffResult) {
                                this.cappedTurnedOff = cappedTurnedOffResult.safetyActionDescription;
                            }
                        });

                    this._catalogService.getSafetyNoticeStatus(previousPropertySafety.labelAttachedOrRemoved)
                        .then((labelAttachedResult) => {
                            if (labelAttachedResult) {
                                this.labelAttached = labelAttachedResult.safetyNoticeStatusDescription;
                            }
                        });

                    this.ownedByCustomer = previousPropertySafety.ownedByCustomer ? "Yes" : "No";
                    this.letterLeft = previousPropertySafety.letterLeft ? "Yes" : "No";
                    this.signatureObtained = previousPropertySafety.signatureObtained ? "Yes" : "No";

                });
        });
    }

    private loadCatalogs(): Promise<void> {
        return this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_UNSAFE_REASON)
                .then((safetyReasons) => {
                    this._unsafeReasonLookup = safetyReasons;
                });
    }

}
