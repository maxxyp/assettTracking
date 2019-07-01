/// <reference path="../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "../../business/services/engineerService", "../../business/services/labelService", "../../../common/core/objectHelper", "../../../common/core/stringHelper", "aurelia-event-aggregator", "../../business/services/businessRuleService", "../../business/services/jobService", "../../business/models/jobState", "../../business/services/constants/engineerServiceConstants", "../../business/services/constants/jobServiceConstants", "../../../common/core/services/configurationService", "../../business/services/constants/catalogConstants", "aurelia-router", "../../api/services/fftService", "aurelia-dialog", "../../../common/ui/dialogs/models/errorDialogModel", "../../../common/ui/dialogs/errorDialog", "../../business/services/archiveService", "../../../common/ui/dialogs/infoDialog", "../../../common/ui/dialogs/models/infoDialogModel", "../modules/eod/endOfDayFail", "../../business/services/constants/userPreferenceConstants", "../../business/services/storageService", "../constants/engineerDialogConstants", "../../business/services/messageService", "../../business/services/constants/archiveConstants", "../../../common/analytics/analytics", "../../../common/analytics/analyticsCustomDimentions", "../../api/services/vanStockService", "../../business/services/vanStockService", "../../business/services/featureToggleService"], function (require, exports, aurelia_framework_1, engineerService_1, labelService_1, objectHelper_1, stringHelper_1, aurelia_event_aggregator_1, businessRuleService_1, jobService_1, jobState_1, engineerServiceConstants_1, jobServiceConstants_1, configurationService_1, catalogConstants_1, aurelia_router_1, fftService_1, aurelia_dialog_1, errorDialogModel_1, errorDialog_1, archiveService_1, infoDialog_1, infoDialogModel_1, endOfDayFail_1, userPreferenceConstants_1, storageService_1, engineerDialogConstants_1, messageService_1, archiveConstants_1, analytics_1, analyticsCustomDimentions_1, vanStockService_1, vanStockService_2, featureToggleService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EngineerState = /** @class */ (function () {
        function EngineerState(engineerService, jobService, labelService, businessRuleService, eventAggregator, configurationService, router, fftService, vanStockService, dialogService, archiveService, storageService, messageService, analytics, featureToggleService, businessVanStockService) {
            this.engineerService = engineerService;
            this._labelService = labelService;
            this._jobService = jobService;
            this._businessRuleService = businessRuleService;
            this._messageService = messageService;
            this._eventAggregator = eventAggregator;
            this.catalog = catalogConstants_1.CatalogConstants;
            this.engineerStatuses = [];
            this.canChangeEngineerStatus = true;
            this._subscriptions = [];
            this._router = router;
            this._fftService = fftService;
            this._vanStockService = vanStockService;
            this._dialogService = dialogService;
            var hemaConfiguration = configurationService.getConfiguration();
            if (hemaConfiguration) {
                this._alwaysAllowSignOff = hemaConfiguration.alwaysAllowSignOff;
            }
            else {
                this._alwaysAllowSignOff = false;
            }
            this._archiveService = archiveService;
            this._storageService = storageService;
            this._featureToggleService = featureToggleService;
            this._businessVanStockService = businessVanStockService;
            this._analytics = analytics;
        }
        EngineerState.prototype.attached = function () {
            var _this = this;
            this._subscriptions.push(this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_STATUS_CHANGED, function () { return _this.engineerUpdateStatus(); }));
            this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.engineerUpdateStatus()
                .then(function () { return _this.updateJobState(); }); }));
            this._subscriptions.push(this._eventAggregator.subscribe(userPreferenceConstants_1.UserPreferenceConstants.USER_PREFERENCES_CHANGED, function (engineer) {
                _this._analytics.setCustomMetaData(engineer, {
                    engineerType: analyticsCustomDimentions_1.ENGINEER_TYPE_DIEMENTION1,
                    engineerPatch: analyticsCustomDimentions_1.ENGINEER_PATCH_DIEMENTION2,
                    engineerRegion: analyticsCustomDimentions_1.ENGINEER_REGION_DIEMENTION3
                });
                _this.userSettingsToggle();
            }));
            this.userSettingsToggle();
            return this._businessRuleService.getRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(engineerService_1.EngineerService)))
                .then(function (engineerServiceBusinessRules) {
                return _this._labelService.getGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(_this)))
                    .then(function (labels) {
                    _this.labels = labels;
                    _this._workingStatus = {};
                    _this._workingStatus.fieldOperativeStatus = "internalWorking";
                    _this._workingStatus.fieldOperativeStatusDescription = objectHelper_1.ObjectHelper.getPathValue(labels, "working");
                    _this._notWorkingStatus = {};
                    _this._notWorkingStatus.fieldOperativeStatus = "internalNotWorking";
                    _this._notWorkingStatus.fieldOperativeStatusDescription = objectHelper_1.ObjectHelper.getPathValue(labels, "notWorking");
                    return _this.engineerService.getAllStatus()
                        .then(function (data) {
                        var signOnId = objectHelper_1.ObjectHelper.getPathValue(engineerServiceBusinessRules, "signOnId");
                        _this._signOffId = objectHelper_1.ObjectHelper.getPathValue(engineerServiceBusinessRules, "signOffId");
                        _this._signOnStatus = data.find(function (es) { return es.fieldOperativeStatus === signOnId; });
                        _this._signOffStatus = data.find(function (es) { return es.fieldOperativeStatus === _this._signOffId; });
                        if (!_this._signOnStatus) {
                            _this._signOnStatus = {};
                            _this._signOnStatus.fieldOperativeStatus = signOnId;
                            _this._signOnStatus.fieldOperativeStatusDescription = objectHelper_1.ObjectHelper.getPathValue(labels, "signOn");
                        }
                        if (!_this._signOffStatus) {
                            _this._signOffStatus = {};
                            _this._signOffStatus.fieldOperativeStatus = _this._signOffId;
                            _this._signOffStatus.fieldOperativeStatusDescription = objectHelper_1.ObjectHelper.getPathValue(labels, "signOff");
                        }
                        var minId = +objectHelper_1.ObjectHelper.getPathValue(engineerServiceBusinessRules, "minId");
                        _this._allStatuses = data.filter(function (fos) { return +fos.fieldOperativeStatus >= minId && fos.fieldOperativeStatus !== signOnId && fos.fieldOperativeStatus !== _this._signOffId; });
                    })
                        .then(function () { return _this.engineerUpdateStatus(); })
                        .then(function () { return _this.updateJobState(); });
                });
            });
        };
        EngineerState.prototype.detached = function () {
            this._subscriptions.forEach(function (sub) { return sub.dispose(); });
            this._subscriptions = [];
        };
        EngineerState.prototype.engineerStateChanged = function (newValue, oldValue) {
            var _this = this;
            if (this._subscriptions.length === 0) {
                return Promise.resolve();
            }
            if (newValue === this._lastKnownHandledEngineerState) {
                // we are resetting from within this handler so do not trigger the actual business logic
                return Promise.resolve();
            }
            // a standard status change...
            if (newValue !== this._signOffId) {
                // 'working' is followed immeditately by 'ready for work' status
                // meaning 'ready for work' will always be zero.
                // hence we exclude it from archive
                return this._businessRuleService.getRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(engineerService_1.EngineerService)))
                    .then(function (engineerServiceBusinessRules) {
                    var signOnId = objectHelper_1.ObjectHelper.getPathValue(engineerServiceBusinessRules, "signOnId");
                    return _this.setPartsCollectionProgress()
                        .then(function () { return _this.engineerService.setStatus(newValue === "internalWorking" || newValue === "internalNotWorking" ? undefined : newValue); })
                        .then(function () { return _this.addToArchive(newValue === "internalNotWorking" || newValue === signOnId ? undefined : newValue); })
                        .then(function () { return _this._lastKnownHandledEngineerState = newValue; })
                        .thenReturn();
                });
            }
            // ... otherwise we are trying to sign off for the day
            if (this._messageService.unreadCount > 0) {
                return this.showEndOfDayErrorDialog(engineerDialogConstants_1.EngineerDialogConstants.END_OF_DAY_MESSAGE_UNREAD)
                    .then(function () { return _this.engineerState = oldValue; })
                    .thenReturn();
            }
            return this.hasUnsentPayloads()
                .then(function (hasUnsentPayloads) {
                if (hasUnsentPayloads) {
                    return _this.showEndOfDayErrorDialog(engineerDialogConstants_1.EngineerDialogConstants.END_OF_DAY_MESSAGE_UNSENT)
                        .then(function () { return _this.engineerState = oldValue; })
                        .thenReturn();
                }
                else {
                    // good to go
                    return _this.engineerService.setStatus(newValue)
                        .then(function () { return _this.showEndOfDaySuccessDialog(); })
                        .then(function () { return _this.addToArchive(newValue); })
                        .then(function () { return _this._lastKnownHandledEngineerState = newValue; })
                        .thenReturn()
                        .catch(function () { return _this.showEndOfDayRetryDialog()
                        .then(function (result) {
                        if (result.output) {
                            // retry immediately
                            _this.engineerStateChanged(newValue, oldValue);
                        }
                        else {
                            // let the user escape from infinite loop if no network
                            _this.engineerState = oldValue;
                        }
                    }); });
                }
            });
        };
        EngineerState.prototype.addToArchive = function (state) {
            var _this = this;
            if (state) {
                return this._jobService.getActiveJobId().then(function (jobId) {
                    return _this.engineerService.getCurrentEngineer().then(function (engineer) {
                        if (engineer && engineer.id) {
                            return _this._archiveService.addEngineerState(engineer, state, jobId)
                                .then(function () { return _this._eventAggregator.publish(archiveConstants_1.ArchiveConstants.ARCHIVE_UPDATED); });
                        }
                        else {
                            return Promise.resolve();
                        }
                    });
                });
            }
            return Promise.resolve();
        };
        EngineerState.prototype.engineerUpdateStatus = function () {
            var _this = this;
            return this.engineerService.isSignedOn()
                .then(function (isSignedOn) {
                _this.updateStatus(isSignedOn);
                return _this.areAllJobsDone().then(function (alldone) {
                    return _this.engineerService.isWorking()
                        .then(function (isWorking) {
                        _this.isSignedOn = isSignedOn;
                        _this.engineerStatuses = [];
                        if (!isSignedOn) {
                            _this.engineerStatuses.push(_this._notWorkingStatus);
                            if (_this._signOnStatus) {
                                _this.engineerStatuses.push(_this._signOnStatus);
                            }
                            _this.engineerState = _this._notWorkingStatus.fieldOperativeStatus;
                            return undefined;
                        }
                        else {
                            _this.engineerStatuses.push(_this._workingStatus);
                            _this.engineerStatuses = _this.engineerStatuses.concat(_this._allStatuses);
                            if (_this._signOffStatus && alldone === true) {
                                _this.engineerStatuses.push(_this._signOffStatus);
                            }
                            if (isWorking) {
                                _this.engineerState = _this._workingStatus.fieldOperativeStatus;
                                return undefined;
                            }
                            else {
                                return _this.engineerService.getStatus()
                                    .then(function (status) {
                                    if (status) {
                                        var state = _this.engineerStatuses.find(function (es) { return es.fieldOperativeStatus === status; });
                                        if (state) {
                                            _this.engineerState = state.fieldOperativeStatus;
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            });
        };
        EngineerState.prototype.updateJobState = function () {
            var _this = this;
            /* if there is no active job then we are allowed to change the engineer status */
            return this._jobService.getActiveJobId()
                .then(function (activeJobId) {
                if (activeJobId) {
                    return _this._jobService.getJobState(activeJobId)
                        .then(function (jobState) {
                        if (jobState) {
                            _this.canChangeEngineerStatus = false;
                            if (jobState.value === jobState_1.JobState.complete) {
                                _this._router.navigateToRoute("customers");
                            }
                        }
                        else {
                            _this.canChangeEngineerStatus = true;
                        }
                    });
                }
                else {
                    _this.canChangeEngineerStatus = true;
                    return undefined;
                }
            });
        };
        EngineerState.prototype.areAllJobsDone = function () {
            if (this._alwaysAllowSignOff === false) {
                return this._jobService.areAllJobsDone();
            }
            else {
                return Promise.resolve(true);
            }
        };
        EngineerState.prototype.updateStatus = function (isSignedOn) {
            if (this.labels) {
                var myStatus = "myStatus";
                var signInHere = "signInHere";
                if (isSignedOn) {
                    this.myStatusLabel = this.labels[myStatus];
                }
                else {
                    this.myStatusLabel = this.labels[signInHere];
                }
            }
        };
        EngineerState.prototype.hasUnsentPayloads = function () {
            return __awaiter(this, void 0, void 0, function () {
                var payloads, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this._fftService.getUnsentPayloads()];
                        case 1:
                            _b = (_a = (_c.sent())).concat;
                            return [4 /*yield*/, this._vanStockService.getUnsentPayloads()];
                        case 2:
                            payloads = _b.apply(_a, [_c.sent()]);
                            if (payloads && payloads.length > 0) {
                                return [2 /*return*/, true];
                            }
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        EngineerState.prototype.showEndOfDaySuccessDialog = function () {
            var model = new infoDialogModel_1.InfoDialogModel(this.labels[engineerDialogConstants_1.EngineerDialogConstants.SIGN_OFF], this.labels[engineerDialogConstants_1.EngineerDialogConstants.END_OF_DAY_MESSAGE_SUCCESS]);
            return this._dialogService.open({ viewModel: infoDialog_1.InfoDialog, model: model });
        };
        EngineerState.prototype.showEndOfDayRetryDialog = function () {
            var model = new errorDialogModel_1.ErrorDialogModel();
            model.errorMessage = this.labels[engineerDialogConstants_1.EngineerDialogConstants.END_OF_DAY_MESSAGE_RETRY];
            model.header = this.labels[engineerDialogConstants_1.EngineerDialogConstants.SIGN_OFF];
            return this._dialogService.open({ viewModel: endOfDayFail_1.EndOfDayFail, model: model });
        };
        EngineerState.prototype.showEndOfDayErrorDialog = function (errorMessage) {
            var model = new errorDialogModel_1.ErrorDialogModel();
            model.errorMessage = this.labels[errorMessage];
            model.header = this.labels[engineerDialogConstants_1.EngineerDialogConstants.SIGN_OFF];
            return this._dialogService.open({ viewModel: errorDialog_1.ErrorDialog, model: model });
        };
        EngineerState.prototype.userSettingsToggle = function () {
            var _this = this;
            this._storageService.userSettingsComplete().then(function (complete) {
                if (complete) {
                    _this.userSettingsComplete = true;
                }
                else {
                    _this.userSettingsComplete = false;
                }
            });
        };
        EngineerState.prototype.setPartsCollectionProgress = function () {
            return __awaiter(this, void 0, void 0, function () {
                var existsPartsToCollect, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(this.engineerState === engineerService_1.EngineerService.OBTAINING_MATS_STATUS && !this.engineerService.isPartCollectionInProgress)) return [3 /*break*/, 5];
                            if (!this._featureToggleService.isAssetTrackingEnabled()) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._businessVanStockService.getPartsToCollect()];
                        case 1:
                            _a = (_b.sent()).toCollect.length > 0;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this._jobService.getPartsCollections()];
                        case 3:
                            _a = ((_b.sent()) || []).some(function (partCollection) { return !partCollection.done; });
                            _b.label = 4;
                        case 4:
                            existsPartsToCollect = _a;
                            if (existsPartsToCollect) {
                                // force the user to exit OBTAING MATS by using the parts collection UI
                                this.engineerService.isPartCollectionInProgress = true;
                            }
                            _b.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], EngineerState.prototype, "engineerState", void 0);
        EngineerState = __decorate([
            aurelia_framework_1.customElement("engineer-state"),
            aurelia_framework_1.inject(engineerService_1.EngineerService, jobService_1.JobService, labelService_1.LabelService, businessRuleService_1.BusinessRuleService, aurelia_event_aggregator_1.EventAggregator, configurationService_1.ConfigurationService, aurelia_router_1.Router, fftService_1.FftService, vanStockService_1.VanStockService, aurelia_dialog_1.DialogService, archiveService_1.ArchiveService, storageService_1.StorageService, messageService_1.MessageService, analytics_1.Analytics, featureToggleService_1.FeatureToggleService, vanStockService_2.VanStockService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, aurelia_router_1.Router, Object, Object, aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, Object])
        ], EngineerState);
        return EngineerState;
    }());
    exports.EngineerState = EngineerState;
});

//# sourceMappingURL=engineerState.js.map
