import { observable } from "aurelia-framework";
import { inject } from "aurelia-dependency-injection";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { Risk } from "../../../business/models/risk";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { ValidationService } from "../../../business/services/validationService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { EditableViewModel } from "../../models/editableViewModel";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { EventAggregator } from "aurelia-event-aggregator";
import { CatalogService } from "../../../business/services/catalogService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { IRiskService } from "../../../business/services/interfaces/IRiskService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { RiskService } from "../../../business/services/riskService";
import { JobService } from "../../../business/services/jobService";
import { Guid } from "../../../../common/core/guid";
import { Router } from "aurelia-router";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { ISftyReasonCat } from "../../../business/models/reference/ISftyReasonCat";

@inject(CatalogService, JobService, EngineerService, LabelService, RiskService, EventAggregator, DialogService, ValidationService, BusinessRuleService, Router)
export class RiskItem extends EditableViewModel {
    public reasonButtons: ButtonListItem[];

    @observable
    public reason: string;

    public report: string;
    // location has different validation rules to report
    public location: string;
    public isHazard: boolean;

    // .DF_1681 we need to stop multiple submissions of the same new record
    public isCompleteTriggeredAlready: boolean;

    private _hazardReason: string;
    private _riskException: string[];

    private _risks: Risk[];
    private _riskId: string;
    private _riskService: IRiskService;
    private _router: Router;

    constructor(catalogService: ICatalogService,
        jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        riskService: IRiskService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        router: Router) {

        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);

        this._riskService = riskService;
        this._router = router;
    }

    public activateAsync(params: { jobId: string, riskId: string }): Promise<void> {
        this._riskId = params.riskId;

        return this._riskService.getRisks(params.jobId).then(risks => {
            this._risks = risks || [];
            if (this._isCleanInstance) {
                return this.buildValidation([
                    { property: "location", condition: () => this.isHazard },
                    { property: "report", condition: () => !this.isHazard },
                ])
                    .then(() => this.loadBusinessRules())
                    .then(() => {
                        this._hazardReason = this.getBusinessRule<string>("hazard");
                        this._riskException = (this.getBusinessRule<string>("riskException") || "").split(",");
                    })
                    .then(() => this.loadCatalogs())
                    .then(() => this.load())
                    .then(() => this.showContent());
            } else {
                return this.load();
            }
        });
    }

    public completeOk(): Promise<void> {
        return this.saveModel()
            .then(() => {
                this.notifyDataStateChanged();
                this._router.navigateToRoute("risks");
            });
    }

    public completeCancel(): void {
        this._router.navigateToRoute("risks");
    }

    public reasonChanged(newReason: string, oldReason: string): void {
        this.isHazard = newReason && newReason === this._hazardReason;
    }

    protected loadModel(): Promise<void> {
        if (this._riskId === Guid.empty) {
            this.reason = "";
            this.report = "";
            this.location = "";
            this.isHazard = false;
            this.setNewDataState("risks");
            this.isNew = true;

            this.reasonButtons.forEach(reasonButton => {
                /* can only have one of each type or risk, so disable any existing ones */
                reasonButton.disabled = !!this._risks.find(r => r.reason === reasonButton.value && !(this._riskException.indexOf(r.reason) !== -1));
            });

            return Promise.resolve();
        } else {
            return this._riskService.getRisk(this.jobId, this._riskId)
                .then(risk => {
                    this.isNew = false;
                    this.reason = risk.reason;
                    this.isHazard = risk.isHazard;
                    this.location = this.isHazard ? risk.report : undefined;
                    this.report = !this.isHazard ? risk.report : undefined;
                    this.setInitialDataState(risk.dataStateId, risk.dataState);
                    this.reasonButtons.forEach(reasonButton => {
                        /* can only have one of each type or risk, so disable any existing ones
                        * as long as its not the current selection */
                        reasonButton.disabled = !!this._risks.find(r => r.reason === reasonButton.value && r.reason !== this.reason);
                    });
                });
        }
    }

    protected clearModel(): Promise<void> {
        this.location = undefined;
        this.report = undefined;
        this.reason = undefined;
        return Promise.resolve();
    }

    protected saveModel(): Promise<void> {
        let risk: Risk = new Risk();
        risk.isHazard = this.reason === this._hazardReason;
        risk.reason = this.reason;
        risk.report = this.isHazard ? this.location : this.report;
        risk.dataState = this.getFinalDataState();

        if (this._riskId === Guid.empty) {
            if (this.isCompleteTriggeredAlready) {
                return Promise.resolve();
            }
            this.isCompleteTriggeredAlready = true;
            return this._riskService.addRisk(this.jobId, risk).then(() => {});
        } else {
            risk.id = this._riskId;
            return this._riskService.updateRisk(this.jobId, risk);
        }

    }

    private loadCatalogs(): Promise<any> {
        return this._catalogService.getSafetyReasonCats(CatalogConstants.SAFETY_REASON_CAT_GROUP_RISK_REASON)
            .then((safetyReasons) => {
                safetyReasons = safetyReasons || [];
                safetyReasons.push(<ISftyReasonCat>{
                    safetyReasonCategoryCode: this._hazardReason,
                    safetyReasonCategoryReason: this.getLabel("hazardReason")
                });

                this.reasonButtons = this.toButtonListItemArray(safetyReasons, CatalogConstants.SAFETY_REASON_CAT_ID, CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
            });
    }
}
