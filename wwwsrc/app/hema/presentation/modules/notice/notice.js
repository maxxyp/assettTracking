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
define(["require", "exports", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-dependency-injection", "../../../business/services/riskService", "moment", "aurelia-dialog", "aurelia-event-aggregator", "../../../../common/core/objectHelper"], function (require, exports, baseViewModel_1, labelService_1, aurelia_dependency_injection_1, riskService_1, moment, aurelia_dialog_1, aurelia_event_aggregator_1, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Notice = /** @class */ (function (_super) {
        __extends(Notice, _super);
        function Notice(labelService, eventAggregator, dialogService, riskService, controller) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._riskService = riskService;
            _this.controller = controller;
            _this.risks = [];
            _this.hazard = null;
            _this.hazardTitle = "";
            return _this;
        }
        Notice.prototype.activateAsync = function (params) {
            var _this = this;
            this.jobId = params.jobId;
            return this._riskService.getRisks(params.jobId).then(function (risks) {
                _this.risks = risks.filter(function (r) { return r.isHazard === false; });
                /* clone the object as we modify it later with label lookup, but we dont want to break original data */
                _this.hazard = objectHelper_1.ObjectHelper.clone(risks.find(function (r) { return r.isHazard === true; }));
                if (_this.hazard) {
                    _this.hazardTitle = _this.getLabel("hazard");
                }
                _this.showContent();
            });
        };
        Notice.prototype.getYear = function (dt) {
            return moment(dt).format("YYYY");
        };
        Notice = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, riskService_1.RiskService, aurelia_dialog_1.DialogController),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, aurelia_dialog_1.DialogController])
        ], Notice);
        return Notice;
    }(baseViewModel_1.BaseViewModel));
    exports.Notice = Notice;
});

//# sourceMappingURL=notice.js.map
