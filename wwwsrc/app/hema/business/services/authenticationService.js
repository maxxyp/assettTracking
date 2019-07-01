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
define(["require", "exports", "aurelia-framework", "../../api/services/whoAmIService", "./constants/whoAmIServiceConstants", "aurelia-logging", "../../../common/core/services/configurationService", "../../../common/core/threading", "aurelia-event-aggregator", "../constants/initialisationEventConstants", "./authenticationServiceConstants"], function (require, exports, aurelia_framework_1, whoAmIService_1, whoAmIServiceConstants_1, Logging, configurationService_1, threading_1, aurelia_event_aggregator_1, initialisationEventConstants_1, authenticationServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WHO_AM_I_ATTRIBUTES = whoAmIServiceConstants_1.WhoAmIServiceConstants.WHO_AM_I_ATTRIBUTES;
    var TIMEOUT_ERROR = "TimeoutError";
    var WhoAmICallResultType;
    (function (WhoAmICallResultType) {
        WhoAmICallResultType[WhoAmICallResultType["success"] = 0] = "success";
        WhoAmICallResultType[WhoAmICallResultType["timeout"] = 1] = "timeout";
        WhoAmICallResultType[WhoAmICallResultType["httpError"] = 2] = "httpError";
    })(WhoAmICallResultType || (WhoAmICallResultType = {}));
    var AuthenticationService = /** @class */ (function () {
        function AuthenticationService(configurationService, whoAmIService, eventAggregator, authenticationServiceConstants) {
            this._configurationService = configurationService;
            this._whoAmIService = whoAmIService;
            this._eventAggregator = eventAggregator;
            this._authenticationServiceConstants = authenticationServiceConstants;
            this._logger = Logging.getLogger("EngineerAuthentication");
        }
        AuthenticationService.prototype.authenticate = function (category, isCurrentlySignedOn) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.pollWhoAmI(category, isCurrentlySignedOn)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, { hasWhoAmISucceeded: true, result: result }];
                        case 2:
                            error_1 = _a.sent();
                            return [2 /*return*/, { hasWhoAmISucceeded: false }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthenticationService.prototype.pollWhoAmI = function (category, isCurrentlySignedOn) {
            return __awaiter(this, void 0, void 0, function () {
                var config, timeoutPollingAttempts, timeoutSecs, allowedRoles, timeoutAttemptIndex, whoAmIResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = this._configurationService.getConfiguration() || {};
                            timeoutPollingAttempts = config.whoAmITimeoutRetries || 1;
                            timeoutSecs = Math.round(config.whoAmITimeoutMs || this._authenticationServiceConstants.DEFAULT_TIME_OUT_MS) / 1000;
                            allowedRoles = config.activeDirectoryRoles || [];
                            timeoutAttemptIndex = 1;
                            _a.label = 1;
                        case 1:
                            if (!true) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.makeWhoAmICall(category, timeoutSecs, allowedRoles)];
                        case 2:
                            whoAmIResult = _a.sent();
                            if (whoAmIResult.resultType === WhoAmICallResultType.success) {
                                // a success
                                return [2 /*return*/, whoAmIResult.whoAmI];
                            }
                            else if (isCurrentlySignedOn) {
                                // a failure, but we are currently signed on so don't bother polling more
                                throw whoAmIResult.error;
                            }
                            else {
                                // observe the polling attempt counter to see how long we go for
                                if (timeoutAttemptIndex >= timeoutPollingAttempts) {
                                    throw whoAmIResult.error;
                                }
                                timeoutAttemptIndex += 1;
                            }
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthenticationService.prototype.makeWhoAmICall = function (category, timeoutSecs, allowedRoles) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var timerId, startFeedingback, stopFeedingback, whoAmI, error_2, isTimeoutError;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startFeedingback = function () {
                                _this._eventAggregator.publish(initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_CATEGORY, {
                                    category: category,
                                    item: "Contacting Authorisation Server. Please wait... (" + timeoutSecs + " seconds remaining)",
                                    progressValue: 0,
                                    progressMax: timeoutSecs
                                });
                                var secondsElapsed = 0;
                                timerId = threading_1.Threading.startTimer(function () {
                                    secondsElapsed += 1;
                                    _this._eventAggregator.publish(initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_UPDATE, {
                                        item: "Contacting Authorisation Server. Please wait... (" + (timeoutSecs - secondsElapsed) + " seconds remaining)",
                                        progressValue: secondsElapsed
                                    });
                                }, _this._authenticationServiceConstants.FEEDBACK_INTERVAL_MS);
                            };
                            stopFeedingback = function (resultType) { return __awaiter(_this, void 0, void 0, function () {
                                var reasonText;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            threading_1.Threading.stopTimer(timerId);
                                            reasonText = "";
                                            switch (resultType) {
                                                case WhoAmICallResultType.timeout:
                                                    reasonText = "Failed - server did not respond within " + timeoutSecs + " seconds. Please wait...";
                                                    break;
                                                case WhoAmICallResultType.httpError:
                                                    reasonText = "Failed - server returned an error. Please wait...";
                                                    break;
                                                case WhoAmICallResultType.success:
                                                    reasonText = "Succeeded";
                                                    break;
                                            }
                                            this._eventAggregator.publish(initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_UPDATE, {
                                                item: "Attempt " + reasonText,
                                                progressValue: timeoutSecs
                                            });
                                            return [4 /*yield*/, Promise.delay(resultType === WhoAmICallResultType.success
                                                    ? this._authenticationServiceConstants.SUCCESS_WAIT_MS
                                                    : this._authenticationServiceConstants.FAIL_WAIT_MS)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 6]);
                            startFeedingback();
                            return [4 /*yield*/, this._whoAmIService.whoAmI(WHO_AM_I_ATTRIBUTES, allowedRoles)
                                    .timeout(timeoutSecs * 1000)];
                        case 2:
                            whoAmI = _a.sent();
                            return [4 /*yield*/, stopFeedingback(WhoAmICallResultType.success)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { resultType: WhoAmICallResultType.success, whoAmI: whoAmI }];
                        case 4:
                            error_2 = _a.sent();
                            isTimeoutError = error_2 && error_2.name === TIMEOUT_ERROR;
                            this._logger.warn("Unable to reach whoAmIService", { isTimeoutError: isTimeoutError, error: error_2 });
                            return [4 /*yield*/, stopFeedingback(isTimeoutError
                                    ? WhoAmICallResultType.timeout
                                    : WhoAmICallResultType.httpError)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    resultType: isTimeoutError
                                        ? WhoAmICallResultType.timeout
                                        : WhoAmICallResultType.httpError,
                                    error: error_2
                                }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        AuthenticationService = __decorate([
            aurelia_framework_1.inject(configurationService_1.ConfigurationService, whoAmIService_1.WhoAmIService, aurelia_event_aggregator_1.EventAggregator, authenticationServiceConstants_1.AuthenticationServiceConstants),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator,
                authenticationServiceConstants_1.AuthenticationServiceConstants])
        ], AuthenticationService);
        return AuthenticationService;
    }());
    exports.AuthenticationService = AuthenticationService;
});

//# sourceMappingURL=authenticationService.js.map
