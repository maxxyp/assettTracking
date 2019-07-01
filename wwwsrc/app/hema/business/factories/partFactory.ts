import { IPartFactory } from "./interfaces/IPartFactory";
import { Part, Part as PartBusinessModel } from "../models/part";
import { IAdaptPartSelected as AdaptPartApiModel } from "../../api/models/adapt/IAdaptPartSelected";
import { Guid } from "../../../common/core/guid";
import { PartsDetail } from "../models/partsDetail";
import { IPartsCharged } from "../../api/models/fft/jobs/jobupdate/IPartsCharged";
import { IPartsUsed } from "../../api/models/fft/jobs/jobupdate/IPartsUsed";
import { IPartsNotUsed } from "../../api/models/fft/jobs/jobupdate/IPartsNotUsed";
import { IPartsClaimedUnderWarranty } from "../../api/models/fft/jobs/jobupdate/IPartsClaimedUnderWarranty";
import { Task } from "../models/task";
import { inject } from "aurelia-dependency-injection";
import { BusinessRuleService } from "../services/businessRuleService";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { IPartsOrderedForTask } from "../../api/models/fft/jobs/orderparts/IPartsOrderedForTask";
import { Job } from "../models/job";
import { BusinessException } from "../models/businessException";
import { IPartOrdered } from "../../api/models/fft/jobs/orderparts/IPartOrdered";
import { IPartsOrderedTasks } from "../../api/models/fft/jobs/orderparts/IPartsOrderedTasks";
import * as bignumber from "bignumber";

@inject(BusinessRuleService)
export class PartFactory implements IPartFactory {
    private _businessRuleService: IBusinessRuleService;

    constructor(businessRuleService: IBusinessRuleService) {
        this._businessRuleService = businessRuleService;
    }

    public createPartBusinessModelFromAdaptApiModel(adaptPartApiModel: AdaptPartApiModel): PartBusinessModel {
        let businessModel: PartBusinessModel = new PartBusinessModel();
        const adaptPartsCurrencyUnit = 0.01;

        businessModel.id = Guid.newGuid();
        // todo: businessModel.status
        businessModel.description = adaptPartApiModel.description;
        businessModel.quantity = 1;
        businessModel.stockReferenceId = adaptPartApiModel.stockReferenceId;
        businessModel.price = adaptPartApiModel.price ? new bignumber.BigNumber(adaptPartApiModel.price).times(adaptPartsCurrencyUnit) : new bignumber.BigNumber(0);

        businessModel.partOrderStatus = "O";
        return businessModel;
    }

