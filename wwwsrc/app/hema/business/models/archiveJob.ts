import { JobState } from "./jobState";

export class ArchiveJob {
    public state: JobState;
    public timestamp: Date;

    constructor() {
        this.timestamp = new Date();
    }
}
