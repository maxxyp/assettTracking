export class State<T> {
    public value: T;
    public name: string;
    public targetValues: T[];
    public targetStates: State<T>[];

    constructor(value: T, name: string, targetValues: T[]) {
        this.value = value;
        this.name = name;
        this.targetValues = targetValues;
        this.targetStates = null;
    }

}
