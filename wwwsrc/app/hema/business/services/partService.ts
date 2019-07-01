/// <reference path="../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { IJobService } from "./interfaces/IJobService";
import { JobService } from "./jobService";
import { IPartService } from "./interfaces/IPartService";
import { Part } from "../models/part";
import { Activity } from "../models/activity";
import { BusinessException } from "../models/businessException";
import { Guid } from "../../../common/core/guid";
import { PartsBasket as PartsBasketBusinessModel } from "../models/partsBasket";
import { PartsDetail as PartsDetailBusinessModel } from "../models/partsDetail";
import { WarrantyEstimate } from "../models/warrantyEstimate";
import { WarrantyEstimateType } from "../models/warrantyEstimateType";
import { CatalogService } from "./catalogService";
import { ICatalogService } from "./interfaces/ICatalogService";
import { IBusinessRuleService } from "./interfaces/IBusinessRuleService";
import { BusinessRuleService } from "./businessRuleService";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import * as moment from "moment";
import { PartsToday } from "../models/partsToday";
import { DataState } from "../models/dataState";
import { PartNotUsedReturn } from "../models/partNotUsedReturn";
import { PartWarrantyReturn } from "../models/partWarrantyReturn";
import { IGoodsType } from "../models/reference/IGoodsType";
import { Appliance } from "../models/appliance";
import { Job } from "../models/job";

@inject(JobService, CatalogService, BusinessRuleService)
export class PartService implements IPartService {

    private _jobService: IJobService;
    private _catalogService: ICatalogService;
    private _businessRuleService: IBusinessRuleService;
    private _partsRequiredBusinessRules: QueryableBusinessRuleGroup;

    constructor(jobService: IJobService,
        catalogService: ICatalogService,
        businessRuleService: IBusinessRuleService) {
        this._jobService = jobService;
        this._catalogService = catalogService;
        this._businessRuleService = businessRuleService;
    }

    public async clearMainPartForTask(jobId: string, taskId: string): Promise<void> {
        let job = await this._jobService.getJob(jobId);

        if (job) {
            let parts = job.partsDetail
                            && job.partsDetail.partsBasket
                            && job.partsDetail.partsBasket.partsToOrder || [];

            let existingMainPart = parts.find(p => p.taskId === taskId && p.isMainPart);

            if (existingMainPart) {
                existingMainPart.isMainPart = false;
                if (job.partsDetail.partsBasket.dataState !== DataState.invalid) {
                    job.partsDetail.partsBasket.dataState = DataState.notVisited;
                }
                await this._jobService.setJob(job);
            }

        } else {
            throw new BusinessException(this, "partService.getMainPartForTask", "job not found", [jobId], null);
        }

    }

    public async getPartStatusValidity(part: Part, job: Job): Promise<boolean> {
        if (!this._partsRequiredBusinessRules) {
            this._partsRequiredBusinessRules = await this._businessRuleService.getQueryableRuleGroup("partsRequiredInBasket");
        }

        let orderPartStatuses = this._partsRequiredBusinessRules.getBusinessRule<string>("orderPartStatuses").split(",");
        let vanStockStatuses = this._partsRequiredBusinessRules.getBusinessRule<string>("vanStockStatuses").split(",");
        let vanStockOrderStatus = this._partsRequiredBusinessRules.getBusinessRule<string>("vanPartsInBasket");

        let validTaskStatusesForThisPart = part.partOrderStatus === vanStockOrderStatus ? vanStockStatuses : orderPartStatuses;
        let partTask = job.tasks.find(task => task.id === part.taskId);

        return !!partTask && validTaskStatusesForThisPart.some(status => partTask.status === status);
    }

