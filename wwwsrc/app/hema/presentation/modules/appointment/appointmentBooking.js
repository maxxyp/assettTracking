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
define(["require", "exports", "./viewModels/taskTimeDurationModel", "aurelia-framework", "aurelia-router", "moment", "aurelia-event-aggregator", "../../../business/services/labelService", "../../../business/services/jobService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../.././../business/services/catalogService", "../../models/editableViewModel", "../../../business/models/dataState", "../../../business/services/engineerService", "../../../business/services/appointmentBookingService", "aurelia-dialog", "../../../business/models/appointment", "../../../business/models/appointmentDurationItem", "../../../business/models/jobState", "aurelia-binding", "../../../core/dateHelper"], function (require, exports, taskTimeDurationModel_1, aurelia_framework_1, aurelia_router_1, moment, aurelia_event_aggregator_1, labelService_1, jobService_1, validationService_1, businessRuleService_1, catalogService_1, editableViewModel_1, dataState_1, engineerService_1, appointmentBookingService_1, aurelia_dialog_1, appointment_1, appointmentDurationItem_1, jobState_1, aurelia_binding_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppointmentBooking = /** @class */ (function (_super) {
        __extends(AppointmentBooking, _super);
        function AppointmentBooking(jobService, engineerService, labelService, router, eventAggregator, validationService, businessRulesService, catalogService, bindingEngine, appointmentBookingService, dialogService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._appointmentBookingService = appointmentBookingService;
            _this.hasAppointment = false;
            _this._showAppointmentRemovedInfo = true;
            _this._router = router;
            _this.isTodaysDateAvailable = false;
            _this._bindingEngine = bindingEngine;
            _this._appointmentBookingSubscriptions = [];
            _this.estimatedDurationOfAppointmentMaxValue = 0;
            return _this;
        }
        AppointmentBooking.prototype.activateAsync = function (params) {
            var _this = this;
            this.jobId = params.jobId;
            return this.loadBusinessRules()
                .then(function () { return _this.buildBusinessRules(); })
                .then(function () { return _this.loadCatalogs(); })
                .then(function () { return _this.checkJobHasParts(); })
                .then(function () { return _this.load(); })
                .then(function () { return _this.buildValidationRules(); })
                .then(function () { return _this.showContent(); });
        };
        AppointmentBooking.prototype.navigateToJob = function () {
            if (this._job.state === jobState_1.JobState.done) {
                this._router.navigateToRoute("doneJob", { jobId: this._job.id });
            }
            else {
                this._router.navigateBack();
            }
        };
        AppointmentBooking.prototype.promisedDateChanged = function (date) {
            this.warnPromisedDateThreshold(date);
        };
        AppointmentBooking.prototype.promisedTimeSlotChanged = function (timeSlot) {
            var startTime = 0;
            if (timeSlot) {
                if (this.businessRules[timeSlot]) {
                    startTime = this.getBusinessRule(timeSlot);
                }
                else {
                    startTime = parseInt(timeSlot, 10);
                }
                this.estimatedDurationOfAppointmentMaxValue = dateHelper_1.DateHelper.getEstimatedDurationOfAppointmentMaxValue(startTime, this._estimatedEndTimeInMinutes);
                return this.validateAllRules();
            }
            return Promise.resolve();
        };
        AppointmentBooking.prototype.deactivateAsync = function () {
            this.clearSubscriptions();
            return Promise.resolve();
        };
        AppointmentBooking.prototype.saveAppointment = function () {
            var finalDataState = this.getFinalDataState();
            if (finalDataState !== dataState_1.DataState.valid) {
                return Promise.resolve();
            }
            var appointment = new appointment_1.Appointment();
            appointment.jobId = this.jobId;
            appointment.accessInformation = this.accessInformation;
            appointment.generalAccessInformation = this.generalAccessInformation;
            appointment.normalAccessInformation = this.normalAccessInformation;
            appointment.preferredEngineer = this.preferredEngineer;
            appointment.promisedDate = this.promisedDate;
            appointment.promisedTimeSlot = this.promisedTimeSlot;
            appointment.estimatedDurationOfAppointment = [];
            this.estimatedDurationOfAppointment.forEach(function (x) {
                var item = new appointmentDurationItem_1.AppointmentDurationItem();
                item.taskId = x.taskId;
                item.duration = x.duration;
                item.specialRequirement = x.specialRequirement;
                appointment.estimatedDurationOfAppointment.push(item);
            });
            appointment.dataState = finalDataState;
            this.hasAppointment = true;
            return this._appointmentBookingService.save(appointment);
        };
        AppointmentBooking.prototype.loadModel = function () {
            var _this = this;
            this.isNew = true;
            this.clearSubscriptions();
            return Promise.all([this._jobService.getJob(this.jobId), this._engineerService.getCurrentEngineer()])
                .then(function (_a) {
                var job = _a[0], engineer = _a[1];
                _this._job = job;
                _this.setState(job);
                if (_this._job && _this.canBook) {
                    _this.initDate();
                    _this.setObservables();
                    if (_this._job.appointment) {
                        _this.hasAppointment = true;
                        _this.accessInformation = _this._job.appointment.accessInformation;
                        _this.generalAccessInformation = _this._job.appointment.generalAccessInformation;
                        _this.normalAccessInformation = _this._job.appointment.normalAccessInformation;
                        _this.promisedDate = moment(_this._job.appointment.promisedDate).toDate();
                        _this.promisedTimeSlot = _this._job.appointment.promisedTimeSlot;
                        _this.estimatedDurationOfAppointment = [];
                        _this.preferredEngineer = _this._job.appointment.preferredEngineer;
                        _this.setInitialDataState(_this._job.appointment.dataStateId, _this._job.appointment.dataState);
                        _this.setTaskTimeDurations(_this._job.tasks, _this._job.appointment);
                    }
                    else {
                        _this.preferredEngineer = engineer.id;
                        _this.initFields();
                    }
                }
            });
        };
        AppointmentBooking.prototype.clearModel = function () {
            var _this = this;
            return this._appointmentBookingService.removeAppointment(this.jobId)
                .then(function () { return _this.init(); })
                .then(function () { return _this.initDate(); })
                .then(function () {
                if (_this._showAppointmentRemovedInfo) {
                    _this.showInfo(_this.getLabel("appointmentNotificationTitle"), _this.getLabel("appointmentRemoved"));
                }
                _this.hasAppointment = false;
                _this.clearFields();
            });
        };
        AppointmentBooking.prototype.showSaveToast = function (finalDataState) {
            if (finalDataState === dataState_1.DataState.valid) {
                this.showSuccess(this.getLabel("appointmentNotificationTitle"), this.getLabel("appointmentSaved"));
            }
            else {
                this.showDanger(this.getLabel("appointmentNotificationTitle"), this.getLabel("appointmentNotSaved"));
            }
        };
        AppointmentBooking.prototype.clearFields = function () {
            this.promisedDate = undefined;
            this.preferredEngineer = undefined;
            this.accessInformation = undefined;
            this.promisedTimeSlot = undefined;
            this.estimatedDurationOfAppointmentMaxValue = undefined;
            this.setTaskTimeDurations(this._job.tasks, this._job.appointment);
        };
        AppointmentBooking.prototype.initFields = function () {
            this.hasAppointment = false;
            this.init();
            this.setTaskTimeDurations(this._job.tasks, null);
            this.promisedTimeSlot = undefined;
            this.setNewDataState("appointment");
        };
        AppointmentBooking.prototype.buildBusinessRules = function () {
            var _this = this;
            this._promiseDateWarningThreshold = this.getBusinessRule("promiseDateWarningThreshold");
            this._cutOffTime = this.getBusinessRule("cutOffTime");
            this.preferredEngineerIdPlaceholder = this.getBusinessRule("preferredEngineerIdPlaceholder");
            this._appointmentAllowedActivityStatus = this.getBusinessRule("appointmentAllowedActivityStatus").split(",");
            this.estimatedDurationOfAppointmentPlaceholder = this.getBusinessRule("estimatedDurationOfAppointmentPlaceholder");
            this.estimatedDurationOfAppointmentMaxLength = this.getBusinessRule("estimatedDurationOfAppointmentMaxLength");
            this._estimatedEndTimeInMinutes = this.getBusinessRule("estimatedEndTimeInMinutes");
            return this._businessRuleService.getQueryableRuleGroup("taskItem").then(function (taskItemRuleGroup) {
                _this._partsRequiredStatus = taskItemRuleGroup.getBusinessRule("activityPartsRequiredStatus");
            });
        };
        AppointmentBooking.prototype.buildValidationRules = function () {
            var _this = this;
            var estimatedDurationRules = [];
            var otherRules = [
                {
                    property: "promisedDate", condition: function () { return _this.canBook; }
                },
                {
                    property: "promisedTimeSlot", condition: function () { return _this.canBook; },
                },
                {
                    property: "preferredEngineer", condition: function () { return !!_this.preferredEngineer; }
                }
            ];
            if (this.estimatedDurationOfAppointment && this.estimatedDurationOfAppointment.length > 0) {
                this.estimatedDurationOfAppointment.forEach(function (app, index) {
                    estimatedDurationRules.push({
                        property: "estimatedDurationOfAppointment[" + index + "].duration",
                        groups: ["estimatedDurationOfAppointment[" + index + "]"],
                        condition: function () { return _this.estimatedDurationOfAppointment[index].duration && _this.promisedTimeSlot ? true : false; },
                        passes: [
                            {
                                test: function () { return _this.estimatedDurationOfAppointment[index].duration > _this.estimatedDurationOfAppointmentMaxValue ? false : true; },
                                message: function () { return _this.getParameterisedLabel("estimatedDurationMaxValueError", [_this.estimatedDurationOfAppointmentMaxValue]); }
                            }
                        ]
                    });
                });
            }
            return this.buildValidation(otherRules.concat(estimatedDurationRules));
        };
        AppointmentBooking.prototype.loadCatalogs = function () {
            var _this = this;
            return Promise.all([
                this._catalogService.getAppointmentBands()
            ]).then(function (_a) {
                var promisedTimeSlotCatalog = _a[0];
                if (promisedTimeSlotCatalog) {
                    _this.promisedTimeSlotCatalog = promisedTimeSlotCatalog;
                }
            });
        };
        AppointmentBooking.prototype.init = function () {
            var _this = this;
            if (this.promisedTimeSlotCatalog && this.promisedTimeSlotCatalog[0]) {
                this.promisedTimeSlot = this.promisedTimeSlotCatalog[0].appointmentBandCode;
            }
            return this._appointmentBookingService.getGeneralAccessInformation(this.jobId)
                .then(function (value) {
                _this.generalAccessInformation = value;
            });
        };
        AppointmentBooking.prototype.checkJobHasParts = function () {
            var _this = this;
            return this._appointmentBookingService.hasParts(this.jobId).then(function (val) {
                _this.hasParts = val;
            });
        };
        AppointmentBooking.prototype.warnPromisedDateThreshold = function (promisedDate) {
            if (promisedDate) {
                var date1 = moment(promisedDate);
                var date2 = moment();
                var noOfDays = date1.diff(date2, "days");
                if (noOfDays >= this._promiseDateWarningThreshold) {
                    this.showWarning(this.getLabel("promisedDate"), this.getParameterisedLabel("promiseDateWarningThresholdWarning", [this._promiseDateWarningThreshold]));
                }
            }
        };
        AppointmentBooking.prototype.setState = function (job) {
            var _this = this;
            if (job && job.tasks) {
                if (this._job.tasks.find(function (x) { return _this._appointmentAllowedActivityStatus.some(function (el) { return el === x.status; }); })) {
                    this.canBook = true;
                }
                else {
                    this.canBook = false;
                }
            }
        };
        AppointmentBooking.prototype.setTaskTimeDurations = function (tasks, appointment) {
            var _this = this;
            this.estimatedDurationOfAppointment = [];
            tasks.filter(function (task) { return _this._appointmentAllowedActivityStatus.indexOf(task.status) !== -1; })
                .forEach(function (x) {
                if (x) {
                    var time = new taskTimeDurationModel_1.TaskTimeDurationModel();
                    time.taskId = x.id;
                    time.jobType = x.jobType;
                    time.applianceType = x.applianceType;
                    if (appointment) {
                        var appointmentDuration = appointment.estimatedDurationOfAppointment.find(function (y) { return y.taskId === x.id; });
                        if (appointmentDuration) {
                            time.duration = appointmentDuration.duration;
                            time.specialRequirement = appointmentDuration.specialRequirement;
                        }
                    }
                    else {
                        time.duration = undefined;
                        time.specialRequirement = undefined;
                    }
                    _this.estimatedDurationOfAppointment.push(time);
                }
            });
        };
        AppointmentBooking.prototype.initDate = function () {
            var _this = this;
            var todaysDate = dateHelper_1.DateHelper.getTodaysDate();
            var isPartsRequired = this._job.tasks.some(function (t) { return t.status === _this._partsRequiredStatus; });
            if (this._job && this._job.appointment && this._job.appointment.promisedDate) {
                this.minDate = this._job.appointment.promisedDate;
            }
            else {
                if (!this.hasParts && !isPartsRequired) {
                    this.minDate = todaysDate;
                }
                else {
                    if (this._appointmentBookingService.checkCutOffTimeExceededWithParts(moment(todaysDate).toDate(), moment(todaysDate).toDate(), this._cutOffTime)) {
                        this.minDate = this._appointmentBookingService.getNexAppointmentDateWithParts(moment(todaysDate).add(2, "days").toDate());
                    }
                    else {
                        this.minDate = moment(todaysDate).add(1, "days").toDate();
                    }
                }
            }
            this.isTodaysDateAvailable = moment(todaysDate).isSame(moment(this.minDate));
        };
        AppointmentBooking.prototype.setObservables = function () {
            var _this = this;
            var sub1 = this._bindingEngine.propertyObserver(this, "promisedDate")
                .subscribe(function (newValue) { return _this.promisedDateChanged(newValue); });
            this._appointmentBookingSubscriptions.push(sub1);
            var sub2 = this._bindingEngine.propertyObserver(this, "promisedTimeSlot")
                .subscribe(function (newValue) { return _this.promisedTimeSlotChanged(newValue); });
            this._appointmentBookingSubscriptions.push(sub2);
        };
        AppointmentBooking.prototype.clearSubscriptions = function () {
            if (this._appointmentBookingSubscriptions.length > 0) {
                this._appointmentBookingSubscriptions.forEach(function (s) { return s.dispose(); });
                this._appointmentBookingSubscriptions = [];
            }
        };
        AppointmentBooking = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, aurelia_binding_1.BindingEngine, appointmentBookingService_1.AppointmentBookingService, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator, Object, Object, Object, aurelia_binding_1.BindingEngine, Object, aurelia_dialog_1.DialogService])
        ], AppointmentBooking);
        return AppointmentBooking;
    }(editableViewModel_1.EditableViewModel));
    exports.AppointmentBooking = AppointmentBooking;
});

//# sourceMappingURL=appointmentBooking.js.map
