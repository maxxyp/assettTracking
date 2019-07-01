/// <reference path="./../../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "../../../business/services/RiskService", "../../../business/services/labelService", "aurelia-event-aggregator", "../../models/editableViewModel", "../../../business/services/catalogService", "../../../business/services/businessRuleService", "../../../business/services/validationService", "../../../business/services/jobService", "../../../business/services/engineerService", "aurelia-dialog", "../../../../common/ui/services/animationService"], function (require, exports, aurelia_framework_1, RiskService_1, labelService_1, aurelia_event_aggregator_1, editableViewModel_1, catalogService_1, businessRuleService_1, validationService_1, jobService_1, engineerService_1, aurelia_dialog_1, animationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RiskMain = /** @class */ (function (_super) {
        __extends(RiskMain, _super);
        function RiskMain(jobService, engineerService, riskService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, animationService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._animationService = animationService;
            _this._riskService = riskService;
            _this.riskIds = [];
            return _this;
        }
        RiskMain.prototype.configureRouter = function (config, childRouter) {
            this.router = childRouter;
            this.setupChildRoutes();
            config.map(this._childRoutes);
        };
        RiskMain.prototype.activateAsync = function (params) {
            var _this = this;
            this.jobId = params.jobId;
            this.riskId = params.riskId;
            return this.load()
                .then(function () { return _this.showContent(); });
        };
        RiskMain.prototype.swipeFunction = function (swipeDirection) {
            var _this = this;
            if (this._riskPosition !== -1) {
                if (swipeDirection === "left") {
                    this._animationService.swipe(this.card, this.riskIds, this._riskPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then(function (position) {
                        _this.router.parent.navigate(_this.router.parent.currentInstruction.fragment.replace(_this.riskIds[_this._riskPosition], _this.riskIds[position]));
                        _this._riskPosition = position;
                    })
                        .catch();
                }
                else {
                    this._animationService.swipe(this.card, this.riskIds, this._riskPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then(function (position) {
                        _this.router.parent.navigate(_this.router.parent.currentInstruction.fragment.replace(_this.riskIds[_this._riskPosition], _this.riskIds[position]));
                        _this._riskPosition = position;
                    })
                        .catch();
                }
            }
        };
        RiskMain.prototype.loadModel = function () {
            var _this = this;
            return this._riskService.getRisks(this.jobId)
                .then(function (risks) {
                if (risks) {
                    _this.riskIds = risks.map(function (r) { return r.id; });
                    _this._riskPosition = _this.riskIds.indexOf(_this.riskId);
                }
            });
        };
        RiskMain.prototype.setupChildRoutes = function () {
            this._childRoutes = [
                {
                    route: "",
                    redirect: "details"
                },
                {
                    route: "details",
                    moduleId: "hema/presentation/modules/risks/riskItem",
                    name: "details",
                    nav: true,
                    title: "Details",
                    settings: { tabGroupParent: "risks" }
                }
            ];
        };
        RiskMain = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, RiskService_1.RiskService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, animationService_1.AnimationService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object])
        ], RiskMain);
        return RiskMain;
    }(editableViewModel_1.EditableViewModel));
    exports.RiskMain = RiskMain;
});

//# sourceMappingURL=riskMain.js.map
