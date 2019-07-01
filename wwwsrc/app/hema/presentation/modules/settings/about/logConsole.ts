import {BaseInformation} from "./baseInformation";
import {inject} from "aurelia-dependency-injection";
import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {LabelService} from "../../../../business/services/labelService";
import { LoggerService } from "../../../../../common/core/services/loggerService";
import { ILoggerService } from "../../../../../common/core/services/ILoggerService";
import { Log } from "../../../../../common/core/services/models/log";

@inject(LabelService, EventAggregator, DialogService, LoggerService)
export class LogConsole extends BaseInformation {

    public logs: Log[];

    private _loggerService: ILoggerService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator,
                dialogService: DialogService, loggerService: ILoggerService) {

        super(labelService, eventAggregator, dialogService);
        this._loggerService = loggerService;
    }

    public activateAsync(): Promise<void> {
        return this._loggerService.getLogs()
            .then((logs) => this.logs = logs)
            .return();
    }
}
