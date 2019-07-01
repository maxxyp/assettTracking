import { inject } from "aurelia-framework";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { PartService } from "../../../business/services/partService";
import { IPartService } from "../../../business/services/interfaces/IPartService";
import { TaskService } from "../../../business/services/taskService";
import { ITaskService } from "../../../business/services/interfaces/ITaskService";
import { Part } from "../../../business/models/part";
import { Task } from "../../../business/models/task";

@inject(LabelService, EventAggregator, DialogService, PartService, TaskService)
export class PreviouslyFittedParts extends BaseViewModel {

    public parts: {part: Part, task: Task}[];
    public readonly vanStockStatus: string;
    public isFullScreen: boolean;
    private _partService: IPartService;
    private _taskService: ITaskService;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        partService: IPartService,
        taskService: ITaskService) {
        super(labelService, eventAggregator, dialogService);
        this._partService = partService;
        this._taskService = taskService;
        this.vanStockStatus = "V";
        this.isFullScreen = window.isFullScreen;
    }

    public activateAsync(params: { jobId: string }): Promise<any> {
        this.parts = [];

   return Promise.all([
            this._partService.getFittedParts(params.jobId),
            this._taskService.getAllTasksEverAtProperty(params.jobId),
        ])
        .then(([parts, tasks]) => {
            this.parts = [];
            if (parts) {
                 parts.forEach(part => this.parts.push({
                     part,
                     task: tasks.find(t => t.id === part.taskId)
                    })
                );
            }
            this.showContent();
        });
    }
}
