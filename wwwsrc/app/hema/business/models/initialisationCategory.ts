export class InitialisationCategory {

    public category: string;
    public item: string;
    public progressValue: number;
    public progressMax: number;

    constructor(category: string, item: string, progressValue: number, progressMax: number) {
        this.category = category;
        this.item = item;
        this.progressValue = progressValue;
        this.progressMax = progressMax;
    }
}
