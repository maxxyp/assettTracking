var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-dependency-injection", "../../../../common/core/threading", "../../../../common/ui/attributes/constants/attributeConstants", "aurelia-event-aggregator", "../../../../common/analytics/analyticsConstants"], function (require, exports, aurelia_framework_1, aurelia_dependency_injection_1, threading_1, attributeConstants_1, aurelia_event_aggregator_1, analyticsConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TOGGLE_FULL_SCREEN_LABEL = "Toggle Full Screen";
    var FullScreen = /** @class */ (function () {
        function FullScreen(eventAggregator) {
            var _this = this;
            this._eventAggregator = eventAggregator;
            this._keyDown = function (event) {
                if (event.keyCode === 90 && (event.ctrlKey)) {
                    event.preventDefault();
                    _this.processContent();
                }
            };
        }
        FullScreen.prototype.attached = function () {
            var _this = this;
            document.addEventListener("keydown", this._keyDown);
            this._isFullScreen = window.isFullScreen;
            this._subscription = this._eventAggregator.subscribe(attributeConstants_1.AttributeConstants.FULL_SCREEN_TOGGLE, function (isFullScreen) {
                if (!_this._originator) {
                    if (isFullScreen) {
                        _this.expand(true);
                        window.isFullScreen = true;
                    }
                    else {
                        _this.contract(true);
                        window.isFullScreen = false;
                    }
                }
                else {
                    _this._originator = false;
                }
            });
        };
        FullScreen.prototype.detached = function () {
            if (this._subscription) {
                this._subscription.dispose();
            }
            document.removeEventListener("keydown", this._keyDown);
        };
        FullScreen.prototype.processContent = function () {
            if (!this._isFullScreen) {
                this._originator = true;
                this.expand(false);
            }
            else {
                this._originator = true;
                this.contract(false);
            }
            this._eventAggregator.publish(attributeConstants_1.AttributeConstants.FULL_SCREEN_TOGGLE, this._isFullScreen);
            this._eventAggregator.publish(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, {
                category: analyticsConstants_1.AnalyticsConstants.FULL_SCREEN_CATEGORY,
                action: analyticsConstants_1.AnalyticsConstants.CLICK_ACTION,
                label: TOGGLE_FULL_SCREEN_LABEL,
                metric: analyticsConstants_1.AnalyticsConstants.METRIC
            });
        };
        FullScreen.prototype.moveItems = function (headerOnly) {
            document.styleSheets[0].insertRule(".full-screen {position:absolute !important;"
                + " overflow:auto !important;  top:-" + this.topOffset
                + " !important;  left:-" + this.leftOffset
                + " !important; right:-" + this.rightOffset + "!important;"
                + " bottom:-" + this.bottomOffset + " !important; "
                + " z-index:200 !important;"
                + " transition: all " + this.transitionTime + "ms ease-in-out;}", 0);
            if (!headerOnly) {
                document.styleSheets[0].insertRule(".hide-left {position:relative !important;"
                    + " transform: translateX(-" + this.hideLeftOffset + "); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
                document.styleSheets[0].insertRule(".hide-right {position:relative !important;"
                    + " transform: translateX(" + this.hideRightOffset + "); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
                document.styleSheets[0].insertRule(".hide-top {position:absolute !important;"
                    + " width:100% !important;   transform: translateY(-" + this.hideTopOffset + ") !important; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
                document.styleSheets[0].insertRule(".hide-bottom {position:relative !important;"
                    + "   transform: translateY(-" + this.hideBottomOffset + ") !important; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            }
        };
        FullScreen.prototype.deleteItems = function (headerOnly) {
            for (var ruleCount = 0; ruleCount < document.styleSheets[0].cssRules.length; ruleCount++) {
                if (document.styleSheets[0].cssRules[ruleCount].selectorText === ".full-screen" && headerOnly) {
                    document.styleSheets[0].deleteRule(ruleCount);
                }
                else if (!headerOnly && (document.styleSheets[0].cssRules[ruleCount].selectorText === ".full-screen" ||
                    document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-bottom" ||
                    document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-top" ||
                    document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-left" ||
                    document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-right")) {
                    document.styleSheets[0].deleteRule(ruleCount);
                }
            }
        };
        FullScreen.prototype.revertItems = function (headerOnly) {
            document.styleSheets[0].insertRule(".full-screen {position:absolute !important;"
                + "overflow:auto !important; !important;  top:" + this.originalPositions.top + " left:" + this.originalPositions.left
                + " !important; right:" + this.originalPositions.right + " !important; bottom:" + this.originalPositions.bottom + " !important; "
                + " z-index:200 !important;margin-bottom: 0px!important; transition: all " + this.transitionTime + "ms ease-in-out;}", 0);
            if (!headerOnly) {
                document.styleSheets[0].insertRule(".hide-left {position:relative !important;"
                    + " transform: translateX(0px); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
                document.styleSheets[0].insertRule(".hide-right {position:relative !important;"
                    + " transform: translateX(0px); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
                document.styleSheets[0].insertRule(".hide-top {position:absolute !important;"
                    + " width:100% !important; transform: translateY(0px) !important; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
                document.styleSheets[0].insertRule(".hide-bottom {position:relative !important;"
                    + "  transform: translateY(0px) !important    ; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            }
        };
        FullScreen.prototype.removeTabbing = function (element) {
            var allDecendents = element.querySelectorAll("*");
            for (var nodeIndex = 0; nodeIndex < allDecendents.length; nodeIndex++) {
                var elementItem = allDecendents[nodeIndex];
                if (elementItem.getAttribute("tabindex")) {
                    var tabIndex = parseInt(elementItem.getAttribute("tabindex"), 10);
                    if (tabIndex > -1) {
                        tabIndex = tabIndex * -1;
                    }
                    elementItem.setAttribute("tabindex", tabIndex.toString());
                }
                else {
                    elementItem.setAttribute("tabindex", "-999");
                }
            }
        };
        FullScreen.prototype.applyTabbing = function (element) {
            var allDecendents = element.querySelectorAll("*");
            for (var nodeIndex = 0; nodeIndex < allDecendents.length; nodeIndex++) {
                var elementItem = allDecendents[nodeIndex];
                if (elementItem.getAttribute("tabindex")) {
                    if (elementItem.getAttribute("tabindex") === "-999") {
                        elementItem.removeAttribute("tabindex");
                    }
                    else {
                        var tabIndex = parseInt(elementItem.getAttribute("tabindex"), 10);
                        if (tabIndex < 0) {
                            tabIndex = tabIndex * -1;
                        }
                        elementItem.setAttribute("tabindex", tabIndex.toString());
                    }
                }
            }
        };
        FullScreen.prototype.toggleTabbing = function () {
            var hideTabArray = document.getElementsByClassName("de-tab");
            var nodeIndex;
            var element;
            if (hideTabArray.length) {
                for (nodeIndex = 0; nodeIndex < hideTabArray.length; nodeIndex++) {
                    element = hideTabArray[nodeIndex];
                    if (this._isFullScreen) {
                        this.removeTabbing(element);
                    }
                    else {
                        this.applyTabbing(element);
                    }
                }
            }
        };
        FullScreen.prototype.expand = function (headerOnly) {
            var _this = this;
            this.moveItems(headerOnly);
            window.isFullScreen = true;
            this._isFullScreen = true;
            threading_1.Threading.delay(function () {
                _this.toggleTabbing();
            }, this.transitionTime);
        };
        FullScreen.prototype.contract = function (headerOnly) {
            var _this = this;
            this.deleteItems(headerOnly);
            this.revertItems(headerOnly);
            window.isFullScreen = false;
            this._isFullScreen = false;
            threading_1.Threading.delay(function () {
                _this.deleteItems(headerOnly);
                _this.toggleTabbing();
            }, this.transitionTime);
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "topOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "bottomOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "leftOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "rightOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "hideLeftOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "hideRightOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "hideBottomOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FullScreen.prototype, "hideTopOffset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], FullScreen.prototype, "transitionTime", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Object)
        ], FullScreen.prototype, "originalPositions", void 0);
        FullScreen = __decorate([
            aurelia_framework_1.customElement("full-screen"),
            aurelia_dependency_injection_1.inject(aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator])
        ], FullScreen);
        return FullScreen;
    }());
    exports.FullScreen = FullScreen;
});

//# sourceMappingURL=fullScreen.js.map
