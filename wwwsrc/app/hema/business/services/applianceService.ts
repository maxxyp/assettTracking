/// <reference path="../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { IApplianceService } from "./interfaces/IApplianceService";
import { Job } from "../models/job";
import { Appliance } from "../models/appliance";
import { History as HistoryBusinessModel } from "../models/history";
import { IJobService } from "./interfaces/IJobService";
import { JobService } from "./jobService";
import { BusinessException } from "../models/businessException";
import { ArrayHelper } from "../../../common/core/arrayHelper";
import { ICatalogService } from "../../business/services/interfaces/ICatalogService";
import { CatalogService } from "../../business/services/catalogService";
import { IBusinessRuleService } from "../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../business/services/businessRuleService";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import { ApplianceSafety } from "../models/applianceSafety";
import { ApplianceElectricalSafetyDetail } from "../models/applianceElectricalSafetyDetail";
import { ApplianceElectricalUnsafeDetail } from "../models/applianceElectricalUnsafeDetail";
import { IObjectType } from "../models/reference/IObjectType";
import { DataState } from "../models/dataState";
import { BaseApplianceFactory } from "../../common/factories/baseApplianceFactory";
import { IBaseApplianceFactory } from "../../common/factories/interfaces/IBaseApplianceFactory";
import { BridgeBusinessService } from "../../business/services/bridgeBusinessService";
import { IBridgeBusinessService } from "../../business/services/interfaces/IBridgeBusinessService";
import { Guid } from "../../../common/core/guid";
import { IStorageService } from "./interfaces/IStorageService";
import { StorageService } from "./storageService";
import { DataStateManager } from "../../common/dataStateManager";
import { IDataStateManager } from "../../common/IDataStateManager";
import { TaskService } from "./taskService";
import { ITaskService } from "./interfaces/ITaskService";
import { IconDetailItem } from "../../../common/ui/elements/models/iconDetailItem";
import { AdaptCssClassConstants } from "../../presentation/constants/adaptCssClassConstants";
import { AdaptAvailabilityAttributeType } from "./constants/adaptAvailabilityAttributeType";
import { ExternalApplianceAppModel } from "../models/adapt/externalApplianceAppModel";
import { ApplianceOperationType } from "../models/applianceOperationType";

@inject(JobService, CatalogService, BusinessRuleService, BaseApplianceFactory, BridgeBusinessService, StorageService, DataStateManager, TaskService)
export class ApplianceService implements IApplianceService {
    private _jobService: IJobService;
    private _catalogService: ICatalogService;
    private _businessRulesService: IBusinessRuleService;
    private _bridgeBusinessService: IBridgeBusinessService;
    private _baseApplianceFactory: IBaseApplianceFactory;
    private _storageService: IStorageService;
    private _dataStateManager: IDataStateManager;
    private _taskService: ITaskService;

    constructor(jobService: IJobService, catalogService: ICatalogService, businessRulesService: IBusinessRuleService,
        baseApplianceFactory: IBaseApplianceFactory, bridgeBusinessService: IBridgeBusinessService,
        storageService: IStorageService, dataStateManager: IDataStateManager, taskService: ITaskService) {
        this._jobService = jobService;
        this._catalogService = catalogService;
        this._businessRulesService = businessRulesService;
        this._bridgeBusinessService = bridgeBusinessService;
        this._baseApplianceFactory = baseApplianceFactory;
        this._storageService = storageService;
        this._dataStateManager = dataStateManager;
        this._taskService = taskService;
    }

    public getChildApplianceId(jobId: string, parentApplianceId: string): Promise<string> {
        return this.getAppliances(jobId)
            .then(appliances => {

                let appliance = appliances.find(a => a.id === parentApplianceId);

                if (!appliance) {
                    throw new BusinessException(this, "getChildApplianceId", "applianceId not found", null, null);
                }

                return appliance.childId;
            })
            .catch(ex => {
                throw new BusinessException(this, "getChildApplianceId", "could not get appliance", null, ex);
            });
    }

