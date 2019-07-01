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
define(["require", "exports", "aurelia-binding", "./businessRulesViewModel", "../../business/models/dataState", "../../../common/core/stringHelper", "../../../common/core/objectHelper", "../../business/services/constants/jobServiceConstants", "../../business/services/constants/engineerServiceConstants", "../../../appConstants"], function (require, exports, aurelia_binding_1, businessRulesViewModel_1, dataState_1, stringHelper_1, objectHelper_1, jobServiceConstants_1, engineerServiceConstants_1, appConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditableViewModel = /** @class */ (function (_super) {
        __extends(EditableViewModel, _super);
        function EditableViewModel(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._jobService = jobService;
            _this._engineerService = engineerService;
            _this.canEdit = false;
            _this._subscriptions = [];
            _this.isScrolledBottom = false;
            _this._canEditCancelledJob = false;
            return _this;
        }
        EditableViewModel.prototype.activate = function (params, routeConfig) {
            this.jobId = params.jobId;
            this.isNew = false;
            this._initialDataState = undefined;
            this._lastDataLoadTime = 0;
            // by default a cancelled job (noacess etc) makes all screens canEdit: false.
            // canEditCancelledJob is a route setting we can apply to override this behaviour on a per route basis.
            // example: we don't want the task screens to be disabled (and validation to work) so override these with canEditCancelledJob: true
            if (routeConfig) {
                this._canEditCancelledJob = routeConfig.settings && !!routeConfig.settings.canEditCancelledJob;
                this._currentRouteConfig = routeConfig;
            }
            return _super.prototype.activate.call(this, params, routeConfig);
        };
        EditableViewModel.prototype.canDeactivate = function () {
            var _this = this;
            var wasActivated = this._isActivated;
            return _super.prototype.canDeactivate.call(this)
                .then(function (canDeactivate) {
                if (wasActivated && canDeactivate) {
                    /* We do the save in canDeactivate as deactivate is not called when navigating to another child router (https://github.com/aurelia/router/issues/132),
                     we also check that the view is activated as canDeactivate can get called multiple times as the parent routers are deconstructed */
                    if (_this.canEdit && !_this.isNew) {
                        // do not call this.resetLiveDataState() as the save calls it. This will avoid some dataState flashing
                        return _this.save();
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return canDeactivate;
                }
            });
        };
        EditableViewModel.prototype.attached = function () {
            var _this = this;
            _super.prototype.attached.call(this);
            this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.stateChanged(); }));
            this._subscriptions.push(this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_WORKING_CHANGED, function () { return _this.stateChanged(); }));
            this.stateChanged();
        };
        EditableViewModel.prototype.detached = function () {
            var _this = this;
            return _super.prototype.detached.call(this)
                .then(function () {
                _this._subscriptions.forEach(function (s) { return s.dispose(); });
                _this._subscriptions = [];
                _this.setDataState(undefined);
            });
        };
        EditableViewModel.prototype.setInitialDataState = function (dataStateId, initialDataState) {
            this._initialDataState = initialDataState;
            this.setDataState(initialDataState);
        };
        EditableViewModel.prototype.setNewDataState = function (dataStateGroup) {
            this._dataStateGroup = dataStateGroup;
            this.setDataState(dataState_1.DataState.notVisited);
        };
        EditableViewModel.prototype.getFinalDataState = function () {
            return this._initialDataState === dataState_1.DataState.dontCare && !this._isDirty
                ? dataState_1.DataState.dontCare
                : this.currentDataState;
        };
        EditableViewModel.prototype.load = function () {
            var _this = this;
            return this.loadModel()
                .then(function () {
                /* set the last data load time so that any value bindings don't trigger change events and in turn validation */
                _this._lastDataLoadTime = new Date().getTime();
                return _this.validateAllRules();
            });
        };
        EditableViewModel.prototype.save = function () {
            var _this = this;
            return this.validateAllRules()
                .then(function () {
                _this._logger.debug(objectHelper_1.ObjectHelper.getClassName(_this) + " => save");
                var savePromise = _this.saveModel();
                if (savePromise) {
                    return savePromise.then(function () {
                        return true;
                    });
                }
                else {
                    return false;
                }
            })
                .then(function (hasSaved) {
                if (hasSaved) {
                    _this._logger.debug(objectHelper_1.ObjectHelper.getClassName(_this) + " => hasSaved: true");
                    _this.notifyDataStateChanged();
                    /* only show the confirmation if the data has changed */
                    if (_this._isDirty) {
                        var finalDataState = _this.getFinalDataState();
                        _this.showSaveToast(finalDataState);
                    }
                }
                else {
                    _this._logger.debug(objectHelper_1.ObjectHelper.getClassName(_this) + " => hasSaved: false");
                }
                _this.setDirty(false);
                return true;
            })
                .catch(function (err) {
                _this.showError(err);
                return false;
            });
        };
        EditableViewModel.prototype.undo = function () {
            var _this = this;
            /* set the last data load time so that any value bindings don't trigger change events and in turn validation
            * we redo the validation after the load anyway */
            this._lastDataLoadTime = new Date().getTime();
            this.undoModel();
            return this.loadModel()
                .then(function () {
                _this.setDirty(false);
                return _this.validateAllRules();
            });
        };
        EditableViewModel.prototype.clear = function () {
            var _this = this;
            var objectName = this.getLabel("objectName");
            return this.showConfirmation(this.getLabel("confirmation"), this.getParameterisedLabel("clearQuestion", [objectName]))
                .then(function (result) {
                if (!result.wasCancelled) {
                    /* set the last data load time so that any value bindings don't trigger change events and in turn validation */
                    _this._lastDataLoadTime = new Date().getTime();
                    return _this.clearModel()
                        .then(function () {
                        _this.setDirty(true);
                        return _this.validateAllRules();
                    });
                }
                else {
                    return Promise.resolve();
                }
            });
        };
        EditableViewModel.prototype.notifyDataStateChanged = function () {
            this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED);
        };
        EditableViewModel.prototype.validationToggle = function (enable) {
            _super.prototype.validationToggle.call(this, enable && this.canEdit);
        };
        EditableViewModel.prototype.isValidChanged = function (isValid) {
            if (this._isActivated) {
                this.setDataState(isValid ? dataState_1.DataState.valid : dataState_1.DataState.invalid);
            }
            if (this._isDirty) {
                this._eventAggregator.publish(appConstants_1.AppConstants.APP_SAVING);
            }
        };
        EditableViewModel.prototype.stateChanged = function () {
            var _this = this;
            if (this.jobId) {
                return Promise.all([
                    this._jobService.isJobEditable(this.jobId),
                    this._jobService.getJob(this.jobId),
                    this._engineerService.isWorking()
                ])
                    .then(function (_a) {
                    var isEditable = _a[0], job = _a[1], isWorking = _a[2];
                    var oldEdit = _this.canEdit;
                    _this.canEdit = isEditable && isWorking && (!job.jobNotDoingReason || _this._canEditCancelledJob);
                    if (_this.canEdit && !oldEdit) {
                        /* we have switched to editing mode so validate the form using the initial data state logic */
                        _this.validationToggle(true);
                        return _this.validateAllRules();
                    }
                    else {
                        if (oldEdit === true && !_this.isNew) {
                            /*
                                we were editing and are no longer editing so save any changes and remove any validation errors,
                                unless we are in new mode and the user is completing a job, in which case we do not want to
                                save the current record.
                            */
                            return _this.save()
                                .then(function () { return _this.validationClearDisplay()
                                .then(function () {
                                _this.validationToggle(false);
                                return;
                            }); });
                        }
                    }
                    return undefined;
                })
                    .catch(function () {
                    _this.canEdit = false;
                    _this.validationToggle(false);
                });
            }
            else {
                return Promise.resolve();
            }
        };
        EditableViewModel.prototype.loadModel = function () {
            return Promise.resolve();
        };
        EditableViewModel.prototype.saveModel = function () {
            return undefined;
        };
        EditableViewModel.prototype.clearModel = function () {
            return Promise.resolve();
        };
        EditableViewModel.prototype.undoModel = function () { };
        EditableViewModel.prototype.showSaveToast = function (finalDataState) {
            var objectName = this.getLabel("objectName");
            var msg = this.getParameterisedLabel(stringHelper_1.StringHelper.endsWith(objectName, "s") ? "savedDescriptionPlural" : "savedDescription", [objectName.toLowerCase()]);
            if (finalDataState === dataState_1.DataState.invalid) {
                msg += this.getLabel("savedDataInvalid");
                this.showDanger(this.getLabel("savedTitle"), msg);
            }
            else {
                this.showSuccess(this.getLabel("savedTitle"), msg);
            }
        };
        EditableViewModel.prototype.pageReadyToValidate = function () {
            // .DF_1149 - only validate if the page has loaded and specified its starting dataState
            return (this._initialDataState !== undefined || this._dataStateGroup)
                // do not validate if this is a don't care and the user has not touched it
                && !(this._initialDataState === dataState_1.DataState.dontCare && !this._isDirty);
        };
        EditableViewModel.prototype.setDataState = function (dataState) {
            this.currentDataState = dataState;
            if (this._currentRouteConfig && this._currentRouteConfig.settings) {
                this._currentRouteConfig.settings.currentDataState = dataState;
            }
        };
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", Boolean)
        ], EditableViewModel.prototype, "canEdit", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", Number)
        ], EditableViewModel.prototype, "currentDataState", void 0);
        return EditableViewModel;
    }(businessRulesViewModel_1.BusinessRulesViewModel));
    exports.EditableViewModel = EditableViewModel;
});

//# sourceMappingURL=editableViewModel.js.map
