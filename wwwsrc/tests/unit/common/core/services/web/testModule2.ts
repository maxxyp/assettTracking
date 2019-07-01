import {ITestModule} from "../ITestModule";

export class TestModuleUnknownName implements ITestModule {
    public value: number;

    constructor() {
        this.value = 42;
    }

    public getValue() : number {
        return this.value;
    }

    public setValue(value: number) : void {
        this.value = value;
    }
}
