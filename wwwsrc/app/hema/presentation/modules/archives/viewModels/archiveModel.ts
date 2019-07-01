import { ArchiveJobStateModel } from "./archiveJobStateModel";
import { ArchiveTaskItem } from "../../../../business/models/archiveTaskItem";
export class ArchiveModel {
    public id: string;
    public engineerId: string;
    public jobId: string;
    public start: string;
    public end: string;
    public duration: string;
    public details: string;
    public customerName: string;
    public shortAddress: string;
    public showJobs: boolean;
    public engineerStatus: string;
    public jobStates: ArchiveJobStateModel[];    
    public taskItems: ArchiveTaskItem[];        
}
