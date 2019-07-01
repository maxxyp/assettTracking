define(["require", "exports", "../models/visit", "../../core/dateHelper"], function (require, exports, visit_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VisitFactory = /** @class */ (function () {
        function VisitFactory() {
        }
        VisitFactory.prototype.createVisitBusinessModel = function (visitApiModel) {
            var visitBusinessModel = new visit_1.Visit();
            if (visitApiModel) {
                visitBusinessModel.id = visitApiModel.id;
                visitBusinessModel.timeSlotFrom = dateHelper_1.DateHelper.fromJsonDateTimeString(visitApiModel.earliestStartTime);
                visitBusinessModel.timeSlotTo = dateHelper_1.DateHelper.fromJsonDateTimeString(visitApiModel.latestStartTime);
                visitBusinessModel.specialInstructions = visitApiModel.specialInstructions;
                visitBusinessModel.engineerInstructions = visitApiModel.engineerInstructions;
            }
            return visitBusinessModel;
        };
        VisitFactory.prototype.createVisitApiModel = function (jobBusinessModel) {
            if (jobBusinessModel && jobBusinessModel.appointment) {
                var futureVisit_1 = {};
                futureVisit_1.premiseId = undefined; // non mandatory
                futureVisit_1.appointmentBandCode = jobBusinessModel.appointment.promisedTimeSlot;
                futureVisit_1.date = dateHelper_1.DateHelper.toJsonDateTimeString(jobBusinessModel.appointment.promisedDate);
                futureVisit_1.temporaryVisitInformation = jobBusinessModel.appointment.accessInformation;
                futureVisit_1.preferredEngineer = (jobBusinessModel.appointment.preferredEngineer) ? jobBusinessModel.appointment.preferredEngineer.toString() : undefined;
                if (jobBusinessModel.appointment.estimatedDurationOfAppointment) {
                    futureVisit_1.tasks = [];
                    jobBusinessModel.appointment.estimatedDurationOfAppointment.forEach(function (x, index) {
                        var task = jobBusinessModel.tasks.find(function (t) { return t.id === x.taskId; });
                        if (task) {
                            var visitTask = {};
                            visitTask.id = task.isNewRFA ? undefined : task.id;
                            visitTask.fieldTaskId = task.fieldTaskId;
                            visitTask.jobType = task.jobType;
                            visitTask.longJobForecastTime = x.duration;
                            visitTask.applianceType = task.applianceType;
                            visitTask.specialRequirement = x.specialRequirement;
                            futureVisit_1.tasks.push(visitTask);
                        }
                    });
                }
                return futureVisit_1;
            }
            else {
                return undefined;
            }
        };
        return VisitFactory;
    }());
    exports.VisitFactory = VisitFactory;
});

//# sourceMappingURL=visitFactory.js.map
