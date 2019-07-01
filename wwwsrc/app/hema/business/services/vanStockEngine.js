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
define(["require", "exports", "aurelia-framework", "../../api/services/vanStockService", "aurelia-logging", "./storageService", "../models/materialSearchResult", "../../../common/core/threading", "../models/materialAdjustments", "../../../common/core/guid", "../models/businessException", "../models/materials", "../models/materialSearchResults", "aurelia-event-aggregator", "../../../common/core/constants/wuaNetworkDiagnosticsConstants", "./constants/vanStockConstants", "./constants/engineerServiceConstants", "../../../common/core/services/configurationService", "../models/materialHighValueTools", "moment", "../../core/pollingHelper", "../constants/initialisationEventConstants"], function (require, exports, aurelia_framework_1, vanStockService_1, Logging, storageService_1, materialSearchResult_1, threading_1, materialAdjustments_1, guid_1, businessException_1, materials_1, materialSearchResults_1, aurelia_event_aggregator_1, wuaNetworkDiagnosticsConstants_1, vanStockConstants_1, engineerServiceConstants_1, configurationService_1, materialHighValueTools_1, moment, pollingHelper_1, initialisationEventConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ZONE_DUMMY_QUANTITY = 9999;
    var DEFAULT_OWNER = "BGS";
    var VanStockEngine = /** @class */ (function () {
        function VanStockEngine(vanStockService, storageService, eventAggregator, configurationService) {
            this._vanStockService = vanStockService;
            this._storageService = storageService;
            this._eventAggregator = eventAggregator;
            this._configurationService = configurationService;
            this._logger = Logging.getLogger("VanStockEngine");
            this._bindableReadinessFlag = {
                isReady: false,
                isActionsEndpointOk: false
            };
        }
        VanStockEngine.prototype.initialise = function (engineerId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._logger.warn("Initialising");
                            this._config = this._configurationService.getConfiguration();
                            this._engineerId = this.convertEngineerId(engineerId);
                            this._onlineSearchResultCache = this._storageService.getMaterialSearchResults()
                                || new materialSearchResults_1.MaterialSearchResults(this._engineerId);
                            // special case: if a search has been previously captured/serialized in SEARCHING state, it ain't ever going to complete as we are a completely
                            //  restarted instance of the app
                            this._onlineSearchResultCache.materialSearchResults = this._onlineSearchResultCache.materialSearchResults
                                .filter(function (result) { return result.completionStatus !== "SEARCHING"; });
                            this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, function (isSignedOn) { return __awaiter(_this, void 0, void 0, function () {
                                var error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!isSignedOn) return [3 /*break*/, 4];
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this._vanStockService.getEngineerActions(this._engineerId)];
                                        case 2:
                                            _a.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_1 = _a.sent();
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                            this.startSyncPolling();
                            return [4 /*yield*/, this.syncWithServer(function (message) { return _this._eventAggregator.publish(initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_CATEGORY, {
                                    category: "Initialising Van Stock",
                                    item: message,
                                    progressValue: -1,
                                    progressMax: -1
                                }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockEngine.prototype.getBindableVanStockStatusFlag = function () {
            // todo: we are exposing the boolean we use for internal purposes, what if the client mutates it!?
            return this._bindableReadinessFlag;
        };
        VanStockEngine.prototype.startSyncPolling = function () {
            var _this = this;
            if (!this._pollingTimerId) {
                this._pollingTimerId = threading_1.Threading.startTimer(function () { return _this.syncWithServer(); }, (this._config.assetTrackingPollingIntervalMinutes || 5) * 60 * 1000);
            }
            // if we have not got fresh data because we did not have network connection when we initialised, let's listen for
            //  when the network comes back and we can immediately try again
            if (!this._networkChangeSubscription) {
                this._networkChangeSubscription = this._eventAggregator.subscribe(wuaNetworkDiagnosticsConstants_1.WuaNetworkDiagnosticsConstants.NETWORK_STATUS_CHANGED, function (isNetworkConnected) {
                    if (isNetworkConnected && !_this._bindableReadinessFlag.isReady) {
                        _this.syncWithServer();
                    }
                });
            }
        };
        VanStockEngine.prototype.getHighValueToolList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getMaterialHighValueTools().highValueTools];
                });
            });
        };
        VanStockEngine.prototype.getLocalMaterial = function () {
            var _this = this;
            // some of the adjustments can have many entries per stockRefId (hence the filter and reduce rather than a straight find)
            // some are one-to-ones so a find would do, but lets just send everything through the same code
            var getTotalQuantity = function (items, filterFn) {
                return (items || [])
                    .filter(function (item) { return item && filterFn(item); })
                    .reduce(function (acc, item) { return acc + item.quantity; }, 0);
            };
            var adjustments = this.getAdjustments();
            return this.getMaterials().materials.map(function (item) {
                var material = item;
                material.quantityToBeCollected = getTotalQuantity(adjustments.collections, function (q) { return q.status !== "FULFILLED_UNACKNOWLEDGED"
                    && q.status !== "FULFILLED_ACKNOWLEDGED"
                    && q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId; });
                material.quantityToBeReturned = getTotalQuantity(adjustments.returns, function (q) { return q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId; });
                material.quantityOutboundReservation = getTotalQuantity(adjustments.outboundMaterialRequests, function (q) { return _this.isALiveReservationStatus(q)
                    && q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId; });
                material.quantityInboundReservation = getTotalQuantity(adjustments.inboundMaterialRequests, function (q) { return _this.isALiveReservationStatus(q)
                    && q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId; });
                return material;
            });
        };
        VanStockEngine.prototype.getBindableMaterialSearchResult = function (stockReferenceId, forceOnlineRefresh) {
            var _this = this;
            var getCachedOnlineSearchResult = function () {
                return _this._onlineSearchResultCache.materialSearchResults
                    .find(function (materialSearchResult) { return materialSearchResult.stockReferenceId.toUpperCase() === stockReferenceId.toUpperCase(); });
            };
            var cacheOnlineSearchResult = function (onlineSearchResult) {
                _this._onlineSearchResultCache.materialSearchResults.push(onlineSearchResult);
            };
            var isValidCachedOnlineSearchResult = function (onlineSearchResult) {
                if (forceOnlineRefresh) {
                    return false;
                }
                if (onlineSearchResult.completionStatus === "NOT_FOUND_OFFLINE") {
                    return false;
                }
                if (onlineSearchResult
                    && onlineSearchResult.timestamp
                    && ((_this.getNowTimeStamp() - onlineSearchResult.timestamp) > (_this._config.assetTrackingSearchStaleMinutes || 5) * 60 * 1000)) {
                    return false;
                }
                return true;
            };
            var removeCachedOnlineSearchResult = function () {
                _this._onlineSearchResultCache.materialSearchResults = _this._onlineSearchResultCache.materialSearchResults
                    .filter(function (searchResult) { return searchResult.stockReferenceId.toUpperCase() !== cachedOnlineResult.stockReferenceId.toUpperCase(); });
            };
            var attachLocalVanstockToResult = function (materialSearchResult) {
                materialSearchResult.local.material = _this.getLocalMaterial()
                    .find(function (item) { return item.stockReferenceId.toUpperCase() === stockReferenceId.toUpperCase()
                    && !item.jobId; });
                materialSearchResult.local.completionStatus = materialSearchResult.local.material && materialSearchResult.local.material.quantity
                    ? "FOUND"
                    : "NOT_FOUND";
            };
            var tryAttachDescriptionFromLocalInfo = function (materialSearchResult) {
                if (materialSearchResult.local && materialSearchResult.local.material) {
                    materialSearchResult.description = materialSearchResult.local.material.description;
                }
                if (!materialSearchResult.description) {
                    var potentialHvtMatch = (_this.getMaterialHighValueTools().highValueTools || [])
                        .find(function (hvt) { return hvt.materialCode.toUpperCase() === materialSearchResult.stockReferenceId.toUpperCase(); });
                    if (potentialHvtMatch) {
                        materialSearchResult.description = potentialHvtMatch.description;
                    }
                }
            };
            var isNumber = function (input) { return !isNaN(parseFloat(input)) && isFinite(input); };
            var getDistance = function (onlineResult) {
                if (!isNumber(onlineResult.distance)
                    || (onlineResult.lat === 0 && onlineResult.lon === 0)) {
                    return "UNKNOWN";
                }
                else {
                    return Math.round(onlineResult.distance * 10) / 10;
                }
            };
            var compareDistances = function (a, b) {
                return (isNumber(a.distance) ? (a.distance) : 999999999)
                    - (isNumber(b.distance) ? (b.distance) : 999999999);
            };
            var getMinimumDistance = function (results) {
                var validDistances = results
                    .filter(function (res) { return isNumber(res.distance); })
                    .map(function (res) { return res.distance; });
                if (!validDistances.length) {
                    return "UNKNOWN";
                }
                else {
                    return Math.min.apply(Math, validDistances);
                }
            };
            var retrieveAndAttachOnlineResult = function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var searchResult, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this._vanStockService.getRemoteMaterialSearch(stockReferenceId)];
                        case 1:
                            searchResult = _a.sent();
                            result.online.timestamp = this.getNowTimeStamp();
                            // filter out my own online results
                            searchResult.results = searchResult.results
                                .filter(function (item) { return item.engineer !== _this._engineerId
                                && item.quantity; });
                            if (!searchResult.isInternectConnected) {
                                result.online.completionStatus = "NOT_FOUND_OFFLINE";
                            }
                            else if (searchResult.results.length) {
                                result.online.completionStatus = "FOUND";
                                result.online.results = searchResult.results
                                    .map(function (onlineResult) { return ({
                                    distance: getDistance(onlineResult),
                                    lon: onlineResult.lon,
                                    lat: onlineResult.lat,
                                    id: onlineResult.engineer,
                                    name: onlineResult.name,
                                    phone: onlineResult.telephone,
                                    workingStatus: "WORKING",
                                    material: {
                                        stockReferenceId: onlineResult.materialCode,
                                        description: onlineResult.description,
                                        quantity: onlineResult.quantity,
                                        area: onlineResult.storageZone,
                                        reservationQuantity: onlineResult.reservedQuantity
                                    }
                                }); })
                                    .sort(function (a, b) { return compareDistances(a, b); });
                                result.online.summary.totalParts = result.online.results
                                    .reduce(function (prev, curr) { return prev + (curr && curr.material.quantity || 0); }, 0);
                                result.online.summary.totalLocations = result.online.results.length;
                                result.online.summary.nearestDistance = getMinimumDistance(result.online.results);
                                if (!result.description &&
                                    result.online &&
                                    result.online.results &&
                                    result.online.results[0] &&
                                    result.online.results[0].material) {
                                    // if not in local van stock then look for remote results
                                    result.description = result.online.results[0].material.description;
                                }
                            }
                            else {
                                result.online.completionStatus = "NOT_FOUND";
                                result.online.results = [];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            result.online.timestamp = this.getNowTimeStamp();
                            result.online.completionStatus = "NOT_FOUND_OFFLINE";
                            return [3 /*break*/, 3];
                        case 3:
                            this.saveSearches();
                            return [2 /*return*/];
                    }
                });
            }); };
            // spin up a new result object to give back, the .online component will be recycled from cache but the result object is always new
            var result = new materialSearchResult_1.MaterialSearchResult();
            result.stockReferenceId = stockReferenceId;
            attachLocalVanstockToResult(result);
            tryAttachDescriptionFromLocalInfo(result);
            var cachedOnlineResult = getCachedOnlineSearchResult();
            if (cachedOnlineResult) {
                if (isValidCachedOnlineSearchResult(cachedOnlineResult)) {
                    result.online = cachedOnlineResult;
                    return result;
                }
                else {
                    removeCachedOnlineSearchResult();
                }
            }
            result.online.stockReferenceId = stockReferenceId;
            result.online.completionStatus = "SEARCHING";
            cacheOnlineSearchResult(result.online);
            /* don't await me! */ retrieveAndAttachOnlineResult();
            this.saveSearches();
            return result;
        };
        VanStockEngine.prototype.getPartsToCollect = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var adjustments, collections, toCollect, collected, expectedReturns;
                return __generator(this, function (_a) {
                    adjustments = this.getAdjustments();
                    collections = adjustments.collections
                        .map(function (item) {
                        var stockReferenceId = item.stockReferenceId, jobId = item.jobId, description = item.description, quantity = item.quantity;
                        var foundMaterial = _this.getMaterials().materials
                            .find(function (material) { return material.stockReferenceId === item.stockReferenceId; });
                        var area = item && item.area
                            || foundMaterial && foundMaterial.area; // todo question - will this be done for us api end?
                        return {
                            material: {
                                stockReferenceId: stockReferenceId,
                                jobId: jobId,
                                description: description,
                                quantity: quantity,
                                area: area,
                                owner: item.owner,
                                id: item.id
                            },
                            status: item.status,
                            quantityCollected: item.quantityCollected
                        };
                    });
                    toCollect = collections
                        .filter(function (item) { return item.status !== "FULFILLED_UNACKNOWLEDGED"
                        && item.status !== "FULFILLED_ACKNOWLEDGED"; })
                        .map(function (item) { return item.material; });
                    collected = collections
                        .filter(function (item) { return item.status === "FULFILLED_UNACKNOWLEDGED"
                        || item.status === "FULFILLED_ACKNOWLEDGED"; })
                        .map(function (item) {
                        return __assign({}, item.material, { quantityReturned: 0, quantityCollected: item.quantityCollected });
                    });
                    expectedReturns = adjustments.yesterdaysReturns
                        .map(function (yesterdaysReturn) { return ({
                        stockReferenceId: yesterdaysReturn.stockReferenceId,
                        jobId: yesterdaysReturn.jobId,
                        description: yesterdaysReturn.description,
                        quantity: yesterdaysReturn.quantity,
                        owner: yesterdaysReturn.owner,
                        area: yesterdaysReturn.area
                    }); });
                    return [2 /*return*/, {
                            toCollect: toCollect,
                            collected: collected,
                            expectedReturns: expectedReturns
                        }];
                });
            });
        };
        VanStockEngine.prototype.getMaterialRequests = function () {
            return __awaiter(this, void 0, void 0, function () {
                var mapStatus, mapIsSyncedToServer, compareByDateAndTime, adjustments, outboundMaterials, inboundMaterials;
                return __generator(this, function (_a) {
                    mapStatus = function (status) {
                        switch (status) {
                            case "DELETED_ACKNOWLEDGED":
                            case "DELETED_UNACKNOWLEDGED":
                                return "WITHDRAWN";
                            case "ACKNOWLEDGED":
                            case "UNACKNOWLEDGED":
                                return "PENDING";
                            case "FULFILLED_UNACKNOWLEDGED":
                            case "FULFILLED_ACKNOWLEDGED":
                                return "COMPLETE";
                            case "REJECTED_ACKNOWLEDGED":
                                return "REJECTED";
                            default:
                                return undefined;
                        }
                    };
                    mapIsSyncedToServer = function (status) {
                        return status === "ACKNOWLEDGED"
                            || status === "DELETED_ACKNOWLEDGED"
                            || status === "FULFILLED_ACKNOWLEDGED"
                            || status === "REJECTED_ACKNOWLEDGED";
                    };
                    compareByDateAndTime = function (a, b) {
                        return a.date === b.date
                            ? a.time - b.time
                            : a.date - b.date;
                    };
                    adjustments = this.getAdjustments();
                    outboundMaterials = adjustments.outboundMaterialRequests
                        .map(function (item) { return ({
                        id: item.id,
                        stockReferenceId: item.stockReferenceId,
                        description: item.description,
                        quantity: item.quantity,
                        engineerId: item.engineerId,
                        engineerName: item.engineerName,
                        engineerPhone: item.engineerPhone,
                        status: mapStatus(item.status),
                        isSyncedToServer: mapIsSyncedToServer(item.status),
                        owner: item.owner,
                        date: item.date,
                        time: item.time,
                        isUnread: item.isUnread
                    }); })
                        .sort(compareByDateAndTime);
                    inboundMaterials = adjustments.inboundMaterialRequests
                        .map(function (item) { return ({
                        id: item.id,
                        stockReferenceId: item.stockReferenceId,
                        description: item.description,
                        quantity: item.quantity,
                        engineerId: item.engineerId,
                        engineerName: item.engineerName,
                        engineerPhone: item.engineerPhone,
                        status: mapStatus(item.status),
                        isSyncedToServer: mapIsSyncedToServer(item.status),
                        owner: item.owner,
                        date: item.date,
                        time: item.time
                    }); })
                        .sort(compareByDateAndTime);
                    return [2 /*return*/, {
                            outboundMaterials: outboundMaterials,
                            inboundMaterials: inboundMaterials
                        }];
                });
            });
        };
        VanStockEngine.prototype.getReturns = function () {
            return __awaiter(this, void 0, void 0, function () {
                var materials;
                return __generator(this, function (_a) {
                    materials = this.getMaterials();
                    return [2 /*return*/, this.getAdjustments().returns
                            .map(function (materialReturn) {
                            var stockReferenceId = materialReturn.stockReferenceId, jobId = materialReturn.jobId, description = materialReturn.description, quantity = materialReturn.quantity;
                            var foundMaterial = materials.materials
                                .find(function (material) { return material.stockReferenceId === materialReturn.stockReferenceId; });
                            var area = foundMaterial && foundMaterial.area;
                            return {
                                stockReferenceId: stockReferenceId,
                                jobId: jobId,
                                description: description,
                                quantity: quantity,
                                area: area
                            };
                        })];
                });
            });
        };
        VanStockEngine.prototype.registerMaterialRequestReads = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var unreadRequests;
                return __generator(this, function (_a) {
                    this.checkArguments("registerAdjustmentReads", arg);
                    unreadRequests = this.getAdjustments().outboundMaterialRequests
                        .filter(function (request) { return request.isUnread
                        && (arg.requestIds || [])
                            .some(function (requestId) { return request.id === requestId; }); });
                    unreadRequests
                        .forEach(function (request) {
                        _this.updateAdjustment("outboundMaterialRequests", request.id, { isUnread: false });
                    });
                    if (unreadRequests.length) {
                        this._eventAggregator.publish(vanStockConstants_1.VanStockConstants.VANSTOCK_UPDATED);
                    }
                    return [2 /*return*/];
                });
            });
        };
        VanStockEngine.prototype.registerMaterialZoneUpdate = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var theseMaterials, _i, theseMaterials_1, thisMaterial, representativeMaterial;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkArguments("registerMaterialZoneUpdate", arg);
                            theseMaterials = this.getMaterials().materials
                                .filter(function (item) { return item.stockReferenceId === arg.stockReferenceId; });
                            if (!theseMaterials.length) {
                                return [2 /*return*/];
                            }
                            for (_i = 0, theseMaterials_1 = theseMaterials; _i < theseMaterials_1.length; _i++) {
                                thisMaterial = theseMaterials_1[_i];
                                this.updateMaterial({ stockReferenceId: arg.stockReferenceId, jobId: thisMaterial.jobId }, { area: arg.area });
                            }
                            representativeMaterial = theseMaterials[0];
                            if (!(representativeMaterial.area !== null && representativeMaterial.area !== undefined)) return [3 /*break*/, 2];
                            // if we already have an area, Chris says to set that quantity to 0.
                            return [4 /*yield*/, this._vanStockService.sendMaterialZoneUpdate(arg.stockReferenceId, {
                                    materialCode: arg.stockReferenceId,
                                    description: representativeMaterial.description,
                                    engineer: this._engineerId,
                                    storageZone: representativeMaterial.area,
                                    owner: representativeMaterial.owner || DEFAULT_OWNER,
                                    quantity: 0
                                })];
                        case 1:
                            // if we already have an area, Chris says to set that quantity to 0.
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this._vanStockService.sendMaterialZoneUpdate(arg.stockReferenceId, {
                                materialCode: arg.stockReferenceId,
                                description: representativeMaterial.description,
                                engineer: this._engineerId,
                                storageZone: arg.area,
                                owner: representativeMaterial.owner || DEFAULT_OWNER,
                                quantity: ZONE_DUMMY_QUANTITY
                            })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockEngine.prototype.registerMaterialCollection = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var thisCollection, thisMaterial, receiptDateAndTime;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkArguments("registerMaterialCollection", arg);
                            this.checkReadiness("registerMaterialCollection");
                            thisCollection = this.getAdjustments().collections
                                .find(function (collection) { return collection.id === arg.dispatchId
                                && collection.status === "ACKNOWLEDGED"; });
                            if (!thisCollection) {
                                return [2 /*return*/]; // what to really do here?
                            }
                            this.updateAdjustment("collections", thisCollection.id, { status: "FULFILLED_UNACKNOWLEDGED", quantityCollected: arg.quantityCollected });
                            thisMaterial = this.getMaterials().materials
                                .find(function (item) { return item.stockReferenceId === thisCollection.stockReferenceId
                                && item.jobId === thisCollection.jobId; });
                            if (thisMaterial) {
                                this.updateMaterial({
                                    stockReferenceId: thisCollection.stockReferenceId,
                                    jobId: thisCollection.jobId
                                }, {
                                    quantity: (thisMaterial.quantity || 0) + (arg.quantityCollected || 0)
                                });
                            }
                            else {
                                this.insertMaterials({
                                    stockReferenceId: thisCollection.stockReferenceId,
                                    jobId: thisCollection.jobId || undefined,
                                    description: thisCollection.description,
                                    quantity: arg.quantityCollected,
                                    area: undefined,
                                    amount: undefined,
                                    owner: thisCollection.owner
                                });
                            }
                            receiptDateAndTime = this.getAPIDateAndTime();
                            return [4 /*yield*/, this._vanStockService.sendMaterialReceipt(thisCollection.stockReferenceId, {
                                    material: {
                                        materialCode: thisCollection.stockReferenceId,
                                        description: thisCollection.description,
                                        engineer: this._engineerId,
                                        quantity: thisCollection.quantity,
                                        owner: thisCollection.owner || DEFAULT_OWNER
                                    },
                                    jobId: thisCollection.jobId || undefined,
                                    date: receiptDateAndTime.date,
                                    time: receiptDateAndTime.time,
                                    receiptQuantity: arg.quantityCollected,
                                    id: arg.dispatchId
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockEngine.prototype.registerMaterialReturn = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var thisMaterial, returnDateAndTime;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkArguments("registerMaterialReturn", arg);
                            thisMaterial = this.getMaterials().materials
                                .find(function (item) { return item.stockReferenceId === arg.stockReferenceId
                                && item.jobId === arg.jobId; });
                            this.insertAdjustments("returns", {
                                id: guid_1.Guid.newGuid(),
                                stockReferenceId: arg.stockReferenceId,
                                jobId: arg.jobId,
                                description: thisMaterial && thisMaterial.description,
                                quantity: arg.quantityReturned,
                                engineerId: undefined,
                                engineerName: undefined,
                                status: "FULFILLED_UNACKNOWLEDGED",
                                owner: thisMaterial && thisMaterial.owner,
                                reason: arg.reason,
                                date: undefined,
                                time: undefined
                            });
                            returnDateAndTime = this.getAPIDateAndTime();
                            return [4 /*yield*/, this._vanStockService.sendMaterialReturn(arg.stockReferenceId, {
                                    material: {
                                        materialCode: arg.stockReferenceId,
                                        description: thisMaterial && thisMaterial.description || "unknown",
                                        engineer: this._engineerId,
                                        quantity: arg.quantityReturned,
                                        owner: thisMaterial && thisMaterial.owner || DEFAULT_OWNER
                                    },
                                    date: returnDateAndTime.date,
                                    time: returnDateAndTime.time,
                                    reason: arg.reason,
                                    jobId: arg.jobId
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockEngine.prototype.registerMaterialConsumption = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var thisMaterial, dateAndTime;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkArguments("registerMaterialConsumption", arg);
                            thisMaterial = this.getMaterials().materials
                                .find(function (item) { return item.stockReferenceId === arg.stockReferenceId
                                && item.jobId === arg.jobId; });
                            if (thisMaterial) {
                                this.updateMaterial(arg, { quantity: (thisMaterial.quantity || 0) - (arg.quantityConsumed || 0) });
                            }
                            dateAndTime = this.getAPIDateAndTime();
                            return [4 /*yield*/, this._vanStockService.sendMaterialConsumption(arg.stockReferenceId, {
                                    material: {
                                        materialCode: arg.stockReferenceId,
                                        description: thisMaterial && thisMaterial.description || "unknown",
                                        engineer: this._engineerId,
                                        quantity: arg.quantityConsumed,
                                        owner: thisMaterial && thisMaterial.owner || DEFAULT_OWNER
                                    },
                                    jobId: arg.jobId || undefined,
                                    date: dateAndTime.date,
                                    time: dateAndTime.time
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockEngine.prototype.registerMaterialRequest = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var dateAndTime, id, status;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkArguments("registerMaterialRequest", arg);
                            this.checkReadiness("registerMaterialRequest");
                            dateAndTime = this.getAPIDateAndTime();
                            id = guid_1.Guid.newGuid();
                            status = this._config.trainingMode
                                ? "ACKNOWLEDGED"
                                : "UNACKNOWLEDGED";
                            this.insertAdjustments("inboundMaterialRequests", {
                                id: id,
                                stockReferenceId: arg.stockReferenceId,
                                jobId: undefined,
                                description: arg.description,
                                quantity: arg.quantityRequested,
                                engineerId: arg.engineerId,
                                engineerName: arg.engineerName,
                                engineerPhone: arg.engineerPhone,
                                status: status,
                                owner: arg.owner,
                                date: dateAndTime.date,
                                time: dateAndTime.time,
                                area: undefined // at the moment we do not specify a preference for a zone
                            });
                            return [4 /*yield*/, this._vanStockService.sendMaterialRequest(arg.stockReferenceId, {
                                    material: {
                                        materialCode: arg.stockReferenceId,
                                        description: arg.description,
                                        engineer: arg.engineerId,
                                        quantity: arg.quantityRequested,
                                        owner: arg.owner || DEFAULT_OWNER
                                    },
                                    requestingEngineer: this._engineerId,
                                    date: dateAndTime.date,
                                    time: dateAndTime.time
                                })];
                        case 1:
                            _a.sent();
                            this.triggerActionsPollingBurst();
                            return [2 /*return*/, id];
                    }
                });
            });
        };
        VanStockEngine.prototype.registerMaterialRequestWithdrawl = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var existingRequest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkArguments("registerMaterialRequestWithdrawl", arg);
                            this.checkReadiness("registerMaterialRequestWithdrawl");
                            existingRequest = this.getAdjustments().inboundMaterialRequests
                                .find(function (request) { return request.id === arg.requestId
                                && _this.isALiveReservationStatus(request); });
                            if (!existingRequest) {
                                return [2 /*return*/];
                            }
                            this.updateAdjustment("inboundMaterialRequests", existingRequest.id, { status: "DELETED_UNACKNOWLEDGED" });
                            return [4 /*yield*/, this._vanStockService.sendMaterialRequestUpdate(existingRequest.stockReferenceId, {
                                    material: {
                                        materialCode: existingRequest.stockReferenceId,
                                        description: existingRequest.description,
                                        engineer: existingRequest.engineerId,
                                        quantity: 0,
                                        owner: existingRequest.owner || DEFAULT_OWNER
                                    },
                                    requestingEngineer: this._engineerId,
                                    date: existingRequest.date,
                                    time: existingRequest.time
                                })];
                        case 1:
                            _a.sent();
                            this.triggerActionsPollingBurst();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockEngine.prototype.registerMaterialTransfer = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var existingRequest, transferDateAndTime, existingMaterial;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkArguments("registerMaterialTransfer", arg);
                            this.checkReadiness("registerMaterialTransfer");
                            existingRequest = this.getAdjustments().inboundMaterialRequests
                                .find(function (request) { return request.id === arg.requestId
                                && _this.isALiveReservationStatus(request); });
                            if (!existingRequest) {
                                return [2 /*return*/];
                            }
                            transferDateAndTime = this.getAPIDateAndTime();
                            this.updateAdjustment("inboundMaterialRequests", existingRequest.id, {
                                status: "FULFILLED_UNACKNOWLEDGED",
                                partnerRecordDate: transferDateAndTime.date,
                                partnerRecordTime: transferDateAndTime.time
                            });
                            this.insertAdjustments("inboundMaterialTransfers", {
                                id: guid_1.Guid.newGuid(),
                                stockReferenceId: existingRequest.stockReferenceId,
                                jobId: undefined,
                                description: existingRequest.description || "unknown",
                                quantity: existingRequest.quantity,
                                engineerId: existingRequest.engineerId,
                                status: "FULFILLED_UNACKNOWLEDGED",
                                owner: existingRequest.owner,
                                date: transferDateAndTime.date,
                                time: transferDateAndTime.time
                            });
                            existingMaterial = this.getMaterials().materials
                                .find(function (item) { return item.stockReferenceId === existingRequest.stockReferenceId
                                && !item.jobId; });
                            if (existingMaterial) {
                                this.updateMaterial({ stockReferenceId: existingRequest.stockReferenceId }, { quantity: (existingMaterial.quantity || 0) + (existingRequest.quantity || 0) });
                            }
                            else {
                                this.insertMaterials({
                                    stockReferenceId: existingRequest.stockReferenceId,
                                    jobId: undefined,
                                    description: existingRequest.description,
                                    quantity: existingRequest.quantity,
                                    area: undefined,
                                    amount: undefined,
                                    owner: existingRequest.owner
                                });
                            }
                            this.expireSearch(existingRequest.stockReferenceId);
                            return [4 /*yield*/, this._vanStockService.sendMaterialRequestUpdate(existingRequest.stockReferenceId, {
                                    material: {
                                        materialCode: existingRequest.stockReferenceId,
                                        description: existingRequest.description
                                            || existingMaterial && existingMaterial.description,
                                        engineer: existingRequest.engineerId,
                                        quantity: 0,
                                        owner: existingRequest.owner || DEFAULT_OWNER
                                    },
                                    requestingEngineer: this._engineerId,
                                    date: existingRequest.date,
                                    time: existingRequest.time
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._vanStockService.sendMaterialTransfer(existingRequest.stockReferenceId, {
                                    material: {
                                        materialCode: existingRequest.stockReferenceId,
                                        description: existingRequest.description
                                            || existingMaterial && existingMaterial.description,
                                        engineer: existingRequest.engineerId,
                                        quantity: existingRequest.quantity,
                                        owner: existingRequest.owner || DEFAULT_OWNER
                                    },
                                    requestingEngineer: this._engineerId,
                                    date: transferDateAndTime.date,
                                    time: transferDateAndTime.time
                                })];
                        case 2:
                            _a.sent();
                            this.triggerActionsPollingBurst();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockEngine.prototype.triggerActionsPollingBurst = function () {
            var _this = this;
            // for activities when we want to see e.g. a read response come back from actions endpoint
            pollingHelper_1.PollingHelper.pollIntervals(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.syncWithServer()];
                    case 1: return [2 /*return*/, (_a.sent()).haveAdjustmentsChanged];
                }
            }); }); }, this._config.assetTrackingActivePollingPattern || [2, 2, 5, 5, 5]);
        };
        VanStockEngine.prototype.getMaterials = function () {
            return this._storageService.getMaterials()
                || new materials_1.Materials(this._engineerId);
        };
        VanStockEngine.prototype.getAdjustments = function () {
            return this._storageService.getMaterialAdjustments()
                || new materialAdjustments_1.MaterialAdjustments(this._engineerId, []);
        };
        VanStockEngine.prototype.getMaterialHighValueTools = function () {
            return this._storageService.getMaterialHighValueTools()
                || new materialHighValueTools_1.MaterialHighValueTools(this._engineerId);
        };
        VanStockEngine.prototype.updateMaterial = function (id, changes) {
            var materials = this.getMaterials();
            var material = materials.materials.find(function (m) { return m
                && m.stockReferenceId === id.stockReferenceId
                && (m.jobId || undefined) === (id.jobId || undefined); });
            if (!material) {
                this._logger.error("Applying material update", id, changes, "DOES NOT EXIST!");
            }
            else {
                this._logger.warn("Applying material update", id, changes, material);
                Object.assign(material, changes);
                this._logger.warn("Applied material update", material);
                this.saveMaterials(materials);
            }
        };
        VanStockEngine.prototype.insertMaterials = function () {
            var _this = this;
            var inMaterials = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inMaterials[_i] = arguments[_i];
            }
            var materials = this.getMaterials();
            this._logger.warn("Inserting materials", materials.materials.length, inMaterials);
            (inMaterials || []).forEach(function (inMaterial) {
                var materialAlreadyExists = materials.materials.some(function (exitingMaterial) { return exitingMaterial
                    && exitingMaterial.stockReferenceId === inMaterial.stockReferenceId
                    && (exitingMaterial.jobId || undefined) === (inMaterial.jobId || undefined); });
                if (materialAlreadyExists) {
                    _this._logger.error("Inserting materials", { id: inMaterial.stockReferenceId, jobId: inMaterial.jobId }, "ALREADY EXISTS!");
                }
                else {
                    materials.materials.push(inMaterial);
                }
            });
            this._logger.warn("Inserted materials", materials.materials.length);
            this.saveMaterials(materials);
        };
        VanStockEngine.prototype.updateAdjustment = function (type, id, changes) {
            var adjustments = this.getAdjustments();
            var adjustment = adjustments[type].find(function (a) { return a
                && a.id === id; });
            if (!adjustment) {
                this._logger.error("Applying adjustment update", type, id, changes, "DOES NOT EXIST!");
            }
            else {
                this._logger.warn("Applying adjustment update", type, adjustment, changes);
                Object.assign(adjustment, changes);
                if (changes.status) {
                    this.stampAdjustmentHistory(adjustment);
                }
                this._logger.warn("Applied adjustment update", type, adjustment);
                this.saveMaterialAdjustments(adjustments);
            }
            return adjustments;
        };
        VanStockEngine.prototype.insertAdjustments = function (type) {
            var _this = this;
            var inAdjustments = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                inAdjustments[_i - 1] = arguments[_i];
            }
            var adjustments = this.getAdjustments();
            this._logger.warn("Inserting adjustments", type, adjustments[type].length, inAdjustments);
            (inAdjustments || []).forEach(function (inAdjustment) {
                if (adjustments[type].some(function (existingAdjustment) { return existingAdjustment.id === inAdjustment.id; })) {
                    _this._logger.error("Inserting adjustments", type, inAdjustment.id, "ALREADY EXISTS!");
                }
                else {
                    _this.stampAdjustmentHistory(inAdjustment);
                    adjustments[type].push(inAdjustment);
                }
            });
            this._logger.warn("Inserted adjustments", type, adjustments[type].length);
            this.saveMaterialAdjustments(adjustments);
            return adjustments;
        };
        VanStockEngine.prototype.deleteAdjustments = function (type) {
            var ids = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ids[_i - 1] = arguments[_i];
            }
            var adjustments = this.getAdjustments();
            this._logger.warn("Deleting adjustments", type, adjustments[type].length, ids);
            adjustments[type] = adjustments[type].filter(function (item) { return !ids.some(function (id) { return item.id === id; }); });
            this._logger.warn("Deleted adjustments", type, adjustments[type].length);
            this.saveMaterialAdjustments(adjustments);
            return adjustments;
        };
        VanStockEngine.prototype.stampAdjustmentHistory = function (adjustment) {
            if (!adjustment) {
                return;
            }
            adjustment.history = adjustment.history || [];
            adjustment.history.push({
                status: adjustment.status,
                time: this.getAPIDateAndTime().time
            });
        };
        VanStockEngine.prototype.saveMaterialHighValueTools = function (materialHighValueTools) {
            materialHighValueTools.timestamp = this.getNowTimeStamp();
            this._storageService.setMaterialHighValueTools(materialHighValueTools);
        };
        VanStockEngine.prototype.saveMaterials = function (materials) {
            materials.timestamp = this.getNowTimeStamp();
            this._storageService.setMaterials(materials);
        };
        VanStockEngine.prototype.saveMaterialAdjustments = function (adjustments) {
            adjustments.timestamp = this.getNowTimeStamp();
            this._storageService.setMaterialAdjustments(adjustments);
        };
        VanStockEngine.prototype.saveSearches = function () {
            this._onlineSearchResultCache.timestamp = this.getNowTimeStamp();
            this._storageService.setMaterialSearchResults(this._onlineSearchResultCache);
        };
        VanStockEngine.prototype.expireSearch = function (stockReferenceId) {
            var existingSearch = this._onlineSearchResultCache.materialSearchResults
                .find(function (result) { return result.stockReferenceId === stockReferenceId; });
            if (existingSearch) {
                existingSearch.timestamp = -1;
            }
        };
        VanStockEngine.prototype.checkArguments = function (callSite, arg) {
            if (!arg) {
                throw new businessException_1.BusinessException(this, callSite, "material argument missing", null, null);
            }
        };
        VanStockEngine.prototype.checkReadiness = function (callSite) {
            if (!this._bindableReadinessFlag.isReady) {
                throw new businessException_1.BusinessException(this, callSite, "This action is not possible until Van Stock has refreshed from the server.", null, null);
            }
        };
        VanStockEngine.prototype.syncWithServer = function (feedbackDelegate) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var log, haveWeHitMaterials, haveWeHitActions, isTimeToClearAndRebuildCache, adjustmentRebuildReason, adjustments, serverHighValueTools, materialHighValueTools, error_3, serverMaterials, currentServerActions, currentAdjustments, error_4, error_5, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._isSyncInProgress) {
                                return [2 /*return*/, {
                                        haveMaterialsChanged: false,
                                        haveAdjustmentsChanged: false
                                    }];
                            }
                            log = function (type, message) {
                                var rest = [];
                                for (var _i = 2; _i < arguments.length; _i++) {
                                    rest[_i - 2] = arguments[_i];
                                }
                                switch (type) {
                                    case "WARN":
                                        _this._logger.warn(message, rest);
                                        break;
                                    case "ERROR":
                                        _this._logger.error(message, rest);
                                        break;
                                    default:
                                        break;
                                }
                                if (feedbackDelegate) {
                                    feedbackDelegate(message);
                                }
                            };
                            this._isSyncInProgress = true;
                            haveWeHitMaterials = false;
                            haveWeHitActions = false;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 14, , 15]);
                            isTimeToClearAndRebuildCache = function (cache) {
                                var cutoffHHmmss = _this._config.assetTrackingCacheRefreshTimeHHmm || "05:00";
                                var todayCutOffTimeString = (new Date()).toISOString().split("T")[0] + "T" + cutoffHHmmss + ":00";
                                var todayCutOffTime = new Date(todayCutOffTimeString).getTime();
                                if (cache.engineerId !== _this._engineerId) {
                                    // hack for when using different engineers in dev/test/training
                                    return "DIFFERENT_ENGINEER_LOGIN";
                                }
                                if (!cache
                                    || !cache.timestamp
                                    || (cache.timestamp < todayCutOffTime
                                        && Date.now() > todayCutOffTime)) {
                                    return "CACHE_EMPTY_OR_EXPIRED";
                                }
                                return false;
                            };
                            if (isTimeToClearAndRebuildCache(this._onlineSearchResultCache)) {
                                log("WARN", "Clearing Searches");
                                this._onlineSearchResultCache = new materialSearchResults_1.MaterialSearchResults(this._engineerId);
                                this.saveSearches();
                            }
                            adjustmentRebuildReason = isTimeToClearAndRebuildCache(this.getAdjustments());
                            if (adjustmentRebuildReason) {
                                adjustments = this.getAdjustments();
                                log("WARN", "Clearing Ajustments", adjustmentRebuildReason, adjustments);
                                this.saveMaterialAdjustments(new materialAdjustments_1.MaterialAdjustments(this._engineerId, adjustmentRebuildReason === "DIFFERENT_ENGINEER_LOGIN"
                                    ? [] // if we are different engineer then drop yesterday's data
                                    : adjustments.returns // ... otherwise keep it
                                ));
                            }
                            if (!isTimeToClearAndRebuildCache(this.getMaterialHighValueTools())) return [3 /*break*/, 5];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            log("WARN", "Trying to rebuild high value tools");
                            return [4 /*yield*/, this._vanStockService.getHighValueTools()];
                        case 3:
                            serverHighValueTools = _a.sent();
                            log("WARN", "Rebuilding high value tools");
                            materialHighValueTools = new materialHighValueTools_1.MaterialHighValueTools(this._engineerId);
                            materialHighValueTools.highValueTools = serverHighValueTools.map(function (hvt) { return ({
                                materialCode: hvt.materialCode,
                                description: hvt.materialDescription
                            }); });
                            this.saveMaterialHighValueTools(materialHighValueTools);
                            log("WARN", "Rebuilt high value tools");
                            return [3 /*break*/, 5];
                        case 4:
                            error_3 = _a.sent();
                            log("ERROR", "Error rebuilding high value tools", error_3 && error_3.toString());
                            return [3 /*break*/, 5];
                        case 5:
                            this._bindableReadinessFlag.isReady = !isTimeToClearAndRebuildCache(this.getMaterials());
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 12, , 13]);
                            if (!!this._bindableReadinessFlag.isReady) return [3 /*break*/, 8];
                            log("WARN", "Trying to rebuild materials");
                            return [4 /*yield*/, this._vanStockService.getEngineerMaterials(this._engineerId)];
                        case 7:
                            serverMaterials = _a.sent();
                            // if getEngineerMaterials() throws an error, we still have the old data in the cache, but the isReady flag is left as false
                            //  and no actions can be set, either through the register* methods or by hitting the actions endpoint below.
                            log("WARN", "Rebuilding materials");
                            // clear down materials
                            this.saveMaterials(new materials_1.Materials(this._engineerId));
                            this.insertMaterials.apply(this, (serverMaterials || [])
                                .filter(function (material) { return !!material; })
                                .map(function (material) { return ({
                                stockReferenceId: material.materialCode,
                                description: material.description,
                                quantity: material.quantity,
                                area: material.storageZone,
                                jobId: material.jobId || undefined,
                                owner: material.owner
                            }); }));
                            this._bindableReadinessFlag.isReady = true;
                            haveWeHitMaterials = true;
                            log("WARN", "Rebuilt materials");
                            _a.label = 8;
                        case 8:
                            _a.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, this._vanStockService.getEngineerActions(this._engineerId)];
                        case 9:
                            currentServerActions = _a.sent();
                            this._bindableReadinessFlag.isActionsEndpointOk = true;
                            currentAdjustments = this.getAdjustments();
                            log("WARN", "Applying actions");
                            haveWeHitActions = this.applyRemoteActions(currentServerActions, currentAdjustments, haveWeHitMaterials);
                            log("WARN", "Applied actions", { haveWeHitActions: haveWeHitActions });
                            return [3 /*break*/, 11];
                        case 10:
                            error_4 = _a.sent();
                            this._bindableReadinessFlag.isActionsEndpointOk = false;
                            log("ERROR", "Error hitting actions", error_4 && error_4.toString());
                            return [3 /*break*/, 11];
                        case 11:
                            if (haveWeHitMaterials || haveWeHitActions) {
                                this._eventAggregator.publish(vanStockConstants_1.VanStockConstants.VANSTOCK_UPDATED);
                            }
                            return [3 /*break*/, 13];
                        case 12:
                            error_5 = _a.sent();
                            log("ERROR", "syncWithServer error", error_5 && error_5.toString());
                            return [3 /*break*/, 13];
                        case 13: return [3 /*break*/, 15];
                        case 14:
                            error_6 = _a.sent();
                            return [3 /*break*/, 15];
                        case 15:
                            this._isSyncInProgress = false;
                            return [2 /*return*/, {
                                    haveAdjustmentsChanged: haveWeHitActions,
                                    haveMaterialsChanged: haveWeHitMaterials
                                }];
                    }
                });
            });
        };
        VanStockEngine.prototype.applyRemoteActions = function (currentServerActions, adjustments, isInitialDataBuid) {
            var _this = this;
            if (currentServerActions === void 0) { currentServerActions = {}; }
            var compareItemsBy = {
                ID: function (a, b) { return a.id === b.id; },
                // note: if using DATE_AND_TIME, make sure your local array is passed in as A, because it is those in A that are returned from the functions inA...*
                //  ... and it will be the case you need your local id, not the remote one in order to do useful subsequent work.
                DATE_AND_TIME: function (a, b) { return a.date === b.date && a.time === b.time; },
            };
            var inANotB = function (a, b, comparator) {
                return (a || [])
                    .filter(function (itemInA) { return !(b || [])
                    .some(function (itemInB) { return itemInA && itemInB && comparator(itemInA, itemInB); }); });
            };
            var inAAndB = function (a, b, comparator) {
                return (a || [])
                    .filter(function (itemInA) { return (b || [])
                    .some(function (itemInB) { return itemInA && itemInB && comparator(itemInA, itemInB); }); });
            };
            var _a = currentServerActions.dispatchedMaterials, dispatches = _a === void 0 ? [] : _a, _b = currentServerActions.reservedMaterials, reservations = _b === void 0 ? [] : _b, _c = currentServerActions.transferredMaterials, transfers = _c === void 0 ? [] : _c;
            var disappearedCollections = inANotB(adjustments.collections.filter(function (item) { return item.status !== "FULFILLED_UNACKNOWLEDGED"
                && item.status !== "FULFILLED_ACKNOWLEDGED"; }), dispatches, compareItemsBy.ID);
            var freshCollections = inANotB(dispatches, adjustments.collections, compareItemsBy.ID);
            if (disappearedCollections.length) {
                // 1) disappeared collection
                adjustments = this.deleteAdjustments.apply(this, ["collections"].concat(disappearedCollections.map(function (item) { return item.id; })));
            }
            if (freshCollections.length) {
                // 2) appeared collections
                adjustments = this.insertAdjustments.apply(this, ["collections"].concat(freshCollections.map(function (item) { return ({
                    id: item.id,
                    stockReferenceId: item.materialCode,
                    jobId: item.jobId || undefined,
                    description: item.description,
                    quantity: item.quantity,
                    engineerId: undefined,
                    status: "ACKNOWLEDGED",
                    owner: item.owner,
                    area: item.storageZone
                }); })));
            }
            // transfers for parts coming to me
            var freshInboundMaterialTransfers = inAAndB(adjustments.inboundMaterialTransfers.filter(function (item) { return item.status === "FULFILLED_UNACKNOWLEDGED"; }), transfers.filter(function (item) { return item.destinationEngineerId === _this._engineerId; }), compareItemsBy.DATE_AND_TIME);
            if (freshInboundMaterialTransfers.length) {
                freshInboundMaterialTransfers.forEach(function (item) {
                    // 3) inbound transfer
                    adjustments = _this.updateAdjustment("inboundMaterialTransfers", item.id, { status: "FULFILLED_ACKNOWLEDGED" });
                    var thisRequest = adjustments.inboundMaterialRequests
                        .find(function (request) { return (request.status === "FULFILLED_UNACKNOWLEDGED")
                        && request.partnerRecordDate === item.date
                        && request.partnerRecordTime === item.time; });
                    // 4) completed inbound request
                    if (thisRequest) {
                        adjustments = _this.updateAdjustment("inboundMaterialRequests", thisRequest.id, { status: "FULFILLED_ACKNOWLEDGED" });
                    }
                });
            }
            // requests for parts coming to me
            var freshInboundMaterialRequests = inAAndB(adjustments.inboundMaterialRequests.filter(function (item) { return item.status === "UNACKNOWLEDGED"; }), reservations.filter(function (reservation) { return !reservation.declined; }), compareItemsBy.DATE_AND_TIME);
            if (freshInboundMaterialRequests.length) {
                freshInboundMaterialRequests.forEach(function (item) {
                    // 5) acknowledged inbound request
                    adjustments = _this.updateAdjustment("inboundMaterialRequests", item.id, { status: "ACKNOWLEDGED" });
                });
            }
            var freshRejectedInboundMaterialRequests = inAAndB(adjustments.inboundMaterialRequests.filter(function (item) { return item.status === "UNACKNOWLEDGED"; }), reservations.filter(function (reservation) { return reservation.declined; }), compareItemsBy.DATE_AND_TIME);
            if (freshRejectedInboundMaterialRequests.length) {
                // 6) acknowledged inbound request but rejected
                freshRejectedInboundMaterialRequests.forEach(function (item) {
                    adjustments = _this.updateAdjustment("inboundMaterialRequests", item.id, { status: "REJECTED_ACKNOWLEDGED" });
                });
            }
            var disappearedInboundMaterialRequests = inANotB(adjustments.inboundMaterialRequests.filter(function (item) { return item.status === "DELETED_UNACKNOWLEDGED"; }), reservations, compareItemsBy.DATE_AND_TIME);
            if (disappearedInboundMaterialRequests.length) {
                // 7) withdrawn inbound request
                disappearedInboundMaterialRequests.forEach(function (item) {
                    adjustments = _this.updateAdjustment("inboundMaterialRequests", item.id, { status: "DELETED_ACKNOWLEDGED" });
                });
            }
            // if the user has hit e.g. Remove User Data whilst there is an open reservation, we will lose it
            //  so look for reservations indbound to us that we do not have
            var rebuildingInboundMaterialRequests = inANotB(reservations.filter(function (reservation) { return !reservation.declined
                && reservation.destinationEngineerId === _this._engineerId; }), adjustments.inboundMaterialRequests, compareItemsBy.DATE_AND_TIME);
            if (rebuildingInboundMaterialRequests.length) {
                adjustments = this.insertAdjustments.apply(this, ["inboundMaterialRequests"].concat(rebuildingInboundMaterialRequests.map(function (item) { return ({
                    id: item.id,
                    stockReferenceId: item.materialCode,
                    jobId: undefined,
                    description: item.description,
                    quantity: item.quantity,
                    engineerId: item.sourceEngineerId,
                    engineerName: item.sourceEngineerName,
                    engineerPhone: item.sourceEngineerTelephone,
                    status: "ACKNOWLEDGED",
                    date: item.date,
                    time: item.time
                }); })));
            }
            var disappearedOutboundRequests = inANotB(adjustments.outboundMaterialRequests, reservations.filter(function (item) { return item.sourceEngineerId === _this._engineerId; }), compareItemsBy.ID);
            // transfers for parts leaving me
            var freshOutboundMaterialTransfers = inANotB(transfers.filter(function (item) { return item.sourceEngineerId === _this._engineerId; }), adjustments.outboundMaterialTransfers, compareItemsBy.ID);
            if (freshOutboundMaterialTransfers.length) {
                // 8) appeared outbound transfer
                adjustments = this.insertAdjustments.apply(this, ["outboundMaterialTransfers"].concat(freshOutboundMaterialTransfers.map(function (item) { return ({
                    id: item.id,
                    stockReferenceId: item.materialCode,
                    jobId: undefined,
                    description: item.description,
                    quantity: item.quantity,
                    engineerId: item.destinationEngineerId,
                    status: "FULFILLED_ACKNOWLEDGED"
                }); })));
                freshOutboundMaterialTransfers.forEach(function (item) {
                    var thisMaterial = _this.getMaterials().materials
                        .find(function (material) { return material.stockReferenceId === item.materialCode && !material.jobId; });
                    if (!isInitialDataBuid) {
                        // special case: if we have just hit the materials endpoint, the transferred quantities *should* already be accounted for in the materials data
                        _this.updateMaterial({ stockReferenceId: item.materialCode }, {
                            quantity: (thisMaterial && thisMaterial.quantity || 0) - (item && item.quantity || 0)
                        });
                    }
                    // todo: check this logic - can we match on id instead?
                    var thisRequest = disappearedOutboundRequests
                        .find(function (request) { return (request.status === "ACKNOWLEDGED"
                        || request.status === "UNACKNOWLEDGED")
                        && request.stockReferenceId === item.materialCode
                        && request.engineerId === item.destinationEngineerId
                        && request.quantity === item.quantity; });
                    // 9) completed outbound request
                    if (thisRequest) {
                        adjustments = _this.updateAdjustment("outboundMaterialRequests", thisRequest.id, { status: "FULFILLED_ACKNOWLEDGED" });
                    }
                    else {
                        // if we never received the reservation (we were in sleep mode?) then there is nothing to update,
                        //  so lets rebuild the reservation
                        adjustments = _this.insertAdjustments("outboundMaterialRequests", {
                            id: (guid_1.Guid.newGuid()),
                            stockReferenceId: item.materialCode,
                            jobId: undefined,
                            description: item.description,
                            quantity: item.quantity,
                            engineerId: item.destinationEngineerId,
                            engineerName: item.destinationEngineerName,
                            engineerPhone: item.destinationEngineerTelephone,
                            status: "FULFILLED_ACKNOWLEDGED",
                            isUnread: true,
                            date: item.date,
                            time: item.time
                        });
                    }
                });
            }
            // requests for parts leaving me
            var deletedOutboundRequests = inANotB(adjustments.outboundMaterialRequests.filter(function (item) { return item.status !== "FULFILLED_ACKNOWLEDGED"
                && item.status !== "DELETED_ACKNOWLEDGED"; }), reservations.filter(function (item) { return item.sourceEngineerId === _this._engineerId; }), compareItemsBy.ID);
            if (deletedOutboundRequests.length) {
                // 10) withdrawn outbound request
                deletedOutboundRequests.forEach(function (item) {
                    adjustments = _this.updateAdjustment("outboundMaterialRequests", item.id, { status: "DELETED_ACKNOWLEDGED" });
                });
            }
            var freshOutboundRequests = inANotB(reservations.filter(function (item) { return item.sourceEngineerId === _this._engineerId; }), adjustments.outboundMaterialRequests, compareItemsBy.ID);
            if (freshOutboundRequests.length) {
                // 11) appeared outbound request
                adjustments = this.insertAdjustments.apply(this, ["outboundMaterialRequests"].concat(freshOutboundRequests.map(function (item) { return ({
                    id: item.id,
                    stockReferenceId: item.materialCode,
                    jobId: undefined,
                    description: item.description,
                    quantity: item.quantity,
                    engineerId: item.destinationEngineerId,
                    engineerName: item.destinationEngineerName,
                    engineerPhone: item.destinationEngineerTelephone,
                    status: item.declined
                        ? "REJECTED_ACKNOWLEDGED"
                        : "ACKNOWLEDGED",
                    isUnread: true,
                    date: item.date,
                    time: item.time
                }); })));
            }
            var rebornOutboundRequests = inAAndB(reservations.filter(function (item) { return item.sourceEngineerId === _this._engineerId; }), adjustments.outboundMaterialRequests.filter(function (item) { return item.status === "DELETED_ACKNOWLEDGED"; }), compareItemsBy.ID);
            if (rebornOutboundRequests.length) {
                // 12) *not sure* a reappeared outbound request (i.e. it disappeared for a bit and then came back, but out in-day refresh should tackle this)
                rebornOutboundRequests.forEach(function (item) {
                    adjustments = _this.updateAdjustment("outboundMaterialRequests", item.id, { status: "ACKNOWLEDGED" });
                });
            }
            return !!(disappearedCollections.length
                || freshCollections.length
                || freshInboundMaterialTransfers.length
                || freshInboundMaterialRequests.length
                || freshRejectedInboundMaterialRequests.length
                || disappearedInboundMaterialRequests.length
                || rebuildingInboundMaterialRequests.length
                || freshOutboundMaterialTransfers.length
                || deletedOutboundRequests.length
                || freshOutboundRequests.length
                || rebornOutboundRequests.length);
        };
        VanStockEngine.prototype.getNowTimeStamp = function () {
            return (new Date()).getTime();
        };
        VanStockEngine.prototype.getAPIDateAndTime = function () {
            var m = moment();
            return {
                date: +m.format("YYYYMMDD"),
                time: +m.format("HHmmssSS") // if the time happens to start with a zero, that zero should be removed, so this logic is correct
            };
        };
        VanStockEngine.prototype.convertEngineerId = function (input) {
            // e.g. "0000050" needs to be "50" (the number with no leading zeros, but as a string)
            // return parseInt((input || "").replace(/\D/g, ""), 10).toString();
            return input;
        };
        VanStockEngine.prototype.isALiveReservationStatus = function (adjustment) {
            return adjustment.status !== "DELETED_UNACKNOWLEDGED"
                && adjustment.status !== "DELETED_ACKNOWLEDGED"
                && adjustment.status !== "FULFILLED_UNACKNOWLEDGED"
                && adjustment.status !== "FULFILLED_ACKNOWLEDGED";
        };
        VanStockEngine = __decorate([
            aurelia_framework_1.inject(vanStockService_1.VanStockService, storageService_1.StorageService, aurelia_event_aggregator_1.EventAggregator, configurationService_1.ConfigurationService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, Object])
        ], VanStockEngine);
        return VanStockEngine;
    }());
    exports.VanStockEngine = VanStockEngine;
});

//# sourceMappingURL=vanStockEngine.js.map
