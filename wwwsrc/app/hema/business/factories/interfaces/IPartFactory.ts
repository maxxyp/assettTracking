import { IAdaptPartSelected as AdaptPartApiModel } from "../../../api/models/adapt/IAdaptPartSelected";
import { Part as PartBusinessModel } from "../../models/part";
import {PartsDetail} from "../../models/partsDetail";
import {IPartsCharged} from "../../../api/models/fft/jobs/jobupdate/IPartsCharged";
import {IPartsUsed} from "../../../api/models/fft/jobs/jobupdate/IPartsUsed";
import {IPartsNotUsed} from "../../../api/models/fft/jobs/jobupdate/IPartsNotUsed";
import {IPartsClaimedUnderWarranty} from "../../../api/models/fft/jobs/jobupdate/IPartsClaimedUnderWarranty";
import {Task} from "../../models/task";
import {Job} from "../../models/job";
import {IPartsOrderedTasks} from "../../../api/models/fft/jobs/orderparts/IPartsOrderedTasks";

export interface IPartFactory {
    createPartBusinessModelFromAdaptApiModel(adaptPartApiModel: AdaptPartApiModel): PartBusinessModel;
    createPartsChargedApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail, isPartsChargeableChargeType: boolean):  Promise<IPartsCharged[]>;
    createPartsUsedApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail, isPartsChargeableChargeType: boolean): Promise<IPartsUsed[]>;
    createPartsNotUsedApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail): Promise<IPartsNotUsed[]>;
    createPartsClaimedUnderWarrantyApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail): Promise<IPartsClaimedUnderWarranty[]>;

    createPartsOrderedForTask(job: Job): Promise<IPartsOrderedTasks>;

    getPartsConsumedOnJob(job: Job): Promise<{stockReferenceId: string, quantityConsumed: number, isVanStock: boolean}[]>;
}
