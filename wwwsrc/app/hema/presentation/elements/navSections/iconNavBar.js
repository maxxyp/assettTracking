var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-router", "aurelia-dependency-injection", "aurelia-event-aggregator", "aurelia-binding", "../../../../common/ui/services/helpOverlayService/helpOverlayService", "../../../business/services/engineerService", "../../../../common/core/platformHelper"], function (require, exports, aurelia_router_1, aurelia_dependency_injection_1, aurelia_event_aggregator_1, aurelia_binding_1, helpOverlayService_1, engineerService_1, platformHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IconNavBar = /** @class */ (function () {
        function IconNavBar(router, eventAggregator, helpOverlayService, engineerService) {
            var _this = this;
            this.router = router;
            this._eventAggregator = eventAggregator;
            this._routeChangeSubscription = this._eventAggregator.subscribe("router:navigation:complete", function () { return _this.handleRouteChanged(); });
            this.helpOverlayService = helpOverlayService;
            engineerService.getCurrentEngineer()
                .then(function (engineer) {
                if (engineer && engineer.roles && engineer.roles.indexOf("SR-Field-Admin")) {
                    _this.isAdmin = true;
                }
                else {
                    _this.isAdmin = false;
                }
            });
            this.platform = platformHelper_1.PlatformHelper.getPlatform();
            this.appVersion = platformHelper_1.PlatformHelper.appVersion;
            this.buildType = platformHelper_1.PlatformHelper.buildType;
        }
        IconNavBar.prototype.attached = function () {
            this.handleRouteChanged();
        };
        IconNavBar.prototype.detached = function () {
            if (this._routeChangeSubscription) {
                this._routeChangeSubscription.dispose();
            }
        };
        IconNavBar.prototype.navigateTo = function (navModel) {
            var settings = navModel.settings;
            this.router.navigateToRoute(navModel.config.name, settings && settings.defaultParam
                ? settings.defaultParam : undefined);
        };
        IconNavBar.prototype.handleRouteChanged = function () {
            var _this = this;
            if (this.router && this.router.currentInstruction && this.router.currentInstruction.fragment) {
                var route_1 = this.router.currentInstruction.fragment.replace("/", "");
                this.router.navigation.forEach(function (row) {
                    if ((row.config.redirect && route_1.lastIndexOf(row.config.redirect, 0) === 0) || route_1.lastIndexOf(row.config.route, 0) === 0) {
                        _this.navTitle = row.title;
                    }
                });
            }
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], IconNavBar.prototype, "navTitle", void 0);
        IconNavBar = __decorate([
            aurelia_dependency_injection_1.inject(aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, helpOverlayService_1.HelpOverlayService, engineerService_1.EngineerService, platformHelper_1.PlatformHelper),
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, Object, Object])
        ], IconNavBar);
        return IconNavBar;
    }());
    exports.IconNavBar = IconNavBar;
});

//# sourceMappingURL=iconNavBar.js.map
