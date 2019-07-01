import { inject } from "aurelia-dependency-injection";
import { ITaskFactory } from "./interfaces/ITaskFactory";
import { IPartFactory } from "./interfaces/IPartFactory";
import { PartFactory } from "./partFactory";

import { ITask as TaskApiModel } from "../../api/models/fft/jobs/ITask";
import { ITask as TaskUpdateApiModel } from "../../api/models/fft/jobs/jobupdate/ITask";
import { Task } from "../models/task";
import { Activity } from "../models/activity";
import { Part } from "../models/part";
import { Guid } from "../../../common/core/guid";
import { DateHelper } from "../../core/dateHelper";
import { Job } from "../models/job";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import { PartsToday } from "../models/partsToday";
import { IActivity } from "../../api/models/fft/jobs/IActivity";
import { TaskVisit } from "../models/taskVisit";
import { StringHelper } from "../../../common/core/stringHelper";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../services/businessRuleService";
import { CatalogService } from "../services/catalogService";
import { ICatalogService } from "../services/interfaces/ICatalogService";
import * as bignumber from "bignumber";
import { NumberHelper } from "../../core/numberHelper";

@inject(PartFactory, BusinessRuleService, CatalogService)
export class TaskFactory implements ITaskFactory {

    private _partFactory: IPartFactory;
    private _businessRulesService: IBusinessRuleService;
    private _catalogService: ICatalogService;

    public constructor(partFactory: IPartFactory, businessRuleService: IBusinessRuleService, catalogService: ICatalogService) {
        this._partFactory = partFactory;
        this._businessRulesService = businessRuleService;
        this._catalogService = catalogService;
    }

