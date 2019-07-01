var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
define(["require", "exports", "aurelia-logging", "moment", "aurelia-framework", "../../../common/storage/indexedDatabaseService", "../../api/services/fftService", "../../../common/storage/models/databaseSchema", "../../../common/storage/models/databaseSchemaStore", "../../../common/storage/models/databaseSchemaStoreIndex", "./constants/referenceDataConstants", "../models/businessException", "aurelia-event-aggregator", "../constants/initialisationEventConstants", "../models/initialisationCategory", "../../../common/core/services/assetService", "../models/initialisationUpdate", "../models/reference/referenceIndex", "../../../common/core/arrayHelper", "../models/reference/referenceDataManifest", "./storageService", "../../../common/core/objectHelper", "../../../common/core/services/configurationService", "../../core/dateHelper", "../../../common/analytics/analyticsExceptionModel", "../../../common/analytics/analyticsExceptionCodeConstants"], function (require, exports, Logging, moment, aurelia_framework_1, indexedDatabaseService_1, fftService_1, databaseSchema_1, databaseSchemaStore_1, databaseSchemaStoreIndex_1, referenceDataConstants_1, businessException_1, aurelia_event_aggregator_1, initialisationEventConstants_1, initialisationCategory_1, assetService_1, initialisationUpdate_1, referenceIndex_1, arrayHelper_1, referenceDataManifest_1, storageService_1, objectHelper_1, configurationService_1, dateHelper_1, analyticsExceptionModel_1, analyticsExceptionCodeConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReferenceDataService = /** @class */ (function () {
        function ReferenceDataService(databaseService, assetService, fftService, eventAggregator, storageService, configurationService, referenceDataManifest) {
            this._databaseService = databaseService;
            this._fftService = fftService;
            this._assetService = assetService;
            this._eventAggregator = eventAggregator;
            this._storageService = storageService;
            this._referenceDataManifest = referenceDataManifest;
            this._referenceVersions = [];
            this._logger = Logging.getLogger("ReferenceDataService");
            this._referenceDataStaleMinutes = 1440;
            var referenceDataConfiguration = configurationService.getConfiguration();
            if (referenceDataConfiguration) {
                this._referenceDataStaleMinutes = referenceDataConfiguration.referenceDataStaleMinutes || this._referenceDataStaleMinutes;
                this._targetReferenceDataTypes = referenceDataConfiguration.targetReferenceDataTypes;
            }
            this._doesRefDataNeedsARetry = false;
        }
        ReferenceDataService.prototype.initialise = function () {
            var _this = this;
            this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Initialising Database", "", -1, -1));
            return this.initDatabase()
                .then(function () {
                var indexKeys = {};
                var localTableIndex = _this._referenceDataManifest.all() || [];
                _this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Loading Local Reference Data Index", "", -1, -1));
                localTableIndex.forEach(function (ti) {
                    indexKeys[ti.type] = ti.indexes ? ti.indexes.split(",") : [];
                });
                _this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Loading Remote Reference Data Index", "", -1, -1));
                return _this.getRemoteIndex()
                    .then(function (remoteIndex) {
                    return _this.populateRemoteData(remoteIndex || [], indexKeys, localTableIndex)
                        .then(function (remoteCatalog) {
                        var existingTables = [];
                        /* create a list of all the tables we have already populated from the remote data */
                        remoteCatalog.forEach(function (rc) {
                            existingTables = existingTables.concat((rc.tables || "").split(","));
                        });
                        /* create an updated list of the local tables with the exising ones we got from remote removed */
                        var updateIndex = [];
                        localTableIndex.forEach(function (ti) {
                            if (existingTables.indexOf(ti.type) < 0) {
                                updateIndex.push({
                                    type: ti.type,
                                    eTag: ti.eTag,
                                    lastModifiedDate: ti.lastModifiedDate
                                });
                            }
                        });
                        return _this.populateLocalData(updateIndex, existingTables, indexKeys, localTableIndex)
                            .then(function () {
                            _this._referenceVersions = arrayHelper_1.ArrayHelper.sortByColumn(_this._referenceVersions, "table");
                            _this._remoteIndexWhenLastChecked = remoteIndex;
                            return _this.setLastRemoteIndexCheckTime();
                        });
                    });
                });
            })
                .catch(function (err) {
                /* failed loading reference data see if we have non stale version we can use */
                return _this.isReferenceDataOutOfDate()
                    .then(function (isReferenceDataOutOfDate) {
                    if (isReferenceDataOutOfDate) {
                        throw err;
                    }
                    // otherwise we can still function with the reference data we have
                })
                    .catch(function () {
                    var exception = new businessException_1.BusinessException(_this, "initialise", "Cannot currently retrieve Reference Data from the server\n                                            and you do not have a recent enough copy that could be used.", [], err);
                    throw exception;
                });
            });
        };
        ReferenceDataService.prototype.shouldUserRefreshReferenceData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isThereNewReferenceDataOnServer, _a, _b, e_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this._storageService.getLastSuccessfulSyncTime()];
                        case 1:
                            if (!(_c.sent())) {
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, this.isReferenceDataOutOfDate()];
                        case 2:
                            if (!(_c.sent())) {
                                return [2 /*return*/, false];
                            }
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 6, , 7]);
                            _b = (_a = objectHelper_1.ObjectHelper).isComparable;
                            return [4 /*yield*/, this.getRemoteIndex()];
                        case 4:
                            isThereNewReferenceDataOnServer = !_b.apply(_a, [_c.sent(), this._remoteIndexWhenLastChecked]);
                            return [4 /*yield*/, this.setLastRemoteIndexCheckTime()];
                        case 5:
                            _c.sent();
                            return [2 /*return*/, isThereNewReferenceDataOnServer];
                        case 6:
                            e_1 = _c.sent();
                            return [2 /*return*/, false];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        ReferenceDataService.prototype.getItems = function (storeName, indexName, indexValue) {
            var _this = this;
            var indexValues = indexValue;
            indexName = indexName || "";
            return this._databaseService.getAll(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, storeName, indexName, indexValues)
                .catch(function (err) {
                var exception = new businessException_1.BusinessException(_this, "getItems", "reference data with keys {0} from store '{1}' was not found", [indexValues, storeName], err);
                var analyticsModel = new analyticsExceptionModel_1.AnalyticsExceptionModel(analyticsExceptionCodeConstants_1.AnalyticsExceptionCodeConstants.REFERENCE_DATA_SERVICE, false, exception.reference, exception.message, exception.parameters);
                _this._logger.error(exception && exception.toString(), analyticsModel);
                throw exception;
            });
        };
        ReferenceDataService.prototype.getItem = function (storeName, indexName, indexValue) {
            var _this = this;
            return this._databaseService.get(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, storeName, indexName, indexValue)
                .catch(function (err) {
                var exception = new businessException_1.BusinessException(_this, "getItem", "reference data with key '{0}' from store '{1}' was not found", [indexValue, storeName], err);
                var analyticsModel = new analyticsExceptionModel_1.AnalyticsExceptionModel(analyticsExceptionCodeConstants_1.AnalyticsExceptionCodeConstants.REFERENCE_DATA_SERVICE, false, exception.reference, exception.message, exception.parameters);
                _this._logger.error(exception && exception.toString(), analyticsModel);
                throw exception;
            });
        };
        ReferenceDataService.prototype.clear = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this._databaseService.close(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            return [3 /*break*/, 3];
                        case 3: return [4 /*yield*/, this._databaseService.destroy(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** clean remote index due to API limitation: .json only and take latest last modified date */
        ReferenceDataService.prototype.generateCleanRemoteIndex = function (listObjects) {
            return listObjects
                .filter(function (x) { return x.documentName.indexOf(".json") > -1; })
                .sort(function (a, b) { return moment(a.lastModifiedDate).diff(moment(b.lastModifiedDate)); })
                .reverse()
                .reduce(function (catalogs, currentCatalog) {
                // take first unique catalog, it's will be the newest due to the sort
                var uniqueCatalogFound = !catalogs.find(function (x) { return x.documentName === currentCatalog.documentName; });
                if (uniqueCatalogFound) {
                    catalogs.push(currentCatalog);
                }
                return catalogs;
            }, [])
                .map(function (listObject) {
                return {
                    type: listObject.documentName.replace(/\.[^/.]+$/, "").toLowerCase(),
                    eTag: listObject.etag,
                    lastModifiedDate: listObject.lastModifiedDate
                };
            });
        };
        ReferenceDataService.prototype.getVersions = function () {
            return this._referenceVersions;
        };
        ReferenceDataService.prototype.isReferenceDataOutOfDate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var storedIndex, lastSuccessfulSyncTime, nowMs, timeWhenARefreshWouldBeRequiredMs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getLocalIndex()];
                        case 1:
                            storedIndex = _a.sent();
                            if (!storedIndex || !storedIndex.length) {
                                // we don't have anything at all
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, this._storageService.getLastSuccessfulSyncTime()];
                        case 2:
                            lastSuccessfulSyncTime = _a.sent();
                            nowMs = dateHelper_1.DateHelper.getTimestampMs();
                            timeWhenARefreshWouldBeRequiredMs = (lastSuccessfulSyncTime || 0) + (this._referenceDataStaleMinutes * 60 * 1000);
                            return [2 /*return*/, nowMs >= timeWhenARefreshWouldBeRequiredMs];
                    }
                });
            });
        };
        ReferenceDataService.prototype.setLastRemoteIndexCheckTime = function () {
            if (this._doesRefDataNeedsARetry) {
                return this._storageService.setLastSuccessfulSyncTime(undefined);
            }
            return this._storageService.setLastSuccessfulSyncTime(dateHelper_1.DateHelper.getTimestampMs());
        };
        ReferenceDataService.prototype.getRemoteIndex = function () {
            return __awaiter(this, void 0, void 0, function () {
                var indexes, referenceIndexes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._fftService.getRemoteReferenceDataIndex()];
                        case 1:
                            indexes = _a.sent();
                            referenceIndexes = this.generateCleanRemoteIndex(indexes);
                            return [2 /*return*/, this.getTargetReferenceDocuments(referenceIndexes)];
                    }
                });
            });
        };
        ReferenceDataService.prototype.getTargetReferenceDocuments = function (indexList) {
            var _this = this;
            var isATargetDocument = function (type) { return _this._targetReferenceDataTypes && _this._targetReferenceDataTypes
                .some(function (expectedDocument) { return type === expectedDocument; }); };
            return indexList.filter(function (documentIndex) { return isATargetDocument(documentIndex.type); });
        };
        ReferenceDataService.prototype.initDatabase = function () {
            var _this = this;
            this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Creating Reference Database", "", -1, -1));
            return this._databaseService.exists(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE)
                .then(function (exists) {
                if (exists) {
                    return _this._databaseService.open(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE);
                }
                else {
                    return _this._databaseService.create(new databaseSchema_1.DatabaseSchema(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE_VERSION, [
                        new databaseSchemaStore_1.DatabaseSchemaStore(referenceDataConstants_1.ReferenceDataConstants.REMOTE_REFERENCE_INDEX, "container", false, [new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex("container", "container", true)]),
                        new databaseSchemaStore_1.DatabaseSchemaStore(referenceDataConstants_1.ReferenceDataConstants.LOCAL_REFERENCE_INDEX, "container", false, [new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex("container", "container", true)])
                    ]));
                }
            });
        };
        /* tslint:disable:promise-must-complete*/
        ReferenceDataService.prototype.populateRemoteData = function (newIndex, indexKeys, localTableIndex) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.getLocalIndex()
                    .then(function (storedIndex) {
                    var updatePattern = _this.calculateUpdatePattern(storedIndex, newIndex);
                    _this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Updating From Remote Data", "", 0, updatePattern.length));
                    _this._logger.info("Stored Remote Index", storedIndex);
                    _this._logger.info("New Remote Index", newIndex);
                    var idx = 0;
                    var remoteReferenceDataIndex = []; // the etag and grouping of remote ref data tables
                    var docVersionUpdateList = [];
                    var needToMakeAnUpdateCall = 0;
                    var document;
                    var majorVersion;
                    var minorVersion;
                    var catSequence;
                    var eTag;
                    var tablesList;
                    var doNext = function () {
                        if (idx < updatePattern.length) {
                            _this.notifyProgress(new initialisationUpdate_1.InitialisationUpdate("Downloading Remote Data '" + updatePattern[idx].type + "'", idx));
                            // default values, if api call fails, will need default settings currently in indexdb
                            document = updatePattern[idx].type;
                            majorVersion = updatePattern[idx].majorVersion;
                            minorVersion = updatePattern[idx].minorVersion;
                            catSequence = updatePattern[idx].sequence;
                            tablesList = updatePattern[idx].tables;
                            // get catalog from api
                            _this.populateRemoteCatalogReferenceData(updatePattern[idx].type, updatePattern[idx].retrieveData, updatePattern[idx].deleteCatalog, updatePattern[idx].tables.split(","), indexKeys, updatePattern[idx].eTag, localTableIndex)
                                .then(function (refDataResponse) {
                                if (!updatePattern[idx].deleteCatalog) {
                                    eTag = refDataResponse.etag;
                                    tablesList = refDataResponse.tables.join(",");
                                    // updates the list of tables in the "remoteReferenceIndex" for a group
                                    if (refDataResponse.meta && updatePattern[idx].retrieveData) {
                                        var _a = refDataResponse.meta, _b = _a.currentMajorVersion, currentMajorVersion = _b === void 0 ? null : _b, _c = _a.currentMinorVersion, currentMinorVersion = _c === void 0 ? null : _c, _d = _a.sequence, refSequence = _d === void 0 ? null : _d;
                                        majorVersion = currentMajorVersion;
                                        minorVersion = currentMinorVersion;
                                        catSequence = refSequence;
                                    }
                                    // updates the list of tables in the "remoteReferenceIndex" for a group
                                    refDataResponse.tables.forEach(function (table) {
                                        _this._referenceVersions.push({
                                            table: table,
                                            version: updatePattern[idx].eTag,
                                            majorVersion: majorVersion,
                                            minorVersion: minorVersion,
                                            sequence: catSequence,
                                            isLocal: localTableIndex.find(function (t) { return t.type === table; }).sourceDocument === "local" || false,
                                            lastAttemptFailed: false,
                                            lastModifiedDate: updatePattern[idx].lastModifiedDate,
                                            source: localTableIndex.find(function (t) { return t.type === table; }).sourceDocument || undefined,
                                        });
                                    });
                                }
                            })
                                .catch(function (err) {
                                var errorText = "failed to get catalog data";
                                var analyticsModel = new analyticsExceptionModel_1.AnalyticsExceptionModel(analyticsExceptionCodeConstants_1.AnalyticsExceptionCodeConstants.REFERENCE_DATA_SERVICE, true, errorText);
                                _this._logger.error(errorText, err, analyticsModel);
                                eTag = undefined;
                                return _this._storageService.getLastSuccessfulSyncTime()
                                    .then(function (lastSyncTime) {
                                    if (!lastSyncTime && (localTableIndex.filter(function (ti) { return ti.sourceDocument === updatePattern[idx].type; }) || []).every(function (t) { return !t.canItBeEmpty; })) {
                                        _this._doesRefDataNeedsARetry = true;
                                    }
                                    if (tablesList && tablesList.length > 0) {
                                        tablesList.split(",").forEach(function (table) {
                                            _this._referenceVersions.push({
                                                table: table,
                                                version: updatePattern[idx].eTag,
                                                majorVersion: majorVersion,
                                                minorVersion: minorVersion,
                                                sequence: catSequence,
                                                isLocal: localTableIndex.find(function (t) { return t.type === table; }).sourceDocument === "local" || false,
                                                lastAttemptFailed: true,
                                                lastModifiedDate: updatePattern[idx].lastModifiedDate,
                                                source: localTableIndex.find(function (t) { return t.type === table; }).sourceDocument || undefined,
                                            });
                                        });
                                    }
                                });
                            })
                                .then(function () {
                                var catalogIndex = new referenceIndex_1.ReferenceIndex();
                                // new versions from remote api endpoint, these are required for put calls
                                // in final block
                                catalogIndex.container = document;
                                catalogIndex.eTag = eTag;
                                catalogIndex.tables = tablesList;
                                catalogIndex.majorVersion = majorVersion;
                                catalogIndex.minorVersion = minorVersion;
                                catalogIndex.sequence = catSequence;
                                remoteReferenceDataIndex.push(catalogIndex);
                                needToMakeAnUpdateCall += updatePattern[idx].retrieveData ? 1 : 0;
                                docVersionUpdateList.push({
                                    documentName: document + ".json",
                                    majorVersion: majorVersion ? majorVersion.toString() : "",
                                    minorVersion: minorVersion ? minorVersion.toString() : "",
                                    sequenceNumber: catSequence ? catSequence.toString() : ""
                                });
                                idx++;
                                doNext();
                            });
                        }
                        else {
                            _this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Remote From Data Update Complete", "", -1, -1));
                            _this.populateTable(remoteReferenceDataIndex, referenceDataConstants_1.ReferenceDataConstants.REMOTE_REFERENCE_INDEX)
                                .then(function () { return needToMakeAnUpdateCall > 0 ? _this.updateRefDataVersion(docVersionUpdateList) : Promise.resolve(); })
                                .then(function () { return resolve(remoteReferenceDataIndex); })
                                .catch(function (err) {
                                reject(err);
                            });
                        }
                    };
                    doNext();
                });
            });
        };
        ReferenceDataService.prototype.getLocalIndex = function () {
            return this._databaseService.getAll(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, referenceDataConstants_1.ReferenceDataConstants.REMOTE_REFERENCE_INDEX);
        };
        ReferenceDataService.prototype.updateRefDataVersion = function (list) {
            var _this = this;
            if (!list || list.length === 0) {
                return Promise.resolve();
            }
            return this._storageService.getEngineer().then(function (engineer) {
                var request = {};
                var data = {};
                data.catalogueConfig = [{
                        engineerId: engineer.id,
                        list: list
                    }];
                request.data = data;
                _this._logger.info("Updating Reference Data Versions", list);
                return _this._fftService.updateRemoteReferenceData(request).then(function () {
                    return _this._logger.info("Updated Reference Data Versions");
                });
            });
        };
        ReferenceDataService.prototype.populateLocalData = function (newIndex, exemptFromDelete, indexKeys, localTableIndex) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._databaseService.getAll(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, referenceDataConstants_1.ReferenceDataConstants.LOCAL_REFERENCE_INDEX)
                    .then(function (storedIndex) {
                    var updatePattern = _this.calculateUpdatePattern(storedIndex, newIndex);
                    _this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Updating From Local Data", "", 0, updatePattern.length));
                    _this._logger.info("Stored Local Index", storedIndex);
                    _this._logger.info("New Local Index", newIndex);
                    var idx = 0;
                    var finalIndex = [];
                    var doNext = function () {
                        if (idx < updatePattern.length) {
                            var p = void 0;
                            if (updatePattern[idx].retrieveData) {
                                _this.notifyProgress(new initialisationUpdate_1.InitialisationUpdate("Importing Local Data '" + updatePattern[idx].type + "'", idx));
                                p = _this._assetService.loadJson("services/reference/" + updatePattern[idx].type + ".json");
                            }
                            else {
                                p = Promise.resolve(undefined);
                            }
                            p.then(function (jsonData) {
                                _this.populateTableReferenceData(updatePattern[idx].type, jsonData, updatePattern[idx].deleteCatalog, idx, exemptFromDelete, indexKeys[updatePattern[idx].type])
                                    .then(function () {
                                    if (!updatePattern[idx].deleteCatalog) {
                                        var catalogIndex = new referenceIndex_1.ReferenceIndex();
                                        catalogIndex.container = updatePattern[idx].type;
                                        catalogIndex.eTag = updatePattern[idx].eTag;
                                        catalogIndex.tables = updatePattern[idx].type;
                                        catalogIndex.majorVersion = updatePattern[idx].majorVersion;
                                        catalogIndex.minorVersion = updatePattern[idx].minorVersion;
                                        catalogIndex.sequence = updatePattern[idx].sequence;
                                        finalIndex.push(catalogIndex);
                                        _this._referenceVersions.push({
                                            table: updatePattern[idx].type,
                                            version: updatePattern[idx].eTag,
                                            lastModifiedDate: updatePattern[idx].lastModifiedDate,
                                            isLocal: localTableIndex.find(function (t) { return t.type === updatePattern[idx].type; }).sourceDocument === "local" || false,
                                            source: localTableIndex.find(function (t) { return t.type === updatePattern[idx].type; }).sourceDocument
                                        });
                                    }
                                    idx++;
                                    doNext();
                                })
                                    .catch(function (err) {
                                    reject(err);
                                });
                            });
                        }
                        else {
                            _this.notifyProgress(new initialisationCategory_1.InitialisationCategory("Local From Data Update Complete", "", -1, -1));
                            _this.populateTable(finalIndex, referenceDataConstants_1.ReferenceDataConstants.LOCAL_REFERENCE_INDEX)
                                .then(function () { return resolve(); })
                                .catch(function (err) {
                                reject(err);
                            });
                        }
                    };
                    doNext();
                });
            });
        };
        ReferenceDataService.prototype.calculateUpdatePattern = function (storedIndex, newIndex) {
            var updatePattern = [];
            if (storedIndex) {
                var _loop_1 = function (i) {
                    var remoteType = newIndex.find(function (x) { return x.type === storedIndex[i].container; });
                    if (remoteType) {
                        /* we found no etag - take the lastest (useful for development) */
                        /* we found the catalog in the new data, has it been updated */
                        if (remoteType.eTag === "-1" || storedIndex[i].eTag !== remoteType.eTag) {
                            /* yes so update data from remote */
                            updatePattern.push({
                                type: remoteType.type,
                                retrieveData: true,
                                deleteCatalog: false,
                                tables: storedIndex[i].tables,
                                eTag: remoteType.eTag,
                                majorVersion: storedIndex[i].majorVersion,
                                minorVersion: storedIndex[i].minorVersion,
                                sequence: storedIndex[i].sequence,
                                lastModifiedDate: remoteType.lastModifiedDate
                            });
                        }
                        else {
                            /* no, so just keep data intact */
                            updatePattern.push({
                                type: remoteType.type,
                                retrieveData: false,
                                deleteCatalog: false,
                                tables: storedIndex[i].tables,
                                eTag: remoteType.eTag,
                                majorVersion: storedIndex[i].majorVersion,
                                minorVersion: storedIndex[i].minorVersion,
                                sequence: storedIndex[i].sequence,
                                lastModifiedDate: remoteType.lastModifiedDate
                            });
                        }
                    }
                    else {
                        /* catalog was in the in stored index but not in new index, so delete */
                        updatePattern.push({
                            type: storedIndex[i].container,
                            retrieveData: false,
                            deleteCatalog: true,
                            tables: storedIndex[i].tables,
                            eTag: storedIndex[i].eTag,
                            majorVersion: null,
                            minorVersion: null,
                            sequence: null,
                            lastModifiedDate: ""
                        });
                    }
                };
                for (var i = 0; i < storedIndex.length; i++) {
                    _loop_1(i);
                }
                var _loop_2 = function (i) {
                    var stored = storedIndex.find(function (x) { return x.container === newIndex[i].type; });
                    if (!stored) {
                        updatePattern.push({
                            type: newIndex[i].type,
                            retrieveData: true,
                            deleteCatalog: false,
                            tables: "",
                            majorVersion: newIndex[i].currentMajorVersion,
                            minorVersion: newIndex[i].currentMinorVersion,
                            sequence: newIndex[i].sequence,
                            eTag: newIndex[i].eTag,
                            lastModifiedDate: newIndex[i].lastModifiedDate
                        });
                    }
                };
                /* now see if there are any new tables in the remote index that we don't have locally */
                for (var i = 0; i < newIndex.length; i++) {
                    _loop_2(i);
                }
            }
            return updatePattern;
        };
        ReferenceDataService.prototype.populateTable = function (data, tableName) {
            var _this = this;
            return this._databaseService.removeAll(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, tableName).then(function () {
                return _this._databaseService.setAll(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, tableName, data);
            });
        };
        ReferenceDataService.prototype.populateRemoteCatalogReferenceData = function (catalog, retrieveData, deleteCatalog, tables, indexKeys, etag, localTableIndex) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var hasTheResponseGotAllTheData = function (data) {
                    var tablesBelongToDoc = localTableIndex.filter(function (ti) { return ti.sourceDocument === catalog; });
                    var res = true;
                    tablesBelongToDoc.forEach(function (t) {
                        var table = data[t.type];
                        if (!t.canItBeEmpty && (!table || table.length === 0)) {
                            res = false;
                            // removing empty table from data object to let it to fall over to the local index
                            if (table) {
                                delete data[t.type];
                            }
                        }
                    });
                    return res;
                };
                var result = { tables: [], meta: null, etag: etag };
                result.tables = tables;
                var idx = 0;
                var getReferenceDataGroup;
                if (retrieveData) {
                    getReferenceDataGroup = _this._fftService.getRemoteReferenceDataCatalog(catalog);
                }
                else {
                    getReferenceDataGroup = Promise.resolve(undefined); // todo why can't we just exit early
                }
                getReferenceDataGroup.then(function (referenceDataGroup) {
                    if (!referenceDataGroup || !referenceDataGroup.meta || !referenceDataGroup.data) {
                        return resolve(result);
                    }
                    var data = referenceDataGroup.data, meta = referenceDataGroup.meta;
                    if (!hasTheResponseGotAllTheData(data)) {
                        result.etag = undefined;
                        _this._doesRefDataNeedsARetry = true;
                    }
                    result.tables = Object.keys(data);
                    result.meta = __assign({}, meta);
                    _this._logger.info(catalog + " documents has got tables " + result.tables);
                    var rTables = result.tables;
                    var doNext = function () {
                        if (idx < rTables.length) {
                            var tableData = data[rTables[idx]];
                            var type = rTables[idx];
                            _this.populateTableReferenceData(type, tableData, deleteCatalog, idx, [], indexKeys[type])
                                .then(function () {
                                idx++;
                                doNext();
                            })
                                .catch(function (err) {
                                reject(err);
                            });
                        }
                        else {
                            resolve(result);
                        }
                    };
                    doNext();
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        ReferenceDataService.prototype.populateTableReferenceData = function (type, data, deleteCatalog, idx, exemptFromDelete, indexKeys) {
            var _this = this;
            return this._databaseService.storeExists(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, type)
                .then(function (exists) {
                if (deleteCatalog) {
                    if (exemptFromDelete.indexOf(type) === -1) {
                        _this.notifyProgress(new initialisationUpdate_1.InitialisationUpdate("Deleting Data '" + type + "'", idx));
                        if (exists) {
                            _this._logger.info("Deleting " + type + " from database");
                            return _this._databaseService.storeRemove(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, type);
                        }
                        else {
                            _this._logger.info("Deleting " + type);
                            return undefined;
                        }
                    }
                    else {
                        _this._logger.info("Defering " + type + " to remote data from database");
                        _this.notifyProgress(new initialisationUpdate_1.InitialisationUpdate("Defering To Remote Data '" + type + "'", idx));
                        return undefined;
                    }
                }
                else if (exists && data === undefined) {
                    _this._logger.info("No Change " + type);
                    _this.notifyProgress(new initialisationUpdate_1.InitialisationUpdate("No Change In Data '" + type + "'", idx));
                    return undefined;
                }
                else {
                    var noOfRows = data ? data.length : 0;
                    if (exists) {
                        _this._logger.info("Updating " + type + " table with " + noOfRows + " rows of data");
                        _this.notifyProgress(new initialisationUpdate_1.InitialisationUpdate("Updating Data '" + type + "'", idx));
                        return _this.populateTable(data, type);
                    }
                    else {
                        _this._logger.info("Creating " + type + " table with " + noOfRows + " rows of data");
                        var indexes = indexKeys.map(function (ik) { return new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex(ik, ik, false); });
                        for (var i = 0; i < indexKeys.length; i++) {
                            for (var j = 0; j < indexKeys.length; j++) {
                                if (indexKeys[i] !== indexKeys[j]) {
                                    var combinedIndex = indexKeys[i] + "_" + indexKeys[j];
                                    indexes.push(new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex(combinedIndex, [indexKeys[i], indexKeys[j]], false));
                                }
                            }
                        }
                        _this.notifyProgress(new initialisationUpdate_1.InitialisationUpdate("Creating Data '" + type + "'", idx));
                        return _this._databaseService.storeCreate(referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE, new databaseSchemaStore_1.DatabaseSchemaStore(type, undefined, true, indexes))
                            .then(function () { return _this.populateTable(data, type); });
                    }
                }
            });
        };
        ReferenceDataService.prototype.notifyProgress = function (payload) {
            var event = payload instanceof initialisationUpdate_1.InitialisationUpdate ? initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_UPDATE : initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_CATEGORY;
            this._eventAggregator.publish(event, payload);
        };
        ReferenceDataService = __decorate([
            aurelia_framework_1.inject(indexedDatabaseService_1.IndexedDatabaseService, assetService_1.AssetService, fftService_1.FftService, aurelia_event_aggregator_1.EventAggregator, storageService_1.StorageService, configurationService_1.ConfigurationService, referenceDataManifest_1.ReferenceDataManifest),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, referenceDataManifest_1.ReferenceDataManifest])
        ], ReferenceDataService);
        return ReferenceDataService;
    }());
    exports.ReferenceDataService = ReferenceDataService;
});

//# sourceMappingURL=referenceDataService.js.map
