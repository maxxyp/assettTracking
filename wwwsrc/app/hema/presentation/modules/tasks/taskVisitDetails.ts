/// <reference path="./../../../../../typings/app.d.ts" />
import {inject} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {CatalogService} from "../.././../business/services/catalogService";
import {ICatalogService} from "../../../business/services/interfaces/ICatalogService";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {JobService} from "../../../business/services/jobService";
import {ITaskService} from "../../../business/services/interfaces/ITaskService";
import {TaskService} from "../../../business/services/taskService";
import {EditableViewModel} from "../../models/editableViewModel";
import {LabelService} from "../../../business/services/labelService";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {IValidationService} from "../../../business/services/interfaces/IValidationService";
import {ValidationService} from "../../../business/services/validationService";
import {IBusinessRuleService} from "../../../business/services/interfaces/IBusinessRuleService";
import {BusinessRuleService} from "../../../business/services/businessRuleService";
import {EngineerService} from "../../../business/services/engineerService";
import {IEngineerService} from "../../../business/services/interfaces/IEngineerService";
import {DialogService} from "aurelia-dialog";
import {TaskVisit} from "../../../business/models/taskVisit";
import {IActivityCmpnentVstStatus} from "../../../business/models/reference/IActivityCmpnentVstStatus";

@inject(CatalogService, JobService, EngineerService, LabelService, TaskService, EventAggregator, DialogService, ValidationService, BusinessRuleService)
export class TaskVisitDetails extends EditableViewModel {
    public noData: boolean;
    public statuses: {[code: string]: string};
    public visits: TaskVisit [];

    private _taskService: ITaskService;
    private _taskId: string;

    constructor(catalogService: ICatalogService,
                jobService: IJobService,
                engineerService: IEngineerService,
                labelService: ILabelService,
                taskService: ITaskService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                validationService: IValidationService,
                businessRulesService: IBusinessRuleService) {

        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);

        this._taskService = taskService;
        this.statuses = {};
        this.visits = [];
        this.noData = true;
    }

    public activateAsync(params: { taskId: string }): Promise<void> {
        this._taskId = params.taskId;

        return this.loadCatalogs()
                .then(() => this.load())
                .then(() => this.showContent());
    }

    protected loadModel(): Promise<void> {
        return this._taskService.getTaskItem(this.jobId, this._taskId).then(task => {
                if (task && task.previousVisits) {
                    this.visits = task.previousVisits;
                }

            this.noData = !(this.visits && this.visits.length > 0);
        });
    }

    private loadCatalogs(): Promise<void> {
        return this._catalogService.getActivityComponentVisitStatuses()
            .then(jobStatus => {
                jobStatus.map((js: IActivityCmpnentVstStatus) =>
                    this.statuses[js.status] = js.statusDescription
                );
            });
    }
}