    public getAppliances(jobId: string): Promise<Appliance[]> {

        return Promise.all<Job, QueryableBusinessRuleGroup, IObjectType[], string>([
            this._jobService.getJob(jobId),
            this._businessRulesService.getQueryableRuleGroup("applianceService"),
            this._catalogService.getObjectTypes(),
            this._storageService.getWorkingSector()
        ])
            .then(([job, ruleGroup, catalog, sector]) => {

                this.senatizeDescription(job, ruleGroup);
                let isElectricalEngineer = ruleGroup.getBusinessRule<string>("electricalWorkingSector") === sector;

                // electrical and gas engineers need to see the appliance list sorted with their own type of appliance higher
                //  e.g. gas engineer sees gas appliances first, then electrical (the other), and vice versa
                let applianceCategoryPriorities = ruleGroup.getBusinessRuleList<string>(isElectricalEngineer
                    ? "electricalApplianceCategorySortOrder"
                    : "gasApplianceCategorySortOrder");

                return this.orderAppliances(job, applianceCategoryPriorities, catalog)
                    .filter(appliance => !appliance.isDeleted && !appliance.isExcluded);
            })
            .catch(ex => {
                throw new BusinessException(this, "appliances", "could not get appliances", null, ex);
            }
            );
    }

    public getAppliancesForLandlordsCertificate(jobId: string): Promise<Appliance[]> {
        return this.getAppliances(jobId).then((appliances: Appliance[]): Appliance[] => {
            return appliances.filter(a => a.isSafetyRequired && !a.isInstPremAppliance && !a.isExcluded);
        });
    }

    public getAppliance(jobId: string, applianceId: string): Promise<Appliance> {
        return this.getAppliances(jobId)
            .then(appliances => {

                let appliance = appliances.find(a => a.id === applianceId);

                if (!appliance) {
                    throw new BusinessException(this, "appliances", "applianceId not found", null, null);
                }

                return appliance;
            })
            .catch(ex => {
                throw new BusinessException(this, "appliances", "could not get appliance", null, ex);
            });
    }

    public createAppliance(jobId: string, appliance: Appliance): Promise<void> {
        let childApplianceIndicator: string;
        let childAppliance: Appliance = null;
        let engineerWorkingSector: string = undefined;

        return this._storageService.getWorkingSector()
            .then((sector) => {
                if (sector) {
                    engineerWorkingSector = sector;
                } else {
                    throw new BusinessException("applianceService", "createAppliance", "Required engineer working sector not found", null, null);
                }
            })
            .then(() => this._jobService.getJob(jobId))
            .then(job => {
                if (job) {

                    // first check if its a parent and child or just a normal appliance
                    // if it is a parent child, then create the child but dont save
                    return this._businessRulesService.getQueryableRuleGroup("applianceService")
                        .then((businessRuleGroup) => {
                            if (businessRuleGroup) {
                                return businessRuleGroup.getBusinessRule<string>("childApplianceIndicator");
                            } else {
                                throw new BusinessException("applianceService", "createAppliance", "Required business rule group not found", null, null);
                            }
                        })
                        .then((childApplianceIndicatorRule) => {
                            if (childApplianceIndicatorRule) {
                                childApplianceIndicator = childApplianceIndicatorRule;
                                return null;
                            } else {
                                throw new BusinessException("applianceService", "createAppliance", "Required business rule not found", null, null);
                            }
                        })
                        .then(() => this._catalogService.getObjectTypes())
                        .then((applianceTypeCatalog: IObjectType[]) => {

                            let parentCatalogItem = applianceTypeCatalog.find(a => a.applianceType === appliance.applianceType);
                            if (parentCatalogItem) {
                                let childCatalogItem = applianceTypeCatalog.find(a =>
                                    a.association === childApplianceIndicator &&
                                    a.associationNumber === parentCatalogItem.associationNumber);

                                if (childCatalogItem) {
                                    // there is a child appliance needed
                                    childAppliance = new Appliance();
                                    childAppliance.id = Guid.newGuid();
                                    childAppliance.parentId = appliance.id;
                                    appliance.childId = childAppliance.id;

                                    childAppliance.applianceType = childCatalogItem.applianceType;

                                    childAppliance.flueType = appliance.flueType;

                                    childAppliance.locationDescription = appliance.locationDescription;
                                    childAppliance.isCreated = true;

                                    return this._baseApplianceFactory.populateBusinessModelFields(childAppliance, engineerWorkingSector)
                                        .then(() => {
                                            // cannot set to notVisited because the baseApplianceFactory.populateApplianceDataState logic
                                            //  will in most scenarios convert to dontCare
                                            childAppliance.dataState = DataState.invalid;
                                        });
                                } else {
                                    return Promise.resolve();
                                }
                            } else {
                                return Promise.resolve();
                            }
                        })
                        .then(() => {
                            this.ensureHistoryExists(job);
                            appliance.isCreated = true;

                            job.history.appliances.push(appliance);
                            if (childAppliance) {
                                job.history.appliances.push(childAppliance);
                            }

                            return this._dataStateManager.updateAppliancesDataState(job);
                        })
                        .then(() => this._jobService.setJob(job));

                } else {
                    throw new BusinessException(this, "appliances", "no current job selected", null, null);
                }
            });
    }

