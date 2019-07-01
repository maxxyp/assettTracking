import { ArchivePart } from "./archivePart";
export class ArchiveTaskItem {
    public taskId: string;
    public visitStatus: string;
    public startTime: string;
    public endTime: string;
    public duration: number;
    public workReport: string;
    public jobType: string;
    public applianceType: string;
    public partsToOrder: ArchivePart[];    
}
