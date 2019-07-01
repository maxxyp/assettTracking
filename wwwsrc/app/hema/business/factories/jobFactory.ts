import { CustomerFactory } from "./customerFactory";
import { IJobFactory } from "./interfaces/IJobFactory";
import { IRiskFactory } from "./interfaces/IRiskFactory";
import { RiskFactory } from "./riskFactory";
import { IContactFactory } from "./interfaces/IContactFactory";
import { ContactFactory } from "./contactFactory";
import { IPremisesFactory } from "./interfaces/IPremisesFactory";
import { PremisesFactory } from "./premisesFactory";
import { ITaskFactory } from "./interfaces/ITaskFactory";
import { TaskFactory } from "./taskFactory";
import { IVisitFactory } from "./interfaces/IVisitFactory";
import { VisitFactory } from "./visitFactory";
import { IApplianceFactory } from "./interfaces/IApplianceFactory";
import { ApplianceFactory } from "./applianceFactory";
import { IPropertySafetyFactory } from "./interfaces/IPropertySafetyFactory";
import { PropertySafetyFactory } from "./propertySafetyFactory";
import { IJob } from "../../api/models/fft/jobs/IJob";
import { Job } from "../models/job";
import { Risk } from "../models/risk";
import { History } from "../models/history";
import { Appliance } from "../models/appliance";
import { IAppliance } from "../../api/models/fft/jobs/history/IAppliance";
import { ArrayHelper } from "../../../common/core/arrayHelper";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../services/businessRuleService";
import { IJobHistory } from "../../api/models/fft/jobs/history/IJobHistory";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import { StringHelper } from "../../../common/core/stringHelper";
import { inject } from "aurelia-dependency-injection";
import { IJobUpdate } from "../../api/models/fft/jobs/jobupdate/IJobUpdate";
import { IJobUpdateJob } from "../../api/models/fft/jobs/jobupdate/IJobUpdateJob";
import { ComplaintFactory } from "./complaintFactory";
import { IComplaintFactory } from "./interfaces/IComplaintFactory";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { IPremises as PremisesUpdateModel } from "../../api/models/fft/jobs/jobupdate/IPremises";
import { IStatus } from "../../api/models/fft/jobs/jobupdate/IStatus";
import { DateHelper } from "../../core/dateHelper";
import { JobState } from "../models/jobState";
import { Engineer } from "../models/engineer";
import { IAppliance as ApplianceUpdateApiModel } from "../../api/models/fft/jobs/jobupdate/IAppliance";
import { PartsDetail } from "../models/partsDetail";
import { PartsToday } from "../models/partsToday";
import { IAddressFactory } from "./interfaces/IAddressFactory";
import { AddressFactory } from "./addressFactory";
import { ICustomerFactory } from "./interfaces/ICustomerFactory";
import { IChargeFactory } from "./interfaces/IChargeFactory";
import { ChargeFactory } from "./chargeFactory";
import { DataState } from "../models/dataState";
import { StorageService } from "../services/storageService";
import { IStorageService } from "../services/interfaces/IStorageService";
import { Task } from "../models/task";
import { IWorkListItem } from "../../api/models/fft/engineers/worklist/IWorkListItem";
import { DataStateManager } from "../../common/dataStateManager";
import { IDataStateManager } from "../../common/IDataStateManager";
import { PropertySafetyType } from "../models/propertySafetyType";
import { JobSanityCheckService } from "../services/jobSanityCheckService";
import { JobPartsCollection } from "../models/jobPartsCollection";
import { IPartCollectionResponse } from "../../api/models/fft/jobs/parts/IPartCollectionResponse";
import { Charge } from "../models/charge/charge";
import { PartsBasket } from "../models/partsBasket";

@inject(RiskFactory, ContactFactory, TaskFactory, PremisesFactory, VisitFactory, ApplianceFactory,
    PropertySafetyFactory, ComplaintFactory, BusinessRuleService,
    AddressFactory, CustomerFactory, ChargeFactory, StorageService, DataStateManager, JobSanityCheckService)
