var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-event-aggregator", "aurelia-dependency-injection", "./constants/uiConstants", "../../core/threading", "./models/toastPosition", "../services/soundService"], function (require, exports, aurelia_templating_1, aurelia_event_aggregator_1, aurelia_dependency_injection_1, uiConstants_1, threading_1, toastPosition_1, soundService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FADE_OUT_TIME = 900;
    var ONE_SECOND_MS = 1000;
    var ToastManager = /** @class */ (function () {
        function ToastManager(eventAggregator, soundService) {
            var _this = this;
            this.toasts = [];
            this._eventAggregator = eventAggregator;
            this._soundService = soundService;
            this._eventAggregator.subscribe(uiConstants_1.UiConstants.TOAST_ADDED, function (toast) {
                if (toast) {
                    var lastToast = _this.toasts.length > 0 && _this.toasts[0];
                    if (!toast.position) {
                        _this.toastPosition = toastPosition_1.ToastPosition[4];
                    }
                    else {
                        _this.toastPosition = toastPosition_1.ToastPosition[toast.position];
                    }
                    if (lastToast && lastToast.content === toast.content) {
                        if (_this._lastCloseDelay) {
                            threading_1.Threading.stopDelay(_this._lastCloseDelay);
                            _this.setUpDelay(lastToast);
                        }
                        if (_this._lastFadeOutDelay) {
                            threading_1.Threading.stopDelay(_this._lastFadeOutDelay);
                        }
                        return;
                    }
                    if (toast.notificationSound) {
                        _this._soundService.play(toast.notificationSound);
                    }
                    _this.toasts.unshift(toast);
                    _this.setUpDelay(toast);
                    _this.setToastAction(toast);
                }
            });
        }
        ToastManager.prototype.closeToast = function (toast) {
            var _this = this;
            toast.style += " fade-out";
            this._lastFadeOutDelay = threading_1.Threading.delay(function () {
                var toastPos = _this.toasts.indexOf(toast);
                if (toastPos >= 0) {
                    _this.toasts.splice(toastPos, 1);
                    if (toast.id) {
                        _this._eventAggregator.publish(uiConstants_1.UiConstants.TOAST_REMOVED, toast);
                    }
                }
            }, FADE_OUT_TIME);
        };
        ToastManager.prototype.setUpDelay = function (toast) {
            var _this = this;
            var autoDismiss = toast.autoDismiss === undefined ? true : toast.autoDismiss;
            if (autoDismiss && toast.dismissTime) {
                this._lastCloseDelay = threading_1.Threading.delay(function () { return _this.closeToast(toast); }, toast.dismissTime * ONE_SECOND_MS);
            }
        };
        ToastManager.prototype.setToastAction = function (toast) {
            var _this = this;
            if (toast.toastAction) {
                if (!toast.toastAction.label) {
                    toast.toastAction.label = "Details";
                }
                if (!toast.toastAction.action) {
                    toast.toastAction.isExpanded = false;
                    toast.toastAction.action = function (t) {
                        if (t) {
                            t.toastAction.isExpanded = !t.toastAction.isExpanded;
                            threading_1.Threading.stopDelay(_this._lastCloseDelay);
                        }
                    };
                }
            }
        };
        ToastManager = __decorate([
            aurelia_templating_1.customElement("toast-manager"),
            aurelia_dependency_injection_1.inject(aurelia_event_aggregator_1.EventAggregator, soundService_1.SoundService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, Object])
        ], ToastManager);
        return ToastManager;
    }());
    exports.ToastManager = ToastManager;
});

//# sourceMappingURL=toastManager.js.map
