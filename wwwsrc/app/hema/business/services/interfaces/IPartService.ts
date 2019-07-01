
import {Guid} from "../../../../common/core/guid";
import {PartsBasket as PartsBasketBusinessModel} from "../../models/partsBasket";
import {Part} from "../../models/part";
import {WarrantyEstimate} from "../../models/warrantyEstimate";
import {PartsToday} from "../../models/partsToday";
import {PartNotUsedReturn} from "../../models/partNotUsedReturn";
import {PartWarrantyReturn} from "../../models/partWarrantyReturn";
import {DataState} from "../../models/dataState";
import {PartsBasketViewModel} from "../../../presentation/models/partsBasketViewModel";
import { Job } from "../../models/job";

export interface IPartService {
    getPartsBasket(jobId: string): Promise<PartsBasketBusinessModel>;
    savePartsBasket(jobId: string, partsBasket: PartsBasketViewModel): Promise<void>;
    getFittedParts(jobId: string): Promise<Part[]>; // todo can we rename this to previouslyOrderedParts
    getTodaysParts(jobId: string): Promise<PartsToday>;
    saveTodaysPartsReturns(jobId: string, dataState: DataState, partReturns: {partId: Guid, warrantyReturn: PartWarrantyReturn, notusedReturn: PartNotUsedReturn}[]): Promise<void>;
    getPartWarrantyEstimate(jobId: string, stockRefId: string, taskId: string) : Promise<WarrantyEstimate>;
    getMainPartForTask(jobId: string, taskId: string): Promise<Part>;
    clearMainPartForTask(jobId: string, taskId: string): Promise<void>;
    setPartsRequiredForTask(jobId: string): Promise<boolean>;
    getPartStatusValidity(part: Part, job: Job): Promise<boolean>;
    deletePartsAssociatedWithTask(jobId: string, taskId: string): Promise<void>;
}