export class JobFactory implements IJobFactory {
    private _riskFactory: IRiskFactory;
    private _contactFactory: IContactFactory;
    private _premisesFactory: IPremisesFactory;
    private _taskFactory: ITaskFactory;
    private _visitFactory: IVisitFactory;
    private _applianceFactory: IApplianceFactory;
    private _propertySafetyFactory: IPropertySafetyFactory;
    private _complaintFactory: IComplaintFactory;
    private _addressFactory: IAddressFactory;
    private _customerFactory: ICustomerFactory;
    private _chargeFactory: IChargeFactory;

    private _businessRules: QueryableBusinessRuleGroup;

    private _businessRulesService: IBusinessRuleService;
    private _storageService: IStorageService;
    private _dataStateManager: IDataStateManager;
    private _jobSanityCheckService: JobSanityCheckService;

    constructor(riskFactory: IRiskFactory,
        contactFactory: IContactFactory,
        taskFactory: ITaskFactory,
        premisesFactory: IPremisesFactory,
        visitFactory: IVisitFactory,
        applianceFactory: IApplianceFactory,
        propertySafetyFactory: IPropertySafetyFactory,
        complaintFactory: IComplaintFactory,
        businessRuleService: IBusinessRuleService,
        addressFactory: IAddressFactory,
        customerFactory: ICustomerFactory,
        chargeFactory: IChargeFactory,
        storageService: IStorageService,
        dataStateManager: IDataStateManager,
        jobSanityCheckService: JobSanityCheckService) {
        this._riskFactory = riskFactory;
        this._contactFactory = contactFactory;
        this._premisesFactory = premisesFactory;
        this._taskFactory = taskFactory;
        this._visitFactory = visitFactory;
        this._applianceFactory = applianceFactory;
        this._propertySafetyFactory = propertySafetyFactory;
        this._complaintFactory = complaintFactory;
        this._businessRulesService = businessRuleService;
        this._addressFactory = addressFactory;
        this._customerFactory = customerFactory;
        this._chargeFactory = chargeFactory;
        this._storageService = storageService;
        this._dataStateManager = dataStateManager;
        this._jobSanityCheckService = jobSanityCheckService;
    }

    public createJobBusinessModel(worklistItem: IWorkListItem, jobApiModel: IJob, jobHistoryApiModel: IJobHistory): Promise<Job> {
        let job: Job = new Job();

        if (worklistItem) {
            job.id = worklistItem.id;
            job.wmisTimestamp = worklistItem.timestamp;
        }

        job.dispatchTime = new Date();

        return this.loadBusinessRules()
            .then(() => {
                this.createCustomerBusinessModel(jobApiModel, job);
                this.createAddressBusinessModel(jobApiModel, job);
                this.createPremisesBusinessModel(jobApiModel, job);
                this.createVisitBusinessModel(jobApiModel, job);

                job.partsDetail = new PartsDetail();
                job.partsDetail.partsToday = new PartsToday();
                job.partsDetail.partsBasket = new PartsBasket();
            })
            .then(() => Promise.all([
                this.createTasksBusinessModel(jobApiModel, job),
                this.createHistoryBusinessModel(jobHistoryApiModel, job)
            ]))
            .then(() => this.calculatePropertySafetyType(job))
            .then(() => {
                job.isLandlordJob = job.wasOriginallyLandlordJob = Job.isLandlordJob(job);
                this.createPropertySafetyBusinessModel(jobApiModel, job);
                this.createChargesBusinessModel(jobApiModel, job);
                return this.createAppliancesBusinessModel(jobHistoryApiModel, job);
            })
            .then(() => this._dataStateManager.updateAppliancesDataState(job))
            .then(() => this._dataStateManager.updatePropertySafetyDataState(job))
            .then(() => {

                job.isBadlyFormed = this._jobSanityCheckService.isBadlyFormed(job);
                return job;
            });
    }