    public async setPartsRequiredForTask(jobId: string): Promise<boolean> {
        let job = await this._jobService.getJob(jobId);

        if (job.tasks.length === 1) {
            job.partsDetail.partsBasket.partsToOrder.forEach(part => {
                part.taskId = job.tasks[0].id;
            });
        }

        let isBasketValid = await this.getPartsBasketStatusValidity(job.partsDetail.partsBasket.partsToOrder, job);
        job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = !isBasketValid;

        if (isBasketValid) {
            if (job.partsDetail.partsBasket.dataState === DataState.invalid) {
                job.partsDetail.partsBasket.dataState = DataState.notVisited;
            }
        } else {
            job.partsDetail.partsBasket.dataState = DataState.invalid;
        }
        await this._jobService.setJob(job);
        return !isBasketValid;
    }

    public getMainPartForTask(jobId: string, taskId: string): Promise<Part> {
        return this._jobService.getJob(jobId)
            .then((job) => {
                if (job) {
                    let parts = job.partsDetail
                            && job.partsDetail.partsBasket
                            && job.partsDetail.partsBasket.partsToOrder || [];

                    return parts.find(p => (p.taskId === taskId) && p.isMainPart) || null;

                } else {
                    throw new BusinessException(this, "partService.getMainPartForTask", "job not found", [jobId], null);
                }
            });
    }

    public getPartsBasket(jobId: string): Promise<PartsBasketBusinessModel> {
        return this._jobService.getJob(jobId)
            .then((job) => {
                if (job) {
                    return job.partsDetail.partsBasket;
                } else {
                    throw new BusinessException(this, "partService.getPartsBasket", "job not found", [jobId], null);
                }
            });
    }

    public savePartsBasket(jobId: string, partsBasket: PartsBasketBusinessModel): Promise<void> {
        return this._jobService.getJob(jobId)
            .then(job => {
                if (job) {
                    if (!job.partsDetail) {
                        job.partsDetail = new PartsDetailBusinessModel();
                    }

                    if (!job.partsDetail.partsBasket) {
                        job.partsDetail.partsBasket = new PartsBasketBusinessModel();
                    }

                    let getTaskMainParts = (parts: Part[]) => parts
                                        .filter(part => part.isMainPart && part.taskId);

                    let preSaveTaskMainParts = getTaskMainParts(job.partsDetail.partsBasket.partsToOrder);
                    let newTaskMainParts = getTaskMainParts(partsBasket.partsToOrder);

                    let taskIdsNewlyMainPartedOrChanged = newTaskMainParts
                                                .filter(newPart => !preSaveTaskMainParts
                                                                    .some(prevPart => newPart.taskId === prevPart.taskId
                                                                                        && newPart.id === prevPart.id))
                                                .map(part => part.taskId);

                    taskIdsNewlyMainPartedOrChanged
                        .map(taskId => job.tasks.find(task => task.id === taskId))
                        .filter(task => task && (task.activity || task.productGroup || task.partType))
                        .forEach(task => {
                            task.activity = undefined;
                            task.productGroup = undefined;
                            task.partType = undefined;
                            if (task.dataState !== DataState.invalid) {
                                task.dataState = DataState.notVisited;
                            }
                        });

                    job.partsDetail.partsBasket.dataState = partsBasket.dataState;
                    job.partsDetail.partsBasket.manualPartDetail = partsBasket.manualPartDetail;
                    job.partsDetail.partsBasket.showAddPartManually = partsBasket.showAddPartManually;
                    job.partsDetail.partsBasket.showRemainingAddPartManuallyFields = partsBasket.showRemainingAddPartManuallyFields;
                    job.partsDetail.partsBasket.deliverPartsToSite = partsBasket.deliverPartsToSite;
                    job.partsDetail.partsBasket.partsToOrder = partsBasket.partsToOrder;
                    job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = partsBasket.hasAtLeastOneWrongActivityStatus;

                    return this.getPartsBasketStatusValidity(job.partsDetail.partsBasket.partsToOrder, job)
                        .then(isBasketValid => {
                            if (isBasketValid) {
                                if (job.partsDetail.partsBasket.dataState !== DataState.invalid) {
                                    job.partsDetail.partsBasket.dataState = DataState.valid;
                                }
                            } else {
                                job.partsDetail.partsBasket.dataState = DataState.invalid;
                            }
                        })
                        .then(() => this._jobService.setJob(job));
                } else {
                    throw new BusinessException(this, "partService.savePartsBasket", "no current job selected", null, null);
                }
            });
    }

