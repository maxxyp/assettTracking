export interface IWorkListItem {
    id: string;
    status: string;
    workType: "job" | "partsCollection";
    timestamp: string;
}
