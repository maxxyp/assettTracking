define(["require", "exports", "aurelia-logging", "aurelia-dependency-injection", "../elements/viewModelState", "../../../common/core/models/baseException", "../../business/models/businessException", "../../../common/core/guid", "../../../common/core/objectHelper", "../../../common/core/stringHelper", "../modules/confirmation/confirmation", "../../business/services/constants/catalogConstants", "../../../appConstants", "../../business/services/storageService"], function (require, exports, Logging, aurelia_dependency_injection_1, viewModelState_1, baseException_1, businessException_1, guid_1, objectHelper_1, stringHelper_1, confirmation_1, catalogConstants_1, appConstants_1, storageService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseViewModel = /** @class */ (function () {
        function BaseViewModel(labelService, eventAggregator, dialogService) {
            var _this = this;
            this._labelService = labelService;
            this._eventAggregator = eventAggregator;
            this._dialogService = dialogService;
            this._logger = Logging.getLogger(objectHelper_1.ObjectHelper.getClassName(this));
            this.catalog = catalogConstants_1.CatalogConstants;
            this._isCleanInstance = true;
            this._isActivated = false;
            this.labels = {};
            this.showBusy("Loading, please wait...");
            this._activateAsync = Promise.resolve(null);
            var storage = aurelia_dependency_injection_1.Container.instance.get(storageService_1.StorageService);
            storage.getAppSettings()
                .then(function (settings) {
                if (settings) {
                    _this.appSettings = settings;
                }
            });
        }
        BaseViewModel.prototype.showBusy = function (message) {
            this.viewState = viewModelState_1.ViewModelState.busy;
            this.viewStateText = message;
        };
        BaseViewModel.prototype.showContent = function () {
            this.viewState = viewModelState_1.ViewModelState.content;
            this.viewStateText = "";
        };
        BaseViewModel.prototype.scrollToTop = function () {
            this._scrollableContainer.scrollTop = 0;
        };
        BaseViewModel.prototype.showError = function (exception) {
            var exceptionText = "";
            if (exception === null || exception === undefined) {
                exceptionText = "A problem has occurred, we were unable to identify any additional details.";
            }
            else if (exception instanceof baseException_1.BaseException) {
                exceptionText = exception.toString();
            }
            else {
                if (exception.message && exception.stack) {
                    exceptionText = exception.message + "\n" + exception.stack;
                }
                else {
                    exceptionText = exception;
                }
            }
            this.showDanger(this.getLabel("errorTitle"), this.getLabel("errorDescription"), exceptionText, 0);
            this._logger.error(exception && exception.toString());
        };
        BaseViewModel.prototype.showDanger = function (title, message, details, dismissTime) {
            return this.showToast(title, message, "danger", details, dismissTime);
        };
        BaseViewModel.prototype.showSuccess = function (title, message, details, dismissTime) {
            return this.showToast(title, message, "success", details, dismissTime);
        };
        BaseViewModel.prototype.showInfo = function (title, message, details, dismissTime) {
            return this.showToast(title, message, "info", details, dismissTime);
        };
        BaseViewModel.prototype.showWarning = function (title, message, details, dismissTime) {
            return this.showToast(title, message, "warning", details, dismissTime);
        };
        BaseViewModel.prototype.showToast = function (title, message, style, details, dismissTime) {
            var toastItem = {
                id: guid_1.Guid.newGuid(),
                title: title,
                content: message,
                style: style,
                dismissTime: dismissTime !== undefined ? dismissTime : 2.25
            };
            if (details) {
                toastItem.toastAction = { details: details };
            }
            this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, toastItem);
            return toastItem.id;
        };
        BaseViewModel.prototype.showConfirmation = function (title, message, yesLabel, noLabel) {
            if (!yesLabel) {
                yesLabel = this.getLabel("yes");
            }
            if (!noLabel) {
                noLabel = this.getLabel("no");
            }
            return this._dialogService.open({ viewModel: confirmation_1.Confirmation, model: { title: title, message: message, yesLabel: yesLabel, noLabel: noLabel } });
        };
        BaseViewModel.prototype.showDeleteConfirmation = function () {
            var title = this.getLabel("confirmation");
            var objectName = this.getLabel("objectName");
            if (stringHelper_1.StringHelper.endsWith(objectName, "ies")) {
                objectName = objectName.substr(0, objectName.length - 3) + "y";
            }
            if (stringHelper_1.StringHelper.endsWith(objectName, "s")) {
                objectName = objectName.substr(0, objectName.length - 1);
            }
            var deleteContent = this.getParameterisedLabel("deleteQuestion", [objectName.toLowerCase()]);
            return this.showConfirmation(title, deleteContent)
                .then(function (dialogResult) {
                return !dialogResult.wasCancelled;
            });
        };
        BaseViewModel.prototype.canActivate = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            this._logger.debug(objectHelper_1.ObjectHelper.getClassName(this) + " => canActivate");
            return this.canActivateAsync.apply(this, rest);
        };
        BaseViewModel.prototype.activate = function () {
            var _this = this;
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            this._logger.debug(objectHelper_1.ObjectHelper.getClassName(this) + " => activate");
            this._isActivated = true;
            var router = rest.length > 1 && rest[1] && rest[1].navModel && rest[1].navModel.router;
            if (router) {
                var viewPorts = router.viewPorts;
                this.element = viewPorts && viewPorts.default && viewPorts.default.element;
                this._scrollableContainer = this.findScrollableViewPort(router);
            }
            return this.loadLabels(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this))).then(function () {
                _this._activateAsync = _this.activateAsync.apply(_this, rest);
                if (_this._activateAsync) {
                    _this._activateAsync.then(function () {
                        _this._isCleanInstance = false;
                    }).catch(function (error) {
                        _this.showError(error);
                    });
                }
            }).catch(function (error) {
                _this.showError(error);
            });
        };
        BaseViewModel.prototype.attached = function () {
            var _this = this;
            this._logger.debug(objectHelper_1.ObjectHelper.getClassName(this) + " => attached");
            var ret = this.attachedAsync();
            if (ret) {
                ret.catch(function (error) {
                    _this.showError(error);
                });
            }
        };
        BaseViewModel.prototype.detached = function () {
            var _this = this;
            this._logger.debug(objectHelper_1.ObjectHelper.getClassName(this) + " => detached");
            var ret = this.detachedAsync();
            if (ret) {
                ret.catch(function (error) {
                    _this.showError(error);
                });
            }
            return Promise.resolve();
        };
        BaseViewModel.prototype.canDeactivate = function () {
            var _this = this;
            /* only do canDeactivate logic if the view is activated */
            if (this._isActivated) {
                this._logger.debug(objectHelper_1.ObjectHelper.getClassName(this) + " => canDeactivate");
                /*
                    We keep the this._activateAsync reference to the this.activateAsync(...rest) promise that is fired off in activate.
                    That promise is not part of its parent promise chain.  In our screens save() is called during
                    deactivate (beacause of our "save on page navigate away" approach).  If a navigation is made too quickly, it
                    may fire off the save() code before activateAsync completes - resulting in uncertain behaviour and
                    most likely null exceptions as models may not be loaded.  So here we chain off the activateAsync promise to ensure
                    that that has completed before the save logic fires.
                */
                return this._activateAsync
                    .catch(function () { }) // if this._activateAsync falls over, we still want to let the user get away from this page
                    .then(function () { return _this.canDeactivateAsync(); })
                    .then(function (canDeactivate) {
                    if (canDeactivate) {
                        _this._isActivated = false;
                    }
                    return canDeactivate;
                });
            }
            else {
                return Promise.resolve(true);
            }
        };
        BaseViewModel.prototype.deactivate = function () {
            var _this = this;
            this._logger.debug(objectHelper_1.ObjectHelper.getClassName(this) + " => deactivate");
            var ret = this.deactivateAsync();
            if (ret) {
                ret.catch(function (error) {
                    _this.showError(error);
                });
            }
            return ret;
        };
        BaseViewModel.prototype.canActivateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return Promise.resolve(true);
        };
        BaseViewModel.prototype.activateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return Promise.resolve();
        };
        BaseViewModel.prototype.attachedAsync = function () {
            return Promise.resolve();
        };
        BaseViewModel.prototype.detachedAsync = function () {
            return Promise.resolve();
        };
        BaseViewModel.prototype.canDeactivateAsync = function () {
            return Promise.resolve(true);
        };
        BaseViewModel.prototype.deactivateAsync = function () {
            return Promise.resolve();
        };
        BaseViewModel.prototype.getLabel = function (labelId) {
            if (!(labelId in this.labels)) {
                throw new businessException_1.BusinessException(this, "getLabel", "Unable to get label '{0}' for viewModel '{1}'", [labelId, objectHelper_1.ObjectHelper.getClassName(this)], null);
            }
            return this.labels[labelId];
        };
        BaseViewModel.prototype.getParameterisedLabel = function (labelId, parameters) {
            if (!(labelId in this.labels)) {
                throw new businessException_1.BusinessException(this, "getParameterisedLabel", "Unable to get label '{0}' for viewModel '{1}'", [labelId, objectHelper_1.ObjectHelper.getClassName(this)], null);
            }
            var labelText = this.labels[labelId];
            if (parameters && parameters.length > 0) {
                return labelText.replace(/{(\d+)}/g, function (match, idx) {
                    return parameters[idx];
                });
            }
            else {
                return labelText;
            }
        };
        BaseViewModel.prototype.loadLabels = function (groupName) {
            var _this = this;
            return !this._labelService ? Promise.resolve() : this._labelService.getGroup(groupName)
                .then(function (labels) { return _this.attachLabels(labels); });
        };
        BaseViewModel.prototype.attachLabels = function (labels) {
            if (!labels) {
                return;
            }
            for (var labelKey in labels) {
                this.labels[labelKey] = this.labels[labelKey] || labels[labelKey];
            }
        };
        BaseViewModel.prototype.findScrollableViewPort = function (router) {
            var viewPorts = router.viewPorts;
            var element = viewPorts && viewPorts.default && viewPorts.default.element;
            if (element) {
                var style = getComputedStyle(element);
                var excludeStaticParent = style.position === "absolute";
                var overflowRegex = /(auto|scroll)/;
                if (style.position === "fixed") {
                    return document.body;
                }
                if (excludeStaticParent && style.position === "static") {
                    if (router.parent) {
                        return this.findScrollableViewPort(router.parent);
                    }
                    else {
                        return null;
                    }
                }
                if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
                    return element;
                }
            }
            if (router.parent) {
                return this.findScrollableViewPort(router.parent);
            }
            return null;
        };
        return BaseViewModel;
    }());
    exports.BaseViewModel = BaseViewModel;
});

//# sourceMappingURL=baseViewModel.js.map
