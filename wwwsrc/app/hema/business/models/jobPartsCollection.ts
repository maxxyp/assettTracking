export class JobPartsCollection {
    public id: string;
    public position: number;
    public wmisTimestamp: string;
    public done: boolean;

    public customer: {
        title: string,
        firstName: string,
        middleName: string,
        lastName: string,
        address: string [];
    };

    public parts: {
        stockReferenceId: string;
        description: string;
        quantity: number;
    } [];

    constructor () {
        this.done = false;
    }
}