    public createPartCollectionBusinessModel(worklistItem: IWorkListItem, partApiModel: IPartCollectionResponse): JobPartsCollection {

        let jobPartsCollection: JobPartsCollection = new JobPartsCollection();

        if (worklistItem) {
            jobPartsCollection.id = worklistItem.id;
            jobPartsCollection.wmisTimestamp = worklistItem.timestamp;
        }

        if (partApiModel && partApiModel.data && partApiModel.data.customer && partApiModel.data.list) {
            const {data} = partApiModel;

            const {customer, list} = data;

            const {address = [], firstName = "", lastName = "", title = "", middleName = ""} = customer;

            // if we don't filter empty string in view model could get double commas,
            // e.g. address like "124 something street, , ...".

            jobPartsCollection.customer = {
                address: address.filter(a => a && !!a.trim()),
                firstName,
                lastName,
                middleName,
                title
            };

            jobPartsCollection.parts = list.map(p => {
                const {stockReferenceId, quantity, description} = p;
                return {
                    stockReferenceId,
                    quantity: parseInt(quantity, 10),
                    description
                };
            });
        }

        return jobPartsCollection;
    }

    public createAddressBusinessModel(jobApiModel: IJob, job: Job): void {
        if (jobApiModel && jobApiModel.customer && jobApiModel.customer.address) {
            job.customerAddress = this._addressFactory.createAddressBusinessModel(jobApiModel.customer.address);
        }
    }

    public createCustomerBusinessModel(jobApiModel: IJob, job: Job): void {
        if (job && jobApiModel && jobApiModel.customer) {
            job.customerId = jobApiModel.customer.id;
            job.customerContact = this._customerFactory.createCustomerContactBusinessModel(jobApiModel.customer);
        }
    }

    public createChargesBusinessModel(jobApiModel: IJob, job: Job): void {
        if (job && jobApiModel && jobApiModel.tasks) {
            job.charge = this._chargeFactory.createChargeBusinessModel(jobApiModel.tasks);
            job.charge.dataState = Job.hasCharge(job) ? DataState.notVisited : DataState.dontCare;
        }
    }

    public createJobApiModel(job: Job, engineer: Engineer, originalJob: Job): Promise<IJobUpdate> {
        let jobUpdataApiModel = <IJobUpdate>{};

        if (job && engineer) {
            return this.loadBusinessRules()
                .then(() => this.getJobStatusCode(job))
                .then((status) => this.createJobUpdateJobApiModel(job, engineer, status, jobUpdataApiModel))
                .then((applianceIdToSequenceMap) => this.createAppliancesApiModel(job, jobUpdataApiModel, applianceIdToSequenceMap, originalJob))
                .then(() => {
                    this.createComplaintApiModel(job, jobUpdataApiModel);
                    this.createAppointmentApiModel(job, jobUpdataApiModel);

                    return jobUpdataApiModel;
                });

        } else {
            return Promise.resolve(jobUpdataApiModel);
        }
    }

    public getJobStatusCode(job: Job): Promise<string> {
        return this.loadBusinessRules()
            .then(() => {

                if (job.jobNotDoingReason) {
                    if (job.tasks.some(task => task.status === this._businessRules.getBusinessRule<string>("NotVisitedOtherActivityStatus"))) {
                        return this._businessRules.getBusinessRule<string>("statusNoVisit");
                    }
                    return this._businessRules.getBusinessRule<string>("statusNoAccess");
                }

                switch (job.state) {
                    // case JobState.idle
                    case JobState.enRoute:
                        return this._businessRules.getBusinessRule<string>("statusEnRoute");
                    case JobState.arrived:
                        return this._businessRules.getBusinessRule<string>("statusOnSite");
                    case JobState.deSelect:
                        return this._businessRules.getBusinessRule<string>("statusVisitDeselected");
                    case JobState.complete:
                        return this._businessRules.getBusinessRule<string>("statusTaskCompletion");
                    case JobState.done:
                        return this._businessRules.getBusinessRule<string>("statusTaskCompletion");
                }

                return undefined;
            });
    }

