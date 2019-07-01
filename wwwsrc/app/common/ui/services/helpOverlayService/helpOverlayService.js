var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../../core/threading", "../../../core/services/assetService", "./helpOverlayConfig", "./helpOverlayStep", "aurelia-router", "aurelia-event-aggregator", "../../../analytics/analyticsConstants"], function (require, exports, aurelia_framework_1, threading_1, assetService_1, helpOverlayConfig_1, helpOverlayStep_1, aurelia_router_1, aurelia_event_aggregator_1, analyticsConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TOGGLE_HELP_LABEL = "Toggle Help";
    var HelpOverlayService = /** @class */ (function () {
        function HelpOverlayService(templatingEngine, assetService, eventAggregator, router) {
            var _this = this;
            this.stepNumber = 0;
            this._parentID = 0;
            this._templatingEngine = templatingEngine;
            this._assetService = assetService;
            this.helpActivated = false;
            this._eventAggregator = eventAggregator;
            this._eventAggregator.subscribe("router:navigation:complete", function () { return _this.handleRouteChanged(router); });
            this.loadHelpOverlayAssets().then(function (jsonSource) {
                if (jsonSource) {
                    _this.helpOverlayConfig = jsonSource;
                }
                else {
                    _this.helpOverlayConfig = [];
                }
            });
        }
        HelpOverlayService.prototype.showAllStepsChanged = function () {
            if (this.helpOverlayConfig) {
                var pageConfigIndex = this.helpOverlayConfig.map(function (v) { return v.page; }).indexOf(this._fragmentArray.join("/"));
                this.helpOverlayConfig[pageConfigIndex].allSteps = this.showAllSteps;
            }
        };
        HelpOverlayService.prototype.helpOverlayConfigChanged = function () {
            var _this = this;
            if (this._fragmentArray) {
                var helpOverlayConfigItem = this.helpOverlayConfig.find(function (s) { return s.page === _this._fragmentArray.join("/"); });
                if (helpOverlayConfigItem) {
                    this.showAllSteps = helpOverlayConfigItem.allSteps;
                    this.steps = helpOverlayConfigItem.steps;
                    this.stepNumber = 0;
                    this._parentID = 0;
                    this.removeElements();
                    this.currentStep = helpOverlayConfigItem.steps[0];
                    if (this.showAllSteps) {
                        this.processAllSteps();
                    }
                    else {
                        this.processNextStep(1);
                    }
                }
            }
        };
        HelpOverlayService.prototype.getNextStep = function () {
            var onNextfunc;
            if (this.currentStep) {
                if (this.currentStep.onNext) {
                    // check the okToClick class.
                    if (this.currentStep.onNextOkToClickClass) {
                        var okToClickClassList = document.querySelector(this.currentStep.onNext).classList;
                        if (okToClickClassList.contains(this.currentStep.onNextOkToClickClass)) {
                            onNextfunc = new Function("document.querySelector(\"" + this.currentStep.onNext + "\")" + this.currentStep.onNextAction);
                            onNextfunc();
                        }
                    }
                    else {
                        onNextfunc = new Function("document.querySelector(\"" + this.currentStep.onNext + "\")" + this.currentStep.onNextAction);
                        onNextfunc();
                    }
                }
                if (this.stepNumber < this.steps.length) {
                    this.processNextStep(1);
                }
            }
            else {
                this.processNextStep(1);
            }
        };
        HelpOverlayService.prototype.toggleHelp = function () {
            this.helpActivated = !this.helpActivated;
            this.stepNumber = 0;
            this.removeElements();
            if (this.helpActivated) {
                if (this.showAllSteps) {
                    this.processAllSteps();
                }
                else {
                    this.processNextStep(1);
                }
            }
            this._eventAggregator.publish(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, {
                category: analyticsConstants_1.AnalyticsConstants.HELP_OVERLAY_CATEGORY,
                action: analyticsConstants_1.AnalyticsConstants.CLICK_ACTION,
                label: TOGGLE_HELP_LABEL,
                metric: analyticsConstants_1.AnalyticsConstants.METRIC
            });
        };
        HelpOverlayService.prototype.toggleHelpAdmin = function () {
            this.adminActivated = !this.adminActivated;
        };
        HelpOverlayService.prototype.getPreviousStep = function () {
            var onPreviousfunc;
            if (this.currentStep.onPrevious) {
                // check the okToClick class.
                if (this.currentStep.onPreviousOkToClickClass) {
                    var okToClickClassList = document.querySelector(this.currentStep.onPrevious).classList;
                    if (okToClickClassList.contains(this.currentStep.onPreviousOkToClickClass)) {
                        onPreviousfunc = new Function("document.querySelector(\"" + this.currentStep.onPrevious + "\")" + this.currentStep.onPreviousAction);
                        onPreviousfunc();
                    }
                }
                else {
                    onPreviousfunc = new Function("document.querySelector(\"" + this.currentStep.onPrevious + "\")" + this.currentStep.onPreviousAction);
                    onPreviousfunc();
                }
            }
            var testStep = this.steps[this.stepNumber - 2];
            if (!testStep.parentStep) {
                this.processNextStep(-1);
            }
            else {
                this.processNextStep(testStep.parentStep - this.currentStep.id);
            }
        };
        HelpOverlayService.prototype.removeElements = function () {
            var className = "help-overlay";
            var elements = document.getElementsByTagName(className);
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        };
        HelpOverlayService.prototype.addStep = function (newStep) {
            var _this = this;
            var helpOverlayConfigItem = this.helpOverlayConfig.find(function (s) { return s.page === _this._fragmentArray.join("/"); });
            if (helpOverlayConfigItem) {
                helpOverlayConfigItem.steps.push(newStep);
            }
            else {
                var newSteps = [];
                newSteps.push(new helpOverlayStep_1.HelpOverlayStep(1));
                this.helpOverlayConfig.push(new helpOverlayConfig_1.HelpOverlayConfig(this._fragmentArray.join("/"), newSteps));
                helpOverlayConfigItem = this.helpOverlayConfig.find(function (s) { return s.page === _this._fragmentArray.join("/"); });
            }
            this.currentStep = helpOverlayConfigItem.steps[helpOverlayConfigItem.steps.length - 1];
            this.stepNumber = helpOverlayConfigItem.steps.length;
            this.steps = helpOverlayConfigItem.steps;
            this.updateEditedConfigString();
            this.processStep();
        };
        HelpOverlayService.prototype.removeStep = function (idToRemove) {
            var _this = this;
            var itemToRemoveArrayLocation;
            var helpOverlayConfigItem = this.helpOverlayConfig.find(function (s) { return s.page === _this._fragmentArray.join("/"); });
            // check for child steps
            var childSteps = helpOverlayConfigItem.steps.filter(function (s) { return ~~s.parentStep === idToRemove; });
            childSteps.forEach(function (stepItem) {
                itemToRemoveArrayLocation = helpOverlayConfigItem.steps.map(function (v) { return v.id; }).indexOf(stepItem.id);
                helpOverlayConfigItem.steps.splice(itemToRemoveArrayLocation, 1);
            });
            itemToRemoveArrayLocation = helpOverlayConfigItem.steps.map(function (v) { return v.id; }).indexOf(idToRemove);
            helpOverlayConfigItem.steps.splice(itemToRemoveArrayLocation, 1);
            this.stepNumber = Math.max(this.stepNumber - 1, 1);
            this.currentStep = helpOverlayConfigItem.steps[Math.max(this.stepNumber - 1, 0)];
            this.steps = helpOverlayConfigItem.steps;
            this.reOrderIds();
            this.updateEditedConfigString();
            if (this.currentStep) {
                this.processStep();
            }
        };
        HelpOverlayService.prototype.insertStep = function (idToinsertAfter) {
            var _this = this;
            if (!idToinsertAfter) {
                idToinsertAfter = 1;
            }
            var helpOverlayConfigItem = this.helpOverlayConfig.find(function (s) { return s.page === _this._fragmentArray.join("/"); });
            helpOverlayConfigItem.steps.splice(idToinsertAfter, 0, new helpOverlayStep_1.HelpOverlayStep(idToinsertAfter + 1));
            this.currentStep = helpOverlayConfigItem.steps[idToinsertAfter];
            this.steps = helpOverlayConfigItem.steps;
            this.stepNumber = idToinsertAfter + 1;
            this.reOrderIds();
            this.updateEditedConfigString();
            this.processStep();
        };
        HelpOverlayService.prototype.updateEditedConfigString = function () {
            this.editedConfigString = JSON.stringify(this.helpOverlayConfig);
        };
        HelpOverlayService.prototype.processNextStep = function (direction, forceNext) {
            var _this = this;
            if (forceNext === void 0) { forceNext = false; }
            if (this.steps) {
                this.stepNumber = Math.min(Math.max(this.stepNumber += direction, 1), this.steps.length);
                this.checkStep(forceNext).then(function (nextOverlayStep) {
                    _this.currentStep = nextOverlayStep;
                    _this.currentStep.showCircle = true;
                    _this.processStep();
                    if (!_this.currentStep.parentStep) {
                        _this._parentID = _this.currentStep.id;
                    }
                }).catch(function () {
                    if (_this.stepNumber > 0 && _this.stepNumber < _this.steps.length) {
                        _this.processNextStep(direction);
                    }
                });
            }
        };
        HelpOverlayService.prototype.reOrderIds = function () {
            for (var index = 0; index < this.steps.length; index++) {
                var step = this.steps[index];
                step.id = index + 1;
            }
        };
        HelpOverlayService.prototype.handleRouteChanged = function (router) {
            var _this = this;
            this._fragmentArray = router.currentInstruction.fragment.split("/").slice(1);
            for (var i = 0; i < this._fragmentArray.length; i++) {
                /* if the fragmet contains digits then treat it as an id based on the previous item */
                if (/\d/.test(this._fragmentArray[i]) && i >= 1) {
                    var previous = this._fragmentArray[i - 1];
                    if (previous.charAt(previous.length - 1) === "s") {
                        previous = previous.substr(0, previous.length - 1);
                    }
                    this._fragmentArray[i] = previous + "details";
                }
            }
            if (this.helpOverlayConfig) {
                var helpOverlayConfig = this.helpOverlayConfig.find(function (s) { return s.page === _this._fragmentArray.join("/"); });
                if (helpOverlayConfig) {
                    this.steps = helpOverlayConfig.steps;
                    this.showAllSteps = helpOverlayConfig.allSteps;
                    this.stepNumber = 0;
                    this._parentID = 0;
                    this.removeElements();
                    if (this.helpActivated) {
                        if (this.showAllSteps) {
                            this.processAllSteps();
                        }
                        else {
                            this.processNextStep(1);
                        }
                    }
                }
                else {
                    this.currentStep = undefined;
                    this.steps = undefined;
                    this.removeElements();
                }
            }
        };
        HelpOverlayService.prototype.processStep = function () {
            var _this = this;
            if (!this.showAllSteps) {
                this.removeElements();
                try {
                    var newOverlayElement_1 = this.createHelpOverlay(this.currentStep.selector);
                    if (newOverlayElement_1 && this.currentStep.parentScollSelector) {
                        this.scrollToStepLocation(newOverlayElement_1).then(function () { return _this._templatingEngine.enhance(newOverlayElement_1); });
                    }
                    else {
                        this._templatingEngine.enhance(newOverlayElement_1);
                    }
                }
                catch (e) {
                    // swallow the error. this may happen if navigating is forced when the element cannot display.
                }
            }
        };
        HelpOverlayService.prototype.loadHelpOverlayAssets = function () {
            return this._assetService.loadJson("services/helpOverlay/overlayConfig.json");
        };
        HelpOverlayService.prototype.scrollToStepLocation = function (overLayElement) {
            var _this = this;
            /* tslint:disable:promise-must-complete */
            return new Promise(function (resolve, reject) {
                var positionToScrollTo;
                var currentPosition;
                currentPosition = document.querySelector(_this.currentStep.parentScollSelector).scrollTop;
                positionToScrollTo = overLayElement.getBoundingClientRect().top;
                if (currentPosition < positionToScrollTo) {
                    var scrollThread_1 = threading_1.Threading.startTimer(function () {
                        if (currentPosition < positionToScrollTo - _this.currentStep.scrollOffset) {
                            currentPosition = currentPosition + 7;
                            document.querySelector(_this.currentStep.parentScollSelector).scrollTop = currentPosition;
                        }
                        else {
                            threading_1.Threading.stopTimer(scrollThread_1);
                            resolve();
                        }
                    }, 1);
                }
                else {
                    var scrollThread_2 = threading_1.Threading.startTimer(function () {
                        if (currentPosition > positionToScrollTo + ~~_this.currentStep.scrollOffset) {
                            currentPosition = currentPosition - 7;
                            document.querySelector(_this.currentStep.parentScollSelector).scrollTop = currentPosition;
                        }
                        else {
                            threading_1.Threading.stopTimer(scrollThread_2);
                            resolve();
                        }
                    }, 1);
                }
            });
            /* tslint:enable:promise-must-complete */
        };
        HelpOverlayService.prototype.checkStep = function (forceNext) {
            if (forceNext === void 0) { forceNext = false; }
            var testStepNumber = this.stepNumber;
            var testStep = this.steps[testStepNumber - 1];
            if (this._parentID === ~~testStep.parentStep || !testStep.parentStep || forceNext) {
                return this.elementCheck(testStep, forceNext);
            }
            return Promise.reject(testStep);
        };
        HelpOverlayService.prototype.elementCheck = function (testStep, forceNext) {
            return new Promise(function (resolve, reject) {
                var elapsedTime = 0;
                if (testStep.selectorWaitTimeout && !forceNext) {
                    var timer_1 = threading_1.Threading.startTimer(function () {
                        if (elapsedTime < testStep.selectorWaitTimeout) {
                            if (document.querySelector(testStep.selector)) {
                                threading_1.Threading.stopTimer(timer_1);
                                resolve(testStep);
                            }
                        }
                        else {
                            threading_1.Threading.stopTimer(timer_1);
                            reject();
                        }
                        elapsedTime = elapsedTime + 10;
                    }, 10);
                }
                else {
                    if (document.querySelector(testStep.selector) || forceNext) {
                        resolve(testStep);
                    }
                    else {
                        reject();
                    }
                }
            });
        };
        HelpOverlayService.prototype.processAllSteps = function () {
            var _this = this;
            this.removeElements();
            this.pushOverlaySteps().then(function (promises) {
                _this.stepNumber = 0;
                _this.processNextStep(1);
            }).catch(function (promises) {
                _this.stepNumber = 0;
                _this.processNextStep(1);
            });
        };
        HelpOverlayService.prototype.pushOverlaySteps = function () {
            var _this = this;
            var promiseArray = [];
            if (this.steps) {
                for (var stepCount = 1; stepCount <= this.steps.length; stepCount++) {
                    var step = this.steps[stepCount - 1];
                    promiseArray.push(this.elementCheck(step, false));
                }
            }
            return Promise.each(promiseArray, (function (step) {
                _this.stepNumber = step.id;
                var newOverlayElement = _this.createHelpOverlay(step.selector);
                _this._templatingEngine.enhance(newOverlayElement);
            }));
        };
        HelpOverlayService.prototype.createHelpOverlay = function (selector) {
            var newElement;
            var el = document.createElement("help-overlay");
            return newElement = document.querySelector(selector).appendChild(el);
        };
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", Number)
        ], HelpOverlayService.prototype, "stepNumber", void 0);
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", Array)
        ], HelpOverlayService.prototype, "steps", void 0);
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", helpOverlayStep_1.HelpOverlayStep)
        ], HelpOverlayService.prototype, "currentStep", void 0);
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", String)
        ], HelpOverlayService.prototype, "editedConfigString", void 0);
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", Boolean)
        ], HelpOverlayService.prototype, "showAllSteps", void 0);
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", Array)
        ], HelpOverlayService.prototype, "helpOverlayConfig", void 0);
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", Boolean)
        ], HelpOverlayService.prototype, "adminActivated", void 0);
        HelpOverlayService = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.TemplatingEngine, assetService_1.AssetService, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_framework_1.TemplatingEngine, Object, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router])
        ], HelpOverlayService);
        return HelpOverlayService;
    }());
    exports.HelpOverlayService = HelpOverlayService;
});

//# sourceMappingURL=helpOverlayService.js.map
