var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-logging", "../models/job", "./engineerService", "aurelia-dependency-injection", "../../api/services/fftService", "../factories/jobFactory", "aurelia-event-aggregator", "../models/businessException", "./jobCacheService", "../../../common/core/objectHelper", "./constants/workRetrievalServiceConstants", "./businessRuleService", "../../../common/core/stringHelper", "./messageService", "../../core/dateHelper", "../../../common/core/services/configurationService", "../../../common/core/threading", "../../../common/core/guid", "../../../appConstants", "../../../common/ui/elements/constants/uiConstants", "../../../common/core/models/baseException", "./workRetrievalTracker", "../../../common/ui/elements/toastManager", "../../../common/analytics/analyticsExceptionModel", "../../../common/analytics/analyticsExceptionCodeConstants", "./constants/soundConstants"], function (require, exports, Logging, job_1, engineerService_1, aurelia_dependency_injection_1, fftService_1, jobFactory_1, aurelia_event_aggregator_1, businessException_1, jobCacheService_1, objectHelper_1, workRetrievalServiceConstants_1, businessRuleService_1, stringHelper_1, messageService_1, dateHelper_1, configurationService_1, threading_1, guid_1, appConstants_1, uiConstants_1, baseException_1, workRetrievalTracker_1, toastManager_1, analyticsExceptionModel_1, analyticsExceptionCodeConstants_1, soundConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkRetrievalService = /** @class */ (function () {
        function WorkRetrievalService(engineerService, fftService, businessRuleService, jobFactory, jobCacheService, eventAggregator, messageService, configurationService, workRetrievalTracker, toastManager) {
            var _this = this;
            this._engineerService = engineerService;
            this._fftService = fftService;
            this._businessRuleService = businessRuleService;
            this._jobFactory = jobFactory;
            this._jobCacheService = jobCacheService;
            this._eventAggregator = eventAggregator;
            this._logger = Logging.getLogger("WorkRetrievalService");
            this._messageService = messageService;
            this._configurationService = configurationService;
            this._refreshWorkListTimerId = -1;
            this._eventAggregator.subscribe(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST, function () { return _this.sendRequestWorkAndPollWorkList(); });
            this._eventAggregator.subscribe(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REFRESH_WORK_LIST, function () { return _this.refreshWorkList(); });
            this._eventAggregator.subscribe(uiConstants_1.UiConstants.TOAST_REMOVED, function () { _this._activeToastItem = undefined; });
            this._tracker = workRetrievalTracker;
            this._toastManager = toastManager;
        }
        WorkRetrievalService.prototype.initialise = function () {
            return __awaiter(this, void 0, void 0, function () {
                var hemaConfiguration, rulesGroup;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            hemaConfiguration = this._configurationService.getConfiguration();
                            this._workListPostRequestWorkPollingIntervals = hemaConfiguration.workListPostRequestWorkPollingIntervals;
                            this._workListPollingInterval = hemaConfiguration.workListPollingInterval;
                            return [4 /*yield*/, this._businessRuleService.getRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))];
                        case 1:
                            rulesGroup = _a.sent();
                            this._businessRules = rulesGroup;
                            this.stopStarRefreshWorkList(true);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.stopStarRefreshWorkList = function (startMonitoring) {
            var _this = this;
            var isPollingSwitchedOn = !!this._workListPollingInterval;
            if (startMonitoring && isPollingSwitchedOn) {
                this._refreshWorkListTimerId = threading_1.Threading.startTimer(function () { return _this.refreshWorkList(); }, this._workListPollingInterval);
            }
            else {
                if (this._refreshWorkListTimerId !== -1) {
                    threading_1.Threading.stopTimer(this._refreshWorkListTimerId);
                    this._refreshWorkListTimerId = -1;
                }
            }
        };
        WorkRetrievalService.prototype.sendRequestWorkAndPollWorkList = function () {
            this._tracker.setShouldRequestWorkOnNextCall(true);
            return this.refreshWorkList();
        };
        WorkRetrievalService.prototype.refreshWorkList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._tracker.requestingStatus) {
                                this.logProgress("getWorkListAlreadyInProgress");
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.getWorkList()];
                        case 1:
                            _a.sent();
                            this._eventAggregator.publish(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REFRESH_START_STOP);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.getIntervals = function () {
            return this._tracker.shouldRequestWorkOnNextCall()
                ? this._workListPostRequestWorkPollingIntervals.slice() 
            // for conventional poll, just one immediate hit (at the moment)
            : [0];
        };
        WorkRetrievalService.prototype.getWorkList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var engineer, canGetWorklist, intervals, pollResults, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._engineerService.getCurrentEngineer()];
                        case 1:
                            engineer = _a.sent();
                            canGetWorklist = engineer && engineer.isSignedOn && engineer.status === undefined;
                            if (!canGetWorklist) {
                                this.logProgress("getWorkListWhenNotWorking");
                                return [2 /*return*/];
                            }
                            intervals = this.getIntervals();
                            this.logProgress("getWorkList");
                            this._tracker.startRequesting();
                            this._eventAggregator.publish(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REFRESH_START_STOP);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 8, , 9]);
                            if (!this._tracker.shouldRequestWorkOnNextCall()) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.requestWork(engineer.id)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.pollWorklist(engineer.id, intervals)];
                        case 5:
                            pollResults = _a.sent();
                            this.logProgress("getWorkListComplete");
                            if (!pollResults) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.notify(pollResults.failures, pollResults.removed, pollResults.newJobs)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            err_1 = _a.sent();
                            this.logError("getWorkList", "getWorkListError", err_1);
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.requestWork = function (engineerId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, err_2, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logProgress("requestWork");
                            if (!!this._tracker.isWorkListIdentifierKnown()) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._fftService.getWorkList(engineerId)];
                        case 2:
                            response = _a.sent();
                            this.registerNewWorkList(response, true);
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            // ... but we have seen from the API it may or may not throw a 404 if we ask for worklist before a request for work.
                            this.logError("preRequestForWorkWorkListRequest", "preRequestForWorkWorkListRequest", err_2);
                            this._tracker.registerFailedWorklist(true);
                            return [3 /*break*/, 4];
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this._fftService.requestWork(engineerId)];
                        case 5:
                            _a.sent();
                            this.logProgress("requestWorkComplete");
                            this._tracker.setShouldRequestWorkOnNextCall(false);
                            return [3 /*break*/, 7];
                        case 6:
                            err_3 = _a.sent();
                            this._tracker.failedRequestWork();
                            this.logError("requestWork", "requestWorkError", err_3);
                            // if the requestForWork call fails, it will be requested next time as we do not set the flag
                            throw new businessException_1.BusinessException(this, "requestWork", "An error has occurred requesting work", [], err_3);
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.pollWorklist = function (engineerId, pollIntervals) {
            return __awaiter(this, void 0, void 0, function () {
                var thisInterval, breakCache, response, error_1, _a, err_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(pollIntervals && pollIntervals.length)) {
                                this.logProgress("pollWorklistUnchanged");
                                this._tracker.registerUnchangedWorklist();
                                return [2 /*return*/, null];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 15, , 16]);
                            thisInterval = pollIntervals.shift();
                            this.logProgress("pollWorklist", "waiting for " + thisInterval + "ms");
                            return [4 /*yield*/, Promise.delay(thisInterval)];
                        case 2:
                            _b.sent();
                            breakCache = this._tracker.hasWorklistFailedPreviously();
                            this.logProgress("requestWorkList", engineerId, { breakCache: breakCache });
                            response = void 0;
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 9]);
                            return [4 /*yield*/, this._fftService.getWorkList(engineerId, breakCache)];
                        case 4:
                            response = _b.sent();
                            return [3 /*break*/, 9];
                        case 5:
                            error_1 = _b.sent();
                            this._tracker.registerFailedWorklist(true);
                            if (!!(pollIntervals && pollIntervals.length)) return [3 /*break*/, 6];
                            throw error_1;
                        case 6:
                            this.logProgress("pollWorklistRetry");
                            return [4 /*yield*/, this.pollWorklist(engineerId, pollIntervals)];
                        case 7: return [2 /*return*/, _b.sent()];
                        case 8: return [3 /*break*/, 9];
                        case 9:
                            this._tracker.deregisterFailedWorklist();
                            this.logProgress("returnedWorkList", JSON.stringify(response));
                            return [4 /*yield*/, this.shouldCompleteWorkListRetrieval(response, pollIntervals)];
                        case 10:
                            if (!(_b.sent())) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.completeWorklistRetrieval(response)];
                        case 11:
                            _a = _b.sent();
                            return [3 /*break*/, 14];
                        case 12: return [4 /*yield*/, this.pollWorklist(engineerId, pollIntervals)];
                        case 13:
                            _a = _b.sent();
                            _b.label = 14;
                        case 14: 
                        // make sure we await the promises here so that this catch handler picks up any errors
                        return [2 /*return*/, _a];
                        case 15:
                            err_4 = _b.sent();
                            this._tracker.registerFailedWorklist(false);
                            this.logError("pollWorklist", "pollWorklisterror", err_4);
                            throw new businessException_1.BusinessException(this, "pollWorklist", "An error has occurred retrieving workList", [], err_4);
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.completeWorklistRetrieval = function (workListResponse) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var allLiveItems, itemsToRetrieve, retrievalResults, updatedModels, err_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            this.logProgress("completeWorklistRetrieval");
                            this.processWorkListMessages(workListResponse.data);
                            this.logProgress("completeWorklistRetrieval - finished messages");
                            allLiveItems = this.getLiveWorklistItems(workListResponse.data.list);
                            itemsToRetrieve = allLiveItems.filter(function (item) { return _this._tracker.shouldRetrieveItem(item); });
                            return [4 /*yield*/, this.retrieveItemsOrErrors(itemsToRetrieve)];
                        case 1:
                            retrievalResults = _a.sent();
                            return [4 /*yield*/, this.appendAndUpdateBusinessModels(retrievalResults, allLiveItems)];
                        case 2:
                            updatedModels = _a.sent();
                            this.setPositions(allLiveItems, updatedModels.currentJobs, updatedModels.currentPartsCollections, retrievalResults.failures);
                            return [4 /*yield*/, Promise.all([
                                    this._jobCacheService.setWorkListJobs(updatedModels.currentJobs),
                                    this._jobCacheService.setPartsCollections(updatedModels.currentPartsCollections),
                                    this._jobCacheService.setWorkListJobApiFailures(retrievalResults.failures)
                                ])];
                        case 3:
                            _a.sent();
                            this._logger.debug("registeringjob", {
                                retrievedOk: retrievalResults.jobs.concat(retrievalResults.partsCollections).map(function (item) { return item.id; }),
                                retrievalError: retrievalResults.failures.map(function (job) { return job.id; })
                            });
                            this.registerNewWorkList(workListResponse, false);
                            this._tracker.registerItems(retrievalResults.okItems, retrievalResults.failedItems, allLiveItems);
                            return [2 /*return*/, {
                                    jobs: updatedModels.currentJobs,
                                    newJobs: updatedModels.newJobs,
                                    failures: retrievalResults.failures,
                                    removed: updatedModels.removedJobs
                                }];
                        case 4:
                            err_5 = _a.sent();
                            this.logError("completeWorklistRetrieval", "completeWorklistRetrievalError", err_5);
                            throw new businessException_1.BusinessException(this, "completeWorklistRetrieval", "A job-specific error has occurred", [], err_5);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.appendAndUpdateBusinessModels = function (retrievalResults, allLiveItems) {
            return __awaiter(this, void 0, void 0, function () {
                var jobs, partsCollections, failures, handleRemovedItems, handleNewOrUpdatedJobs, currentJobs, removedJobs, newPartsCollections, newJobs, currentPartsCollections, removedPartsCollections;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jobs = retrievalResults.jobs, partsCollections = retrievalResults.partsCollections, failures = retrievalResults.failures;
                            this.logProgress("storeWorkList", jobs && jobs.map(function (item) { return item && item.id; }), partsCollections && partsCollections.map(function (item) { return item.id; }));
                            handleRemovedItems = function (currentItems, workType) {
                                var removedItems = [];
                                // position = -1 means the job will be ignored by business code
                                currentItems.forEach(function (item) {
                                    // if the job is no longer in the worklist remove it
                                    if (!allLiveItems.some(function (liveItem) { return liveItem.id === item.id && liveItem.workType === workType; })) {
                                        item.position = -1;
                                        removedItems.push(item);
                                    }
                                    // if a previously healthy job has errored remove it
                                    if (failures.some(function (failedJob) { return failedJob.id === item.id && failedJob.workType === workType; })) {
                                        item.position = -1;
                                    }
                                });
                                return removedItems;
                            };
                            handleNewOrUpdatedJobs = function (currentItems, incomingItems, newItems) {
                                incomingItems.forEach(function (incomingItem) {
                                    var idx = currentItems.findIndex(function (item) { return item.id === incomingItem.id; });
                                    if (idx >= 0) {
                                        currentItems[idx] = incomingItem;
                                    }
                                    else {
                                        currentItems.push(incomingItem);
                                        newItems.push(incomingItem.id);
                                    }
                                });
                            };
                            return [4 /*yield*/, this._jobCacheService.getWorkListJobs()];
                        case 1:
                            currentJobs = (_a.sent()) || [];
                            removedJobs = handleRemovedItems(currentJobs, "job");
                            newPartsCollections = [];
                            newJobs = [];
                            handleNewOrUpdatedJobs(currentJobs, jobs, newJobs);
                            return [4 /*yield*/, this._jobCacheService.getPartsCollections()];
                        case 2:
                            currentPartsCollections = (_a.sent()) || [];
                            removedPartsCollections = handleRemovedItems(currentPartsCollections, "partsCollection");
                            handleNewOrUpdatedJobs(currentPartsCollections, partsCollections, newPartsCollections);
                            // for (let job of jobs) {
                            //     // eventually Howard wants a status acknowledgment for partsCollections too,
                            //     //  but only jobs at the moment
                            //     await this.sendJobStatusAcknowledged(job.id, job.visit && job.visit.id);
                            // }
                            return [2 /*return*/, { currentJobs: currentJobs, newJobs: newJobs, removedJobs: removedJobs, currentPartsCollections: currentPartsCollections, removedPartsCollections: removedPartsCollections }];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.setPositions = function (allLiveItems, jobs, partsCollections, failures) {
            allLiveItems.forEach(function (liveItem, index) {
                var job = (liveItem.workType === "job") && jobs.find(function (item) { return item.id === liveItem.id; });
                if (job && job.position !== -1) {
                    job.position = index;
                    return;
                }
                var partsCollection = (liveItem.workType === "partsCollection") && partsCollections.find(function (item) { return item.id === liveItem.id; });
                if (partsCollection && partsCollection.position !== -1) {
                    partsCollection.position = index;
                    return;
                }
                var apiFailure = failures.find(function (item) { return item.id === liveItem.id && item.workType === liveItem.workType; });
                if (apiFailure && apiFailure.position !== -1) {
                    apiFailure.position = index;
                }
            });
        };
        WorkRetrievalService.prototype.processWorkListMessages = function (workListResponseData) {
            this.logProgress("processMessages");
            if (workListResponseData && workListResponseData.memoList) {
                this._messageService.updateMessages(workListResponseData.memoList);
            }
        };
        WorkRetrievalService.prototype.retrieveItemsOrErrors = function (itemsToRetrieve) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var jobItems, partsCollectionItems, _a, jobsAndErrors, partCollectionsAndErrors, jobs, partsCollections, failures, err_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logProgress("requestJobs", itemsToRetrieve && itemsToRetrieve.map(function (item) { return item && item.id; }));
                            jobItems = itemsToRetrieve.filter(function (item) { return _this.isWorklistItemLiveJob(item); });
                            partsCollectionItems = itemsToRetrieve.filter(function (item) { return _this.isWorklistItemLivePartsCollection(item); });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all([
                                    Promise.map(jobItems, function (worklistItem) { return _this.getWorklistJobOrError(worklistItem); }),
                                    Promise.map(partsCollectionItems, function (worklistItem) { return _this.getWorklistPartsCollectionOrError(worklistItem); })
                                ])];
                        case 2:
                            _a = _b.sent(), jobsAndErrors = _a[0], partCollectionsAndErrors = _a[1];
                            jobs = jobsAndErrors
                                .filter(function (item) { return !item.isError; });
                            partsCollections = partCollectionsAndErrors
                                .filter(function (item) { return !item.isError; });
                            failures = jobsAndErrors.concat(partCollectionsAndErrors).filter(function (item) { return item.isError; });
                            return [2 /*return*/, {
                                    jobs: jobs.map(function (item) { return item.data; }),
                                    partsCollections: partsCollections.map(function (item) { return item.data; }),
                                    failures: failures.map(function (item) { return item.data; }),
                                    okItems: jobs.map(function (item) { return item.worklistItem; }).concat(partsCollections.map(function (item) { return item.worklistItem; })),
                                    failedItems: failures.map(function (item) { return item.worklistItem; })
                                }];
                        case 3:
                            err_6 = _b.sent();
                            this.logError("retrieveWorkListJobsOrErrors", "retrieveWorkListJobsOrErrorsError", err_6);
                            throw new businessException_1.BusinessException(this, "getWorkListJobs", "An error has occurred getting all worklist jobs", [], err_6);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.getWorklistJobOrError = function (worklistItem) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, jobApiModel, jobApiHistory, job, err_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logProgress("getWorklistItem", worklistItem.id);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, Promise.all([
                                    this.getWorklistJob(worklistItem),
                                    this.getWorklistJobHistory(worklistItem)
                                ])];
                        case 2:
                            _a = _b.sent(), jobApiModel = _a[0], jobApiHistory = _a[1];
                            return [4 /*yield*/, this.sendJobStatusAcknowledged(worklistItem.id, jobApiModel.visit && jobApiModel.visit.id)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, this._jobFactory.createJobBusinessModel(worklistItem, jobApiModel, jobApiHistory)];
                        case 4:
                            job = _b.sent();
                            this.logProgress("returnedJobAndJobHistory");
                            return [2 /*return*/, { isError: false, data: job, worklistItem: worklistItem }];
                        case 5:
                            err_7 = _b.sent();
                            this.logError("getWorklistItemOrError", "getWorklistItemOrErrorError", err_7);
                            return [2 /*return*/, { isError: true, data: { id: worklistItem.id, workType: "job" }, worklistItem: worklistItem }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.getWorklistPartsCollectionOrError = function (worklistItem) {
            return __awaiter(this, void 0, void 0, function () {
                var partApiModel, partCollectionJob, err_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.getPartCollection(worklistItem)];
                        case 1:
                            partApiModel = _a.sent();
                            return [4 /*yield*/, this._jobFactory.createPartCollectionBusinessModel(worklistItem, partApiModel)];
                        case 2:
                            partCollectionJob = _a.sent();
                            this.logProgress("returnedPartCollection");
                            return [2 /*return*/, { isError: false, data: partCollectionJob, worklistItem: worklistItem }];
                        case 3:
                            err_8 = _a.sent();
                            this.logError("getWorkListPartsCollectionOrError", "getWorkListPartsCollectionOrError", err_8);
                            return [2 /*return*/, { isError: true, data: { id: worklistItem.id, workType: "partsCollection" }, worklistItem: worklistItem }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.getWorklistJob = function (worklistItem) {
            return __awaiter(this, void 0, void 0, function () {
                var jobId, breakCache, job, err_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jobId = worklistItem.id;
                            breakCache = this._tracker.hasItemFailedPreviously(worklistItem);
                            this.logProgress("requestJobRecord", jobId, { breakCache: breakCache });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._fftService.getJob(jobId, breakCache)];
                        case 2:
                            job = _a.sent();
                            if (!job) {
                                throw new businessException_1.BusinessException(this, "getWorklistJob", "Empty job '{0}' from API", [jobId], null);
                            }
                            return [2 /*return*/, job];
                        case 3:
                            err_9 = _a.sent();
                            throw new businessException_1.BusinessException(this, "getWorklistJob", "Getting job '{0}' from API", [jobId], err_9);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.getWorklistJobHistory = function (worklistItem) {
            return __awaiter(this, void 0, void 0, function () {
                var jobId, breakCache, jobHistory, err_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jobId = worklistItem.id;
                            breakCache = this._tracker.hasItemFailedPreviously(worklistItem);
                            this.logProgress("requestJobHistory", jobId, { breakCache: breakCache });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._fftService.getJobHistory(jobId, breakCache)];
                        case 2:
                            jobHistory = _a.sent();
                            if (!jobHistory) {
                                throw new businessException_1.BusinessException(this, "getWorklistJobHistory", "Empty jobHistory '{0}' from API", [jobId], null);
                            }
                            return [2 /*return*/, jobHistory];
                        case 3:
                            err_10 = _a.sent();
                            throw new businessException_1.BusinessException(this, "getWorklistJobHistory", "Getting job history '{0}' from API", [jobId], err_10);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.getPartCollection = function (worklistItem) {
            return __awaiter(this, void 0, void 0, function () {
                var jobId, breakCache, partCollection, err_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jobId = worklistItem.id;
                            breakCache = this._tracker.hasItemFailedPreviously(worklistItem);
                            this.logProgress("requestPartsCollection", jobId, { breakCache: breakCache });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._fftService.getPartsCollection(jobId, breakCache)];
                        case 2:
                            partCollection = _a.sent();
                            if (!partCollection) {
                                throw new businessException_1.BusinessException(this, "getPartsCollection", "Empty partsCollection '{0}' from API", [jobId], null);
                            }
                            return [2 /*return*/, partCollection];
                        case 3:
                            err_11 = _a.sent();
                            throw new businessException_1.BusinessException(this, "getPartsCollection", "Empty partsCollection '{0}' from API", [jobId], err_11);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.shouldCompleteWorkListRetrieval = function (workListResponse, intervals) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var newTimestamp, hasTimestampChanged, isEndOfPollingVeryFirstRequestForWork, isAPreviouslyFailedJobInWorkList, isAJobInTodoThatIsNotInWorklist;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._tracker.hasWorklistFailedPreviously()) {
                                return [2 /*return*/, true];
                            }
                            newTimestamp = this.getTimeStamp(workListResponse);
                            hasTimestampChanged = newTimestamp !== this._tracker.getLastKnownModifiedTimestamp();
                            this.logProgress("comparingBeforeAndAfterTimestamps", [this._tracker.getLastKnownModifiedTimestamp(), newTimestamp, "has changed?: " + hasTimestampChanged]);
                            if (hasTimestampChanged) {
                                return [2 /*return*/, true];
                            }
                            isEndOfPollingVeryFirstRequestForWork = intervals.length === 0
                                && this._tracker.isFirstRequestForWorkOfTheDay()
                                && workListResponse && workListResponse.data && workListResponse.data.list && !!workListResponse.data.list.length;
                            if (isEndOfPollingVeryFirstRequestForWork) {
                                return [2 /*return*/, true];
                            }
                            isAPreviouslyFailedJobInWorkList = workListResponse && workListResponse.data && workListResponse.data.list
                                && workListResponse.data.list.some(function (workListItem) { return _this._tracker.hasItemFailedPreviously(workListItem); });
                            if (isAPreviouslyFailedJobInWorkList) {
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, this._jobCacheService.existsALiveJobNotInWorklist()];
                        case 1:
                            isAJobInTodoThatIsNotInWorklist = _a.sent();
                            if (isAJobInTodoThatIsNotInWorklist) {
                                return [2 /*return*/, true];
                            }
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.isWorklistItemLiveJob = function (worklistItem) {
            return worklistItem.workType === objectHelper_1.ObjectHelper.getPathValue(this._businessRules, "workTypeJob")
                && worklistItem.status === objectHelper_1.ObjectHelper.getPathValue(this._businessRules, "statusAllocated");
        };
        WorkRetrievalService.prototype.isWorklistItemLivePartsCollection = function (worklistItem) {
            return worklistItem.workType === objectHelper_1.ObjectHelper.getPathValue(this._businessRules, "workTypePartsCollection")
                && worklistItem.status === objectHelper_1.ObjectHelper.getPathValue(this._businessRules, "statusToCollect");
        };
        WorkRetrievalService.prototype.getLiveWorklistItems = function (list) {
            var _this = this;
            return list
                .filter(function (worklistItem) { return _this.isWorklistItemLiveJob(worklistItem) || _this.isWorklistItemLivePartsCollection(worklistItem); });
        };
        WorkRetrievalService.prototype.registerNewWorkList = function (workListResponse, isOnlyForTracking) {
            var newTimestamp = this.getTimeStamp(workListResponse);
            this.logProgress("registerNewTimestamp", newTimestamp);
            this._tracker.registerNewWorklist(newTimestamp, isOnlyForTracking);
        };
        WorkRetrievalService.prototype.getTimeStamp = function (workListResponse) {
            return workListResponse && workListResponse.meta && workListResponse.meta.modifiedTimestamp
                ? workListResponse.meta.modifiedTimestamp
                : undefined;
        };
        WorkRetrievalService.prototype.logProgress = function (step) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            this._logger.info(step, rest);
        };
        WorkRetrievalService.prototype.logError = function (reference, message, err) {
            var errorString = err ? err.toString() : "no-error";
            var analyticsMsg = (err instanceof baseException_1.BaseException)
                ? message + " " + err.resolvedMessage
                : message + " " + errorString;
            var analyticsModel = new analyticsExceptionModel_1.AnalyticsExceptionModel(analyticsExceptionCodeConstants_1.AnalyticsExceptionCodeConstants.WORK_RETRIVAL_SERVICE, false, analyticsMsg);
            this._logger.error(reference + " - " + message, analyticsModel, errorString);
        };
        WorkRetrievalService.prototype.notify = function (failures, removed, newItems) {
            return __awaiter(this, void 0, void 0, function () {
                var messages, autoDismiss, liveJobs_1, liveJob, liveJobId_1, removedTodoJobs, jobList;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            messages = [];
                            autoDismiss = true;
                            if (!(removed && removed.length)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._jobCacheService.getJobsToDo()];
                        case 1:
                            liveJobs_1 = _a.sent();
                            liveJob = liveJobs_1.find(function (job) { return job_1.Job.isActive(job); });
                            liveJobId_1 = liveJob && liveJob.id;
                            if (liveJobId_1 && removed.some(function (removedJob) { return removedJob.id === liveJobId_1; })) {
                                messages.push("The job you are working on (" + liveJobId_1 + ") has been cancelled!");
                            }
                            removedTodoJobs = removed.filter(function (removedJob) { return removedJob.id !== liveJobId_1
                                && !liveJobs_1.some(function (job) { return job.id === removedJob.id; }); });
                            if (removedTodoJobs.length) {
                                messages.push(removedTodoJobs.length + " of todays job(s) have been removed from your worklist.");
                            }
                            autoDismiss = false;
                            _a.label = 2;
                        case 2:
                            if (failures && failures.length) {
                                jobList = failures.map(function (failure) { return failure.id; }).join(", ");
                                messages.push("Failed to load job(s) " + jobList + " in the latest work list.");
                            }
                            if (messages.length) {
                                this.notifyToast("Worklist Update Issue: " + ["Worklist Update Issue: "].concat(messages).join("\n"), undefined, autoDismiss);
                            }
                            if (newItems && newItems.length) {
                                // new jobs identified, notify via sound
                                this._eventAggregator.publish(soundConstants_1.SoundConstants.NOTIFICATION_SOUND, 2);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WorkRetrievalService.prototype.notifyToast = function (content, details, autoDismiss) {
            if (this._activeToastItem) {
                this._toastManager.closeToast(this._activeToastItem);
            }
            else {
                var toast = {
                    id: guid_1.Guid.newGuid(),
                    title: "Work List Retrieval Problem",
                    style: "warning",
                    autoDismiss: autoDismiss
                };
                toast.content = new Date().toLocaleTimeString() + " :" + content;
                toast.toastAction = details && { details: details };
                this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, toast);
                this._activeToastItem = toast;
            }
        };
        WorkRetrievalService.prototype.sendJobStatusAcknowledged = function (jobId, visitId) {
            return __awaiter(this, void 0, void 0, function () {
                var rulesGroup, ruleGroupKey, ackJobReceivedStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._businessRuleService.getRuleGroup("jobFactory")];
                        case 1:
                            rulesGroup = _a.sent();
                            ruleGroupKey = "statusTaskAcknowledged";
                            ackJobReceivedStatus = {
                                data: {
                                    jobId: jobId,
                                    reason: null,
                                    statusCode: rulesGroup[ruleGroupKey],
                                    timestamp: dateHelper_1.DateHelper.toJsonDateTimeString(new Date()),
                                    visitId: visitId
                                }
                            };
                            return [2 /*return*/, this._fftService.jobStatusUpdate(jobId, ackJobReceivedStatus)];
                    }
                });
            });
        };
        WorkRetrievalService = __decorate([
            aurelia_dependency_injection_1.inject(engineerService_1.EngineerService, fftService_1.FftService, businessRuleService_1.BusinessRuleService, jobFactory_1.JobFactory, jobCacheService_1.JobCacheService, aurelia_event_aggregator_1.EventAggregator, messageService_1.MessageService, configurationService_1.ConfigurationService, workRetrievalTracker_1.WorkRetrievalTracker, toastManager_1.ToastManager),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, workRetrievalTracker_1.WorkRetrievalTracker,
                toastManager_1.ToastManager])
        ], WorkRetrievalService);
        return WorkRetrievalService;
    }());
    exports.WorkRetrievalService = WorkRetrievalService;
});

//# sourceMappingURL=workRetrievalService.js.map
