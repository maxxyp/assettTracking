export class InitialisationUpdate {

    public item: string;
    public progressValue: number;

    constructor(item: string, progressValue: number) {
        this.item = item;
        this.progressValue = progressValue;
    }
}
