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
define(["require", "exports", "aurelia-logging", "aurelia-framework", "moment", "../../api/services/bridgeApiService", "./constants/adaptAttributeConstants", "./constants/adaptAvailabilityAttributeType", "../models/adapt/externalApplianceAppModel", "../models/businessException", "aurelia-event-aggregator", "./jobService", "../../../common/core/threading", "../models/jobState", "../factories/partFactory", "../models/partsDetail", "./constants/jobServiceConstants", "./constants/adaptBusinessServiceConstants", "../models/dataState", "../../../common/core/services/configurationService", "./businessRuleService", "../../../common/core/objectHelper", "../models/partsBasket", "../../../common/core/stringHelper", "./consumableService", "../models/consumablePart", "./catalogService", "bignumber", "../../../appConstants", "../../../common/core/guid", "../models/bridgeDiagnostic"], function (require, exports, Logging, aurelia_framework_1, moment, bridgeApiService_1, adaptAttributeConstants_1, adaptAvailabilityAttributeType_1, externalApplianceAppModel_1, businessException_1, aurelia_event_aggregator_1, jobService_1, threading_1, jobState_1, partFactory_1, partsDetail_1, jobServiceConstants_1, adaptBusinessServiceConstants_1, dataState_1, configurationService_1, businessRuleService_1, objectHelper_1, partsBasket_1, stringHelper_1, consumableService_1, consumablePart_1, catalogService_1, bignumber, appConstants_1, guid_1, bridgeDiagnostic_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { ConsumablesBasket } from "../models/consumablesBasket";
    /**
     * Business service to communicate with Adapt database, work out parts availability and safety risks for appliance
     */
    var BridgeBusinessService = /** @class */ (function () {
        function BridgeBusinessService(bridgeApiService, jobService, eventAggregator, partFactory, configurationService, businessRuleService, consumableService, catalogService) {
            this._bridgeApiService = bridgeApiService;
            this._eventAggregator = eventAggregator;
            this._jobService = jobService;
            this._partFactory = partFactory;
            this._configurationService = configurationService;
            this._businessRuleService = businessRuleService;
            this._consumableService = consumableService;
            this._catalogService = catalogService;
            this._logger = Logging.getLogger("BridgeBusinessService");
            this._monitorAdaptPartsSelectedIntervalId = -1;
        }
        BridgeBusinessService.prototype.initialise = function () {
            var _this = this;
            // want to generate customer qoute text file on job status change (arrived state)
            var isTrainingMode = this._configurationService.getConfiguration().trainingMode;
            if (!isTrainingMode) {
                this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.handleJobStateChanged(); });
            }
            return this.buildBusinessRules().then(function () {
                _this.stopStartAdaptMonitoring(true);
            }).catch(function (error) {
                _this._logger.error(error && error.toString());
            });
        };
        BridgeBusinessService.prototype.stopStartAdaptMonitoring = function (startMonitoring) {
            var _this = this;
            var hemaConfiguration = this._configurationService.getConfiguration();
            var isPollingSwitchedOn = hemaConfiguration && !!hemaConfiguration.adaptPollingInterval;
            if (startMonitoring && isPollingSwitchedOn) {
                this._monitorAdaptPartsSelectedIntervalId = threading_1.Threading.startTimer(function () { return _this.monitorAdaptPartsSelectedElapsed(); }, hemaConfiguration.adaptPollingInterval);
            }
            else {
                if (this._monitorAdaptPartsSelectedIntervalId !== -1) {
                    threading_1.Threading.stopTimer(this._monitorAdaptPartsSelectedIntervalId);
                    this._monitorAdaptPartsSelectedIntervalId = -1;
                }
            }
        };
        BridgeBusinessService.prototype.monitorAdaptPartsSelectedElapsed = function () {
            var _this = this;
            var isPartConsumable = function (part) {
                return part
                    && part.stockReferenceId
                    && _this._isPartConsumableStockReferencePrefixes
                    && _this._isPartConsumableStockReferencePrefixes.some(function (prefix) { return stringHelper_1.StringHelper.startsWith(part.stockReferenceId, prefix); });
            };
            return Promise.all([
                this._bridgeApiService.getPartsSelected(),
                this._jobService.getActiveJobId()
                    .then(function (activeJobId) { return activeJobId ? _this._jobService.getJob(activeJobId) : null; })
            ])
                .then(function (_a) {
                var partsSelected = _a[0], activeJob = _a[1];
                _this._logger.debug("parts located in adapt", [JSON.stringify(partsSelected)]);
                if (partsSelected && partsSelected.parts && partsSelected.parts.length) {
                    if (activeJob && activeJob.state === jobState_1.JobState.arrived) {
                        _this._logger.debug("add parts basket, activeJob status", [JSON.stringify(activeJob)]);
                        return _this.addToPartsBasket(partsSelected.parts, activeJob);
                    }
                    else {
                        _this._logger.debug("add consumable parts basket", []);
                        var consumableParts = partsSelected.parts.filter(function (x) { return isPartConsumable(x); });
                        if (consumableParts && consumableParts.length) {
                            return _this.addToConsumableBasket(consumableParts);
                        }
                    }
                }
                _this._logger.debug("no parts found from adapt", []);
                return undefined;
            })
                .catch(function (error) {
                _this._logger.error(error && error.toString());
                _this.stopStartAdaptMonitoring(false);
                _this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, {
                    id: guid_1.Guid.newGuid(),
                    title: "Adapt Connection Problem",
                    style: "warning",
                    content: "Could not check for parts from Adapt. Ensure adapt and the Bridge Service are running.",
                    dismissTime: 0
                });
            });
        };
        /**
         * gets the user information specified in the adapt settings
         * @returns {string}
         *
         * Note: 22/11/2017 - this method returns a set of details describing the user (name, phone, region, etc) from the ADAPT application.
         *  These settings from ADAPT include working sector, region and patch.  EWB is also interested in these three settings.
         *  The problem is that the values ADAPT keeps are in a different format to how EWB keeps them, hence there is no usefulness
         *  in using this endpoint at the current time.  This may change in the future, hence this method is left in.
         *
         */
        BridgeBusinessService.prototype.getUserSettings = function () {
            return this._bridgeApiService.getUserSettings();
        };
        /**
         * used to export customer details, generates a post JSON body with customer details for api call to bridge service
         * @param jobId
         * @param hasTobeActiveState - if want to manually invoke (e.g. clicking button) set to false
         * @returns {Promise<Job>}
         */
        BridgeBusinessService.prototype.exportCustomerDetails = function (jobId, hasTobeActiveState) {
            var _this = this;
            if (hasTobeActiveState === void 0) { hasTobeActiveState = true; }
            var req = {};
            return this._jobService.getJob(jobId).then(function (job) {
                if (!job) {
                    return Promise.resolve();
                }
                if (hasTobeActiveState && job.state !== jobState_1.JobState.arrived) {
                    return Promise.resolve();
                }
                var id = job.id, contact = job.contact, customerContact = job.customerContact, premises = job.premises;
                if (contact) {
                    var _a = contact.lastName, custName = _a === void 0 ? "" : _a, custWorkPhone = contact.workPhone, custHomePhone = contact.homePhone;
                    req.wMISnumber = id;
                    req.workcontactnumber = custWorkPhone;
                    req.homecontactnumber = custHomePhone;
                    req.custName = custName;
                }
                if (customerContact) {
                    var _b = customerContact.lastName, billName = _b === void 0 ? "" : _b, billAddress = customerContact.address;
                    req.billName = billName;
                    if (billAddress) {
                        var billLine = billAddress.line, billHouseName = billAddress.premisesName, billHouseNumber = billAddress.houseNumber, billTown = billAddress.town, billCounty = billAddress.county, billPostCodeIn = billAddress.postCodeIn, billPostCodeOut = billAddress.postCodeOut;
                        req.billhousenumber = billHouseNumber;
                        req.billhousename = billHouseName;
                        req.billcity = billCounty;
                        req.billsuburb = billTown;
                        req.billpostin = billPostCodeIn;
                        req.billpostout = billPostCodeOut;
                        if (billLine && billLine.length > 0) {
                            if (billLine[0]) {
                                req.billstreet1 = billLine[0];
                            }
                            if (billLine[1]) {
                                req.billstreet2 = billLine[1];
                            }
                        }
                    }
                }
                if (premises) {
                    var jobAddress = premises.address;
                    if (jobAddress) {
                        var jobLine = jobAddress.line, jobHouseName = jobAddress.premisesName, jobHouseNumber = jobAddress.houseNumber, jobTown = jobAddress.town, jobCounty = jobAddress.county, jobPostCodeIn = jobAddress.postCodeIn, jobPostCodeOut = jobAddress.postCodeOut;
                        req.jobhousenumber = jobHouseNumber;
                        req.jobhousename = jobHouseName;
                        req.jobcity = jobCounty;
                        req.jobsuburb = jobTown;
                        req.jobpostin = jobPostCodeIn;
                        req.jobpostout = jobPostCodeOut;
                        if (jobLine && jobLine.length > 0) {
                            if (jobLine[0]) {
                                req.jobaddress1 = jobLine[0];
                            }
                            if (jobLine[1]) {
                                req.jobaddress2 = jobLine[1];
                            }
                        }
                    }
                }
                return _this._bridgeApiService.postCustomerDetails(req)
                    .catch(function (err) {
                    var content = "Could not export customer details. Check Bridge Service and Quote folder exists";
                    var title = "Customer Export Failure";
                    _this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, {
                        id: guid_1.Guid.newGuid(),
                        title: title,
                        style: "warning",
                        content: content,
                        dismissTime: 0
                    });
                    _this._logger.error(content, err);
                    return Promise.resolve(null);
                });
            });
        };
        /**
         * Call api to get appliance information, first get models, then use model id to get model attributes
         * @param applianceGCCode
         * @returns {Promise<ExternalApplianceAppModel>}
         */
        BridgeBusinessService.prototype.getApplianceInformation = function (applianceGCCode) {
            var _this = this;
            var formattedGCCode = this.formatGCCode(applianceGCCode);
            return this._bridgeApiService.getModels(formattedGCCode)
                .then(function (response) {
                if (response && response.models && response.models.length) {
                    // there can be more than one model for the gc code
                    var getModelCalls = response.models.map(function (model) { return _this._bridgeApiService.getModelAttributes(model.imModKey); });
                    return Promise.all(getModelCalls).then(function (result) {
                        var apiAttributes = [];
                        result.forEach(function (r) { return apiAttributes.push.apply(apiAttributes, r.attributes); });
                        var representativeModelForResult = _this.getRepresentativeDescriptionAndManufacturer(response.models);
                        return _this.mapApiAttributesToModel(apiAttributes, representativeModelForResult);
                    }).catch(function (error) {
                        throw new businessException_1.BusinessException(_this, "adaptBusinessService", "could not get product with gc no " + formattedGCCode + " from adapt", [formattedGCCode], error);
                    });
                }
                return Promise.resolve(new externalApplianceAppModel_1.ExternalApplianceAppModel(false));
            })
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "adaptBusinessService.getApplianceInformation", "could not get product with gc no '{0}'", [applianceGCCode], error);
            });
        };
        /**
         * formats the plain gcCode into the formatted one for adapt
         * @returns {string}
         * @param gcCode
         */
        BridgeBusinessService.prototype.formatGCCode = function (gcCode) {
            if (gcCode.length === 7) {
                return gcCode.substr(0, 2) + "-" + gcCode.substr(2, 3) + "-" + gcCode.substr(5, 2);
            }
            else {
                return gcCode;
            }
        };
        BridgeBusinessService.prototype.buildBusinessRules = function () {
            var _this = this;
            return this._businessRuleService.getQueryableRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(partsBasket_1.PartsBasket)))
                .then(function (ruleGroup) {
                var consumableRules = ruleGroup.getBusinessRule("isPartConsumableStockReferencePrefix");
                if (consumableRules) {
                    _this._isPartConsumableStockReferencePrefixes = consumableRules.split(",");
                }
            });
        };
        BridgeBusinessService.prototype.getDiagnostic = function () {
            return __awaiter(this, void 0, void 0, function () {
                var diagnosticSummary, version, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            diagnosticSummary = new bridgeDiagnostic_1.BridgeDiagnostic();
                            diagnosticSummary.timestamp = new Date();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this._bridgeApiService.getStatusOk()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this._bridgeApiService.getVersion()];
                        case 3:
                            version = _a.sent();
                            diagnosticSummary.statusOk = true;
                            diagnosticSummary.version = version;
                            return [3 /*break*/, 5];
                        case 4:
                            ex_1 = _a.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/, diagnosticSummary];
                    }
                });
            });
        };
        BridgeBusinessService.prototype.handleJobStateChanged = function () {
            var _this = this;
            return this._jobService.getActiveJobId()
                .then(function (activeJobId) { return activeJobId
                ? _this.exportCustomerDetails(activeJobId)
                : Promise.resolve(); } // the job may have just been completed, so activeJobId is null
            );
        };
        BridgeBusinessService.prototype.getMaxDateFromTimestamps = function (timestamps) {
            var dates = timestamps.map(function (timestamp) { return new Date(timestamp); });
            return new Date(Math.max.apply(null, dates));
        };
        BridgeBusinessService.prototype.isRecentPart = function (partTimestamp, lastBasketDate) {
            return !lastBasketDate || moment(partTimestamp).isAfter(lastBasketDate);
        };
        BridgeBusinessService.prototype.addToConsumableBasket = function (validConsumablePartsSelected) {
            var _this = this;
            return this._consumableService.getConsumablesBasket()
                .then(function (basket) {
                if (basket) {
                    var validPartsSelected_1 = validConsumablePartsSelected.filter(function (x) { return _this.isRecentPart(x.timestamp, basket.lastPartGatheredTime); });
                    basket.lastPartGatheredTime = _this.getMaxDateFromTimestamps(validConsumablePartsSelected.map(function (a) { return a.timestamp; }));
                    if (validPartsSelected_1 && validPartsSelected_1.length) {
                        return _this._consumableService.saveBasket(basket)
                            .then(function () {
                            var promises = validPartsSelected_1.map(function (validPart) {
                                var part = _this._partFactory.createPartBusinessModelFromAdaptApiModel(validPart);
                                return _this._consumableService.addConsumableToBasket(new consumablePart_1.ConsumablePart(part.stockReferenceId, part.description, part.quantity));
                            });
                            return Promise.all(promises);
                        })
                            .then(function () {
                            _this._eventAggregator.publish(adaptBusinessServiceConstants_1.AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, validPartsSelected_1.map(function (p) { return p.stockReferenceId; }));
                        });
                    }
                }
                return undefined;
            });
        };
        BridgeBusinessService.prototype.addToPartsBasket = function (partsSelected, job) {
            var _this = this;
            if (!job.partsDetail) {
                job.partsDetail = new partsDetail_1.PartsDetail();
            }
            if (!job.partsDetail.partsBasket) {
                job.partsDetail.partsBasket = new partsBasket_1.PartsBasket();
            }
            if (!job.partsDetail.partsBasket.lastPartGatheredTime) {
                job.partsDetail.partsBasket.lastPartGatheredTime = job.onsiteTime;
            }
            var validPartsSelected = partsSelected.filter(function (x) { return _this.isRecentPart(x.timestamp, job.partsDetail.partsBasket.lastPartGatheredTime); });
            job.partsDetail.partsBasket.lastPartGatheredTime = this.getMaxDateFromTimestamps(partsSelected.map(function (a) { return a.timestamp; }));
            if (validPartsSelected && validPartsSelected.length) {
                var partBusinessModels_1 = [];
                var partBusinessModelPromises = [];
                partBusinessModelPromises = validPartsSelected.map(function (partSelected) {
                    return _this._catalogService.getGoodsType(partSelected.stockReferenceId)
                        .then(function (catalogLookedUpPart) {
                        var partBusinessModel = _this._partFactory.createPartBusinessModelFromAdaptApiModel(partSelected);
                        if (catalogLookedUpPart) {
                            var catalogLookedUpPartPrice = catalogLookedUpPart.charge
                                ? new bignumber.BigNumber(catalogLookedUpPart.charge / 100)
                                : new bignumber.BigNumber(0);
                            if (catalogLookedUpPartPrice !== partBusinessModel.price) {
                                partBusinessModel.isCatalogPriceDifferentFromAdapt = true;
                                partBusinessModel.price = catalogLookedUpPartPrice;
                            }
                        }
                        partBusinessModels_1.push(partBusinessModel);
                    });
                });
                return Promise.all(partBusinessModelPromises)
                    .then(function () {
                    (_a = job.partsDetail.partsBasket.partsToOrder).push.apply(_a, partBusinessModels_1);
                    job.partsDetail.partsBasket.dataState = dataState_1.DataState.notVisited;
                    // todo undecided on approach, if on parts basket page should we persist to job, so that undo can work?
                    // if on partsBasketPage then publish event otherwise setJob and publish event
                    return _this._jobService.setJob(job)
                        .then(function () {
                        _this._eventAggregator.publish(adaptBusinessServiceConstants_1.AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, partBusinessModels_1.map(function (part) { return part.id; }));
                        _this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED);
                    });
                    var _a;
                })
                    .catch(function (error) {
                    // couldn't check the part lookup prices
                    throw new businessException_1.BusinessException(_this, "adaptBusinessService.savePartsBasket", "couldn't check the part lookup prices for parts added via adapt", null, error);
                });
            }
            else {
                return undefined;
            }
        };
        BridgeBusinessService.prototype.getRepresentativeDescriptionAndManufacturer = function (models) {
            // todo: is there any logic that we need to apply to get the best model
            //  e.g. if there is more than one model in the result set, should be return a comma delimited list of all (distinct) descriptions.
            return models[0];
        };
        BridgeBusinessService.prototype.mapApiAttributesToModel = function (apiAttributes, descriptionAndManufacturer) {
            var hasAttribute = function (attr) { return apiAttributes.some(function (apiAttr) { return apiAttr.attributeType === attr.attributeType
                && (attr.attributeValue === undefined || (apiAttr.attributeValue === attr.attributeValue)); }); };
            var result = new externalApplianceAppModel_1.ExternalApplianceAppModel(true);
            result.description = descriptionAndManufacturer.description;
            result.manufacturer = descriptionAndManufacturer.manufacturer;
            result.ceased = hasAttribute(adaptAttributeConstants_1.AdaptAttributeConstants.CEASED_PRODUCTION);
            result.safetyNotice = hasAttribute(adaptAttributeConstants_1.AdaptAttributeConstants.SAFETY_NOTICE);
            // since there can be more than one model for a gc, need to establish 'worst case' to report
            // worts case precedence: FOLIO, WITHDRAWN, REDUCED_PARTS_LIST, SERVICE_LISTED, NA
            if (hasAttribute(adaptAttributeConstants_1.AdaptAttributeConstants.FOLIO)) {
                result.availabilityStatus = adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.FOLIO;
            }
            else if (hasAttribute(adaptAttributeConstants_1.AdaptAttributeConstants.WITHDRAWN)) {
                result.availabilityStatus = adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.WITHDRAWN;
            }
            else if (hasAttribute(adaptAttributeConstants_1.AdaptAttributeConstants.REDUCED_PARTS_LIST)) {
                result.availabilityStatus = adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.REDUCED_PARTS_LIST;
            }
            else if (hasAttribute(adaptAttributeConstants_1.AdaptAttributeConstants.SERVICE_LISTED)) {
                result.availabilityStatus = adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.SERVICE_LISTED;
            }
            else {
                result.availabilityStatus = adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.NA;
            }
            return result;
        };
        BridgeBusinessService = __decorate([
            aurelia_framework_1.inject(bridgeApiService_1.BridgeApiService, jobService_1.JobService, aurelia_event_aggregator_1.EventAggregator, partFactory_1.PartFactory, configurationService_1.ConfigurationService, businessRuleService_1.BusinessRuleService, consumableService_1.ConsumableService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, Object, Object, Object])
        ], BridgeBusinessService);
        return BridgeBusinessService;
    }());
    exports.BridgeBusinessService = BridgeBusinessService;
});

//# sourceMappingURL=bridgeBusinessService.js.map