    public getTodaysParts(jobId: string): Promise<PartsToday> {
        return this._jobService.getJob(jobId)
            .then((job) => {
                if (!job) {
                    throw new BusinessException(this, "partService.getTodaysParts", "no current job selected", null, null);
                }

                let promises: Promise<void>[] = [];

                if (job.partsDetail &&
                    job.partsDetail.partsToday &&
                    job.partsDetail.partsToday.parts) {
                    job.partsDetail.partsToday.parts.forEach(part => {
                        promises.push(this.getPartWarrantyEstimate(jobId, part.stockReferenceId, part.taskId)
                            .then(estimate => {
                                part.warrantyEstimate = estimate;
                            }));
                    });
                }

                return Promise.all(promises).then(() => job.partsDetail.partsToday);
            });
    }

    public saveTodaysPartsReturns(jobId: string, dataState: DataState, partReturns: { partId: Guid, warrantyReturn: PartWarrantyReturn, notusedReturn: PartNotUsedReturn }[]): Promise<void> {
        return this._jobService.getJob(jobId)
            .then((job) => {
                if (!job || !job.partsDetail || !job.partsDetail.partsToday || !job.partsDetail.partsToday.parts) {
                    throw new BusinessException(this, "partService.saveTodaysParts", "no current job selected or no partsToday parts found", [jobId], null);
                }

                job.partsDetail.partsToday.dataState = dataState;

                partReturns.forEach(partReturn => {
                    let part = job.partsDetail.partsToday.parts.find(todaysPart => todaysPart.id === partReturn.partId);
                    part.warrantyReturn = partReturn.warrantyReturn;
                    part.notUsedReturn = partReturn.notusedReturn;
                });

                return this._jobService.setJob(job);
            });
    }

