var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabButtons = /** @class */ (function () {
        function TabButtons(router, eventAggregator) {
            this.router = router;
            this._eventAggregator = eventAggregator;
            this.isFullScreen = window.isFullScreen;
        }
        TabButtons.prototype.attached = function () {
            var _this = this;
            this._routeChangeSubscription = this._eventAggregator.subscribe("router:navigation:complete", function () { return _this.handleRouteChanged(); });
            this.handleRouteChanged();
        };
        TabButtons.prototype.detached = function () {
            if (this._routeChangeSubscription) {
                this._routeChangeSubscription.dispose();
                this._routeChangeSubscription = null;
            }
        };
        TabButtons.prototype.navigateToChildRoute = function (routeName) {
            this.router.navigateToRoute(routeName);
        };
        TabButtons.prototype.handleRouteChanged = function () {
            if (this.router &&
                this.router.currentInstruction &&
                this.router.currentInstruction.config &&
                this.router.currentInstruction.config.settings) {
                this.activeTab = this.router.currentInstruction.config.settings.tabGroupParent
                    ? this.router.currentInstruction.config.settings.tabGroupParent : this.router.currentInstruction.config.name;
            }
        };
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.oneWay }),
            __metadata("design:type", aurelia_router_1.Router)
        ], TabButtons.prototype, "router", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TabButtons.prototype, "activeTab", void 0);
        TabButtons = __decorate([
            aurelia_framework_2.customElement("tab-buttons"),
            aurelia_framework_1.inject(aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator])
        ], TabButtons);
        return TabButtons;
    }());
    exports.TabButtons = TabButtons;
});

//# sourceMappingURL=tabButtons.js.map
