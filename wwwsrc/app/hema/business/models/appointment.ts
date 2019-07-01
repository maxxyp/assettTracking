import { DataStateProvider } from "./dataStateProvider";
import { AppointmentDurationItem } from "./appointmentDurationItem";
import { DataState } from "./dataState";

export class Appointment extends DataStateProvider {
    public jobId: string;
    public normalAccessInformation: string;
    public promisedDate: Date;
    public promisedTimeSlot: string;
    public generalAccessInformation: string;
    public accessInformation: string;
    public preferredEngineer: string;
    public estimatedDurationOfAppointment: AppointmentDurationItem[];

    constructor() {
        super(DataState.dontCare, "appointment");
        this.estimatedDurationOfAppointment = [];
    }
}
