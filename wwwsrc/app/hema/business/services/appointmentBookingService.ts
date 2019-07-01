import { inject } from "aurelia-framework";
import { IAppointmentBookingService } from "./interfaces/IAppointmentBookingService";
import { JobService } from "./jobService";
import { IJobService } from "./interfaces/IJobService";
import { Job } from "../models/job";
import { Appointment } from "../models/appointment";
import { DateHelper } from "../../core/dateHelper";
import * as moment from "moment";
import { BusinessRuleService } from "./businessRuleService";
import { IBusinessRuleService } from "./interfaces/IBusinessRuleService";

@inject(JobService, BusinessRuleService)
export class AppointmentBookingService implements IAppointmentBookingService {
    private _jobService: IJobService;
    private _businessRuleService: IBusinessRuleService;
    constructor(jobService: IJobService, businessRuleService: IBusinessRuleService) {
        this._jobService = jobService;
        this._businessRuleService = businessRuleService;
    }

    public getGeneralAccessInformation(jobId: string): Promise<string> {
        return this._jobService.getJob(jobId).then((job: Job) => {
            if (job && job.premises) {
                return job.premises.accessInfo;
            } else {
                return undefined;
            }
        });
    }

    public save(appointment: Appointment): Promise<void> {
        return this._jobService.getJob(appointment.jobId).then((job: Job) => {
            job.appointment = appointment;
            return this._jobService.setJob(job);
        });
    }

    public removeAppointment(jobId: string): Promise<void> {
        return this._jobService.getJob(jobId).then((job: Job) => {
            job.appointment = undefined;
            return this._jobService.setJob(job);
        });
    }

    public load(jobId: string): Promise<Appointment> {
        return this._jobService.getJob(jobId).then((job: Job) => {
            return job.appointment;
        });
    }

    public hasParts(jobId: string): Promise<boolean> {
        return this.getPartJobStatusRule().then((rule: string) => {
            return this._jobService.getJob(jobId).then((job: Job) => {
                if (job && job.partsDetail && job.partsDetail.partsBasket
                    && job.partsDetail.partsBasket.partsToOrder 
                    && job.partsDetail.partsBasket.partsToOrder.some(x => x.partOrderStatus === rule)) {
                    return true;
                } else {
                    return false;
                }
            });
        });
    }

    public checkCutOffTimeExceededWithParts(promisedDateOnly: Date, promisedTimeOnly: Date, cutOffTime: string): boolean {         
        return (DateHelper.dateInMondayToFriday(promisedDateOnly) || DateHelper.dateIsOnSunday(promisedDateOnly)) ?
                        this.checkIfCutoffTimeHasBeenExceeded(cutOffTime, moment(promisedTimeOnly).format(DateHelper.timeFormat)) :
                        true;    
    }

    public checkIfAppointmentNeedsToBeRebooked(appointmentDate: Date, startTime: Date, cutOffTime: string): boolean {
        let tomorrow = moment(DateHelper.getTodaysDate()).add(1, "days");
        let daysDiff = moment(appointmentDate).startOf("day").diff(tomorrow.startOf("day"), "days");
        let rebook =  (daysDiff < 0) ? true : false;
        
        if (daysDiff === 0) {
            if (this.checkIfCutoffTimeHasBeenExceeded(cutOffTime, moment(startTime).format(DateHelper.timeFormat))) {
                rebook = true;
            } else if (DateHelper.dateIsOnSunday(appointmentDate)) {
                rebook = true;
            }
        }
        return rebook;        
    }

    public getNexAppointmentDateWithParts(date: Date): Date {
        let nextDate: Date;
        if (DateHelper.dateIsOnSunday(date)) {
            nextDate = moment(date).add(1, "day").toDate();
        } else {
            nextDate = date;
        }
        return nextDate;
    }

    private checkIfCutoffTimeHasBeenExceeded(cutOffTime: string, timeToBeTested: string): boolean {
        let cutOffTimeMoment = moment(cutOffTime, DateHelper.timeFormat);
        let promisedTime = DateHelper.parseTimeRangeSlot(timeToBeTested).start;
        if (promisedTime.add(1, "minute").isAfter(cutOffTimeMoment)) {
            return true;
        } else {
            return false;
        }
    }

    private getPartJobStatusRule(): Promise<string> {
        return this._businessRuleService.getQueryableRuleGroup("partsBasket")
            .then((ruleGroup) => {
                return ruleGroup.getBusinessRule<string>("partOrderStatus");
            });
    }
}
