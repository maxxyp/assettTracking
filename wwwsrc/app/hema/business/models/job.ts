import { Appointment } from "./appointment";
import { Visit } from "./visit";
import { Contact } from "./contact";
import { Risk } from "./risk";
import { Premises } from "./premises";
import { Task } from "./task";
import { History } from "./history";
import { JobState } from "./jobState";
import { PropertySafety } from "./propertySafety";
import { PartsDetail } from "./partsDetail";
import { Charge } from "./charge/charge";
import { Address as AddressBusinessModel } from "./address";
import { CustomerContact } from "./customerContact";
import { RiskAcknowledgement } from "./riskAcknowledgement";
import { NumberHelper } from "../../core/numberHelper";
import { DateHelper } from "../../core/dateHelper";
import { JobNotDoingReason } from "./jobNotDoingReason";
import { PropertySafetyType } from "./propertySafetyType";
import { Guid } from "../../../common/core/guid";
import { Part } from "./part";

export class Job {
    public id: string;
    public isBadlyFormed: {isBadlyFormed: boolean, reason?: string};
    public uniqueId: string; // jobs with the same id can be returned from WMIS
    public wmisTimestamp: string; // keep as string for the time being, we only need to know if/when this changes
    public position: number;
    public customerId: string;
    public risks: Risk[];

    // added by #15745, risks go back to WMIS via appliance object, so need to participate in CRUD tracking
    public deletedRisks: Risk[];

    public contact: Contact;
    public premises: Premises;
    public customerAddress: AddressBusinessModel;
    public customerContact: CustomerContact;
    public visit: Visit;

    public tasks: Task[];
    public tasksNotToday: Task[];

    public specialInstructions: string;
    public history: History;
    public propertySafetyType: PropertySafetyType;
    public propertySafety: PropertySafety;

    public dispatchTime: Date;
    public enrouteTime: Date;
    public onsiteTime: Date;
    public completionTime: Date;
    public pendingTime: Date;
    public allocationTime: Date;
    public holdTime: Date;
    public cancellationTime: Date;

    public state: JobState;

    public appointment: Appointment;
    public partsDetail: PartsDetail;
    public charge: Charge;
    public isLandlordJob: boolean;
    public wasOriginallyLandlordJob: boolean;
    public riskAcknowledgement: RiskAcknowledgement;
    public jobNotDoingReason: JobNotDoingReason;

    constructor() {
        this.state = JobState.idle;
        this.riskAcknowledgement = new RiskAcknowledgement();
        this.uniqueId = Guid.newGuid();
    }

    public static hasCharge(job: Job): boolean {
        return job && job.tasks && job.tasks.some(task => task.isCharge);
    }

    public static isActive(job: Job): boolean {
        return !!job && job.state !== JobState.idle && job.state !== JobState.done;
    }

    public static getTasksAndCompletedTasks(job: Job): Task[] {
        // tasks are stored in their presentation order.  We want completed tasks at the end
        //  so the combined list of tasks emerging from here will be in the desired presentation order.
        //  todo: should ordering be done explicitly at the UI?
        return (job.tasks || []).concat(job.tasksNotToday || []);
    }

    public static hasHazardAndRisk(job: Job): { hasHazard: boolean, hasRisk: boolean } {
        let risks = job.risks || [];

        return {
            hasHazard: risks.some(risk => risk.isHazard),
            hasRisk: risks.some(risk => !risk.isHazard)
        };
    }

    public static isLandlordJob(job: Job): boolean {
        return !!(job
                    && job.tasks
                    && job.tasks.some(task =>
                        task
                        && !task.isNotDoingTask
                        && task.jobType === "AS"
                        && task.applianceType === "INS"
                        )
        );
    }

