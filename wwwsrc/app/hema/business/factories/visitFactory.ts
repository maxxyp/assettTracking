import {IVisitFactory} from "./interfaces/IVisitFactory";

import {IVisit as VisitApiModel} from "../../api/models/fft/jobs/IVisit";
import {Visit as VisitBusinessModel} from "../models/visit";
import {IFutureVisit} from "../../api/models/fft/jobs/jobupdate/IFutureVisit";
import {Job as JobBusinessModel} from "../models/job";
import {DateHelper} from "../../core/dateHelper";
import { IFutureTask } from "../../api/models/fft/jobs/jobupdate/IFutureTask";

export class VisitFactory implements IVisitFactory {
    public createVisitBusinessModel(visitApiModel: VisitApiModel): VisitBusinessModel {
        let visitBusinessModel: VisitBusinessModel = new VisitBusinessModel();

        if (visitApiModel) {
            visitBusinessModel.id = visitApiModel.id;
            visitBusinessModel.timeSlotFrom = DateHelper.fromJsonDateTimeString(visitApiModel.earliestStartTime);
            visitBusinessModel.timeSlotTo = DateHelper.fromJsonDateTimeString(visitApiModel.latestStartTime);
            visitBusinessModel.specialInstructions = visitApiModel.specialInstructions;
            visitBusinessModel.engineerInstructions = visitApiModel.engineerInstructions;
        }

        return visitBusinessModel;
    }

    public createVisitApiModel(jobBusinessModel: JobBusinessModel): IFutureVisit {
        if (jobBusinessModel && jobBusinessModel.appointment) {
            let futureVisit = <IFutureVisit>{};

            futureVisit.premiseId = undefined; // non mandatory
            futureVisit.appointmentBandCode = jobBusinessModel.appointment.promisedTimeSlot;
            futureVisit.date = DateHelper.toJsonDateTimeString(jobBusinessModel.appointment.promisedDate);
            futureVisit.temporaryVisitInformation = jobBusinessModel.appointment.accessInformation;
            futureVisit.preferredEngineer = (jobBusinessModel.appointment.preferredEngineer) ? jobBusinessModel.appointment.preferredEngineer.toString() : undefined;
            if (jobBusinessModel.appointment.estimatedDurationOfAppointment) {
                futureVisit.tasks = [];
                jobBusinessModel.appointment.estimatedDurationOfAppointment.forEach((x, index) => {
                    let task = jobBusinessModel.tasks.find(t => t.id === x.taskId);
                    if (task) {
                        let visitTask = <IFutureTask>{};
                        visitTask.id = task.isNewRFA ? undefined : task.id;
                        visitTask.fieldTaskId = task.fieldTaskId;
                        visitTask.jobType = task.jobType;
                        visitTask.longJobForecastTime = x.duration;
                        visitTask.applianceType = task.applianceType;
                        visitTask.specialRequirement = x.specialRequirement;
                        futureVisit.tasks.push(visitTask);
                    }
                });
            }
            return futureVisit;
        } else {
            return undefined;
        }

    }
}