    public async createPartsChargedApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail, isPartsChargeableChargeType: boolean): Promise<IPartsCharged[]> {

        const canAddPart = isPartsChargeableChargeType
            && partsDetail
            && task
            && task.isCharge
            // only ever transmit partsCharged if the task is complete
            && task.status === "C";

        if (!canAddPart) {
            return [];
        }

        try {
            let partFactoryRules = await this._businessRuleService.getQueryableRuleGroup("partFactory");
            let brPartVanStockStatus = partFactoryRules && partFactoryRules.getBusinessRule<string>("partVanStockStatus");
            let brPartsDescriptionLength = partFactoryRules && partFactoryRules.getBusinessRule<number>("partsDescriptionLength");

            let chargeServiceRules = await this._businessRuleService.getQueryableRuleGroup("chargeService");
            let visitStatuses = chargeServiceRules.getBusinessRuleList<string>("visitStatuses");
            let excludePartStatusPrevious = chargeServiceRules.getBusinessRuleList<string>("excludePartStatusPrevious");

            let partsCharged: IPartsCharged[] = [];

            // vanstock
            if (partsDetail.partsBasket && partsDetail.partsBasket.partsToOrder) {
                partsDetail.partsBasket.partsToOrder
                    .filter(part => part && (part.taskId === task.id) && (part.partOrderStatus === brPartVanStockStatus))
                    .forEach(chargeablePart => {
                        const convertedPart = this.createPartCharge(chargeablePart, brPartsDescriptionLength);
                        if (convertedPart) {
                            partsCharged.push(convertedPart);
                        }
                    });
            }

            // todays parts that have been fitted
            if (partsDetail.partsToday && partsDetail.partsToday.parts) {
                partsDetail.partsToday.parts
                    .filter(part => part && (part.taskId === task.id))
                    .forEach((todaysPart) => {
                        const convertedPart = this.createPartCharge(todaysPart, brPartsDescriptionLength);
                        if (convertedPart) {
                            partsCharged.push(convertedPart);
                        }
                    });
            }

            // previously fitted parts on this job
            if (task.activities) {
                let chargableActivities = task.activities
                            .filter(activity => activity
                                                && activity.parts
                                                && activity.parts.length
                                                && visitStatuses.some(status => status === activity.status)
                                            );

                chargableActivities.forEach(activity => {
                    activity.parts
                        .filter(part => part && !excludePartStatusPrevious.some(excludedStatus => part.status === excludedStatus))
                        .forEach(previousPart => {
                            const convertedPart = this.createPartCharge(previousPart, brPartsDescriptionLength);
                            if (convertedPart) {
                                partsCharged.push(convertedPart);
                            }
                        });
                });

            }

            return partsCharged;
        } catch (error) {
            throw new BusinessException(this, "createPartsChargedApiModelsFromBusinessModels", "Unable to create the parts charged", null, error);
        }
    }

    public createPartsUsedApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail, isPartsChargeableChargeType: boolean): Promise<IPartsUsed[]> {
        // go through all the parts for this task and see if they were used, as in they were either vanstock and in the parts basket
        // or they are todays parts and not returned not used

        if (!partsDetail || !task) {
            return Promise.resolve([]);
        }

        return Promise.all([
            this._businessRuleService.getQueryableRuleGroup("partFactory"),
            this._businessRuleService.getQueryableRuleGroup("todaysParts"),
        ]).then(([partFactoryRules, todaysPartsRules]) => {
            let partsUsed: IPartsUsed[] = [];
            let brPartsDescriptionLength = partFactoryRules && partFactoryRules.getBusinessRule<number>("partsDescriptionLength");

            if (!todaysPartsRules) {
                return partsUsed;
            }

            let brPersonalSourceCategory: string = todaysPartsRules.getBusinessRule<string>("personalSourceCategory");
            let brPartVanStockStatus = todaysPartsRules.getBusinessRule<string>("partVanStockStatus");

            if (brPersonalSourceCategory && brPartVanStockStatus && partsDetail.partsBasket && partsDetail.partsBasket.partsToOrder
                && partsDetail.partsBasket.partsToOrder.length > 0) {

                partsDetail.partsBasket.partsToOrder
                    .filter(part => (part.taskId === task.id) && (part.partOrderStatus === brPartVanStockStatus))
                    .forEach(vanStockPart => {
                        const convertedPart = this.createPartUsed(vanStockPart, brPartsDescriptionLength, brPersonalSourceCategory, 100, isPartsChargeableChargeType);
                        if (convertedPart) {
                            partsUsed.push(convertedPart);
                        }
                    });
            }

            return partsUsed;
        });
    }

    public createPartsNotUsedApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail): Promise<IPartsNotUsed[]> {
        // look at the todays parts and add the ones which are returned not used and return those

        if (!partsDetail) {
            return Promise.resolve([]);
        }
        let partsToReturn: IPartsNotUsed[] = [];

        const partsAvailable = partsDetail.partsToday && partsDetail.partsToday.parts && partsDetail.partsToday.parts.length > 0;

        if (!partsAvailable) {
            return Promise.resolve(partsToReturn);
        }

        partsDetail.partsToday.parts
            .filter(part => (part.taskId === task.id) && (part.notUsedReturn) && (part.notUsedReturn.quantityToReturn > 0))
            .forEach((notUsedPart) => {

                let convertedPart = <IPartsNotUsed>{
                    "fieldComponentVisitSeq": task.sequence,
                    "locationCode": "", // todo": DataMapping - what is this?
                    "reasonCode": notUsedPart.notUsedReturn.reasonForReturn,
                    "quantityNotUsed": notUsedPart.notUsedReturn.quantityToReturn,
                    "requisitionNumber": "", // todo": DataMapping - what is this?
                    "stockReferenceId": notUsedPart.stockReferenceId
                };

                partsToReturn.push(convertedPart);
            });

        return Promise.resolve(partsToReturn);

    }

    public createPartsClaimedUnderWarrantyApiModelsFromBusinessModels(task: Task, partsDetail: PartsDetail): Promise<IPartsClaimedUnderWarranty[]> {
        let partsToReturn: IPartsClaimedUnderWarranty[] = [];

        if (partsDetail && partsDetail.partsToday && partsDetail.partsToday.parts && partsDetail.partsToday.parts.length) {
            partsDetail.partsToday.parts.filter(p => p.taskId === task.id && p.warrantyReturn && p.warrantyReturn.isWarrantyReturn)
                .forEach(part => {
                    let convertedPart = this.createPartClaimsWarranty(part);
                    partsToReturn.push(convertedPart);
                });
        }

        if (partsDetail && partsDetail.partsBasket && partsDetail.partsBasket.partsToOrder && partsDetail.partsBasket.partsToOrder.length) {
            partsDetail.partsBasket.partsToOrder.filter(p => p.taskId === task.id && p.warrantyReturn && p.warrantyReturn.isWarrantyReturn)
                .forEach(part => {
                    let convertedPart = this.createPartClaimsWarranty(part);
                    partsToReturn.push(convertedPart);
                });
        }

        return Promise.resolve(partsToReturn);
    }

    public createPartsOrderedForTask(job: Job): Promise<IPartsOrderedTasks> {
        let partsOrderedForTasks: IPartsOrderedTasks = <IPartsOrderedTasks>{tasks: []};
        return this._businessRuleService.getQueryableRuleGroup("partFactory")
            .then((ruleGroup) => {
                let brPartsDescriptionLength = ruleGroup && ruleGroup.getBusinessRule<number>("partsDescriptionLength");
                let brPartOrderStatus = ruleGroup.getBusinessRule<string>("partOrderStatus");
                if (brPartOrderStatus) {

                    if (job && job.partsDetail && job.partsDetail.partsBasket && job.partsDetail.partsBasket.partsToOrder &&
                        job.partsDetail.partsBasket.partsToOrder.filter(part => part.partOrderStatus === brPartOrderStatus).length > 0) {
                        if (job.tasks && job.tasks.length > 0) {

                            job.tasks.forEach(task => {
                                let orderedParts: IPartOrdered[] = [];

                                job.partsDetail.partsBasket.partsToOrder
                                    .filter(part => (part.partOrderStatus === brPartOrderStatus) && (part.taskId === task.id))
                                    .forEach(orderedPart => {
                                        let convertedPart = <IPartOrdered>{
                                            visitId: job.visit.id,
                                            charge: new bignumber.BigNumber(orderedPart.price).times(100).toNumber(),
                                            description: orderedPart.description.substring(0, brPartsDescriptionLength),
                                            priority: orderedPart.isPriorityPart,
                                            quantity: orderedPart.quantity,
                                            quantityCharged: orderedPart.quantity,
                                            stockReferenceId: orderedPart.stockReferenceId
                                        };

                                        orderedParts.push(convertedPart);
                                    });

                                if (orderedParts.length > 0) {
                                    // some parts have been ordered for this task
                                    let partsOrderedForTask = <IPartsOrderedForTask>{};
                                    partsOrderedForTask.deliverToSite = job.partsDetail.partsBasket.deliverPartsToSite || false;
                                    partsOrderedForTask.id = task.isNewRFA ? undefined : task.id;
                                    partsOrderedForTask.fieldTaskId = task.isNewRFA ? task.fieldTaskId : undefined;
                                    partsOrderedForTask.parts = orderedParts;

                                    partsOrderedForTasks.tasks.push(partsOrderedForTask);
                                }
                            });

                            return partsOrderedForTasks;
                        } else {
                            // tasks are missing
                            throw new BusinessException(this, "createPartsOrderedForTask", "Required task details not present", null, null);
                        }
                    } else {
                        return partsOrderedForTasks;
                    }
                } else {
                    // missing required business rules
                    throw new BusinessException(this, "createPartsOrderedForTask", "Required business rules not present", null, null);
                }
            })
            .catch(error => {
                throw new BusinessException(this, "createPartsOrderedForTask", "Required business rule group not present: '{0}'", ["partFactory"], error);
            });
    }

    public async getPartsConsumedOnJob(job: Job): Promise<{stockReferenceId: string, quantityConsumed: number, isVanStock: boolean}[]> {
        const todaysPartsRules = await this._businessRuleService.getQueryableRuleGroup("todaysParts");
        const brPartVanStockStatus = todaysPartsRules.getBusinessRule<string>("partVanStockStatus");

        const consumedVanStockParts = (job && job.partsDetail && job.partsDetail.partsBasket && job.partsDetail.partsBasket.partsToOrder || [])
            .filter(part => part && part.partOrderStatus === brPartVanStockStatus)
            .map(part => ({
                stockReferenceId: part.stockReferenceId,
                isVanStock: true,
                quantityConsumed: part.quantity || 0
            }))
            .filter(part => part.quantityConsumed);

        const consumedJobParts = (job && job.partsDetail && job.partsDetail.partsToday && job.partsDetail.partsToday.parts || [])
            .filter(part => part)
            .map(part => ({
                stockReferenceId: part.stockReferenceId,
                isVanStock: false,
                quantityConsumed: (part.quantity || 0) - (part.notUsedReturn && part.notUsedReturn.quantityToReturn || 0)
            }))
            .filter(part => part.quantityConsumed);

        return [...consumedVanStockParts, ...consumedJobParts];
    }

    private createPartClaimsWarranty(part: Part): IPartsClaimedUnderWarranty {

        return <IPartsClaimedUnderWarranty>{
            "claimedUnderWarrantyReasonDescription": part.warrantyReturn.reasonForClaim,
            "partReturnedIndicator": true, // todo: DataMapping // assumption is that this is true if there is a return
            "quantityClaimed": part.warrantyReturn.quantityToClaimOrReturn,
            "stockReferenceId": part.warrantyReturn.removedPartStockReferenceId
        };
    }

    private createPartCharge(part: Part, brPartsDescriptionLength: number): IPartsCharged {
        const {price = 0, quantity = 0, description = "", stockReferenceId = ""} = part;

        let noChargeQty = 0;
        let notUsed = 0;

        if (part.notUsedReturn) {
            noChargeQty = notUsed = part.notUsedReturn.quantityToReturn || 0;
        }

        if (part.warrantyReturn && part.warrantyReturn.isWarrantyReturn) {
            noChargeQty = noChargeQty + (part.warrantyReturn.quantityToClaimOrReturn || 0);
        }

        let quantityUsed = quantity - notUsed;
        let quantityCharged = quantity - noChargeQty;

        if (quantityCharged <= 0 || quantityUsed <= 0) {
            return null;
        }

        return <IPartsCharged>{
            "charge": new bignumber.BigNumber(price).times(100).toNumber(),
            "quantityCharged": quantityCharged,
            "quantityUsed": quantityUsed,
            "description": description.substring(0, brPartsDescriptionLength),
            "stockReferenceId": stockReferenceId
        };
    }

    private createPartUsed(part: Part, brPartsDescriptionLength: number, sourceCategory: string, buyingUnitPriceMultiplier: number = 1, isPartsChargeableChargeType: boolean): IPartsUsed {
        const {price = 0, quantity = 0, description = "", stockReferenceId = ""} = part;

        let noChargeQty = 0;
        let notUsed = 0;

        if (part.notUsedReturn) {
            noChargeQty = notUsed = part.notUsedReturn.quantityToReturn || 0;
        }

        if (part.warrantyReturn && part.warrantyReturn.isWarrantyReturn) {
            noChargeQty = noChargeQty + (part.warrantyReturn.quantityToClaimOrReturn || 0);
        }

        let quantityUsed = quantity - notUsed;
        if (quantityUsed <= 0) {
            return null;
        }

        return <IPartsUsed>{
            "quantityUsed": quantityUsed,
            "quantityCharged": isPartsChargeableChargeType ? quantity - noChargeQty : 0,
            "requisitionNumber": "", // todo: DataMapping - what is this?
            "buyingUnitPrice": new bignumber.BigNumber(price).times(buyingUnitPriceMultiplier).toNumber(), // todo": DataMapping - assuming its the price
            "description": description.substring(0, brPartsDescriptionLength),
            sourceCategory,
            "charge": new bignumber.BigNumber(part.price).times(buyingUnitPriceMultiplier).toNumber(), // todo": DataMapping - assuming its the price
            stockReferenceId
        };
    }

}