    private calculatePropertySafetyType(job: Job): Promise<void> {
        return Promise.all([
            this._businessRulesService.getQueryableRuleGroup("jobFactory")
            .then((ruleGroup) => {
                return ruleGroup.getBusinessRule<string>("electricalWorkingSector");
            }),
            this._storageService.getWorkingSector()
        ]).then(([electricalWorkingSector, engineerWorkingSector]) => {

            job.propertySafetyType = engineerWorkingSector === electricalWorkingSector
                                        ? PropertySafetyType.electrical
                                        : PropertySafetyType.gas;
        });
    }

    private createPremisesBusinessModel(jobApiModel: IJob, job: Job): void {
        if (jobApiModel && jobApiModel.premises) {
            job.premises = this._premisesFactory.createPremisesBusinessModel(jobApiModel.premises);

            if (jobApiModel.premises.contact) {
                job.contact = this._contactFactory.createContactBusinessModel(jobApiModel.premises.contact);
            }

            if (jobApiModel.premises.risks) {
                job.risks = [];

                jobApiModel.premises.risks.forEach(riskApiModel => {
                    job.risks.push(this._riskFactory.createRiskBusinessModel(riskApiModel));
                });
            }
        }
    }

    private createVisitBusinessModel(jobApiModel: IJob, job: Job): void {
        if (jobApiModel && jobApiModel.visit) {
            job.visit = this._visitFactory.createVisitBusinessModel(jobApiModel.visit);
        }
    }

    private createTasksBusinessModel(jobApiModel: IJob, job: Job): Promise<void> {
        if (!jobApiModel || !jobApiModel.tasks) {
            return Promise.resolve();
        }

        job.tasks = [];
        job.tasksNotToday = [];
        let order: number = 0;
        let taskPromises = jobApiModel.tasks.map(taskApiModel => {
            return this._taskFactory.createTaskBusinessModel(taskApiModel, job.partsDetail.partsToday, true)
                .then(task => {
                    if (task) {
                        return this._businessRulesService.getQueryableRuleGroup("chargeService").then(ruleGroup => {
                            task.isCharge = Task.isChargeableTask(task.chargeType, ruleGroup.getBusinessRule<string>("noChargePrefix"));

                            // it looks like orderNo is used during calculations on work durations across doToday tasks, see taskItem.ts
                            // so only give doToday tasks an orderNo so there is an unbroken sequence across live tasks i.e. do not give
                            // !doToday tasks an orderNo
                            if (task.isMiddlewareDoTodayTask) {
                                order = order + 1;
                                task.orderNo = order;
                                job.tasks.push(task);
                            } else {
                                job.tasksNotToday.push(task);
                            }
                        });
                    } else {
                        return undefined;
                    }
                });
        });

        return Promise.all(taskPromises)
            .then(() => ArrayHelper.sortByColumn(job.tasks, "id"))
            .then(() => {
                if (job.partsDetail.partsToday.parts.length === 0) {
                    job.partsDetail.partsToday.dataState = DataState.dontCare;
                }
            });
    }

    private createHistoryBusinessModel(jobHistoryApiModel: IJobHistory, job: Job): Promise<void> {
        if (!jobHistoryApiModel || !jobHistoryApiModel.tasks) {
            return Promise.resolve();
        }

        job.history = new History();
        job.history.tasks = [];

        let taskPromises = jobHistoryApiModel.tasks.map(taskApiModel => {
            return this._taskFactory.createTaskBusinessModel(taskApiModel, null, false)
                .then(task => {
                    if (task) {
                        return job.history.tasks.push(task);
                    } else {
                        return undefined;
                    }
                });
        });

        return Promise.all(taskPromises)
            .then(() => ArrayHelper.sortByColumn(job.tasks, "id"))
            .then(() => {
            });
    }

    private createPropertySafetyBusinessModel(jobApiModel: IJob, job: Job): void {
        if (jobApiModel && jobApiModel.premises) {
            job.propertySafety =
                this._propertySafetyFactory.createPropertySafetyBusinessModel(job.propertySafetyType, jobApiModel.premises.safetyDetail, jobApiModel.premises.unsafeDetail);
        }
    }

