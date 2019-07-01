import {Address as AddressBusinessModel} from "../../business/models/address";
import {TaskSummaryViewModel} from "./taskSummaryViewModel";
import { JobState } from "../../business/models/jobState";

export class JobSummaryViewModel {
    public jobNumber: string;
    public contactName: string;
    public shortAddress: string;
    public contactTelephoneNumber: string;
    public premisesId: string;
    public address: AddressBusinessModel;
    public password: string;
    public specialInstructions: string;
    public engineerInstructions: string;

    public accessInfo: string;

    public earliestStartTime: Date;
    public latestStartTime: Date;

    public tasks: TaskSummaryViewModel[];

    public viewCount: number;

    public isLandlordJob: boolean;
    public jobState: JobState;

    constructor () {
        this.tasks = [];
        this.viewCount = 0;
    }
}
