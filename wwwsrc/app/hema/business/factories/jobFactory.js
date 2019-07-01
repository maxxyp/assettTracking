var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "./customerFactory", "./riskFactory", "./contactFactory", "./premisesFactory", "./taskFactory", "./visitFactory", "./applianceFactory", "./propertySafetyFactory", "../models/job", "../models/history", "../../../common/core/arrayHelper", "../services/businessRuleService", "../../../common/core/stringHelper", "aurelia-dependency-injection", "./complaintFactory", "../../../common/core/objectHelper", "../../core/dateHelper", "../models/jobState", "../models/partsDetail", "../models/partsToday", "./addressFactory", "./chargeFactory", "../models/dataState", "../services/storageService", "../models/task", "../../common/dataStateManager", "../models/propertySafetyType", "../services/jobSanityCheckService", "../models/jobPartsCollection", "../models/charge/charge", "../models/partsBasket"], function (require, exports, customerFactory_1, riskFactory_1, contactFactory_1, premisesFactory_1, taskFactory_1, visitFactory_1, applianceFactory_1, propertySafetyFactory_1, job_1, history_1, arrayHelper_1, businessRuleService_1, stringHelper_1, aurelia_dependency_injection_1, complaintFactory_1, objectHelper_1, dateHelper_1, jobState_1, partsDetail_1, partsToday_1, addressFactory_1, chargeFactory_1, dataState_1, storageService_1, task_1, dataStateManager_1, propertySafetyType_1, jobSanityCheckService_1, jobPartsCollection_1, charge_1, partsBasket_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobFactory = /** @class */ (function () {
        function JobFactory(riskFactory, contactFactory, taskFactory, premisesFactory, visitFactory, applianceFactory, propertySafetyFactory, complaintFactory, businessRuleService, addressFactory, customerFactory, chargeFactory, storageService, dataStateManager, jobSanityCheckService) {
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
        JobFactory.prototype.createJobBusinessModel = function (worklistItem, jobApiModel, jobHistoryApiModel) {
            var _this = this;
            var job = new job_1.Job();
            if (worklistItem) {
                job.id = worklistItem.id;
                job.wmisTimestamp = worklistItem.timestamp;
            }
            job.dispatchTime = new Date();
            return this.loadBusinessRules()
                .then(function () {
                _this.createCustomerBusinessModel(jobApiModel, job);
                _this.createAddressBusinessModel(jobApiModel, job);
                _this.createPremisesBusinessModel(jobApiModel, job);
                _this.createVisitBusinessModel(jobApiModel, job);
                job.partsDetail = new partsDetail_1.PartsDetail();
                job.partsDetail.partsToday = new partsToday_1.PartsToday();
                job.partsDetail.partsBasket = new partsBasket_1.PartsBasket();
            })
                .then(function () { return Promise.all([
                _this.createTasksBusinessModel(jobApiModel, job),
                _this.createHistoryBusinessModel(jobHistoryApiModel, job)
            ]); })
                .then(function () { return _this.calculatePropertySafetyType(job); })
                .then(function () {
                job.isLandlordJob = job.wasOriginallyLandlordJob = job_1.Job.isLandlordJob(job);
                _this.createPropertySafetyBusinessModel(jobApiModel, job);
                _this.createChargesBusinessModel(jobApiModel, job);
                return _this.createAppliancesBusinessModel(jobHistoryApiModel, job);
            })
                .then(function () { return _this._dataStateManager.updateAppliancesDataState(job); })
                .then(function () { return _this._dataStateManager.updatePropertySafetyDataState(job); })
                .then(function () {
                job.isBadlyFormed = _this._jobSanityCheckService.isBadlyFormed(job);
                return job;
            });
        };
        JobFactory.prototype.createPartCollectionBusinessModel = function (worklistItem, partApiModel) {
            var jobPartsCollection = new jobPartsCollection_1.JobPartsCollection();
            if (worklistItem) {
                jobPartsCollection.id = worklistItem.id;
                jobPartsCollection.wmisTimestamp = worklistItem.timestamp;
            }
            if (partApiModel && partApiModel.data && partApiModel.data.customer && partApiModel.data.list) {
                var data = partApiModel.data;
                var customer = data.customer, list = data.list;
                var _a = customer.address, address = _a === void 0 ? [] : _a, _b = customer.firstName, firstName = _b === void 0 ? "" : _b, _c = customer.lastName, lastName = _c === void 0 ? "" : _c, _d = customer.title, title = _d === void 0 ? "" : _d, _e = customer.middleName, middleName = _e === void 0 ? "" : _e;
                // if we don't filter empty string in view model could get double commas,
                // e.g. address like "124 something street, , ...".
                jobPartsCollection.customer = {
                    address: address.filter(function (a) { return a && !!a.trim(); }),
                    firstName: firstName,
                    lastName: lastName,
                    middleName: middleName,
                    title: title
                };
                jobPartsCollection.parts = list.map(function (p) {
                    var stockReferenceId = p.stockReferenceId, quantity = p.quantity, description = p.description;
                    return {
                        stockReferenceId: stockReferenceId,
                        quantity: parseInt(quantity, 10),
                        description: description
                    };
                });
            }
            return jobPartsCollection;
        };
        JobFactory.prototype.createAddressBusinessModel = function (jobApiModel, job) {
            if (jobApiModel && jobApiModel.customer && jobApiModel.customer.address) {
                job.customerAddress = this._addressFactory.createAddressBusinessModel(jobApiModel.customer.address);
            }
        };
        JobFactory.prototype.createCustomerBusinessModel = function (jobApiModel, job) {
            if (job && jobApiModel && jobApiModel.customer) {
                job.customerId = jobApiModel.customer.id;
                job.customerContact = this._customerFactory.createCustomerContactBusinessModel(jobApiModel.customer);
            }
        };
        JobFactory.prototype.createChargesBusinessModel = function (jobApiModel, job) {
            if (job && jobApiModel && jobApiModel.tasks) {
                job.charge = this._chargeFactory.createChargeBusinessModel(jobApiModel.tasks);
                job.charge.dataState = job_1.Job.hasCharge(job) ? dataState_1.DataState.notVisited : dataState_1.DataState.dontCare;
            }
        };
        JobFactory.prototype.createJobApiModel = function (job, engineer, originalJob) {
            var _this = this;
            var jobUpdataApiModel = {};
            if (job && engineer) {
                return this.loadBusinessRules()
                    .then(function () { return _this.getJobStatusCode(job); })
                    .then(function (status) { return _this.createJobUpdateJobApiModel(job, engineer, status, jobUpdataApiModel); })
                    .then(function (applianceIdToSequenceMap) { return _this.createAppliancesApiModel(job, jobUpdataApiModel, applianceIdToSequenceMap, originalJob); })
                    .then(function () {
                    _this.createComplaintApiModel(job, jobUpdataApiModel);
                    _this.createAppointmentApiModel(job, jobUpdataApiModel);
                    return jobUpdataApiModel;
                });
            }
            else {
                return Promise.resolve(jobUpdataApiModel);
            }
        };
        JobFactory.prototype.getJobStatusCode = function (job) {
            var _this = this;
            return this.loadBusinessRules()
                .then(function () {
                if (job.jobNotDoingReason) {
                    if (job.tasks.some(function (task) { return task.status === _this._businessRules.getBusinessRule("NotVisitedOtherActivityStatus"); })) {
                        return _this._businessRules.getBusinessRule("statusNoVisit");
                    }
                    return _this._businessRules.getBusinessRule("statusNoAccess");
                }
                switch (job.state) {
                    // case JobState.idle
                    case jobState_1.JobState.enRoute:
                        return _this._businessRules.getBusinessRule("statusEnRoute");
                    case jobState_1.JobState.arrived:
                        return _this._businessRules.getBusinessRule("statusOnSite");
                    case jobState_1.JobState.deSelect:
                        return _this._businessRules.getBusinessRule("statusVisitDeselected");
                    case jobState_1.JobState.complete:
                        return _this._businessRules.getBusinessRule("statusTaskCompletion");
                    case jobState_1.JobState.done:
                        return _this._businessRules.getBusinessRule("statusTaskCompletion");
                }
                return undefined;
            });
        };
        JobFactory.prototype.calculatePropertySafetyType = function (job) {
            return Promise.all([
                this._businessRulesService.getQueryableRuleGroup("jobFactory")
                    .then(function (ruleGroup) {
                    return ruleGroup.getBusinessRule("electricalWorkingSector");
                }),
                this._storageService.getWorkingSector()
            ]).then(function (_a) {
                var electricalWorkingSector = _a[0], engineerWorkingSector = _a[1];
                job.propertySafetyType = engineerWorkingSector === electricalWorkingSector
                    ? propertySafetyType_1.PropertySafetyType.electrical
                    : propertySafetyType_1.PropertySafetyType.gas;
            });
        };
        JobFactory.prototype.createPremisesBusinessModel = function (jobApiModel, job) {
            var _this = this;
            if (jobApiModel && jobApiModel.premises) {
                job.premises = this._premisesFactory.createPremisesBusinessModel(jobApiModel.premises);
                if (jobApiModel.premises.contact) {
                    job.contact = this._contactFactory.createContactBusinessModel(jobApiModel.premises.contact);
                }
                if (jobApiModel.premises.risks) {
                    job.risks = [];
                    jobApiModel.premises.risks.forEach(function (riskApiModel) {
                        job.risks.push(_this._riskFactory.createRiskBusinessModel(riskApiModel));
                    });
                }
            }
        };
        JobFactory.prototype.createVisitBusinessModel = function (jobApiModel, job) {
            if (jobApiModel && jobApiModel.visit) {
                job.visit = this._visitFactory.createVisitBusinessModel(jobApiModel.visit);
            }
        };
        JobFactory.prototype.createTasksBusinessModel = function (jobApiModel, job) {
            var _this = this;
            if (!jobApiModel || !jobApiModel.tasks) {
                return Promise.resolve();
            }
            job.tasks = [];
            job.tasksNotToday = [];
            var order = 0;
            var taskPromises = jobApiModel.tasks.map(function (taskApiModel) {
                return _this._taskFactory.createTaskBusinessModel(taskApiModel, job.partsDetail.partsToday, true)
                    .then(function (task) {
                    if (task) {
                        return _this._businessRulesService.getQueryableRuleGroup("chargeService").then(function (ruleGroup) {
                            task.isCharge = task_1.Task.isChargeableTask(task.chargeType, ruleGroup.getBusinessRule("noChargePrefix"));
                            // it looks like orderNo is used during calculations on work durations across doToday tasks, see taskItem.ts
                            // so only give doToday tasks an orderNo so there is an unbroken sequence across live tasks i.e. do not give
                            // !doToday tasks an orderNo
                            if (task.isMiddlewareDoTodayTask) {
                                order = order + 1;
                                task.orderNo = order;
                                job.tasks.push(task);
                            }
                            else {
                                job.tasksNotToday.push(task);
                            }
                        });
                    }
                    else {
                        return undefined;
                    }
                });
            });
            return Promise.all(taskPromises)
                .then(function () { return arrayHelper_1.ArrayHelper.sortByColumn(job.tasks, "id"); })
                .then(function () {
                if (job.partsDetail.partsToday.parts.length === 0) {
                    job.partsDetail.partsToday.dataState = dataState_1.DataState.dontCare;
                }
            });
        };
        JobFactory.prototype.createHistoryBusinessModel = function (jobHistoryApiModel, job) {
            var _this = this;
            if (!jobHistoryApiModel || !jobHistoryApiModel.tasks) {
                return Promise.resolve();
            }
            job.history = new history_1.History();
            job.history.tasks = [];
            var taskPromises = jobHistoryApiModel.tasks.map(function (taskApiModel) {
                return _this._taskFactory.createTaskBusinessModel(taskApiModel, null, false)
                    .then(function (task) {
                    if (task) {
                        return job.history.tasks.push(task);
                    }
                    else {
                        return undefined;
                    }
                });
            });
            return Promise.all(taskPromises)
                .then(function () { return arrayHelper_1.ArrayHelper.sortByColumn(job.tasks, "id"); })
                .then(function () {
            });
        };
        JobFactory.prototype.createPropertySafetyBusinessModel = function (jobApiModel, job) {
            if (jobApiModel && jobApiModel.premises) {
                job.propertySafety =
                    this._propertySafetyFactory.createPropertySafetyBusinessModel(job.propertySafetyType, jobApiModel.premises.safetyDetail, jobApiModel.premises.unsafeDetail);
            }
        };
        JobFactory.prototype.createAppliancesBusinessModel = function (jobHistoryApiModel, job) {
            var _this = this;
            if (jobHistoryApiModel) {
                // #16167 DF_984 - whenever more than one task targets the same appliance, WMIS sends duplicate appliance records,
                //   - 3 tasks for the same appliance means that appliance comes down three times.  THere are no plans to change this behaviour in the API.
                //   - also we access appliance via id, so we ensure that appliance records have an id before accepting them.
                // #16698 - it is possible for there to be no appliances array in the jobHistoryApiModel.
                var uniqueAppliances = (jobHistoryApiModel.appliances || [])
                    .reduce(function (visitedAppliances, currentAppliance) {
                    if (currentAppliance && currentAppliance.id && !visitedAppliances.some(function (a) { return a.id === currentAppliance.id; })) {
                        visitedAppliances.push(currentAppliance);
                    }
                    return visitedAppliances;
                }, []);
                var applianceTypeHazard_1 = this._businessRules.getBusinessRule("applianceTypeHazard");
                var riskApplianceApiModels = uniqueAppliances.filter(function (applianceApiModel) { return applianceApiModel.applianceType === applianceTypeHazard_1; });
                riskApplianceApiModels.forEach(function (riskApplianceApiModel) {
                    var risk = _this._riskFactory.createRiskBusinessModelFromAppliance(riskApplianceApiModel, applianceTypeHazard_1);
                    if (!job.risks) {
                        job.risks = [];
                    }
                    job.risks.push(risk);
                });
                if (!job.history) {
                    job.history = new history_1.History();
                }
                job.history.appliances = [];
                var populateAppliancePromises = uniqueAppliances
                    .filter(function (applianceApiModel) { return applianceApiModel.applianceType !== applianceTypeHazard_1; })
                    .map(function (applianceApiModel) {
                    return _this._storageService.getWorkingSector()
                        .then(function (engineerWorkingSector) { return _this._applianceFactory
                        .createApplianceBusinessModel(applianceApiModel, job, engineerWorkingSector); })
                        .then(function (appliance) {
                        if (appliance) {
                            job.history.appliances.push(appliance);
                        }
                    });
                });
                return Promise.all(populateAppliancePromises).then(function () {
                    /* make sure all the parent/child relationships have referential integrity */
                    job.history.appliances.filter(function (x) { return stringHelper_1.StringHelper.isString(x.parentId) && x.parentId.length > 0; })
                        .forEach(function (childAppliance) {
                        var parentAppliance = job.history.appliances.find(function (a) { return a.id === childAppliance.parentId; });
                        if (parentAppliance) {
                            /* found the parent appliance so set its child, however if the child is already set then clear
                             out the parent link from the child as a parent can only have one child */
                            if (parentAppliance.childId) {
                                childAppliance.parentId = undefined;
                            }
                            else {
                                /* if the parent appliance already has its own parent then dont set it again as we
                                 can only have one level deep relationships */
                                if (stringHelper_1.StringHelper.isString(parentAppliance.parentId) && parentAppliance.parentId.length > 0) {
                                    childAppliance.parentId = undefined;
                                }
                                else {
                                    parentAppliance.childId = childAppliance.id;
                                }
                            }
                        }
                        else {
                            /* no parent appliance found so remove the parent id from the child */
                            childAppliance.parentId = undefined;
                        }
                    });
                });
            }
            else {
                return Promise.resolve();
            }
        };
        JobFactory.prototype.createJobUpdateJobApiModel = function (job, engineer, status, jobUpdateApiModel) {
            var _this = this;
            if (job) {
                jobUpdateApiModel.job = {};
                jobUpdateApiModel.job.status = {};
                jobUpdateApiModel.job.status.code = status;
                jobUpdateApiModel.job.status.timestamp = dateHelper_1.DateHelper.toJsonDateTimeString(new Date());
                jobUpdateApiModel.job.sourceSystem = this._businessRules.getBusinessRule("sourceSystemWMIS");
                if (!!engineer && !!engineer.id) {
                    jobUpdateApiModel.job.engineerId = engineer.id;
                }
                jobUpdateApiModel.job.dispatchTime = dateHelper_1.DateHelper.toJsonDateTimeString(job.dispatchTime);
                jobUpdateApiModel.job.enrouteTime = dateHelper_1.DateHelper.toJsonDateTimeString(job.enrouteTime);
                jobUpdateApiModel.job.onsiteTime = dateHelper_1.DateHelper.toJsonDateTimeString(job.onsiteTime);
                jobUpdateApiModel.job.completionTime = dateHelper_1.DateHelper.toJsonDateTimeString(job.completionTime);
                // this is required for charge disputes
                // the understanding previously was that complaint reason code determined if there was a charge dispute
                // however, this is wrong and actually it should be in paymentNonCollectionReasonCode
                // future refactor - there maybe warrant to remove the entire complaint reason code mapping in the charge factory
                if (job.charge && job.charge.chargeOption === charge_1.Charge.CHARGE_NOT_OK) {
                    jobUpdateApiModel.job.paymentNonCollectionReasonCode
                        = this._businessRules.getBusinessRule("paymentNonCollectionReasonCodeChargeNotOkCode");
                }
                else if (job.charge && job.charge.chargeOption === charge_1.Charge.CHARGE_OK) {
                    jobUpdateApiModel.job.paymentNonCollectionReasonCode
                        = this._businessRules.getBusinessRule("paymentNonCollectionReasonCodeChargeOkCode");
                }
                else {
                    jobUpdateApiModel.job.paymentNonCollectionReasonCode = undefined;
                }
                jobUpdateApiModel.job.visitId = job.visit && job.visit.id;
                jobUpdateApiModel.job.futureVisit = this._visitFactory.createVisitApiModel(job);
                jobUpdateApiModel.job.premises = this.createPremisesUpdateJobApiModel(job);
                if (job.tasks) {
                    var applianceIdToSequenceMap_1 = this.getNewApplianceIdToHardwareSequenceMap(job);
                    var taskPromises = job.tasks.map(function (task) {
                        var hardwareSequenceNumber = applianceIdToSequenceMap_1[task.applianceId];
                        return _this._taskFactory.createTaskApiModel(task, job, hardwareSequenceNumber);
                    });
                    return Promise.all(taskPromises)
                        .then(function (taskUpdateModels) { return _this._chargeFactory.createChargeApiModel(job.charge.tasks, taskUpdateModels); })
                        .then(function (withChargesTaskUpdateModels) {
                        jobUpdateApiModel.job.tasks = withChargesTaskUpdateModels;
                        return applianceIdToSequenceMap_1;
                    });
                }
                else {
                    return Promise.resolve({});
                }
            }
            else {
                return Promise.resolve({});
            }
        };
        JobFactory.prototype.createPremisesUpdateJobApiModel = function (job) {
            var _this = this;
            if (job) {
                var premises = this._premisesFactory.createPremisesApiModel(job.premises);
                if (premises) {
                    var hasRisks = false;
                    if (job.contact) {
                        premises.contact = this._contactFactory.createContactApiModel(job.contact);
                    }
                    if (job.risks) {
                        premises.risks = job.risks.filter(function (risk) { return !risk.isHazard; }).map(function (risk) { return _this._riskFactory.createRiskApiModel(risk); });
                        hasRisks = premises.risks && premises.risks.length > 0;
                    }
                    if (!job.jobNotDoingReason) {
                        if (job.propertySafety || hasRisks) {
                            // isjobPartLJReportable should only be defined if a task has explicity set it to true or false, otherwise undefined
                            var isjobPartLJReportable = undefined;
                            if (job.tasks) {
                                if (job.tasks.some(function (task) { return task.isPartLJReportable; })) {
                                    isjobPartLJReportable = true;
                                }
                                else if (job.tasks.some(function (task) { return task.isPartLJReportable === false; })) {
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
            }
            else {
                return undefined;
            }
        };
        JobFactory.prototype.createAppliancesApiModel = function (job, jobUpdateApiModel, applianceIdToSequenceMap, originalJob) {
            var _this = this;
            if (job && !job.jobNotDoingReason) {
                var applianceApiModels = [];
                if (job.history) {
                    if (job.history.appliances) {
                        var appliancesToReturn = job.history.appliances.filter(function (appliance) { return _this.shouldApplianceBeReturnedToWmis(appliance, job); });
                        var applModels = appliancesToReturn.map(function (appliance) { return _this._applianceFactory.createApplianceApiModel(job, originalJob, appliance, applianceIdToSequenceMap); });
                        applianceApiModels = applianceApiModels.concat(applModels);
                    }
                }
                if (job.risks) {
                    // #16679 has been added to refactor job.deletedRisks out, and replace with a isDeleted flag on risk models (like appliances)
                    var allRisks = job.risks.concat(job.deletedRisks || []);
                    var risksToReturn = allRisks.filter(function (risk) { return _this.shouldRiskBeReturnedToWmis(risk); });
                    var riskModels = risksToReturn.map((function (risk) { return Promise.resolve(_this._riskFactory.createApplianceApiModel(risk, originalJob)); }));
                    applianceApiModels = applianceApiModels.concat(riskModels);
                }
                return Promise.all(applianceApiModels)
                    .then(function (applianceUpdateApiModels) {
                    jobUpdateApiModel.appliances = applianceUpdateApiModels;
                });
            }
            return Promise.resolve();
        };
        JobFactory.prototype.shouldApplianceBeReturnedToWmis = function (appliance, job) {
            if ((appliance.isCreated && appliance.isDeleted) || appliance.isExcluded) {
                return false;
            }
            return !!job.isLandlordJob && !!appliance.isInstPremAppliance || appliance.isCreated || appliance.isUpdated || appliance.isDeleted;
        };
        JobFactory.prototype.shouldRiskBeReturnedToWmis = function (risk) {
            if (!risk.isHazard) {
                return false;
            }
            if (risk.isCreated && risk.isDeleted) {
                return false;
            }
            return risk.isCreated || risk.isUpdated || risk.isDeleted;
        };
        JobFactory.prototype.createComplaintApiModel = function (job, jobUpdateApiModel) {
            jobUpdateApiModel.complaintReportOrCompensationPayment = this._complaintFactory.createComplaintApiModel(job);
        };
        JobFactory.prototype.createAppointmentApiModel = function (job, jobUpdateApiModel) {
            if (job) {
                jobUpdateApiModel.job.futureVisit = this._visitFactory.createVisitApiModel(job);
            }
        };
        JobFactory.prototype.loadBusinessRules = function () {
            var _this = this;
            if (!!this._businessRules) {
                return Promise.resolve();
            }
            return this._businessRulesService.getQueryableRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this))).then(function (ruleGroup) {
                _this._businessRules = ruleGroup;
            });
        };
        JobFactory.prototype.getNewApplianceIdToHardwareSequenceMap = function (job) {
            /*
             Jairam says (in conf call 17/02/17) that for new appliances, we should not pass back applianceId (we give new
             appliances an arbitrary guid in HEMA).  When a new appliance is attached to a task, the task and appliance should be
             referenced to each other via the hardwareSequenceNumber field.  We generate this mapping here and pass this to the task
             and appliance factory methods.
             */
            var map = {};
            if (job && job.history && job.history.appliances) {
                var newAppliances = job.history.appliances.filter(function (appliance) { return appliance.isCreated; });
                if (newAppliances.length) {
                    var maxExistingSequenceNumber_1 = job.history.appliances.filter(function (appliance) { return !appliance.isCreated; }).length;
                    newAppliances.forEach(function (appliance, index) { return map[appliance.id] = index + 1 + maxExistingSequenceNumber_1; });
                }
            }
            return map;
        };
        JobFactory = __decorate([
            aurelia_dependency_injection_1.inject(riskFactory_1.RiskFactory, contactFactory_1.ContactFactory, taskFactory_1.TaskFactory, premisesFactory_1.PremisesFactory, visitFactory_1.VisitFactory, applianceFactory_1.ApplianceFactory, propertySafetyFactory_1.PropertySafetyFactory, complaintFactory_1.ComplaintFactory, businessRuleService_1.BusinessRuleService, addressFactory_1.AddressFactory, customerFactory_1.CustomerFactory, chargeFactory_1.ChargeFactory, storageService_1.StorageService, dataStateManager_1.DataStateManager, jobSanityCheckService_1.JobSanityCheckService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, jobSanityCheckService_1.JobSanityCheckService])
        ], JobFactory);
        return JobFactory;
    }());
    exports.JobFactory = JobFactory;
});

//# sourceMappingURL=jobFactory.js.map