    private createAppliancesBusinessModel(jobHistoryApiModel: IJobHistory, job: Job): Promise<void> {
        if (jobHistoryApiModel) {

            // #16167 DF_984 - whenever more than one task targets the same appliance, WMIS sends duplicate appliance records,
            //   - 3 tasks for the same appliance means that appliance comes down three times.  THere are no plans to change this behaviour in the API.
            //   - also we access appliance via id, so we ensure that appliance records have an id before accepting them.
            // #16698 - it is possible for there to be no appliances array in the jobHistoryApiModel.
            let uniqueAppliances = (jobHistoryApiModel.appliances || [])
                .reduce((visitedAppliances: IAppliance[], currentAppliance: IAppliance) => {
                    if (currentAppliance && currentAppliance.id && !visitedAppliances.some(a => a.id === currentAppliance.id)) {
                        visitedAppliances.push(currentAppliance);
                    }
                    return visitedAppliances;
                }, []);

            let applianceTypeHazard = this._businessRules.getBusinessRule<string>("applianceTypeHazard");

            let riskApplianceApiModels = uniqueAppliances.filter(applianceApiModel => applianceApiModel.applianceType === applianceTypeHazard);
            riskApplianceApiModels.forEach(riskApplianceApiModel => {
                let risk = this._riskFactory.createRiskBusinessModelFromAppliance(riskApplianceApiModel, applianceTypeHazard);
                if (!job.risks) {
                    job.risks = [];
                }
                job.risks.push(risk);
            });

            if (!job.history) {
                job.history = new History();
            }
            job.history.appliances = [];

            let populateAppliancePromises = uniqueAppliances
                .filter(applianceApiModel => applianceApiModel.applianceType !== applianceTypeHazard)
                .map((applianceApiModel) => {
                    return this._storageService.getWorkingSector()
                        .then((engineerWorkingSector) => this._applianceFactory
                            .createApplianceBusinessModel(applianceApiModel, job, engineerWorkingSector))
                        .then(appliance => {
                            if (appliance) {
                                job.history.appliances.push(appliance);
                            }
                        });
                });

            return Promise.all(populateAppliancePromises).then(() => {
                /* make sure all the parent/child relationships have referential integrity */
                job.history.appliances.filter(x => StringHelper.isString(x.parentId) && x.parentId.length > 0)
                    .forEach(childAppliance => {
                        let parentAppliance = job.history.appliances.find(a => a.id === childAppliance.parentId);

                        if (parentAppliance) {
                            /* found the parent appliance so set its child, however if the child is already set then clear
                             out the parent link from the child as a parent can only have one child */
                            if (parentAppliance.childId) {
                                childAppliance.parentId = undefined;
                            } else {
                                /* if the parent appliance already has its own parent then dont set it again as we
                                 can only have one level deep relationships */
                                if (StringHelper.isString(parentAppliance.parentId) && parentAppliance.parentId.length > 0) {
                                    childAppliance.parentId = undefined;
                                } else {
                                    parentAppliance.childId = childAppliance.id;
                                }
                            }
                        } else {
                            /* no parent appliance found so remove the parent id from the child */
                            childAppliance.parentId = undefined;
                        }
                    });
            });
        } else {
            return Promise.resolve();
        }
    }