    public static fromJson(raw: any): Job {

        let job = new Job();

        Object.assign(job, raw);

        job.dispatchTime = DateHelper.convertDateTime(raw.dispatchTime);
        job.enrouteTime = DateHelper.convertDateTime(raw.enrouteTime);
        job.onsiteTime = DateHelper.convertDateTime(raw.onsiteTime);
        job.completionTime = DateHelper.convertDateTime(raw.completionTime);
        job.pendingTime = DateHelper.convertDateTime(raw.pendingTime);
        job.allocationTime = DateHelper.convertDateTime(raw.allocationTime);
        job.holdTime = DateHelper.convertDateTime(raw.holdTime);
        job.cancellationTime = DateHelper.convertDateTime(raw.cancellationTime);

        // todo put in Risks.fromJson(...)
        if (raw.risks) {
            raw.risks.forEach((risk: any) => risk.date = DateHelper.convertDateTime(risk.date));
            job.risks = raw.risks;
        }

        if (raw.deletedRisks) {
            raw.deletedRisks.forEach((risk: any) => risk.date = DateHelper.convertDateTime(risk.date));
            job.deletedRisks = raw.deletedRisks;
        }

        // todo put in Visit.fromJson...
        if (raw.visit) {
            const {timeSlotFrom, timeSlotTo} = raw.visit;
            job.visit.timeSlotFrom = DateHelper.convertDateTime(timeSlotFrom);
            job.visit.timeSlotTo = DateHelper.convertDateTime(timeSlotTo);
        }

        // todo put in Task.fromJson
        if (raw.tasks) {
            raw.tasks.forEach((task: any) => {
                if (task.activities) {
                    task.activities.forEach((activity: any) => {
                        activity.date = DateHelper.convertDateTime(activity.date);

                        if (activity.parts && activity.parts.length > 0) {
                            activity.parts.forEach((part: any) => Part.fromJson(part));
                        }
                    });
                }
            });

            job.tasks = raw.tasks;
        }

        if (raw.tasksNotToday) {
            raw.tasksNotToday.forEach((task: any) => {
                if (task.activities) {
                    task.activities.forEach((activity: any) => {
                        activity.date = DateHelper.convertDateTime(activity.date);
                    });
                }
            });

            job.tasksNotToday = raw.tasksNotToday;
        }

        // todo put in History.fromJson ...

        if (raw.history) {
            if (raw.history.tasks) {
                raw.history.tasks.forEach((task: any) => {
                    task.activities.forEach((activity: any) => {
                        activity.date = DateHelper.convertDateTime(activity.date);
                    });
                });
            }

            if (raw.history.appliances) {
                raw.history.appliances.forEach((appliance: any) => {
                    appliance.contractExpiryDate = DateHelper.convertDateTime(appliance.contractExpiryDate);

                    if (appliance.safety && appliance.safety.previousApplianceUnsafeDetail) {
                        appliance.safety.previousApplianceUnsafeDetail.date =
                            DateHelper.convertDateTime(appliance.safety.previousApplianceUnsafeDetail.date);
                    }
                });
            }

            job.history = raw.history;
        }

        // todo put in Appointment.fromJson...
        if (raw.appointment) {
            raw.appointment.promisedDate = DateHelper.convertDateTime(raw.appointment.promisedDate);
            job.appointment = raw.appointment;
        }

        // todo put in PartBasket

        if (raw.partsDetail) {
            let {partsToday, partsBasket} = raw.partsDetail;

            if (partsToday && partsToday.parts && partsToday.parts.length > 0) {
                partsToday.parts.forEach((p: any) => Part.fromJson(p));
            }

            if (partsBasket) {

                partsBasket.lastPartGatheredTime = DateHelper.convertDateTime(partsBasket.lastPartGatheredTime);

                let {partsInBasket, partsToOrder, manualPartDetail} = partsBasket;

                if (partsInBasket && partsInBasket.length > 0) {
                    partsInBasket.forEach((p: any) => Part.fromJson(p));
                }

                if (partsToOrder && partsToOrder.length > 0) {
                    partsToOrder.forEach((p: any) => Part.fromJson(p));
                }

                if (manualPartDetail && manualPartDetail.price) {
                    manualPartDetail.price = NumberHelper.convertToBigNumber(manualPartDetail.price);
                }
            }

            job.partsDetail = raw.partsDetail;
        }

        // todo put in chargeableMain

        if (raw.charge) {
            job.charge.discountAmount = NumberHelper.convertToBigNumber(raw.charge.discountAmount);
            job.charge.netTotal = NumberHelper.convertToBigNumber(raw.charge.netTotal);
            job.charge.chargeTotal = NumberHelper.convertToBigNumber(raw.charge.chargeTotal);
            job.charge.totalVatAmount = NumberHelper.convertToBigNumber(raw.charge.totalVatAmount);

            if (raw.charge.tasks) {
                raw.charge.tasks.map((chargeableTask: any) => {

                    if (chargeableTask.task) {

                        chargeableTask.task.activities = chargeableTask.task.activities.map((activity: any) => {
                            activity.date = DateHelper.convertDateTime(activity.date);
                            return activity;
                        });

                        chargeableTask.vat = NumberHelper.convertToBigNumber(chargeableTask.vat);
                        chargeableTask.discountAmount = NumberHelper.convertToBigNumber(chargeableTask.discountAmount);
                        chargeableTask.fixedPriceQuotationAmount = NumberHelper.convertToBigNumber(chargeableTask.fixedPriceQuotationAmount);
                        if (chargeableTask.labourItem) {
                            chargeableTask.labourItem.netAmount = NumberHelper.convertToBigNumber(chargeableTask.labourItem.netAmount);
                            chargeableTask.labourItem.vat = NumberHelper.convertToBigNumber(chargeableTask.labourItem.vat);

                            if (chargeableTask.labourItem.chargePair) {
                                let pair = chargeableTask.labourItem.chargePair;
                                pair.primeCharge = NumberHelper.convertToBigNumber(pair.primeCharge);
                                pair.subsequentCharge = NumberHelper.convertToBigNumber(pair.subsequentCharge);
                            }
                        }
                        if (chargeableTask.partItems) {
                            chargeableTask.partItems.forEach((partItem: any) => {
                                partItem.netAmount = NumberHelper.convertToBigNumber(partItem.netAmount);
                                partItem.vat = NumberHelper.convertToBigNumber(partItem.vat);
                            });
                        }
                    }
                    return chargeableTask;
                });
            }

            job.charge = raw.charge;
        }

        return job;
    }

    public static isIncompleteSerialization(job: Job): boolean {
        if (job && job.charge && job.charge.tasks && job.charge.tasks.length > 0) {
            return job.charge.tasks.some(task => typeof task.calculatedVatAmount === "undefined");
        }
        return false;
    }
}
