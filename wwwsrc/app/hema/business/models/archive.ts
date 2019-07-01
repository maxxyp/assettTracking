import { ArchiveJob } from "./archiveJob";
import { ArchiveTaskItem } from "./archiveTaskItem";
import * as moment from "moment";

export const ARCHIVE_DATE_FORMAT: string = "DD-MM-YYYY";

export class Archive {
    public id: string;
    public uniqueJobId: string;
    public engineerId: string;
    public jobId: string;
    public visitId: string;
    public engineerStatus: string;
    public jobStates: ArchiveJob[];
    public taskItems: ArchiveTaskItem[];
    public details: string;
    public customerName: string;
    public address: string;
    public timestamp: Date;
    public readonly date: string;

    constructor(engineerId: string) {
        this.engineerId = engineerId;
        this.timestamp = new Date();
        this.date = moment().format(ARCHIVE_DATE_FORMAT);
    }
}