    public getFittedParts(jobId: string): Promise<Part[]> {

        return Promise.all([
            this._catalogService.getGoodsItemStatuses(),
            this._businessRuleService.getQueryableRuleGroup("todaysParts"),
            this._jobService.getJob(jobId)
        ])
            .then(([partStatuses, ruleGroup, job]) => {
                if (!job) {
                    throw new BusinessException(this, "partService.saveTodaysParts", "no current job selected", null, null);
                }

                let parts: Part[] = [];

                let notFittedIndicator = ruleGroup.getBusinessRule<string>("notFittedIndicator");

                let isAFittedPart = (part: Part) => partStatuses.find(status => status.status === part.status && status.goodsItemNotFindIndicator === notFittedIndicator);

                if (job.history && job.history.tasks) {
                    job.history.tasks.forEach(task => {
                        if (task && task.activities) {
                            task.activities.forEach(activity => {
                                if (activity && activity.parts) {
                                    activity.parts.forEach(part => {
                                        if (part) {
                                            if (isAFittedPart(part)) {
                                                parts.push(part);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                Job.getTasksAndCompletedTasks(job)
                    .forEach(task => {
                        if (task && task.activities) {
                            task.activities.forEach(activity => {
                                if (activity && activity.parts) {
                                    activity.parts.forEach(part => {
                                        if (part && isAFittedPart(part) && !this.isATodaysPart(part, activity, ruleGroup)) {
                                            parts.push(part);
                                        }
                                    });
                                }
                            });
                        }
                    });

                return parts;
            });
    }

    public getPartWarrantyEstimate(jobId: string, stockRefId: string, taskId: string): Promise<WarrantyEstimate> {

        return Promise.all([
            this._businessRuleService.getQueryableRuleGroup("todaysParts"),
            this._catalogService.getGoodsType(stockRefId),
            this._jobService.getJob(jobId)
        ])
            .then(([ruleGroup, goodsType, job]) => {
                let warrantyPeriod = this.getPartWarrantyPeriodOrDefault(goodsType, ruleGroup);
                let unknownWarrantyEstimateResult = new WarrantyEstimate(false, warrantyPeriod, null, WarrantyEstimateType.unknown);
                let appliance: Appliance;

                if (!taskId || !job || !job.history || !job.history.appliances) {
                    return unknownWarrantyEstimateResult;
                }

                let task = (job.tasks.concat(job.history.tasks || [])).find(t => t.id === taskId);
                if (task !== undefined) {
                    appliance = job.history.appliances.find(a => a.id === task.applianceId);
                    if (!appliance) {
                        return unknownWarrantyEstimateResult;
                    }
                }

                return this.getPartFittedDates(jobId, stockRefId, goodsType, ruleGroup)
                    .then(partFittedDates => {
                        let applianceInstallationDate = (appliance && appliance.installationYear) ? moment(`${appliance.installationYear}-12-31`).toDate() : null;
                        let mostRecentFittedDate = Math.max.apply(null, [applianceInstallationDate, partFittedDates.equivalentPartDate, partFittedDates.samePartDate]);
                        mostRecentFittedDate = (mostRecentFittedDate === 0 ? null : mostRecentFittedDate);

                        if (warrantyPeriod === 0) {
                            return new WarrantyEstimate(false, 0, mostRecentFittedDate, WarrantyEstimateType.doesNotHaveWarranty);
                        }

                        if (this.isDateInWarranty(partFittedDates.samePartDate, warrantyPeriod)) {
                            return new WarrantyEstimate(true, warrantyPeriod, partFittedDates.samePartDate, WarrantyEstimateType.samePartInstallationDate);
                        }

                        if (this.isDateInWarranty(partFittedDates.equivalentPartDate, warrantyPeriod)) {
                            return new WarrantyEstimate(true, warrantyPeriod, partFittedDates.equivalentPartDate, WarrantyEstimateType.equivalentPartInstallationDate);
                        }

                        let applianceWarrantyPeriod = ruleGroup.getBusinessRule<number>("defaultApplianceWarrantyWeeks");
                        if (this.isDateInWarranty(applianceInstallationDate, warrantyPeriod)) {
                            return new WarrantyEstimate(true, applianceWarrantyPeriod, applianceInstallationDate, WarrantyEstimateType.applianceInstallationDate);
                        }

                        return new WarrantyEstimate(false, warrantyPeriod, mostRecentFittedDate, WarrantyEstimateType.notInWarranty);
                    });
            });
    }

    public async deletePartsAssociatedWithTask(jobId: string, taskId: string): Promise<void> {
        let job = await this._jobService.getJob(jobId);
        if (job && job.partsDetail && job.partsDetail.partsBasket) {
            if (job.partsDetail.partsBasket.partsToOrder) {
                let partsInBasket: Part[] = job.partsDetail.partsBasket.partsToOrder.slice();
                partsInBasket.forEach(part => {
                    if (part.taskId === taskId) {
                        job.partsDetail.partsBasket.partsToOrder.splice(job.partsDetail.partsBasket.partsToOrder.indexOf(part), 1);
                    }
                });
                let isPartsBasketValid = await this.getPartsBasketStatusValidity(job.partsDetail.partsBasket.partsToOrder, job);
                job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = !isPartsBasketValid;

                if (isPartsBasketValid) {
                    if (job.partsDetail.partsBasket.dataState === DataState.invalid) {
                        job.partsDetail.partsBasket.dataState = DataState.notVisited;
                    }
                } else {
                    job.partsDetail.partsBasket.dataState = DataState.invalid;
                }
                return this._jobService.setJob(job);
            }
            return;
        }
        return;
    }

    private async getPartsBasketStatusValidity(parts: Part[], job: Job): Promise<boolean> {
        let mandatoryPartStatuses = ["IP"];

        let partValidityResults = await Promise.all(parts.map(part => this.getPartStatusValidity(part, job)));
        let isAPartInvalid = partValidityResults.some(result => !result);

        let partRequiredTasks = job.tasks.filter(task => mandatoryPartStatuses.some(status => status === task.status));
        let everyMandatoryTaskIsHappy = partRequiredTasks.every(task => parts.some(part => part.taskId === task.id && part.partOrderStatus === "O"));

        job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = !everyMandatoryTaskIsHappy;
        return everyMandatoryTaskIsHappy && !isAPartInvalid;
    }

    private getPartWarrantyPeriodOrDefault(goodsType: IGoodsType, ruleGroup: QueryableBusinessRuleGroup): number {
        let isPartCatalogCurrentlyInDate = (): boolean => {

            const goodsTypeDateFmt = ruleGroup.getBusinessRule<string>("goodsTypeDateFmt") || "";

            return (!goodsType.goodsTypeStartDate || moment(goodsType.goodsTypeStartDate, goodsTypeDateFmt).isBefore(moment()))
                && ((!goodsType.goodsTypeEndDate || goodsType.goodsTypeEndDate === "") || moment(goodsType.goodsTypeEndDate, goodsTypeDateFmt).isAfter(moment()));
        };

        let hasPartCatalogGotAWarrantyPeriod = () => {
            return goodsType
                && (!!goodsType.warrantyPeriod || goodsType.warrantyPeriod === 0);
        };

        return hasPartCatalogGotAWarrantyPeriod() && isPartCatalogCurrentlyInDate()
            ? goodsType.warrantyPeriod
            : ruleGroup.getBusinessRule<number>("defaultPartWarrantyWeeks");
    }

    private getPartFittedDates(
        jobId: string,
        stockRefId: string,
        goodsType: IGoodsType,
        ruleGroup: QueryableBusinessRuleGroup)
        : Promise<{ samePartDate: Date, equivalentPartDate: Date }> {

        let getPartWithClassification = (part: Part): Promise<{ part: Part, classification: "samePart" | "equivalentPart" | "differentPart" | "cannotEstablish" }> => {

            if (part.stockReferenceId === stockRefId) {
                return Promise.resolve({ part, classification: <"samePart">"samePart" });
            } else if (!goodsType) {
                return Promise.resolve({ part, classification: <"cannotEstablish">"cannotEstablish" });
            } else {
                return this._catalogService.getGoodsType(part.stockReferenceId)
                    .then(catalog => (catalog
                        && catalog.productGroupCode === goodsType.productGroupCode
                        && catalog.partTypeCode === goodsType.partTypeCode)
                        ? { part, classification: <"equivalentPart">"equivalentPart" }
                        : { part, classification: <"differentPart">"differentPart" }
                    );
            }
        };

        return this.getFittedParts(jobId)
            .then(parts => Promise.all(parts.map(part => getPartWithClassification(part))))
            .then(partsWithClassification => {
                let samePartDates = partsWithClassification.filter(p => p.classification === "samePart")
                    .map(p => moment(p.part.fittedDate).toDate());

                let equivalentPartDates = partsWithClassification.filter(p => p.classification === "equivalentPart")
                    .map(p => moment(p.part.fittedDate).toDate());
                return {
                    samePartDate: samePartDates.length ? Math.max.apply(null, samePartDates) : null,
                    equivalentPartDate: equivalentPartDates.length ? Math.max.apply(null, equivalentPartDates) : null
                };
            });
    }

    private isDateInWarranty(date: Date, warrantyWeeks: number): boolean {
        return !!date && moment(date).add(warrantyWeeks, "weeks").isAfter();
    }

    private isATodaysPart(part: Part, activity: Activity, ruleGroup: QueryableBusinessRuleGroup): boolean {
        return activity.status === ruleGroup.getBusinessRule<string>("doTodayActivityStatus")
            && part.status === ruleGroup.getBusinessRule<string>("toBeFittedPartStatus");
    }

}
