var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./jobService", "../../core/dateHelper", "moment", "./businessRuleService"], function (require, exports, aurelia_framework_1, jobService_1, dateHelper_1, moment, businessRuleService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppointmentBookingService = /** @class */ (function () {
        function AppointmentBookingService(jobService, businessRuleService) {
            this._jobService = jobService;
            this._businessRuleService = businessRuleService;
        }
        AppointmentBookingService.prototype.getGeneralAccessInformation = function (jobId) {
            return this._jobService.getJob(jobId).then(function (job) {
                if (job && job.premises) {
                    return job.premises.accessInfo;
                }
                else {
                    return undefined;
                }
            });
        };
        AppointmentBookingService.prototype.save = function (appointment) {
            var _this = this;
            return this._jobService.getJob(appointment.jobId).then(function (job) {
                job.appointment = appointment;
                return _this._jobService.setJob(job);
            });
        };
        AppointmentBookingService.prototype.removeAppointment = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                job.appointment = undefined;
                return _this._jobService.setJob(job);
            });
        };
        AppointmentBookingService.prototype.load = function (jobId) {
            return this._jobService.getJob(jobId).then(function (job) {
                return job.appointment;
            });
        };
        AppointmentBookingService.prototype.hasParts = function (jobId) {
            var _this = this;
            return this.getPartJobStatusRule().then(function (rule) {
                return _this._jobService.getJob(jobId).then(function (job) {
                    if (job && job.partsDetail && job.partsDetail.partsBasket
                        && job.partsDetail.partsBasket.partsToOrder
                        && job.partsDetail.partsBasket.partsToOrder.some(function (x) { return x.partOrderStatus === rule; })) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            });
        };
        AppointmentBookingService.prototype.checkCutOffTimeExceededWithParts = function (promisedDateOnly, promisedTimeOnly, cutOffTime) {
            return (dateHelper_1.DateHelper.dateInMondayToFriday(promisedDateOnly) || dateHelper_1.DateHelper.dateIsOnSunday(promisedDateOnly)) ?
                this.checkIfCutoffTimeHasBeenExceeded(cutOffTime, moment(promisedTimeOnly).format(dateHelper_1.DateHelper.timeFormat)) :
                true;
        };
        AppointmentBookingService.prototype.checkIfAppointmentNeedsToBeRebooked = function (appointmentDate, startTime, cutOffTime) {
            var tomorrow = moment(dateHelper_1.DateHelper.getTodaysDate()).add(1, "days");
            var daysDiff = moment(appointmentDate).startOf("day").diff(tomorrow.startOf("day"), "days");
            var rebook = (daysDiff < 0) ? true : false;
            if (daysDiff === 0) {
                if (this.checkIfCutoffTimeHasBeenExceeded(cutOffTime, moment(startTime).format(dateHelper_1.DateHelper.timeFormat))) {
                    rebook = true;
                }
                else if (dateHelper_1.DateHelper.dateIsOnSunday(appointmentDate)) {
                    rebook = true;
                }
            }
            return rebook;
        };
        AppointmentBookingService.prototype.getNexAppointmentDateWithParts = function (date) {
            var nextDate;
            if (dateHelper_1.DateHelper.dateIsOnSunday(date)) {
                nextDate = moment(date).add(1, "day").toDate();
            }
            else {
                nextDate = date;
            }
            return nextDate;
        };
        AppointmentBookingService.prototype.checkIfCutoffTimeHasBeenExceeded = function (cutOffTime, timeToBeTested) {
            var cutOffTimeMoment = moment(cutOffTime, dateHelper_1.DateHelper.timeFormat);
            var promisedTime = dateHelper_1.DateHelper.parseTimeRangeSlot(timeToBeTested).start;
            if (promisedTime.add(1, "minute").isAfter(cutOffTimeMoment)) {
                return true;
            }
            else {
                return false;
            }
        };
        AppointmentBookingService.prototype.getPartJobStatusRule = function () {
            return this._businessRuleService.getQueryableRuleGroup("partsBasket")
                .then(function (ruleGroup) {
                return ruleGroup.getBusinessRule("partOrderStatus");
            });
        };
        AppointmentBookingService = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object, Object])
        ], AppointmentBookingService);
        return AppointmentBookingService;
    }());
    exports.AppointmentBookingService = AppointmentBookingService;
});

//# sourceMappingURL=appointmentBookingService.js.map
