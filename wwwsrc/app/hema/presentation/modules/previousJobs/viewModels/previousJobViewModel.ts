import {Task} from "../../../../business/models/task";

export class PreviousJobViewModel {
    public id : string;
    public date : Date;
    public tasksDescription : string[];
    public tasks : Task [];
    public isCharge: boolean;

    constructor(id? : string, date? : Date, tasksDescription? : string[], tasks? : Task []) {
        this.id = id;
        this.date = date;
        this.tasksDescription = tasksDescription;
        this.tasks = tasks;
        this.isCharge = false;
    }
}
