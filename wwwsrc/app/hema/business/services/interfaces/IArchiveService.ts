import { Archive } from "../../models/archive";
import { Engineer } from "../../models/engineer";
import { JobState } from "../../models/jobState";
import { Job } from "../../models/job";
import { IDatabaseService } from "../../../../common/storage/IDatabaseService";
export interface IArchiveService {
    initialise(): Promise<void>;
    addEngineerState(engineer: Engineer, state: string, jobId: string): Promise<void>;
    addUpdateJobState(job: Job, engineer: Engineer, jobState: JobState): Promise<void>;
    getArchiveByDate(date: string): Promise<Archive[]>;
    getEarliestDate(): Promise<Date>;
    migrate(fromDb: IDatabaseService): Promise< "NOTHING_TO_MIGRATE"
                                                | "MIGRATION_ALREADY_HAPPENED"
                                                | "HAVE_MIGRATED"
                                                | "MIGRATION_ERROR">;
}