    public updateAppliance(jobId: string, appliance: Appliance, setIsUpdated: boolean, updateMakeAndModel: boolean): Promise<void> {
        return this._jobService.getJob(jobId)
            .then(job => {
                if (job) {
                    this.ensureHistoryExists(job);

                    let existingApplianceIndex: number = job.history.appliances.findIndex(a => a.id === appliance.id);

                    if (existingApplianceIndex >= 0) {
                        let existingAppliance = job.history.appliances[existingApplianceIndex];

                        if (appliance.flueType !== existingAppliance.flueType && appliance.safety && appliance.safety.applianceGasSafety) {
                            appliance.safety.applianceGasSafety.chimneyInstallationAndTests = undefined;
                        }

                        if (setIsUpdated) {
                            appliance.isUpdated = true;
                        }
                        job.history.appliances[existingApplianceIndex] = appliance;

                        let p = updateMakeAndModel ? this.ensureAdaptInformationIsSynced(jobId) : Promise.resolve();

                        return p
                            .then(() => this._dataStateManager.updateApplianceDataState(appliance, job))
                            .then(() => this._jobService.setJob(job));
                    } else {
                        throw new BusinessException(this, "appliances", "saving appliance that does not exist", null, null);
                    }
                } else {
                    throw new BusinessException(this, "appliances", "no current job selected", null, null);
                }
            });
    }

    public getApplianceSafetyDetails(jobId: string, applianceId: string): Promise<ApplianceSafety> {
        return this.getAppliance(jobId, applianceId)
            .then(appliance => appliance.safety);
    }

    public saveApplianceSafetyDetails(jobId: string, applianceId: string, applianceSafety: ApplianceSafety, setIsUpdated: boolean, updateAdaptMakeAndModel: boolean): Promise<void> {
        return this.getAppliance(jobId, applianceId)
            .then(appliance => {
                appliance.safety = applianceSafety;

                return this.updateAppliance(jobId, appliance, setIsUpdated, updateAdaptMakeAndModel);
            });
    }

    public saveElectricalSafetyDetails(jobId: string, applianceId: string,
        safetyDetail: ApplianceElectricalSafetyDetail,
        unsafeDetail: ApplianceElectricalUnsafeDetail,
        setIsUpdated: boolean): Promise<void> {

        return this.getAppliance(jobId, applianceId)
            .then(appliance => {
                if (appliance) {
                    appliance.safety.applianceElectricalSafetyDetail = safetyDetail;
                    appliance.safety.applianceElectricalUnsafeDetail = unsafeDetail;

                    return this.updateAppliance(jobId, appliance, setIsUpdated, false);
                } else {
                    // todo: throw error
                    throw new BusinessException(this, "appliances", "no current appliance", null, null);
                }
            });
    }

    public async isFullGcCode(gcCode: string): Promise<boolean> {
        const ruleGroup = await this._businessRulesService.getQueryableRuleGroup("applianceService");
        const rule = ruleGroup.getBusinessRule<string>("fullGcCodeLength");
        return !!gcCode && parseInt(rule, 10) === gcCode.length;
    }

