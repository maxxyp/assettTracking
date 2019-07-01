/// <reference path="../../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/models/jobState", "../../../business/services/jobService"], function (require, exports, aurelia_framework_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, jobState_1, jobService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Done = /** @class */ (function (_super) {
        __extends(Done, _super);
        function Done(labelService, eventAggregator, dialogService, jobService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.jobs = [];
            _this._jobService = jobService;
            return _this;
        }
        Done.prototype.activateAsync = function () {
            var _this = this;
            return this._jobService.getJobsToDo()
                .then(function (jobsToDo) {
                _this.jobs = (jobsToDo || []).filter(function (j) { return j.state === jobState_1.JobState.done; });
            }).then(function () {
                _this.showContent();
            });
        };
        Done = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, jobService_1.JobService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object])
        ], Done);
        return Done;
    }(baseViewModel_1.BaseViewModel));
    exports.Done = Done;
});

//# sourceMappingURL=done.js.map
