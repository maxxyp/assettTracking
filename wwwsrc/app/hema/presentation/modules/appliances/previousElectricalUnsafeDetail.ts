/// <reference path="./../../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {Redirect } from "aurelia-router";
import {IApplianceService} from "../../../business/services/interfaces/IApplianceService";
import {ApplianceService} from "../../../business/services/applianceService";
import {LabelService} from "../../../business/services/labelService";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {BusinessRulesViewModel} from "../../models/businessRulesViewModel";
import {EventAggregator} from "aurelia-event-aggregator";
import {PreviousApplianceUnsafeDetail} from "../../../business/models/previousApplianceUnsafeDetail";
import {CatalogService} from "../../../business/services/catalogService";
import {ICatalogService} from "../../../business/services/interfaces/ICatalogService";
import {ButtonListItem} from "../../../../common/ui/elements/models/buttonListItem";
import {ValidationService} from "../../../business/services/validationService";
import {IValidationService} from "../../../business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../../business/services/interfaces/IBusinessRuleService";
import {BusinessRuleService} from "../../../business/services/businessRuleService";
import {DialogService} from "aurelia-dialog";
import {ISafetyAction} from "../../../business/models/reference/ISafetyAction";
import {ISafetyNoticeType} from "../../../business/models/reference/ISafetyNoticeType";
import {ISafetyNoticeStatus} from "../../../business/models/reference/ISafetyNoticeStatus";
import {AppliancePageHelper} from "./appliancePageHelper";

@inject(LabelService, EventAggregator, DialogService, ApplianceService, ValidationService, BusinessRuleService, CatalogService)
export class PreviousElectricalUnsafeDetail extends BusinessRulesViewModel {

    public viewModel: PreviousApplianceUnsafeDetail;

    public applianceSafeLookup: ButtonListItem[];
    public installationSafeLookup: ButtonListItem[];

    public safetyActionTypeCatalog: ISafetyAction[];
    public noticeStatusCatalog: ISafetyNoticeStatus[];
    public noticeTypeCatalog: ISafetyNoticeType[];
    public isEmpty: boolean;

    private _applianceService: IApplianceService;
    private _applianceId: string;
    private _jobId: string;

    constructor(
                labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                applianceService: IApplianceService,
                validationService: IValidationService,
                businessRuleService: IBusinessRuleService,
                catalogService: ICatalogService) {
        super(labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);

        this._applianceService = applianceService;
        this._catalogService = catalogService;

        this.viewModel = null;
    }

    public canActivateAsync(...rest: any[]): Promise<boolean | Redirect> {
        return AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
    }

    public activateAsync(params: { jobId: string, applianceId: string }): Promise<any> {
        this._jobId = params.jobId;
        this._applianceId = params.applianceId;

        if (this._isCleanInstance) {
            return this.loadCatalogs()
                .then(() => this.loadModel())
                .then(() => this.showContent());
        } else {
            return this.loadModel();
        }
    }

    protected loadModel(): Promise<void> {

        return this._applianceService.getApplianceSafetyDetails(this._jobId, this._applianceId)
            .then((applianceSafety) => {
                if (applianceSafety && applianceSafety.previousApplianceUnsafeDetail) {
                    // there are some safety info already there, load those
                    this.viewModel = applianceSafety.previousApplianceUnsafeDetail;
                    this.isEmpty = this.isModelEmpty(applianceSafety.previousApplianceUnsafeDetail);
                }
            });
    }

    private loadCatalogs(): Promise<void> {

        let catalogPromises = [
            this.buildYesNoList()
                .then(btns => this.applianceSafeLookup = btns),
            this.buildYesNoList()
                .then(btns => this.installationSafeLookup = btns),

            this._catalogService.getSafetyNoticeTypes()
                .then(safetyNoticeTypes => { this.noticeTypeCatalog = safetyNoticeTypes; }),

            this._catalogService.getSafetyActions()
                .then(safetyActions => { this.safetyActionTypeCatalog = safetyActions; }),

            this._catalogService.getSafetyNoticeStatuses()
                .then(safetyNoticeStatus => { this.noticeStatusCatalog = safetyNoticeStatus; })
        ];

        return Promise.all(catalogPromises).then(() => {
        });
    }

    private isModelEmpty(previous: PreviousApplianceUnsafeDetail): boolean {
        let isEmpty: boolean = false;
        if (previous) {
            if (!previous.actionCode &&
                !previous.applianceSafe &&
                !previous.date &&
                !previous.installationSafe &&
                !previous.noticeStatus &&
                !previous.noticeType &&
                !previous.progress &&
                !previous.report) {
                isEmpty = true;
            }
        } else {
            isEmpty = true;
        }
        return isEmpty;
    }
}