    private createJobUpdateJobApiModel(job: Job, engineer: Engineer, status: string, jobUpdateApiModel: IJobUpdate): Promise<{ [guid: string]: number }> {
        if (job) {
            jobUpdateApiModel.job = <IJobUpdateJob>{};

            jobUpdateApiModel.job.status = <IStatus>{};
            jobUpdateApiModel.job.status.code = status;
            jobUpdateApiModel.job.status.timestamp = DateHelper.toJsonDateTimeString(new Date());

            jobUpdateApiModel.job.sourceSystem = this._businessRules.getBusinessRule<string>("sourceSystemWMIS");
            if (!!engineer && !!engineer.id) {
                jobUpdateApiModel.job.engineerId = engineer.id;
            }
            jobUpdateApiModel.job.dispatchTime = DateHelper.toJsonDateTimeString(job.dispatchTime);
            jobUpdateApiModel.job.enrouteTime = DateHelper.toJsonDateTimeString(job.enrouteTime);
            jobUpdateApiModel.job.onsiteTime = DateHelper.toJsonDateTimeString(job.onsiteTime);
            jobUpdateApiModel.job.completionTime = DateHelper.toJsonDateTimeString(job.completionTime);

            // this is required for charge disputes
            // the understanding previously was that complaint reason code determined if there was a charge dispute
            // however, this is wrong and actually it should be in paymentNonCollectionReasonCode

            // future refactor - there maybe warrant to remove the entire complaint reason code mapping in the charge factory

            if (job.charge && job.charge.chargeOption === Charge.CHARGE_NOT_OK) {
                jobUpdateApiModel.job.paymentNonCollectionReasonCode
                    = this._businessRules.getBusinessRule<string>("paymentNonCollectionReasonCodeChargeNotOkCode");
            } else if (job.charge && job.charge.chargeOption === Charge.CHARGE_OK) {
                jobUpdateApiModel.job.paymentNonCollectionReasonCode
                    = this._businessRules.getBusinessRule<string>("paymentNonCollectionReasonCodeChargeOkCode");
            } else {
                jobUpdateApiModel.job.paymentNonCollectionReasonCode = undefined;
            }

            jobUpdateApiModel.job.visitId = job.visit && job.visit.id;

            jobUpdateApiModel.job.futureVisit = this._visitFactory.createVisitApiModel(job);

            jobUpdateApiModel.job.premises = this.createPremisesUpdateJobApiModel(job);

            if (job.tasks) {

                let applianceIdToSequenceMap = this.getNewApplianceIdToHardwareSequenceMap(job);

                let taskPromises = job.tasks.map(task => {
                    let hardwareSequenceNumber = applianceIdToSequenceMap[task.applianceId];
                    return this._taskFactory.createTaskApiModel(task, job, hardwareSequenceNumber);
                });

                return Promise.all(taskPromises)
                    .then(taskUpdateModels => this._chargeFactory.createChargeApiModel(job.charge.tasks, taskUpdateModels))
                    .then(withChargesTaskUpdateModels => {
                        jobUpdateApiModel.job.tasks = withChargesTaskUpdateModels;
                        return applianceIdToSequenceMap;
                    });

            } else {
                return Promise.resolve({});
            }
        } else {
            return Promise.resolve({});
        }
    }

    private createPremisesUpdateJobApiModel(job: Job): PremisesUpdateModel {
        if (job) {
            let premises = this._premisesFactory.createPremisesApiModel(job.premises);

            if (premises) {
                let hasRisks = false;

                if (job.contact) {
                    premises.contact = this._contactFactory.createContactApiModel(job.contact);
                }

                if (job.risks) {
                    premises.risks = job.risks.filter(risk => !risk.isHazard).map(risk => this._riskFactory.createRiskApiModel(risk));
                    hasRisks = premises.risks && premises.risks.length > 0;
                }

                if (!job.jobNotDoingReason) {
                    if (job.propertySafety || hasRisks) {
                        // isjobPartLJReportable should only be defined if a task has explicity set it to true or false, otherwise undefined
                        let isjobPartLJReportable: boolean = undefined;
                        if (job.tasks) {
                            if (job.tasks.some(task => task.isPartLJReportable)) {
                                isjobPartLJReportable = true;
                            } else if (job.tasks.some(task => task.isPartLJReportable === false)) {
                                isjobPartLJReportable = false;
                            }
                        }
                        premises.safety = this._propertySafetyFactory.createPropertySafetyApiModel(job.propertySafetyType, job.propertySafety, hasRisks, isjobPartLJReportable);
                    }

                    if (job.propertySafety) {
                        premises.unsafeDetail = this._propertySafetyFactory.createPropertyUnsafetyApiModel(job.propertySafetyType, job.propertySafety);
                    }
                }
            }

            return premises;
        } else {
            return undefined;
        }
    }