    public async ensureAdaptInformationIsSynced(jobId: string): Promise<void> {
        const job = jobId && await this._jobService.getJob(jobId);
        if (!job) {
            return;
        }

        const createIcon = (className: string, key: string) => <IconDetailItem>{ iconClassName: className, title: key};
        const ruleGroup = await this._businessRulesService.getQueryableRuleGroup("applianceService");
        const rule = ruleGroup.getBusinessRule<string>("fullGcCodeLength");
        const isFullGcCode = (gcCode: string) => !!gcCode && parseInt(rule, 10) === gcCode.length;

        const appliances = (job.history && job.history.appliances || [])
                .filter(appliance => appliance && !appliance.isDeleted);

        // reset any appliances that the user has changed gc code or are invalid
        const appliancesToReset = appliances
            .filter(appliance => !isFullGcCode(appliance.gcCode)
                                    || (appliance.adaptInfo && appliance.adaptInfo.gcCode !== appliance.gcCode));

        appliancesToReset
            .forEach(appliance => {
                appliance.adaptInfo = undefined;
                appliance.headerIcons = [];
            });

        const appliancesThatShouldBeSynced = appliances
            .filter(appliance =>  isFullGcCode(appliance.gcCode)
                                    && !appliance.adaptInfo);

        const getAndAttachAdaptInfo = async (appliance: Appliance) => {

            let adaptInfo: ExternalApplianceAppModel;
            try {
                appliance.headerIcons = [createIcon(AdaptCssClassConstants.BUSY, "loading")];
                adaptInfo = await this._bridgeBusinessService.getApplianceInformation(appliance.gcCode);
                if (adaptInfo.foundInAdapt) {

                    appliance.safety.applianceGasSafety.applianceMake = adaptInfo.manufacturer && adaptInfo.manufacturer.substr(0, 10);

                    appliance.safety.applianceGasSafety.applianceModel = adaptInfo.description && adaptInfo.description.substr(0, 10);

                    appliance.headerIcons = [];

                    if (adaptInfo.safetyNotice) {
                        appliance.headerIcons.push(createIcon(AdaptCssClassConstants.SAFETY_ISSUE, "gcStatusSafetyIssue"));
                    }

                    if (adaptInfo.availabilityStatus === AdaptAvailabilityAttributeType.FOLIO) {
                        appliance.headerIcons.push(createIcon(AdaptCssClassConstants.FOLIO, "gcStatusFolio"));
                    } else if (adaptInfo.availabilityStatus === AdaptAvailabilityAttributeType.WITHDRAWN) {
                        appliance.headerIcons.push(createIcon(AdaptCssClassConstants.WITHDRAWN, "gcStatusWithdrawn"));
                    } else if (adaptInfo.availabilityStatus === AdaptAvailabilityAttributeType.REDUCED_PARTS_LIST) {
                        appliance.headerIcons.push(createIcon(AdaptCssClassConstants.RESTRICTED, "gcStatusRsl"));
                    } else if (adaptInfo.availabilityStatus === AdaptAvailabilityAttributeType.SERVICE_LISTED) {
                        appliance.headerIcons.push(createIcon(AdaptCssClassConstants.SERVICE_LISTED, "gcStatusSl"));
                    }

                    if (adaptInfo.ceased) {
                        appliance.headerIcons.push(createIcon(AdaptCssClassConstants.CEASED, "gcStatusCeased"));
                    }
                } else {
                    appliance.headerIcons = [createIcon(AdaptCssClassConstants.ERROR_ADAPT, "adaptError")];
                }

            } catch (error) {
                appliance.headerIcons = [createIcon(AdaptCssClassConstants.ERROR_ADAPT, "adaptError")];
            } finally {
                // fallback logic - try to give a decent default to model
                if (!appliance.safety.applianceGasSafety.applianceModel && appliance.description) {
                    appliance.safety.applianceGasSafety.applianceModel = appliance.description.substr(0, 10);
                }

                appliance.adaptInfo = { gcCode: appliance.gcCode, info: adaptInfo};
            }
        };

        await Promise.map(appliancesThatShouldBeSynced, appliance => getAndAttachAdaptInfo(appliance));
    }

    public async replaceAppliance(jobId: string, appliance: Appliance, oldApplianceId: string): Promise<void> {
        await this.createAppliance(jobId, appliance);

        let job = await this._jobService.getJob(jobId);
        if (job) {
            let tasks = job.tasks && job.tasks.filter(x => x.applianceId === oldApplianceId);
            if (tasks && tasks.length) {
                await Promise.map(tasks, task => this._taskService.updateTaskAppliance(jobId, task.id, appliance.applianceType, appliance.id, task.jobType, task.chargeType));
            }
            let oldAppliance = job.history.appliances.find(a => a.id === oldApplianceId);
            await this.deleteOrExcludeAppliance(jobId, oldApplianceId, ApplianceOperationType.delete);

            if (oldAppliance.childId) {
                await this.deleteOrExcludeAppliance(jobId, oldAppliance.childId, ApplianceOperationType.delete);
            }
        } else {
            throw new BusinessException(this, "replaceAppliance", "job not exist", null, null);
        }
    }

