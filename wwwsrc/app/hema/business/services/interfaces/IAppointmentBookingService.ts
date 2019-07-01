import {Appointment} from "../../models/appointment";

export interface IAppointmentBookingService {
    getGeneralAccessInformation(jobId: string): Promise<string>;
    save(appointment: Appointment): Promise<void>;
    removeAppointment(jobId: string): Promise<void>;
    load(jobId: string): Promise<Appointment>;
    hasParts(jobId: string): Promise<boolean>;
    checkCutOffTimeExceededWithParts(promisedDateOnly: Date, promisedTimeOnly: Date, cutOffTime: string): boolean;
    getNexAppointmentDateWithParts(date: Date): Date;
    checkIfAppointmentNeedsToBeRebooked(appointmentDate: Date, startTime: Date, cutOffTime: string): boolean;
}
