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
define(["require", "exports", "aurelia-framework", "../models/jobState", "../models/businessException", "./storageService"], function (require, exports, aurelia_framework_1, jobState_1, businessException_1, storageService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobCacheService = /** @class */ (function () {
        function JobCacheService(storageService) {
            this._storageService = storageService;
        }
        JobCacheService.prototype.getJobsToDo = function () {
            var _this = this;
            if (this._jobCache === undefined) {
                return this._storageService.getJobsToDo()
                    .then(function (jobsToDo) {
                    _this._jobCache = jobsToDo;
                    return _this._jobCache;
                });
            }
            else {
                return Promise.resolve(this._jobCache);
            }
        };
        JobCacheService.prototype.clearJobsToDo = function () {
            this._jobCache = [];
            return this._storageService.setJobsToDo(null);
        };
        JobCacheService.prototype.getJob = function (id) {
            var job = this._jobCache.find(function (j) { return j.id === id; });
            if (job) {
                return Promise.resolve(job);
            }
            else {
                return Promise.reject(new businessException_1.BusinessException(this, "getJob.notFound", "Job not found '{0}'", [id], null));
            }
        };
        JobCacheService.prototype.setJob = function (job) {
            /* Set job doesn't actually need to do anything with the job as it is the in memory cache object
             * just save the list of jobs as a background task */
            return this._storageService.setJobsToDo(this._jobCache);
        };
        JobCacheService.prototype.getWorkListJobs = function () {
            return this._storageService.getWorkListJobs()
                .then(function (jobs) { return jobs ? jobs.filter(function (job) { return job.position >= 0; }) : []; });
        };
        JobCacheService.prototype.setWorkListJobs = function (jobs) {
            var _this = this;
            return this._storageService.setWorkListJobs(jobs)
                .then(function () { return _this.buildTodoJobs(); })
                .then(function (toDoJobs) { return _this.setJobsToDo(toDoJobs); });
        };
        JobCacheService.prototype.getPartsCollections = function () {
            return this._storageService.getPartsCollections()
                .then(function (collections) { return collections ? collections.filter(function (collection) { return collection.position >= 0; }) : []; });
        };
        JobCacheService.prototype.setPartsCollections = function (partsCollections) {
            return this._storageService.setPartsCollections(partsCollections);
        };
        JobCacheService.prototype.getWorkListJobApiFailures = function () {
            return this._storageService.getWorkListJobApiFailures();
        };
        JobCacheService.prototype.setWorkListJobApiFailures = function (jobApiFailures) {
            return this._storageService.setWorkListJobApiFailures(jobApiFailures);
        };
        JobCacheService.prototype.clearWorkListJobs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this._storageService.setWorkListJobs(null),
                                this._storageService.setWorkListJobApiFailures(null),
                                this._storageService.setPartsCollections(null)
                            ])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        JobCacheService.prototype.existsALiveJobNotInWorklist = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, todoListJobs, worklistJobs, failures, idleJobs, liveJobsOrFailures;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.getJobsToDo(),
                                this.getWorkListJobs(),
                                this.getWorkListJobApiFailures()
                            ])];
                        case 1:
                            _a = _b.sent(), todoListJobs = _a[0], worklistJobs = _a[1], failures = _a[2];
                            idleJobs = (todoListJobs || []).filter(function (job) { return job && job.state === jobState_1.JobState.idle; });
                            liveJobsOrFailures = idleJobs.concat((failures || []));
                            return [2 /*return*/, liveJobsOrFailures.some(function (liveJobsOrFailure) { return !worklistJobs.some(function (worklistJob) { return worklistJob && liveJobsOrFailure && worklistJob.id === liveJobsOrFailure.id; }); })];
                    }
                });
            });
        };
        JobCacheService.prototype.setJobsToDo = function (jobs) {
            this._jobCache = jobs;
            return this._storageService.setJobsToDo(jobs);
        };
        JobCacheService.prototype.buildTodoJobs = function () {
            return Promise.all([
                this.getJobsToDo(),
                this.getWorkListJobs()
            ])
                .then(function (_a) {
                /*
                    At this point:
                        1) we have a new list of allocated jobs from the worklist endpoint: all currently idle jobs in todo jobs need to be
                            replaced with the incoming jobs
                        2) we may or may not have an active job (en-route or arrived): we can expect this job to be in the incoming
                            list, but obviously this job should not be overwritten.  Its position in the list should be updated
                            (todo: why? does this position even matter anymore as the job is in progress)
                        3) we have our done jobs in todoJobs (todo: refactor for better naming, as todoJobs includes done jobs):
                            these jobs need to remain in todoJobs
                        4) a done job may be being rebooked: we need to replace the done job with the incoming job from the worklist
                            these can be identified by a job with a different timestamp

                        In other words: we keep all existing jobs that are at a status other than idle, apart from rebooked done jobs.
                */
                var todoJobs = _a[0], workListJobs = _a[1];
                var nextJobList = [];
                var addJobsOnlyOnce = function (jobs) {
                    (jobs || []).forEach(function (job) {
                        if (!nextJobList.some(function (alreadyAddedJob) { return alreadyAddedJob.id === job.id; })) {
                            nextJobList.push(job);
                        }
                    });
                };
                var doneJobsBeingReactivated = (workListJobs || []).filter(function (workListJob) {
                    return (todoJobs || []).some(function (todoJob) { return todoJob.state === jobState_1.JobState.done
                        && workListJob.id === todoJob.id
                        && workListJob.wmisTimestamp !== todoJob.wmisTimestamp; });
                });
                var existingJobsToKeep = (todoJobs || []).filter(function (job) { return job.state !== jobState_1.JobState.idle; });
                // the order of the following calls is important
                addJobsOnlyOnce(doneJobsBeingReactivated);
                addJobsOnlyOnce(existingJobsToKeep);
                addJobsOnlyOnce(workListJobs);
                // assign the latest position ranking from the worklist
                nextJobList.forEach(function (job) {
                    var workListJob = workListJobs.find(function (wkJob) { return wkJob.id === job.id; });
                    job.position = workListJob ? workListJob.position : job.position;
                });
                nextJobList.sort(function (a, b) { return a.position < b.position ? -1 : 1; });
                return nextJobList;
            });
        };
        JobCacheService = __decorate([
            aurelia_framework_1.inject(storageService_1.StorageService),
            __metadata("design:paramtypes", [Object])
        ], JobCacheService);
        return JobCacheService;
    }());
    exports.JobCacheService = JobCacheService;
});

//# sourceMappingURL=jobCacheService.js.map
