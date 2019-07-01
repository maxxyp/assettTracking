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
define(["require", "exports", "aurelia-dependency-injection", "../../../business/services/jobService", "../../../business/services/labelService", "../../models/baseViewModel", "aurelia-event-aggregator", "aurelia-dialog", "../../factories/jobSummaryFactory"], function (require, exports, aurelia_dependency_injection_1, jobService_1, labelService_1, baseViewModel_1, aurelia_event_aggregator_1, aurelia_dialog_1, jobSummaryFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppointmentBookingMain = /** @class */ (function (_super) {
        __extends(AppointmentBookingMain, _super);
        function AppointmentBookingMain(labelService, eventAggregator, dialogService, jobService, jobSummaryFactory) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._jobService = jobService;
            _this._jobSummaryFactory = jobSummaryFactory;
            _this.childRoutes = _this.getAppointmentBookingChildRoute();
            return _this;
        }
        AppointmentBookingMain.prototype.configureRouter = function (config, childRouter) {
            config.map(this.childRoutes);
        };
        AppointmentBookingMain.prototype.activateAsync = function (params) {
            var _this = this;
            return this._jobService.getJob(params.jobId).then(function (job) {
                _this.job = job;
                _this.jobSummaryViewModel = _this._jobSummaryFactory.createJobSummaryViewModel(_this.job);
                _this.showContent();
            });
        };
        AppointmentBookingMain.prototype.getAppointmentBookingChildRoute = function () {
            return [
                {
                    route: "",
                    redirect: "book-an-appointment"
                },
                {
                    route: "book-an-appointment",
                    moduleId: "hema/presentation/modules/appointment/appointmentBooking",
                    name: "book-an-appointment",
                    nav: false,
                    title: "Book an Appointment",
                    settings: {
                        canEditCancelledJob: true
                    }
                }
            ];
        };
        AppointmentBookingMain = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, jobService_1.JobService, jobSummaryFactory_1.JobSummaryFactory),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object])
        ], AppointmentBookingMain);
        return AppointmentBookingMain;
    }(baseViewModel_1.BaseViewModel));
    exports.AppointmentBookingMain = AppointmentBookingMain;
});

//# sourceMappingURL=appointmentBookingMain.js.map
