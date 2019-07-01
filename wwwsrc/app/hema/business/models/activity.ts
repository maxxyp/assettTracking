import { Part } from "./part";

export class Activity {
    public date: Date;
    public status: string;
    public workDuration: number;
    public chargeableTime: number;
    public engineerName: string;
    public report: string;
    public parts: Part[];

    constructor(date?: Date) {
        this.date = date;
    }
}
