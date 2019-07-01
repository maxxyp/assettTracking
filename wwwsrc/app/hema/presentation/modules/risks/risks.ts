import { RiskAcknowledgement } from "../../../business/models/riskAcknowledgement";
import { inject } from "aurelia-dependency-injection";
import { DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { observable } from "aurelia-binding";
import { DataState } from "../../../business/models/dataState";
import { EditableViewModel } from "../../models/editableViewModel";
import { Guid } from "../../../../common/core/guid";

import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { CatalogService } from "../../../business/services/catalogService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { IRiskService } from "../../../business/services/interfaces/IRiskService";
import { RiskService } from "../../../business/services/riskService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { RiskViewModel } from "./viewModels/riskViewModel";
import { Job } from "../../../business/models/job";

@inject(LabelService, RiskService, JobService, EngineerService, CatalogService, EventAggregator, DialogService,
    ValidationService, BusinessRuleService, Router)
export class Risks extends EditableViewModel {
    public jobId: string;
    @observable
    public riskViewModels: RiskViewModel[];
    public riskMessageRead: boolean;
    private _riskService: IRiskService;
    private _router: Router;
    private _job: Job;

    constructor(labelService: ILabelService,
        riskService: IRiskService,
        jobService: IJobService,
        engineerService: IEngineerService,
        catalogService: ICatalogService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        router: Router) {

        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);

        this._riskService = riskService;
        this._router = router;
        this.riskViewModels = [];
    }

    public activateAsync(params: { jobId: string }): Promise<void> {
        this.jobId = params.jobId;
        return this._jobService.getJob(params.jobId)
            .then((job) => {
                if (job) {
                    this._job = job;
                    if (job.riskAcknowledgement) {
                        this.riskMessageRead = job.riskAcknowledgement.messageRead;
                    }
                }
            })
            .then(() => this.load())
            .then(() => this.showContent());
    }

    public navigateToRisk(id: string): void {
        this._router.navigateToRoute("risk", { riskId: id });
    }

    public newRisk(): void {
        this._router.navigateToRoute("risk", { riskId: Guid.empty });
    }

    public deleteRisk(event: MouseEvent, id: string): void {
        event.stopPropagation();

        this.showDeleteConfirmation()
            .then((shouldDelete) => {
                if (shouldDelete) {
                    let foundIndex = this.riskViewModels.findIndex(riskViewModel => riskViewModel.risk.id === id);

                    if (foundIndex >= 0) {
                        this._riskService.deleteRisk(this.jobId, id)
                            .then(() => {
                                this.riskViewModels.splice(foundIndex, 1);
                                this.notifyDataStateChanged();
                            })
                            .catch(ex => {
                                this.showError(ex);
                            });
                    }
                }
            });
    }

    public accept(): Promise<void> {
        if (this._job) {
            this._job.riskAcknowledgement = new RiskAcknowledgement();
            this._job.riskAcknowledgement.messageRead = true;
            this._job.riskAcknowledgement.dataState = DataState.valid;
            this.setIndividualRisksStatus();
            return this._jobService.setJob(this._job).then(() => {
                this.riskMessageRead = true;
                this.notifyDataStateChanged();
            });
        } else {
            return Promise.resolve();
        }
    }

    protected loadModel(): Promise<void> {
        return this._riskService.getRisks(this.jobId)
        .then(risks => {
                (risks || []).forEach(risk => {
                    let riskViewModel = new RiskViewModel();
                    riskViewModel.risk = risk;
                    this.riskViewModels.push(riskViewModel);
                });
        });
    }

    private setIndividualRisksStatus(): void {
        (this._job.risks || []).forEach(risk => {
                if (risk.dataState === DataState.notVisited) {
                    risk.dataState = DataState.valid;
                }
            });
    }
}