    public createTaskBusinessModel(taskApiModel: TaskApiModel, partsToday: PartsToday, isCurrentJob: boolean): Promise<Task> {

        return Promise.all([
            this._businessRulesService.getQueryableRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this))),
            this._businessRulesService.getQueryableRuleGroup("todaysParts")
        ]).then(([businessRules, todaysPartsBusinessRules]) => {
            let taskBusinessModel: Task = undefined;
            let partLJActionCodes = businessRules.getBusinessRuleList<string>("partLJReportableActionTypes");
            let bypassTaskStatus = businessRules.getBusinessRule<string>("bypassTaskStatus");
            let middlewareDoTodayStatuses = businessRules.getBusinessRuleList<string>("middlewareDoTodayStatuses");
            let partsCurrencyUnit = businessRules.getBusinessRule<string>("partsCurrencyUnit");

            if (taskApiModel && taskApiModel.status !== bypassTaskStatus) {
                let isDoTodayTask = middlewareDoTodayStatuses.indexOf(taskApiModel.status) > -1;
                taskBusinessModel = new Task(isDoTodayTask && isCurrentJob, false);
                taskBusinessModel.isMiddlewareDoTodayTask = isDoTodayTask;
                taskBusinessModel.id = taskApiModel.id;
                taskBusinessModel.jobType = taskApiModel.jobType;
                taskBusinessModel.applianceType = taskApiModel.applianceType;
                taskBusinessModel.applianceId = taskApiModel.applianceId;
                taskBusinessModel.chargeType = taskApiModel.chargeType;
                taskBusinessModel.specialRequirement = taskApiModel.specialRequirement;
                taskBusinessModel.supportingText = taskApiModel.supportingText;

                taskBusinessModel.problemDesc = taskApiModel.problemDesc;
                taskBusinessModel.applianceMake = taskApiModel.applianceMake;
                taskBusinessModel.applianceModel = taskApiModel.applianceModel;
                taskBusinessModel.applianceErrorCode = taskApiModel.applianceErrorCode;
                taskBusinessModel.applianceErrorDesc = taskApiModel.applianceErrorDesc;
                taskBusinessModel.sequence = taskApiModel.sequence;
                taskBusinessModel.previousVisits = [];

                taskBusinessModel.fixedPriceQuotationAmount = taskApiModel.fixedPriceQuotationAmount;
                taskBusinessModel.discountCode = taskApiModel.discountCode;

                taskBusinessModel.isPotentiallyPartLJReportable = partLJActionCodes.some(actionCode => taskApiModel.jobType === actionCode);
                if (!taskBusinessModel.isMiddlewareDoTodayTask) {
                    taskBusinessModel.status = taskApiModel.status;
                }

                taskBusinessModel.activities = [];
                if (taskApiModel.activities) {

                    taskApiModel.activities.forEach((activityApiModel) => {

                        let activityBusinessModel = new Activity();
                        activityBusinessModel.date = DateHelper.fromJsonDateString(activityApiModel.date);
                        activityBusinessModel.status = activityApiModel.status;
                        activityBusinessModel.engineerName = activityApiModel.engineerName;
                        activityBusinessModel.report = activityApiModel.report;
                        activityBusinessModel.workDuration = activityApiModel.workDuration;
                        activityBusinessModel.chargeableTime = activityApiModel.chargeableTime;
                        activityBusinessModel.parts = [];

                        if (activityApiModel.parts) {
                            activityApiModel.parts.forEach((partApiModel) => {
                                let partBusinessModel = new Part();
                                partBusinessModel.status = partApiModel.status;
                                partBusinessModel.description = partApiModel.description;
                                partBusinessModel.quantity = partApiModel.quantity;
                                partBusinessModel.stockReferenceId = partApiModel.stockReferenceId;
                                partBusinessModel.taskId = taskBusinessModel.id;
                                partBusinessModel.price = partApiModel.charge ? new bignumber.BigNumber(partApiModel.charge).times(partsCurrencyUnit) : new bignumber.BigNumber(0);
                                partBusinessModel.isMainPart = partApiModel.isMainPart;
                                partBusinessModel.orderDate = partApiModel.orderDate;
                                partBusinessModel.partOrderStatus = partApiModel.partOrderStatus;
                                partBusinessModel.quantityCharged = partApiModel.quantityCharged;
                                partBusinessModel.requisitionNumber = partApiModel.requisitionNumber;
                                partBusinessModel.stockReferenceId = partApiModel.stockReferenceId;
                                partBusinessModel.fittedDate = DateHelper.fromJsonDateString(activityApiModel.date);
                                partBusinessModel.id = Guid.newGuid();
                                activityBusinessModel.parts.push(partBusinessModel);

                                if (todaysPartsBusinessRules && partsToday) {
                                    if (this.isATodaysPart(partBusinessModel, activityBusinessModel, todaysPartsBusinessRules)) {
                                        partsToday.parts.push(partBusinessModel);
                                    }
                                }
                            });
                        }

                        taskBusinessModel.activities.push(activityBusinessModel);
                    });
                }

                const previousVisits = this.generatePreviousVisits(middlewareDoTodayStatuses, taskApiModel.activities);
                taskBusinessModel.previousVisits = previousVisits;
            }

            return taskBusinessModel;
        });
    }

    public async createTaskApiModel(task: Task, job: Job, hardwareSequenceNumber?: number): Promise<TaskUpdateApiModel> {
        let taskApiModel = <TaskUpdateApiModel>{};

        let taskIsLive = !job.jobNotDoingReason && !task.isNotDoingTask;

        taskApiModel.id = task.isNewRFA ? undefined : task.id;
        taskApiModel.fieldTaskId = task.isNewRFA ? task.fieldTaskId : undefined;
        taskApiModel.newWork = task.isNewRFA;
        taskApiModel.jobType = task.jobType;
        taskApiModel.applianceType = task.applianceType;
        taskApiModel.chargeType = task.chargeType;
        taskApiModel.sequence = task.sequence;
        taskApiModel.applianceId = hardwareSequenceNumber ? undefined : task.applianceId;
        taskApiModel.status = task.status;
        taskApiModel.hardwareSequenceNumber = hardwareSequenceNumber || undefined;

        taskApiModel.componentEndTime = DateHelper.timeStringToJsonDateTimeString(task.endTime) || undefined;
        taskApiModel.componentStartTime = DateHelper.timeStringToJsonDateTimeString(task.startTime) || undefined;
        taskApiModel.report = task.report;

        if (taskIsLive) {
            taskApiModel.report = (task.chirpCodes && task.chirpCodes.length > 0) ?
                task.chirpCodes.join(" ").concat(" ", taskApiModel.report) :
                taskApiModel.report;
            taskApiModel.energyEfficiencyOutcome = task.adviceOutcome;
            taskApiModel.energyAdviceCategoryCode = task.adviceCode;
            taskApiModel.energyEfficiencyAdviceComments = task.adviceComment;
            taskApiModel.productGroupCode = task.productGroup;
            taskApiModel.partTypeCode = task.partType;
            taskApiModel.fixedPriceQuotationAmount = task.fixedPriceQuotationAmount;
            taskApiModel.workDuration = task.workDuration;
            taskApiModel.workedOnCode = task.workedOnCode;
            taskApiModel.visitActivityCode = task.activity;
            taskApiModel.faultActionCode = task.faultActionCode;
        }

        let chargeType = await this._catalogService.getChargeType(task.chargeType);

        let isPartsChargeable = NumberHelper.isNullOrUndefined(task.fixedPriceQuotationAmount) // 0 is valid here
            && chargeType
            && chargeType.chargePartsIndicator === "Y"
            && taskIsLive;

        if (taskIsLive) {
            // todo move logic out to here about whether to build charges
            taskApiModel.partsCharged = await this._partFactory.createPartsChargedApiModelsFromBusinessModels(task, job.partsDetail, isPartsChargeable);

            taskApiModel.partsUsed = await this._partFactory.createPartsUsedApiModelsFromBusinessModels(task, job.partsDetail, isPartsChargeable);

            taskApiModel.partsNotUsed = await this._partFactory.createPartsNotUsedApiModelsFromBusinessModels(task, job.partsDetail);

            taskApiModel.partsClaimedUnderWarranty = await this._partFactory.createPartsClaimedUnderWarrantyApiModelsFromBusinessModels(task, job.partsDetail);
        }

        let statuses = await this._catalogService.getActivityComponentVisitStatuses();
        let taskStatus = statuses && statuses.find(status => status.status === taskApiModel.status);
        if (taskStatus) {
            taskApiModel.jobStatusCategory = taskStatus.jobStatusCategory;
        }

        if (!taskApiModel.partsUsed || taskApiModel.partsUsed.length === 0) {
            taskApiModel.partsUsed = undefined;
        }

        if (!taskApiModel.partsCharged || taskApiModel.partsCharged.length === 0) {
            taskApiModel.partsCharged = undefined;
        }

        if (!taskApiModel.partsClaimedUnderWarranty || taskApiModel.partsClaimedUnderWarranty.length === 0) {
            taskApiModel.partsClaimedUnderWarranty = undefined;
        }

        if (!taskApiModel.partsNotUsed || taskApiModel.partsNotUsed.length === 0) {
            taskApiModel.partsNotUsed = undefined;
        }

        // we need to set workduration to 0, chargeable time for any statuses that don't send safety, parts charges etc back. 
        // the basic job report does not send any start/finish time, job duration / charegable time back
        // @jairam: for NA,XC and XB, work duration can be 0 and WMIS doenst need start and end time
        //          job will progress to NAW status only if work duration is greater than 0
        let taskItemRuleGroup = await this._businessRulesService.getQueryableRuleGroup("taskItem");
        if (!this.isTaskStatusRequiresDurations(taskItemRuleGroup, task.status)) {
            taskApiModel.workDuration = 0;
            taskApiModel.chargeableTime = undefined;
            taskApiModel.componentStartTime = undefined;
            taskApiModel.componentEndTime = undefined;
        } else {
            taskApiModel.workDuration = taskIsLive ? task.workDuration : 0;
            taskApiModel.chargeableTime = taskIsLive ? task.chargeableTime : 0;
        }

        return taskApiModel;
    }

    private isATodaysPart(part: Part, activity: Activity, todaysPartsBusinessRules: QueryableBusinessRuleGroup): boolean {
        return activity.status === todaysPartsBusinessRules.getBusinessRule<string>("doTodayActivityStatus")
            && part.status === todaysPartsBusinessRules.getBusinessRule<string>("toBeFittedPartStatus");
    }

    private generatePreviousVisits(middlewareDoTodayStatuses: string[], activities: IActivity[]): TaskVisit[] {
        const visits: TaskVisit[] = [];
        if (activities && middlewareDoTodayStatuses) {
            activities.filter(activity => middlewareDoTodayStatuses.indexOf(activity.status) === -1).forEach(activity => {
                let previousVisit = new TaskVisit();
                previousVisit.date = activity.date;
                previousVisit.report = activity.report;
                previousVisit.status = activity.status;
                previousVisit.chargeableTime = activity.chargeableTime;
                previousVisit.workDuration = activity.workDuration;
                previousVisit.engineerName = activity.engineerName;

                visits.push(previousVisit);
            });
        }

        return visits;
    }

    private isTaskStatusRequiresDurations(ruleGroup: QueryableBusinessRuleGroup, status: string): boolean {
        const rules = ruleGroup.getBusinessRuleList<string>("taskNotRequriedDuration");
        return rules ? !rules.some(x => x === status) : true;
    }
}
