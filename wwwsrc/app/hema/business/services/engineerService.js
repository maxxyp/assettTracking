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
define(["require", "exports", "aurelia-logging", "aurelia-framework", "aurelia-event-aggregator", "../../api/services/fftService", "./storageService", "../models/engineer", "../models/businessException", "../../../common/core/stringHelper", "../../../common/core/objectHelper", "./businessRuleService", "../../core/dateHelper", "./constants/engineerServiceConstants", "./catalogService", "../../../common/core/services/configurationService", "../models/unAuthorisedException", "./constants/whoAmIServiceConstants", "./constants/workRetrievalServiceConstants", "../../../common/analytics/analyticsConstants", "moment", "./labelService", "../models/job", "../../../common/resilience/apiException", "../../core/numberHelper"], function (require, exports, Logging, aurelia_framework_1, aurelia_event_aggregator_1, fftService_1, storageService_1, engineer_1, businessException_1, stringHelper_1, objectHelper_1, businessRuleService_1, dateHelper_1, engineerServiceConstants_1, catalogService_1, configurationService_1, unAuthorisedException_1, whoAmIServiceConstants_1, workRetrievalServiceConstants_1, analyticsConstants_1, moment, labelService_1, job_1, apiException_1, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_EMPLOYEE_ID_CHARACTERS = 7;
    var EMPLOYEE_ID_PREFIX_CHARACTER = "0";
    var WHO_AM_I_EMPLOYEEID_ATTRIBUTE = whoAmIServiceConstants_1.WhoAmIServiceConstants.WHO_AM_I_EMPLOYEEID_ATTRIBUTE, WHO_AM_I_GIVENNAME_ATTRIBUTE = whoAmIServiceConstants_1.WhoAmIServiceConstants.WHO_AM_I_GIVENNAME_ATTRIBUTE, WHO_AM_I_SN_ATTRIBUTE = whoAmIServiceConstants_1.WhoAmIServiceConstants.WHO_AM_I_SN_ATTRIBUTE, WHO_AM_I_TELEPHONE_NUMBER_ATTRIBUTE = whoAmIServiceConstants_1.WhoAmIServiceConstants.WHO_AM_I_TELEPHONE_NUMBER_ATTRIBUTE;
    var ENGINNER_STATE_ELEMENT = "EngineerState";
    var EngineerService = /** @class */ (function () {
        function EngineerService(storageService, fftService, eventAggregator, catalogService, businessRulesService, configurationService, labelService) {
            this._storageService = storageService;
            this._fftService = fftService;
            this._eventAggregator = eventAggregator;
            this._catalogService = catalogService;
            this._businessRuleService = businessRulesService;
            this._configurationService = configurationService;
            this._labelService = labelService;
            this._logger = Logging.getLogger("EngineerService");
            this.isPartCollectionInProgress = false;
        }
        EngineerService.prototype.initialise = function (hasWhoAmISucceeded, whoAmI) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var throwUnauthorised, getWhoAmIAttributeValue, isAnAllowedRolePresent, tidyEngineerId, config, allowedActiveDirectoryRoles, engineer, isAlreadySignedOn, rawEngineerId, engineerId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            throwUnauthorised = function (message) {
                                var args = [];
                                for (var _i = 1; _i < arguments.length; _i++) {
                                    args[_i - 1] = arguments[_i];
                                }
                                throw new unAuthorisedException_1.UnAuthorisedException(_this, "initialise", message, null, args);
                            };
                            getWhoAmIAttributeValue = function (arr, propName) {
                                var attribute = (arr || []).filter(function (item) { return Object.keys(item).length === 1 && Object.keys(item)[0] === propName; });
                                return attribute.length ? attribute[0][propName] : "";
                            };
                            isAnAllowedRolePresent = function (actualRoles, allowedRoles) {
                                return actualRoles.some(function (actualRole) {
                                    return allowedRoles.some(function (allowedRole) {
                                        return allowedRole.toLowerCase() === actualRole.toLowerCase();
                                    });
                                });
                            };
                            tidyEngineerId = function (input) {
                                var numericCharacters = (input || "").replace(/\D/g, "");
                                return numericCharacters
                                    ? stringHelper_1.StringHelper.padLeft(numericCharacters, EMPLOYEE_ID_PREFIX_CHARACTER, MAX_EMPLOYEE_ID_CHARACTERS)
                                    : undefined;
                            };
                            config = this._configurationService.getConfiguration();
                            allowedActiveDirectoryRoles = (config && config.activeDirectoryRoles) || [];
                            if (!allowedActiveDirectoryRoles.length) {
                                throwUnauthorised("Cannot find activeDirectoryRoles", config);
                            }
                            return [4 /*yield*/, this.getCurrentEngineer()];
                        case 1:
                            engineer = _a.sent();
                            isAlreadySignedOn = engineer && engineer.isSignedOn;
                            if (!hasWhoAmISucceeded) {
                                if (isAlreadySignedOn) {
                                    // special case: if the user a) is already signed in (the app was previously closed/crashed before end of day was triggered)
                                    // and b) we have no connectivity, we still authenticate the user
                                    return [2 /*return*/];
                                }
                                else {
                                    throwUnauthorised("Cannot currently authorise your account as the authentication server is not responding.", config);
                                }
                            }
                            if (!whoAmI || !whoAmI.attributes || !whoAmI.roles) {
                                throwUnauthorised("There is a problem with the response from the authentication server.", whoAmI);
                            }
                            rawEngineerId = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_EMPLOYEEID_ATTRIBUTE);
                            if (!rawEngineerId) {
                                throwUnauthorised("Your LAN user account does not have the attribute " + WHO_AM_I_EMPLOYEEID_ATTRIBUTE + ".");
                            }
                            engineerId = tidyEngineerId(rawEngineerId);
                            if (!engineerId) {
                                throwUnauthorised("Unable to determine your WMIS engineer id from active directory.", rawEngineerId);
                            }
                            if (!isAnAllowedRolePresent(whoAmI.roles, allowedActiveDirectoryRoles)) {
                                throwUnauthorised("Your LAN user account does not have one of the required roles " + allowedActiveDirectoryRoles.join(", ") + ".", allowedActiveDirectoryRoles);
                            }
                            if (isAlreadySignedOn) {
                                engineer.roles = whoAmI.roles;
                            }
                            else {
                                engineer = new engineer_1.Engineer();
                                engineer.isSignedOn = false;
                                engineer.status = undefined;
                                engineer.lanId = whoAmI.userid;
                                engineer.id = engineerId;
                                engineer.firstName = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_GIVENNAME_ATTRIBUTE);
                                engineer.lastName = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_SN_ATTRIBUTE);
                                engineer.phoneNumber = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_TELEPHONE_NUMBER_ATTRIBUTE);
                                engineer.roles = whoAmI.roles;
                            }
                            return [4 /*yield*/, this._storageService.setEngineer(engineer)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EngineerService.prototype.getCurrentEngineer = function () {
            var _this = this;
            return this._storageService.getEngineer()
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getCurrentEngineer", "Getting current engineer", null, error);
            });
        };
        EngineerService.prototype.getAllStatus = function () {
            var _this = this;
            return this._engineerStatuss ?
                Promise.resolve(this._engineerStatuss) :
                this._catalogService.getFieldOperativeStatuses()
                    .then(function (data) {
                    _this._engineerStatuss = data;
                    return _this._engineerStatuss;
                });
        };
        EngineerService.prototype.setStatus = function (engineerStatus) {
            var _this = this;
            return this.loadBusinessRules()
                .then(function () { return _this._storageService.getEngineer(); })
                .then(function (engineer) {
                _this.addToAnalytics(engineerStatus, engineer);
                return engineer;
            })
                .then(function (engineer) {
                var oldIsSignedOn = engineer.isSignedOn;
                var oldStatus = engineer.status;
                var oldIsWorking = engineer.status === undefined;
                var newIsWorking = engineerStatus === undefined;
                if (engineerStatus === _this._signOnId) {
                    engineer.isSignedOn = true;
                    engineer.status = undefined;
                }
                else if (engineerStatus === _this._signOffId) {
                    engineer.isSignedOn = false;
                    engineer.status = undefined;
                    engineer.isContractor = undefined;
                }
                else {
                    engineer.status = engineerStatus;
                }
                if (engineer.isSignedOn !== oldIsSignedOn || engineer.status !== oldStatus) {
                    // "isWorking" is a made-up internal-only status, (and so engineerStatus is undefined)
                    //  so do not send an update to the API
                    return (newIsWorking ? Promise.resolve() : _this.sendStatusOrThrow(engineer, engineerStatus))
                        .then(function () {
                        return _this._storageService.getJobsToDo()
                            .then(function (jobs) {
                            if (jobs.some(function (job) { return job_1.Job.isActive(job); })) {
                                engineer.status = undefined;
                                newIsWorking = true;
                            }
                        });
                    })
                        .then(function () { return _this._storageService.setEngineer(engineer); })
                        .then(function () {
                        var shouldPublishSignedOnChanged = engineer.isSignedOn !== oldIsSignedOn;
                        var shouldPublishIsWorkingChanged = newIsWorking !== oldIsWorking;
                        var shouldPublishStatusChanged = shouldPublishSignedOnChanged || shouldPublishIsWorkingChanged || engineer.status !== oldStatus;
                        var shouldPublishWorkRetrieval = (shouldPublishSignedOnChanged && engineer.isSignedOn)
                            || (shouldPublishIsWorkingChanged && newIsWorking);
                        if (shouldPublishStatusChanged) {
                            _this._eventAggregator.publish(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_STATUS_CHANGED);
                        }
                        if (shouldPublishSignedOnChanged) {
                            _this._eventAggregator.publish(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, engineer.isSignedOn);
                        }
                        if (shouldPublishIsWorkingChanged) {
                            _this._eventAggregator.publish(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_WORKING_CHANGED);
                        }
                        if (shouldPublishWorkRetrieval) {
                            _this._eventAggregator.publish(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST);
                        }
                    });
                }
                else {
                    return undefined;
                }
            });
        };
        EngineerService.prototype.getStatus = function () {
            return this._storageService.getEngineer()
                .then(function (engineer) {
                if (engineer) {
                    return engineer.status;
                }
                else {
                    return undefined;
                }
            });
        };
        EngineerService.prototype.isWorking = function () {
            return this._storageService.getEngineer()
                .then(function (engineer) {
                if (engineer) {
                    return engineer.isSignedOn && engineer.status === undefined;
                }
                else {
                    return false;
                }
            });
        };
        EngineerService.prototype.isSignedOn = function () {
            return this._storageService.getEngineer()
                .then(function (engineer) {
                if (engineer) {
                    return engineer.isSignedOn;
                }
                else {
                    return false;
                }
            });
        };
        EngineerService.prototype.getEngineerStateText = function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var statuses, labels;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadBusinessRules()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.getAllStatus()];
                        case 2:
                            statuses = _a.sent();
                            if (!(statuses && statuses.length > 0)) return [3 /*break*/, 4];
                            if (statuses && statuses.find(function (x) { return x.fieldOperativeStatus === state; })) {
                                return [2 /*return*/, statuses.find(function (x) { return x.fieldOperativeStatus === state; }).fieldOperativeStatusDescription];
                            }
                            return [4 /*yield*/, this.getLabels()];
                        case 3:
                            labels = _a.sent();
                            if (labels) {
                                if (state === "internalWorking") {
                                    return [2 /*return*/, objectHelper_1.ObjectHelper.getPathValue(labels, "working")];
                                }
                                if (state === "internalNotWorking") {
                                    return [2 /*return*/, objectHelper_1.ObjectHelper.getPathValue(labels, "notWorking")];
                                }
                                if (state === this._signOnId) {
                                    return [2 /*return*/, objectHelper_1.ObjectHelper.getPathValue(labels, "signOn")];
                                }
                                else if (state === this._signOffId) {
                                    return [2 /*return*/, objectHelper_1.ObjectHelper.getPathValue(labels, "signOff")];
                                }
                                return [2 /*return*/, state];
                            }
                            return [2 /*return*/, undefined];
                        case 4: return [2 /*return*/, undefined];
                    }
                });
            });
        };
        EngineerService.prototype.overrideEngineerId = function (engineer) {
            return __awaiter(this, void 0, void 0, function () {
                var contractEngineerResponse, error_1, statusCode, wmisPayrollId, workdayPayrollId, contractorInd;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!engineer && !!engineer.isContractor) {
                                return [2 /*return*/, engineer];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._fftService.getAmIContractEngineerInfo(engineer.id)];
                        case 2:
                            contractEngineerResponse = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 && error_1 instanceof apiException_1.ApiException) {
                                statusCode = error_1.httpStatusCode;
                                if (!!statusCode && statusCode.indexOf("404") >= 0) {
                                    return [2 /*return*/, engineer];
                                }
                            }
                            throw new businessException_1.BusinessException(this, "overrideEngineerId", "Unable to get user details (contract engineer check)'{0}'.", [engineer.id], error_1);
                        case 4:
                            wmisPayrollId = contractEngineerResponse.engineerId, workdayPayrollId = contractEngineerResponse.workdayPayrollId, contractorInd = contractEngineerResponse.contractorInd;
                            if (stringHelper_1.StringHelper.isEmptyOrUndefinedOrNull(wmisPayrollId)
                                || numberHelper_1.NumberHelper.isNullOrUndefined(workdayPayrollId)
                                || stringHelper_1.StringHelper.isEmptyOrUndefinedOrNull(contractorInd)) {
                                throw new businessException_1.BusinessException(this, "overrideEngineerId", "Invalid contract engineer's data received", null, null);
                            }
                            engineer.id = wmisPayrollId;
                            engineer.isContractor = contractorInd;
                            return [4 /*yield*/, this._storageService.setEngineer(engineer)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, engineer];
                    }
                });
            });
        };
        EngineerService.prototype.loadBusinessRules = function () {
            var _this = this;
            return this._signOnId && this._signOffId ?
                Promise.resolve() :
                this._businessRuleService.getRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))
                    .then(function (businessRules) {
                    _this._signOnId = objectHelper_1.ObjectHelper.getPathValue(businessRules, "signOnId");
                    _this._signOffId = objectHelper_1.ObjectHelper.getPathValue(businessRules, "signOffId");
                    if (!stringHelper_1.StringHelper.isString(_this._signOnId) || !stringHelper_1.StringHelper.isString(_this._signOffId)) {
                        throw new businessException_1.BusinessException(_this, "loadBusinessRules", "Unable to load signOn and signOff business rules", null, null);
                    }
                });
        };
        EngineerService.prototype.sendStatusOrThrow = function (signedOnEngineer, engineerStatus) {
            var _this = this;
            var engineerStatusReport = {
                data: {
                    timestamp: dateHelper_1.DateHelper.toJsonDateTimeString(new Date()),
                    statusCode: engineerStatus
                }
            };
            if (engineerStatus === this._signOffId) {
                return this._fftService.engineerStatusUpdateEod(signedOnEngineer.id, engineerStatusReport)
                    .catch(function (error) {
                    _this._logger.error(new businessException_1.BusinessException(_this, "setStatusEod", "Setting status '{0}' for engineer '{1}'", [engineerStatus, signedOnEngineer.id], error).toString());
                    // we need to feed back to the user if the end-of-day has not gone: the calling code will handle this exception.
                    throw error;
                });
            }
            else {
                return this._fftService.engineerStatusUpdate(signedOnEngineer.id, engineerStatusReport)
                    .catch(function (error) {
                    _this._logger.error(new businessException_1.BusinessException(_this, "setStatus", "Setting status '{0}' for engineer '{1}'", [engineerStatus, signedOnEngineer.id], error).toString());
                });
            }
        };
        EngineerService.prototype.addToAnalytics = function (state, engineer) {
            return __awaiter(this, void 0, void 0, function () {
                var stateText, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getEngineerStateText(state)];
                        case 1:
                            stateText = _b.sent();
                            if (stateText && engineer && engineer.id) {
                                this._eventAggregator.publish(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, {
                                    category: analyticsConstants_1.AnalyticsConstants.ENGINNER_STATE_CHANGED,
                                    action: stateText,
                                    label: moment().format(analyticsConstants_1.AnalyticsConstants.DATE_TIME_FORMAT),
                                    metric: analyticsConstants_1.AnalyticsConstants.METRIC
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        EngineerService.prototype.getLabels = function () {
            return this._labelService.getGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(ENGINNER_STATE_ELEMENT)));
        };
        EngineerService.OBTAINING_MATS_STATUS = "11";
        EngineerService.ENGINEER_WORKING_STATUS = "internalWorking";
        EngineerService = __decorate([
            aurelia_framework_1.inject(storageService_1.StorageService, fftService_1.FftService, aurelia_event_aggregator_1.EventAggregator, catalogService_1.CatalogService, businessRuleService_1.BusinessRuleService, configurationService_1.ConfigurationService, labelService_1.LabelService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, Object, Object])
        ], EngineerService);
        return EngineerService;
    }());
    exports.EngineerService = EngineerService;
});

//# sourceMappingURL=engineerService.js.map
