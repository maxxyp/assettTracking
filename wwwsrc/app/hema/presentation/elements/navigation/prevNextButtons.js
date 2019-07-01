var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-router", "aurelia-templating", "aurelia-dependency-injection", "aurelia-binding", "aurelia-event-aggregator"], function (require, exports, aurelia_router_1, aurelia_templating_1, aurelia_dependency_injection_1, aurelia_binding_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrevNextButtons = /** @class */ (function () {
        function PrevNextButtons(router, eventAggregator) {
            this._router = router;
            this._eventAggregator = eventAggregator;
        }
        PrevNextButtons.prototype.attached = function () {
            var _this = this;
            this._subscription = this._eventAggregator.subscribe("router:navigation:complete", function () { return _this.updateStateFromCurrent(); });
            this.updateStateFromCurrent();
        };
        PrevNextButtons.prototype.detached = function () {
            if (this._subscription) {
                this._subscription.dispose();
                this._subscription = null;
            }
        };
        Object.defineProperty(PrevNextButtons.prototype, "hasMultipleItems", {
            get: function () {
                return this.values && this.values.length > 1;
            },
            enumerable: true,
            configurable: true
        });
        PrevNextButtons.prototype.paramIdChanged = function () {
            this.updateStateFromCurrent();
        };
        PrevNextButtons.prototype.valuesChanged = function () {
            this.updateStateFromCurrent();
        };
        PrevNextButtons.prototype.navigateToNext = function () {
            var currentId = this.getCurrentId();
            if (currentId) {
                var currentIndex = this.values.indexOf(currentId);
                if (currentIndex < this.values.length - 1) {
                    var paramRouter = this.getRouterForParam(this._router, this.paramId);
                    if (paramRouter) {
                        paramRouter.navigate(paramRouter.currentInstruction.fragment.replace(currentId, this.values[currentIndex + 1]));
                    }
                }
            }
        };
        PrevNextButtons.prototype.navigateToPrevious = function () {
            var currentId = this.getCurrentId();
            if (currentId) {
                var currentIndex = this.values.indexOf(currentId);
                if (currentIndex > 0) {
                    var paramRouter = this.getRouterForParam(this._router, this.paramId);
                    if (paramRouter) {
                        paramRouter.navigate(paramRouter.currentInstruction.fragment.replace(currentId, this.values[currentIndex - 1]));
                    }
                }
            }
        };
        PrevNextButtons.prototype.updateStateFromCurrent = function () {
            var currentId = this.getCurrentId();
            if (currentId) {
                var index = this.values.indexOf(currentId);
                var info = "";
                var hasPrevious = false;
                var hasNext = false;
                if (index >= 0) {
                    info = (index + 1) + "/" + this.values.length;
                    hasPrevious = this.values.length > 1 && index > 0;
                    hasNext = this.values.length > 1 && (index < (this.values.length - 1));
                }
                this.hasPrevious = hasPrevious;
                this.hasNext = hasNext;
                this.info = info;
            }
        };
        PrevNextButtons.prototype.getCurrentId = function () {
            if (this.paramId && this.values && this.values.length > 0) {
                var paramRouter = this.getRouterForParam(this._router, this.paramId);
                if (paramRouter) {
                    return paramRouter.currentInstruction.params[this.paramId];
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        };
        PrevNextButtons.prototype.getRouterForParam = function (router, paramId) {
            var paramRouter = router;
            var done = false;
            do {
                if (paramRouter &&
                    paramRouter.currentInstruction &&
                    paramRouter.currentInstruction.params &&
                    paramRouter.currentInstruction.params[paramId]) {
                    done = true;
                }
                else if (paramRouter.parent) {
                    paramRouter = paramRouter.parent;
                }
                else {
                    done = true;
                    paramRouter = null;
                }
            } while (!done);
            return paramRouter;
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], PrevNextButtons.prototype, "values", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], PrevNextButtons.prototype, "paramId", void 0);
        PrevNextButtons = __decorate([
            aurelia_templating_1.customElement("prev-next-buttons"),
            aurelia_dependency_injection_1.inject(aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator])
        ], PrevNextButtons);
        return PrevNextButtons;
    }());
    exports.PrevNextButtons = PrevNextButtons;
});

//# sourceMappingURL=prevNextButtons.js.map
