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
define(["require", "exports", "../../../business/models/riskAcknowledgement", "aurelia-dependency-injection", "aurelia-dialog", "aurelia-event-aggregator", "aurelia-router", "aurelia-binding", "../../../business/models/dataState", "../../models/editableViewModel", "../../../../common/core/guid", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "../../../business/services/engineerService", "../../../business/services/jobService", "../../../business/services/labelService", "../../../business/services/riskService", "../../../business/services/validationService", "./viewModels/riskViewModel"], function (require, exports, riskAcknowledgement_1, aurelia_dependency_injection_1, aurelia_dialog_1, aurelia_event_aggregator_1, aurelia_router_1, aurelia_binding_1, dataState_1, editableViewModel_1, guid_1, businessRuleService_1, catalogService_1, engineerService_1, jobService_1, labelService_1, riskService_1, validationService_1, riskViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Risks = /** @class */ (function (_super) {
        __extends(Risks, _super);
        function Risks(labelService, riskService, jobService, engineerService, catalogService, eventAggregator, dialogService, validationService, businessRuleService, router) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._riskService = riskService;
            _this._router = router;
            _this.riskViewModels = [];
            return _this;
        }
        Risks.prototype.activateAsync = function (params) {
            var _this = this;
            this.jobId = params.jobId;
            return this._jobService.getJob(params.jobId)
                .then(function (job) {
                if (job) {
                    _this._job = job;
                    if (job.riskAcknowledgement) {
                        _this.riskMessageRead = job.riskAcknowledgement.messageRead;
                    }
                }
            })
                .then(function () { return _this.load(); })
                .then(function () { return _this.showContent(); });
        };
        Risks.prototype.navigateToRisk = function (id) {
            this._router.navigateToRoute("risk", { riskId: id });
        };
        Risks.prototype.newRisk = function () {
            this._router.navigateToRoute("risk", { riskId: guid_1.Guid.empty });
        };
        Risks.prototype.deleteRisk = function (event, id) {
            var _this = this;
            event.stopPropagation();
            this.showDeleteConfirmation()
                .then(function (shouldDelete) {
                if (shouldDelete) {
                    var foundIndex_1 = _this.riskViewModels.findIndex(function (riskViewModel) { return riskViewModel.risk.id === id; });
                    if (foundIndex_1 >= 0) {
                        _this._riskService.deleteRisk(_this.jobId, id)
                            .then(function () {
                            _this.riskViewModels.splice(foundIndex_1, 1);
                            _this.notifyDataStateChanged();
                        })
                            .catch(function (ex) {
                            _this.showError(ex);
                        });
                    }
                }
            });
        };
        Risks.prototype.accept = function () {
            var _this = this;
            if (this._job) {
                this._job.riskAcknowledgement = new riskAcknowledgement_1.RiskAcknowledgement();
                this._job.riskAcknowledgement.messageRead = true;
                this._job.riskAcknowledgement.dataState = dataState_1.DataState.valid;
                this.setIndividualRisksStatus();
                return this._jobService.setJob(this._job).then(function () {
                    _this.riskMessageRead = true;
                    _this.notifyDataStateChanged();
                });
            }
            else {
                return Promise.resolve();
            }
        };
        Risks.prototype.loadModel = function () {
            var _this = this;
            return this._riskService.getRisks(this.jobId)
                .then(function (risks) {
                (risks || []).forEach(function (risk) {
                    var riskViewModel = new riskViewModel_1.RiskViewModel();
                    riskViewModel.risk = risk;
                    _this.riskViewModels.push(riskViewModel);
                });
            });
        };
        Risks.prototype.setIndividualRisksStatus = function () {
            (this._job.risks || []).forEach(function (risk) {
                if (risk.dataState === dataState_1.DataState.notVisited) {
                    risk.dataState = dataState_1.DataState.valid;
                }
            });
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Array)
        ], Risks.prototype, "riskViewModels", void 0);
        Risks = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, riskService_1.RiskService, jobService_1.JobService, engineerService_1.EngineerService, catalogService_1.CatalogService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, aurelia_router_1.Router),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, aurelia_router_1.Router])
        ], Risks);
        return Risks;
    }(editableViewModel_1.EditableViewModel));
    exports.Risks = Risks;
});

//# sourceMappingURL=risks.js.map
