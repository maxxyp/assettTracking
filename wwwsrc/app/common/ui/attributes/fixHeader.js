var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-templating", "../../core/services/assetService", "./constants/attributeConstants", "aurelia-event-aggregator", "aurelia-router", "../../core/threading"], function (require, exports, aurelia_framework_1, aurelia_templating_1, assetService_1, attributeConstants_1, aurelia_event_aggregator_1, aurelia_router_1, threading_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // must be less than the aurelia dialog overlay z-index of 1000 otherwise it renders above dialogs
    var Z_INDEX = 999;
    var FixHeader = /** @class */ (function () {
        function FixHeader(element, assetService, eventAggregator, router) {
            this._assetService = assetService;
            this._element = element;
            this._topOffset = 0;
            this._leftOffset = 0;
            this._rightOffset = 0;
            this._transitionTime = 0;
            this.isFloating = false;
            this._eventAggregator = eventAggregator;
            this._router = router;
            this._subscriptions = [];
        }
        FixHeader.prototype.attached = function () {
            var _this = this;
            this._assetService.loadJson("services/fixedHeader/fixedHeaderConfig.json").then(function (config) {
                if (config) {
                    _this._elementConfig = config.find(function (item) { return item.selector === _this._element.id; });
                    if (_this._elementConfig) {
                        _this._topOffset = _this._elementConfig.topOffset;
                        _this._leftOffset = _this._elementConfig.leftOffset;
                        _this._rightOffset = _this._elementConfig.rightOffset;
                        _this._additionalStyle = _this._elementConfig.additionalStyle;
                        _this._enableForRoutePartial = _this._elementConfig.enableForRoutePartial;
                        _this._transitionTime = _this._elementConfig.transitionTime;
                        _this._element.setAttribute("style", "transition: all " + _this._transitionTime + "ms ease-in-out; display:none;");
                        _this._timer = threading_1.Threading.startTimer(function () { return _this.checkFreezeFrame(); }, 50);
                        if (!_this.isAlt) {
                            _this._topOffset = _this._elementConfig.topOffset;
                            _this._leftOffset = _this._elementConfig.leftOffset;
                            _this._rightOffset = _this._elementConfig.rightOffset;
                            _this._transitionTime = _this._elementConfig.transitionTime;
                            _this._additionalStyle = _this._elementConfig.additionalStyle;
                        }
                        else {
                            _this._topOffset = _this._elementConfig.altTopOffset;
                            _this._leftOffset = _this._elementConfig.altLeftOffset;
                            _this._rightOffset = _this._elementConfig.altRightOffset;
                            _this._transitionTime = _this._elementConfig.transitionTime;
                            _this._additionalStyle = _this._elementConfig.additionalStyle;
                        }
                    }
                }
                _this._subscriptions.push(_this._eventAggregator.subscribe("router:navigation:success", function () { return _this.resetLayout(); }));
                _this._subscriptions.push(_this._eventAggregator.subscribe(attributeConstants_1.AttributeConstants.FULL_SCREEN_TOGGLE, function (isAlt) {
                    if (!isAlt) {
                        _this._topOffset = _this._elementConfig.topOffset;
                        _this._leftOffset = _this._elementConfig.leftOffset;
                        _this._rightOffset = _this._elementConfig.rightOffset;
                        _this._transitionTime = _this._elementConfig.transitionTime;
                        _this._additionalStyle = _this._elementConfig.additionalStyle;
                    }
                    else {
                        _this._topOffset = _this._elementConfig.altTopOffset;
                        _this._leftOffset = _this._elementConfig.altLeftOffset;
                        _this._rightOffset = _this._elementConfig.altRightOffset;
                        _this._transitionTime = _this._elementConfig.transitionTime;
                        _this._additionalStyle = _this._elementConfig.additionalStyle;
                    }
                    _this.isFloating = false;
                    _this.resetLayout();
                    _this.checkFreezeFrame();
                }));
            });
        };
        FixHeader.prototype.detached = function () {
            threading_1.Threading.stopTimer(this._timer);
            this._subscriptions.forEach(function (subscription) { return subscription.dispose(); });
            this._subscriptions = [];
        };
        FixHeader.prototype.resetLayout = function () {
            this.isFloating = false;
            var top = " display: none; ";
            this._element.setAttribute("style", top);
        };
        FixHeader.prototype.checkFragment = function (enableForRoutePartialList, extractedFragment) {
            var partialList = enableForRoutePartialList.split(",");
            var result = false;
            for (var partialCount = 0; partialCount < partialList.length; partialCount++) {
                if (!!~extractedFragment.indexOf(partialList[partialCount], 0)) {
                    result = true;
                    break;
                }
                else {
                    result = false;
                }
            }
            return result;
        };
        FixHeader.prototype.extractFragment = function (router) {
            var fragmentParts = router.currentInstruction.fragment.split("/");
            if (fragmentParts.length === 1) {
                return fragmentParts[0];
            }
            else {
                for (var fragmentCount = 0; fragmentCount < fragmentParts.length; fragmentCount++) {
                    if (Number(fragmentParts[fragmentCount]) || (fragmentParts[fragmentCount].length === 36 && fragmentParts[fragmentCount].indexOf("-") === 8)) {
                        fragmentParts[fragmentCount] = "item";
                    }
                }
                return fragmentParts.join("/");
            }
        };
        FixHeader.prototype.updateStyle = function (setFixed) {
            if (this.checkFragment(this._elementConfig.enableForRoutePartial, this.extractFragment(this._router)) || !this._enableForRoutePartial) {
                var top_1;
                if (setFixed) {
                    top_1 = "z-index:" + Z_INDEX + "; position:fixed; top:" + this._topOffset + "px; left:" + this._leftOffset + "px; right:"
                        + this._rightOffset + "px;transition: all " + this._transitionTime + "ms ease-in-out; "
                        + this._additionalStyle;
                }
                else {
                    top_1 = " display: none; "
                        + this._additionalStyle;
                }
                this._element.setAttribute("style", top_1);
                this.isFloating = setFixed;
            }
            else {
                this.isFloating = false;
            }
        };
        FixHeader.prototype.checkFreezeFrame = function () {
            if (this._element.nextElementSibling.getBoundingClientRect().top <= this._topOffset) {
                this.updateStyle(true);
            }
            else if (this._element.nextElementSibling.getBoundingClientRect().top >= this._topOffset && this.isFloating) {
                this.updateStyle(false);
            }
        };
        __decorate([
            aurelia_templating_1.bindable,
            __metadata("design:type", Boolean)
        ], FixHeader.prototype, "isAlt", void 0);
        FixHeader = __decorate([
            aurelia_templating_1.customAttribute("fix-header"),
            aurelia_framework_1.inject(Element, assetService_1.AssetService, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router),
            __metadata("design:paramtypes", [HTMLElement, Object, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router])
        ], FixHeader);
        return FixHeader;
    }());
    exports.FixHeader = FixHeader;
});

//# sourceMappingURL=fixHeader.js.map
