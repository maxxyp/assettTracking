import { inject } from "aurelia-framework";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ApplianceService } from "../../../business/services/applianceService";
import { EventAggregator } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { DialogService } from "aurelia-dialog";
import { CatalogService } from "../../../business/services/catalogService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { BusinessRulesViewModel } from "../../models/businessRulesViewModel";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { ValidationService } from "../../../business/services/validationService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { Appliance } from "../../../business/models/appliance";
import { PreviousApplianceUnsafeDetail } from "../../../business/models/previousApplianceUnsafeDetail";
import {ISafetyNoticeType} from "../../../business/models/reference/ISafetyNoticeType";
import {ISafetyAction} from "../../../business/models/reference/ISafetyAction";
import {ISafetyNoticeStatus} from "../../../business/models/reference/ISafetyNoticeStatus";
import {AppliancePageHelper} from "./appliancePageHelper";
import { Redirect } from "aurelia-router";

@inject(LabelService, ApplianceService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService)
export class PrevGasSafety extends BusinessRulesViewModel {

    public safety: PreviousApplianceUnsafeDetail;

    public applianceSafeLookup: ButtonListItem[];
    public installationSafeLookup: ButtonListItem[];
    public safetyActionTypeCatalog: ISafetyAction[];
    public noticeStatusCatalog: ISafetyNoticeStatus[];
    public noticeTypeCatalog: ISafetyNoticeType[];
    public isEmpty: boolean;

    private _applianceService: IApplianceService;
    private _jobId: string;
    private _applianceId: string;

    public constructor(
        labelService: ILabelService,
        applianceService: IApplianceService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService) {
        super(labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this._applianceService = applianceService;
        this._catalogService = catalogService;
        this.isEmpty = false;
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

        return this._applianceService.getAppliance(this._jobId, this._applianceId)
            .then((appliance: Appliance) => {
                if (appliance) {
                    this.safety = appliance.safety.previousApplianceUnsafeDetail;
                    this.isEmpty = this.isModelEmpty(appliance.safety.previousApplianceUnsafeDetail);
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

        return Promise.all(catalogPromises).then(() => {});
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
