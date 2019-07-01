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
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../.././../business/services/catalogService", "../../../business/services/jobService", "../../../business/services/taskService", "../../models/editableViewModel", "../../../business/services/labelService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/engineerService", "aurelia-dialog"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, catalogService_1, jobService_1, taskService_1, editableViewModel_1, labelService_1, validationService_1, businessRuleService_1, engineerService_1, aurelia_dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskVisitDetails = /** @class */ (function (_super) {
        __extends(TaskVisitDetails, _super);
        function TaskVisitDetails(catalogService, jobService, engineerService, labelService, taskService, eventAggregator, dialogService, validationService, businessRulesService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._taskService = taskService;
            _this.statuses = {};
            _this.visits = [];
            _this.noData = true;
            return _this;
        }
        TaskVisitDetails.prototype.activateAsync = function (params) {
            var _this = this;
            this._taskId = params.taskId;
            return this.loadCatalogs()
                .then(function () { return _this.load(); })
                .then(function () { return _this.showContent(); });
        };
        TaskVisitDetails.prototype.loadModel = function () {
            var _this = this;
            return this._taskService.getTaskItem(this.jobId, this._taskId).then(function (task) {
                if (task && task.previousVisits) {
                    _this.visits = task.previousVisits;
                }
                _this.noData = !(_this.visits && _this.visits.length > 0);
            });
        };
        TaskVisitDetails.prototype.loadCatalogs = function () {
            var _this = this;
            return this._catalogService.getActivityComponentVisitStatuses()
                .then(function (jobStatus) {
                jobStatus.map(function (js) {
                    return _this.statuses[js.status] = js.statusDescription;
                });
            });
        };
        TaskVisitDetails = __decorate([
            aurelia_framework_1.inject(catalogService_1.CatalogService, jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, taskService_1.TaskService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object])
        ], TaskVisitDetails);
        return TaskVisitDetails;
    }(editableViewModel_1.EditableViewModel));
    exports.TaskVisitDetails = TaskVisitDetails;
});

//# sourceMappingURL=taskVisitDetails.js.map
