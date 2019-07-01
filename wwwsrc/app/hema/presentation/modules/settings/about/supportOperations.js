var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
define(["require", "exports", "aurelia-event-aggregator", "aurelia-dialog", "../../../../business/services/labelService", "aurelia-dependency-injection", "./baseInformation", "../../../../core/services/hemaStorage", "../../../../business/services/referenceDataService", "../../../../../common/ui/dialogs/models/confirmDialogModel", "./dialog/confirmationDialog", "../../../../../common/core/platformHelper", "../../../../business/services/jobService", "../../../../business/models/bridgeDiagnostic", "../../../../business/services/bridgeBusinessService", "../../../../core/windowHelper", "./dialog/informationDialog", "../../../../../common/ui/dialogs/models/infoDialogModel", "../../../../api/services/fftService", "../../../../business/services/supportService", "../../../../../common/analytics/analyticsConstants", "moment"], function (require, exports, aurelia_event_aggregator_1, aurelia_dialog_1, labelService_1, aurelia_dependency_injection_1, baseInformation_1, hemaStorage_1, referenceDataService_1, confirmDialogModel_1, confirmationDialog_1, platformHelper_1, jobService_1, bridgeDiagnostic_1, bridgeBusinessService_1, windowHelper_1, informationDialog_1, infoDialogModel_1, fftService_1, supportService_1, analyticsConstants_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupportOperations = /** @class */ (function (_super) {
        __extends(SupportOperations, _super);
        function SupportOperations(labelService, eventAggregator, dialogService, storage, referenceDataService, jobService, bridgeBusinessService, fftService, supportService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.isExpanded = false;
            _this._storage = storage;
            _this._referenceDataService = referenceDataService;
            _this._jobService = jobService;
            _this._bridgeBusinessService = bridgeBusinessService;
            _this._supportService = supportService;
            _this.platform = platformHelper_1.PlatformHelper.getPlatform();
            _this.bridgeDiagnosticSummary = new bridgeDiagnostic_1.BridgeDiagnostic();
            _this._fftService = fftService;
            return _this;
        }
        SupportOperations.prototype.activateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var lastJob;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._supportService.getLastJobUpdate()];
                        case 1:
                            lastJob = _a.sent();
                            if (lastJob) {
                                this.jobUpdate = JSON.stringify(lastJob, undefined, 2);
                            }
                            return [4 /*yield*/, this.getBridgeDiagnostic()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SupportOperations.prototype.logCurrentJobState = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var feedback, jobId, job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            feedback = function (message) {
                                return _this._dialogService.open({
                                    viewModel: informationDialog_1.InformationDialog,
                                    model: new infoDialogModel_1.InfoDialogModel(_this.getLabel("logJobTitle"), message)
                                });
                            };
                            return [4 /*yield*/, this._jobService.getActiveJobId()];
                        case 1:
                            jobId = _a.sent();
                            if (!jobId) {
                                return [2 /*return*/, feedback(this.getLabel("logJobNoActiveJob"))];
                            }
                            return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 2:
                            job = _a.sent();
                            if (!job) {
                                return [2 /*return*/, feedback(this.getLabel("logJobCantGetJob") + jobId)];
                            }
                            this._logger.warn("Current Job State", job);
                            return [2 /*return*/, feedback(this.getLabel("logJobSuccess") + jobId)];
                    }
                });
            });
        };
        SupportOperations.prototype.getBridgeDiagnostic = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, this._bridgeBusinessService.getDiagnostic()];
                        case 1:
                            _a.bridgeDiagnosticSummary = _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SupportOperations.prototype.removeData = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var buildModel, result, payloads, resultPayloads, error_1, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            buildModel = function (title, text) {
                                var model = new confirmDialogModel_1.ConfirmDialogModel();
                                model.header = _this.getLabel(title);
                                model.text = _this.getLabel(text);
                                return model;
                            };
                            return [4 /*yield*/, this._dialogService.open({
                                    viewModel: confirmationDialog_1.ConfirmationDialog,
                                    model: buildModel("questionTitle", "question")
                                })];
                        case 1:
                            result = _a.sent();
                            if (result.wasCancelled) {
                                return [2 /*return*/];
                            }
                            if (!args.user) return [3 /*break*/, 8];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, , 8]);
                            return [4 /*yield*/, this._fftService.getUnsentPayloads()];
                        case 3:
                            payloads = _a.sent();
                            if (!payloads.length) return [3 /*break*/, 5];
                            return [4 /*yield*/, this._dialogService.open({
                                    viewModel: confirmationDialog_1.ConfirmationDialog,
                                    model: buildModel("haveUnsentPayloadsTitle", "haveUnsentPayloads")
                                })];
                        case 4:
                            resultPayloads = _a.sent();
                            if (resultPayloads.wasCancelled) {
                                return [2 /*return*/];
                            }
                            _a.label = 5;
                        case 5:
                            this._logger.warn("Attempting to clear user data");
                            return [4 /*yield*/, this._storage.clear()];
                        case 6:
                            _a.sent();
                            this.addToAnalytics(analyticsConstants_1.AnalyticsConstants.REMOVE_USER_DATA);
                            return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            this._logger.warn("Error when user storage", error_1);
                            return [3 /*break*/, 8];
                        case 8:
                            if (!args.catalog) return [3 /*break*/, 12];
                            _a.label = 9;
                        case 9:
                            _a.trys.push([9, 11, , 12]);
                            this._logger.warn("Attempting to clear reference data");
                            return [4 /*yield*/, this._referenceDataService.clear()];
                        case 10:
                            _a.sent();
                            this.addToAnalytics(analyticsConstants_1.AnalyticsConstants.REMOVE_CATALOG_DATA);
                            return [3 /*break*/, 12];
                        case 11:
                            error_2 = _a.sent();
                            // we have seen that even though db is deleted, a "blocked" error may still be thrown
                            this._logger.warn("Error when clearing catalog", error_2);
                            return [3 /*break*/, 12];
                        case 12:
                            this._logger.warn("About to reload ...");
                            // give the logger time to flush to disk
                            return [4 /*yield*/, Promise.delay(500)];
                        case 13:
                            // give the logger time to flush to disk
                            _a.sent();
                            windowHelper_1.WindowHelper.reload();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SupportOperations.prototype.copy = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (_this.populateHiddenText()) {
                    _this.hiddenText.select();
                    try {
                        var supported = document.queryCommandSupported("copy");
                        if (supported) {
                            document.execCommand("copy");
                        }
                        _this.clearHiddenText();
                        resolve();
                    }
                    catch (err) {
                        _this.clearHiddenText();
                        resolve();
                    }
                }
                else {
                    resolve();
                }
            });
        };
        SupportOperations.prototype.addToAnalytics = function (category) {
            try {
                this._eventAggregator.publish(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, {
                    category: category,
                    action: analyticsConstants_1.AnalyticsConstants.CLICK_ACTION,
                    label: moment().format(analyticsConstants_1.AnalyticsConstants.DATE_TIME_FORMAT),
                    metric: analyticsConstants_1.AnalyticsConstants.METRIC
                });
            }
            catch (_a) {
                // do nothing
            }
        };
        SupportOperations.prototype.populateHiddenText = function () {
            var flag = false;
            if (this.hiddenText) {
                this.hiddenText.innerText = this.jobUpdate;
                flag = true;
            }
            return flag;
        };
        SupportOperations.prototype.clearHiddenText = function () {
            if (this.hiddenText) {
                this.hiddenText.innerText = " ";
            }
        };
        SupportOperations = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, hemaStorage_1.HemaStorage, referenceDataService_1.ReferenceDataService, jobService_1.JobService, bridgeBusinessService_1.BridgeBusinessService, fftService_1.FftService, supportService_1.SupportService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, Object])
        ], SupportOperations);
        return SupportOperations;
    }(baseInformation_1.BaseInformation));
    exports.SupportOperations = SupportOperations;
});

//# sourceMappingURL=supportOperations.js.map
