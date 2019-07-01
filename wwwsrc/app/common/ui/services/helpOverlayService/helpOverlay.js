var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-framework", "./helpOverlayService", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, aurelia_framework_2, helpOverlayService_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HelpOverlay = /** @class */ (function () {
        function HelpOverlay(helpOverlayService, eventAggregator) {
            var _this = this;
            this.helpOverlayService = helpOverlayService;
            this.showContent = false;
            this.stepArrayItem = this.helpOverlayService.stepNumber - 1;
            this._eventAggregator = eventAggregator;
            this._eventAggregator.subscribe("openedOverlay", (function (id) { _this.closeMe(id); }));
        }
        HelpOverlay.prototype.nextStep = function (e) {
            if (e) {
                e.stopPropagation();
            }
            this.helpOverlayService.getNextStep();
        };
        HelpOverlay.prototype.previousStep = function (e) {
            if (e) {
                e.stopPropagation();
            }
            this.helpOverlayService.getPreviousStep();
        };
        HelpOverlay.prototype.manageClick = function (e) {
            if (e) {
                e.stopPropagation();
            }
        };
        HelpOverlay.prototype.toggleContent = function () {
            this.showContent = !this.showContent;
            this.helpOverlayService.stepNumber = this.stepArrayItem + 1;
            if (this.showContent) {
                this._eventAggregator.publish("openedOverlay", this.stepArrayItem);
            }
        };
        HelpOverlay.prototype.closeMe = function (openedId) {
            if (this.stepArrayItem !== openedId) {
                this.showContent = false;
            }
        };
        __decorate([
            aurelia_framework_2.observable,
            __metadata("design:type", Number)
        ], HelpOverlay.prototype, "stepArrayItem", void 0);
        HelpOverlay = __decorate([
            aurelia_framework_2.inject(helpOverlayService_1.HelpOverlayService, aurelia_event_aggregator_1.EventAggregator),
            aurelia_framework_1.customElement("help-overlay"),
            __metadata("design:paramtypes", [helpOverlayService_1.HelpOverlayService, aurelia_event_aggregator_1.EventAggregator])
        ], HelpOverlay);
        return HelpOverlay;
    }());
    exports.HelpOverlay = HelpOverlay;
});

//# sourceMappingURL=helpOverlay.js.map