    public deleteOrExcludeAppliance(jobId: string, applianceId: string, operation: ApplianceOperationType): Promise<void> {
        return this._jobService.getJob(jobId)
            .then(job => {
                if (job) {
                    let appliance = job.history.appliances.find(a => a.id === applianceId);
                    if (appliance) {
                        appliance.isDeleted = operation === ApplianceOperationType.delete ? true : undefined;
                        appliance.isExcluded = operation === ApplianceOperationType.exclude ? true : undefined;
                    } else {
                        throw new BusinessException(this, "appliances", "deleting appliance that does not exist", null, null);
                    }
                    // todo crossover between appliances and tasks here
                    let tasksWithAppliance = job.tasks && job.tasks.filter(x => x.applianceId === applianceId);
                    tasksWithAppliance.forEach((task) => {
                        task.applianceId = undefined;
                        task.applianceType = undefined;
                        task.dataState = DataState.invalid;
                    });

                    return this._dataStateManager.updateAppliancesDataState(job)
                        .then(() => this._dataStateManager.updatePropertySafetyDataState(job))
                        .then(() => this._jobService.setJob(job));
                } else {
                    throw new BusinessException(this, "appliances", "no current job selected", null, null);
                }
            });
    }

    private ensureHistoryExists(job: Job): void {
        if (!job.history) {
            job.history = new HistoryBusinessModel();
            job.history.appliances = [];
        } else if (!job.history.appliances) {
            job.history.appliances = [];
        }
    }

    private removeBadCharactersFromApplianceDesc(regex: string, appliance: Appliance): void {

        // if WMIS returns description with trailing full stop replace with empty string
        if (regex) {
            let desc = appliance.description;
            if (desc) {
                appliance.description = desc.replace(new RegExp(regex), "");
            }
        }
    }

    private orderAppliances(job: Job, categoryPriorities: string[], catalog: IObjectType[]): Appliance[] {
        // the default ordering for appliances should be:
        //  0) child appliances must be shown immediately after their parent
        //  1) the appliance for task 001, then 002, then 003, etc. (i.e. in task id order)
        //  2) for a gas job: the remaining appliances, ordered by gas, then electric, then other
        //     for an electrical job: the remaining appliances, ordered by electric, then gas, then other
        let orderedAppliances: Appliance[] = [];

        if (job.history) {
            let appliances = job.history.appliances;

            if (appliances) {
                let addApplianceOnce = (appliance: Appliance): void => {
                    if (appliance && !orderedAppliances.find(app => app.id === appliance.id)) {
                        orderedAppliances.push(appliance);
                    }
                };

                // handles making sure that parent/child pairs are always added as a
                //   pair, and in the correct order.  It is possible that the child may be fed in before the parent.
                let addApplianceOrPair = (appliance: Appliance): void => {
                    if (appliance) {
                        // check for a child being added first
                        if (appliance.parentId) {
                            let parentApp = appliances.find(a => a.id === appliance.parentId);
                            addApplianceOnce(parentApp);
                        }

                        addApplianceOnce(appliance);

                        // check for a parent being added first
                        if (appliance.childId) {
                            let childApp = appliances.find(a => a.id === appliance.childId);
                            addApplianceOnce(childApp);
                        }
                    }
                };

                if (job.tasks) {
                    // add appliances for today's tasks, in task order
                    ArrayHelper.sortByColumn(job.tasks, "id");
                    job.tasks.forEach(task => {
                        let appliance = appliances.find(app => app.id === task.applianceId);
                        addApplianceOrPair(appliance);
                    });
                }

                let applianceAndTypeCodes = appliances.map(app => {
                    let catalogItem = catalog.find(c => c.applianceType === app.applianceType);

                    return {
                        appliance: app,
                        code: catalogItem ? catalogItem.applianceCategory : undefined
                    };
                });

                /* add appliance based on their categories */
                categoryPriorities.forEach(category => {
                    applianceAndTypeCodes
                        .filter(app => app.code === category)
                        .forEach(app => addApplianceOrPair(app.appliance));
                });

                /* finally any that we have missed because they didn't have a category */
                appliances.forEach((appliance) => addApplianceOrPair(appliance));
            }
        }

        return orderedAppliances;
    }

    private senatizeDescription(job: Job, ruleGroup: QueryableBusinessRuleGroup): void {
        // reference: DF_553, in some cases, for e.g. First Visit, WMIS adds a trailing '.', so remove here.
        // todo remove this when WMIS clean up their appliance description for first visits

        let regex = ruleGroup.getBusinessRule<string>("removeCharactersDescription");
        if (regex && job.history.appliances) {
            job.history.appliances.forEach(appliance => this.removeBadCharactersFromApplianceDesc(regex, appliance));
        }
    }
}
