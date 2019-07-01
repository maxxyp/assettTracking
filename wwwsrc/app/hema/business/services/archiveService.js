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
define(["require", "exports", "../../../common/core/services/configurationService", "aurelia-dependency-injection", "../models/archive", "./constants/archiveConstants", "../../../common/storage/models/databaseSchema", "../../../common/storage/models/databaseSchemaStoreIndex", "../../../common/storage/models/databaseSchemaStore", "moment", "../models/archiveTaskItem", "../models/jobState", "../models/archivePart", "../models/archiveJob", "../../core/customerHelper", "../../../common/core/arrayHelper", "../../core/dateHelper", "../../../common/storage/localStorageDbService", "aurelia-logging"], function (require, exports, configurationService_1, aurelia_dependency_injection_1, archive_1, archiveConstants_1, databaseSchema_1, databaseSchemaStoreIndex_1, databaseSchemaStore_1, moment, archiveTaskItem_1, jobState_1, archivePart_1, archiveJob_1, customerHelper_1, arrayHelper_1, dateHelper_1, localStorageDbService_1, Logging) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
    Underlying assumption is that once job is started it gets completed within the same day.
    Jobs never rollover to any other day. So everthing is logged (archived) is added/updated
    under same job for the current date.
    */
    var ArchiveService = /** @class */ (function () {
        function ArchiveService(databaseService, configurationService) {
            this._archiveDays = configurationService.getConfiguration().maxDaysArchiveRetrival;
            this._databaseService = databaseService;
            this._logger = Logging.getLogger("ArchiveService");
        }
        ArchiveService.prototype.migrate = function (fromDb) {
            return __awaiter(this, void 0, void 0, function () {
                var dbSchema, databaseName, storeSchemas, toDb, _i, storeSchemas_1, storeSchema, existingRecords, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 11, , 12]);
                            dbSchema = this.getDbSchemDefinition();
                            databaseName = dbSchema.name, storeSchemas = dbSchema.storeSchemas;
                            toDb = this._databaseService;
                            return [4 /*yield*/, fromDb.exists(databaseName, storeSchemas[0].name)];
                        case 1:
                            if (!(_a.sent())) {
                                this._logger.warn("Archive Service Migration", "Nothing to migrate");
                                return [2 /*return*/, "NOTHING_TO_MIGRATE"];
                            }
                            return [4 /*yield*/, toDb.exists(databaseName, storeSchemas[0].name)];
                        case 2:
                            if (_a.sent()) {
                                this._logger.warn("Archive Service Migration", "Migration already happened");
                                return [2 /*return*/, "MIGRATION_ALREADY_HAPPENED"];
                            }
                            // we're good to try an migrate from old to new
                            return [4 /*yield*/, toDb.create(dbSchema)];
                        case 3:
                            // we're good to try an migrate from old to new
                            _a.sent();
                            return [4 /*yield*/, toDb.open(databaseName)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, fromDb.open(databaseName)];
                        case 5:
                            _a.sent();
                            _i = 0, storeSchemas_1 = storeSchemas;
                            _a.label = 6;
                        case 6:
                            if (!(_i < storeSchemas_1.length)) return [3 /*break*/, 10];
                            storeSchema = storeSchemas_1[_i];
                            return [4 /*yield*/, fromDb.getAll(databaseName, storeSchema.name)];
                        case 7:
                            existingRecords = _a.sent();
                            return [4 /*yield*/, toDb.setAll(databaseName, storeSchema.name, existingRecords)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 6];
                        case 10:
                            this._logger.warn("Archive Service Migration", "Have migrated");
                            return [2 /*return*/, "HAVE_MIGRATED"];
                        case 11:
                            error_1 = _a.sent();
                            this._logger.warn("Archive Service Migration", "Error", error_1);
                            return [2 /*return*/, "MIGRATION_ERROR"];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        ArchiveService.prototype.initialise = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var items, itemsToDelete, _i, itemsToDelete_1, itemToDelete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.createOrOpen()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._databaseService.getAll(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME)];
                        case 2:
                            items = (_a.sent()) || [];
                            itemsToDelete = items.filter(function (x) { return moment().diff(moment(x.timestamp), "days") >= _this._archiveDays; });
                            _i = 0, itemsToDelete_1 = itemsToDelete;
                            _a.label = 3;
                        case 3:
                            if (!(_i < itemsToDelete_1.length)) return [3 /*break*/, 6];
                            itemToDelete = itemsToDelete_1[_i];
                            return [4 /*yield*/, this._databaseService.remove(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME, itemToDelete.id)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ArchiveService.prototype.addEngineerState = function (engineer, state, jobId) {
            var archive = new archive_1.Archive(engineer.id);
            archive.jobId = jobId;
            archive.engineerId = engineer.id;
            archive.engineerStatus = state;
            return this.updateEngineerStatus(archive, engineer.id, state);
        };
        ArchiveService.prototype.addUpdateJobState = function (job, engineer, jobState) {
            var _this = this;
            return this.getByJob(job.id)
                .then(function (archives) {
                if (archives && archives.length > 0) {
                    var existingArchive = archives.find(function (x) { return x.uniqueJobId === job.uniqueId; });
                    // if exists and not complete then update otherwise add
                    if (existingArchive) {
                        _this.populateJobState(jobState, existingArchive);
                        _this.populateTasks(job, existingArchive, jobState);
                        return _this.update(existingArchive);
                    }
                    else {
                        return _this.addNewArchive(job, engineer, jobState);
                    }
                }
                else {
                    return _this.addNewArchive(job, engineer, jobState);
                }
            });
        };
        ArchiveService.prototype.getArchiveByDate = function (date) {
            return this._databaseService.getAll(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME, "date", date);
        };
        ArchiveService.prototype.getEarliestDate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, dateString, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this._databaseService.getAll(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME)];
                        case 1:
                            data = _a.sent();
                            if (!data) {
                                return [2 /*return*/, undefined];
                            }
                            dateString = dateHelper_1.DateHelper.getMinDate(data.map(function (d) { return d.date; }));
                            return [2 /*return*/, moment(dateString, archive_1.ARCHIVE_DATE_FORMAT).toDate()];
                        case 2:
                            e_1 = _a.sent();
                            throw e_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ArchiveService.prototype.addNewArchive = function (job, engineer, jobState) {
            var archive = new archive_1.Archive(engineer.id);
            archive.jobId = job.id;
            archive.uniqueJobId = job.uniqueId;
            this.populateJobState(jobState, archive);
            if (job.customerContact) {
                archive.address = customerHelper_1.CustomerHelper.formatCustomerAddress(job.premises);
                archive.customerName = customerHelper_1.CustomerHelper.formatCustomerContact(job.contact);
            }
            this.populateTasks(job, archive, jobState);
            return this.update(archive);
        };
        ArchiveService.prototype.populateJobState = function (newState, archive) {
            if (!archive.jobStates) {
                archive.jobStates = [];
            }
            var newArchiveJob = new archiveJob_1.ArchiveJob();
            newArchiveJob.state = newState;
            if (newState === jobState_1.JobState.enRoute) {
                // user may select / de-select job multiple times
                // so we will remove previously selected job state.
                archive.jobStates = [];
            }
            if (!archive.jobStates.find(function (x) { return x.state === newArchiveJob.state; })) {
                archive.jobStates.push(newArchiveJob);
            }
            var newJobStates = archive.jobStates
                .map(function (x) { return (x.state !== newState) ? x : newArchiveJob; });
            archive.jobStates = newJobStates;
        };
        ArchiveService.prototype.update = function (timesheet) {
            return this._databaseService.set(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME, timesheet);
        };
        ArchiveService.prototype.updateEngineerStatus = function (timesheet, engineerId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var currentArchive, sortedArchive, sortedArc, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getByDate(moment().format(archive_1.ARCHIVE_DATE_FORMAT))];
                        case 1:
                            currentArchive = _a.sent();
                            sortedArchive = arrayHelper_1.ArrayHelper.sortByColumnDescending(currentArchive, "id");
                            sortedArc = sortedArchive.filter(function (x) { return x.engineerStatus; });
                            if (sortedArc && sortedArc[0] &&
                                // tslint:disable-next-line:max-line-length
                                (moment(sortedArc[0].timestamp).format(archive_1.ARCHIVE_DATE_FORMAT) === moment().format(archive_1.ARCHIVE_DATE_FORMAT) && sortedArc[0].engineerStatus === status)) {
                                // last enginner status update is already been make for today's date. so dont do it again.
                                return [2 /*return*/];
                            }
                            return [2 /*return*/, this._databaseService.set(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME, timesheet)];
                        case 2:
                            e_2 = _a.sent();
                            throw e_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ArchiveService.prototype.getByJob = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var archives;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getByDate(moment().format(archive_1.ARCHIVE_DATE_FORMAT))];
                        case 1:
                            archives = _a.sent();
                            if (archives) {
                                return [2 /*return*/, archives.filter(function (x) { return x.jobId === jobId; })];
                            }
                            return [2 /*return*/, []];
                    }
                });
            });
        };
        ArchiveService.prototype.getByDate = function (date) {
            return this._databaseService.getAll(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME, "date", date);
        };
        ArchiveService.prototype.createOrOpen = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._databaseService.exists(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE)];
                        case 1:
                            if (!_a.sent()) return [3 /*break*/, 2];
                            this._databaseService.open(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE);
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this._databaseService.create(this.getDbSchemDefinition())];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ArchiveService.prototype.populateParts = function (job, archiveTaskItem) {
            if (job.partsDetail && job.partsDetail.partsBasket && job.partsDetail.partsBasket.partsToOrder) {
                var filteredParts = job.partsDetail.partsBasket.partsToOrder.filter(function (x) { return x.taskId === archiveTaskItem.taskId; });
                if (filteredParts) {
                    archiveTaskItem.partsToOrder = [];
                    filteredParts.forEach(function (part) {
                        var existingPart = archiveTaskItem.partsToOrder.find(function (x) { return x.stockRefereceId === part.stockReferenceId; });
                        if (existingPart === undefined || existingPart === null) {
                            existingPart = new archivePart_1.ArchivePart();
                        }
                        existingPart.description = part.description;
                        existingPart.quantity = part.quantity;
                        existingPart.stockRefereceId = part.stockReferenceId;
                        if (!archiveTaskItem.partsToOrder.find(function (x) { return x.stockRefereceId === part.stockReferenceId; })) {
                            archiveTaskItem.partsToOrder.push(existingPart);
                        }
                    });
                }
            }
        };
        ArchiveService.prototype.populateTasks = function (job, jobArchive, jobState) {
            var _this = this;
            if (jobState === jobState_1.JobState.complete) {
                if (job && job.tasks && jobArchive) {
                    if (!jobArchive.taskItems) {
                        jobArchive.taskItems = [];
                    }
                    job.tasks.forEach(function (task) {
                        if (task && task.report) {
                            var archiveTask = jobArchive.taskItems.find(function (x) { return x.taskId === task.id; });
                            if (archiveTask === undefined || archiveTask === null) {
                                archiveTask = new archiveTaskItem_1.ArchiveTaskItem();
                                archiveTask.taskId = task.id;
                            }
                            archiveTask.visitStatus = task.status;
                            archiveTask.startTime = task.startTime;
                            archiveTask.endTime = task.endTime;
                            archiveTask.duration = task.workDuration;
                            archiveTask.workReport = task.report;
                            archiveTask.applianceType = task.applianceType;
                            archiveTask.jobType = task.jobType;
                            if (!jobArchive.taskItems.find(function (x) { return x.taskId === task.id; })) {
                                jobArchive.taskItems.push(archiveTask);
                            }
                            _this.populateParts(job, archiveTask);
                        }
                    });
                }
            }
        };
        ArchiveService.prototype.getDbSchemDefinition = function () {
            return new databaseSchema_1.DatabaseSchema(archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE, archiveConstants_1.ArchiveConstants.ARCHIVE_DATABASE_VERSION, [
                new databaseSchemaStore_1.DatabaseSchemaStore(archiveConstants_1.ArchiveConstants.ARCHIVE_STORENAME, "id", true, [
                    new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex("id", "id", true),
                    new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex("jobId", "jobId", false),
                    new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex("engineerId", "engineerId", false),
                    new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex("date", "date", false)
                ])
            ]);
        };
        ArchiveService = __decorate([
            aurelia_dependency_injection_1.inject(localStorageDbService_1.LocalStorageDbService, configurationService_1.ConfigurationService),
            __metadata("design:paramtypes", [Object, Object])
        ], ArchiveService);
        return ArchiveService;
    }());
    exports.ArchiveService = ArchiveService;
});

//# sourceMappingURL=archiveService.js.map