    private createAppliancesApiModel(job: Job, jobUpdateApiModel: IJobUpdate, applianceIdToSequenceMap: { [guid: string]: number }, originalJob: Job): Promise<void> {
        if (job && !job.jobNotDoingReason) {
            let applianceApiModels: Promise<ApplianceUpdateApiModel>[] = [];

            if (job.history) {
                if (job.history.appliances) {
                    let appliancesToReturn = job.history.appliances.filter(appliance => this.shouldApplianceBeReturnedToWmis(appliance, job));
                    let applModels = appliancesToReturn.map(appliance => this._applianceFactory.createApplianceApiModel(job, originalJob, appliance, applianceIdToSequenceMap));
                    applianceApiModels = applianceApiModels.concat(applModels);
                }
            }

            if (job.risks) {
                // #16679 has been added to refactor job.deletedRisks out, and replace with a isDeleted flag on risk models (like appliances)
                let allRisks = job.risks.concat(job.deletedRisks || []);

                let risksToReturn = allRisks.filter(risk => this.shouldRiskBeReturnedToWmis(risk));
                let riskModels = risksToReturn.map((risk => Promise.resolve(this._riskFactory.createApplianceApiModel(risk, originalJob))));
                applianceApiModels = applianceApiModels.concat(riskModels);
            }

            return Promise.all<ApplianceUpdateApiModel>(applianceApiModels)
                .then((applianceUpdateApiModels) => {
                    jobUpdateApiModel.appliances = applianceUpdateApiModels;
                });
        }
        return Promise.resolve();
    }

    private shouldApplianceBeReturnedToWmis(appliance: Appliance, job: Job): boolean {
        if ((appliance.isCreated && appliance.isDeleted) || appliance.isExcluded) {
            return false;
        }
        return !!job.isLandlordJob && !!appliance.isInstPremAppliance || appliance.isCreated || appliance.isUpdated || appliance.isDeleted;
    }

    private shouldRiskBeReturnedToWmis(risk: Risk): boolean {
        if (!risk.isHazard) {
            return false;
        }
        if (risk.isCreated && risk.isDeleted) {
            return false;
        }
        return risk.isCreated || risk.isUpdated || risk.isDeleted;
    }

    private createComplaintApiModel(job: Job, jobUpdateApiModel: IJobUpdate): void {
        jobUpdateApiModel.complaintReportOrCompensationPayment = this._complaintFactory.createComplaintApiModel(job);
    }

    private createAppointmentApiModel(job: Job, jobUpdateApiModel: IJobUpdate): void {
        if (job) {
            jobUpdateApiModel.job.futureVisit = this._visitFactory.createVisitApiModel(job);
        }
    }

    private loadBusinessRules(): Promise<any> {
        if (!!this._businessRules) {
            return Promise.resolve();
        }

        return this._businessRulesService.getQueryableRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this))).then(ruleGroup => {
            this._businessRules = ruleGroup;
        });
    }

    private getNewApplianceIdToHardwareSequenceMap(job: Job): { [guid: string]: number } {
        /*
         Jairam says (in conf call 17/02/17) that for new appliances, we should not pass back applianceId (we give new
         appliances an arbitrary guid in HEMA).  When a new appliance is attached to a task, the task and appliance should be
         referenced to each other via the hardwareSequenceNumber field.  We generate this mapping here and pass this to the task
         and appliance factory methods.
         */
        let map: { [guid: string]: number } = {};

        if (job && job.history && job.history.appliances) {
            let newAppliances = job.history.appliances.filter(appliance => appliance.isCreated);

            if (newAppliances.length) {
                let maxExistingSequenceNumber = job.history.appliances.filter(appliance => !appliance.isCreated).length;
                newAppliances.forEach((appliance, index) => map[appliance.id] = index + 1 + maxExistingSequenceNumber);
            }
        }
        return map;
    }
}
