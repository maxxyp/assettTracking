import { IChargeFactory } from "./interfaces/IChargeFactory";
import { Charge } from "../models/charge/charge";
import { ChargeableTask } from "../models/charge/chargeableTask";
import { ITask as TaskUpdateApiModel } from "../../api/models/fft/jobs/jobupdate/ITask";
import { ITask as TaskApiModel } from "../../api/models/fft/jobs/ITask";
import { inject } from "aurelia-dependency-injection";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../services/businessRuleService";
import { ICatalogService } from "../services/interfaces/ICatalogService";
import { CatalogService } from "../services/catalogService";

@inject(BusinessRuleService, CatalogService)
export class ChargeFactory implements IChargeFactory {

    private _businessRuleService: IBusinessRuleService;
    private _catalogService: ICatalogService;
    private _incompleteStatuses: string[];

    constructor(businessRuleService: IBusinessRuleService, catalogService: ICatalogService) {
        this._businessRuleService = businessRuleService;
        this._catalogService = catalogService;
    }

    public createChargeBusinessModel(taskApiModel: TaskApiModel[]): Charge {
        return new Charge();
    }

    public createChargeApiModel(chargeableTasks: ChargeableTask[], updateApiTasks: TaskUpdateApiModel[]): Promise<TaskUpdateApiModel[]> {

        return this._businessRuleService.getQueryableRuleGroup("chargeFactory").then((queryableGroup) => {

            this._incompleteStatuses = queryableGroup.getBusinessRuleList<string>("incompleteStatuses");

            let taskPromises = updateApiTasks.map(updateApiTask => {

                const chargeableTask = chargeableTasks.find(ct => {

                    // if newRFA search by fieldTaskId instead of taskId
                    if (ct.task.isNewRFA) {
                        return ct.task.fieldTaskId === updateApiTask.fieldTaskId;
                    }

                    return ct.task.id === updateApiTask.id;
                });

                if (chargeableTask && this._incompleteStatuses.indexOf(chargeableTask.task.status) > -1) {
                    return Promise.resolve(updateApiTask);
                }

                return this.mapChargeToTask(updateApiTask, chargeableTask);
            });

            return Promise.all(taskPromises).then(results => {

                // see DF_1494, if zero charge job, still need to include subsequentJobIndicator per task for api support.
                // if more than one task, need to flag first item as prime charge
                // primary logic is in chargeService, but that's only for *chargeable tasks*. No charge tasks
                // would not be added to chargeableTasks in the job business model.

                const existsPrime = results.some(t => t.subsequentJobIndicator !== undefined && t.subsequentJobIndicator === false);

                if (existsPrime) {
                    return results;
                }

                results.forEach((task, index) => {
                    // no incomplete statuses then set sub indicator, otherwise do not send across at all
                    if (this._incompleteStatuses.indexOf(task.status) === -1) {
                        task.subsequentJobIndicator = index > 0;
                    }
                });

                return results;
            });

        });
    }

    private mapChargeToTask(taskApiModel: TaskUpdateApiModel, chargeableTask: ChargeableTask): Promise<TaskUpdateApiModel> {

        // initialise task api
        taskApiModel.chargeExcludingVAT = 0;
        taskApiModel.vatAmount = 0;

        if (!taskApiModel.chargeType) {
            return Promise.resolve(taskApiModel);
        }

        return this._catalogService.getChargeType(taskApiModel.chargeType).then(ct => {

            taskApiModel.vatCode = ct.vatCode;

            if (!chargeableTask || !chargeableTask.task) {
                taskApiModel.subsequentJobIndicator = true; // api still expects this even when cancelled.
                return Promise.resolve(taskApiModel);
            }

            taskApiModel.subsequentJobIndicator = chargeableTask.isSubsequent;

            if (!chargeableTask.task.isCharge) {
                return Promise.resolve(taskApiModel);
            }

            if (chargeableTask.discountAmount) {
                taskApiModel.discountAmount = chargeableTask.discountAmount.times(100).toNumber();
            }

            if (chargeableTask.netTotal) {
                taskApiModel.chargeExcludingVAT = chargeableTask.netTotal.times(100).toNumber();
            }

            if (chargeableTask.vat) {
                taskApiModel.vatAmount = chargeableTask.calculatedVatAmount.times(1000).toNumber();
            }

            if (chargeableTask.labourItem) {
                taskApiModel.standardLabourChargeIndicator = !!chargeableTask.labourItem.isFixed;
            }

            if (chargeableTask.labourItem && chargeableTask.labourItem.netAmount) {
                taskApiModel.totalLabourCharged = chargeableTask.labourItem.netAmount.times(100).toNumber();
            }

            return this._businessRuleService.getQueryableRuleGroup("chargeService")
                .then(ruleGroup => {

                    let noDiscountCode = ruleGroup.getBusinessRule<string>("noDiscountCode");
                    if (chargeableTask.discountCode !== noDiscountCode) {
                        taskApiModel.discountCode = chargeableTask.discountCode;
                    }

                    return Promise.resolve(taskApiModel);
                });
        });
    }
}
