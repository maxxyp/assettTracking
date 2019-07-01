import { MaterialHighValueTool } from "./materialHighValueTool";

export class MaterialHighValueTools {
    public timestamp: number;
    public engineerId: string;
    public highValueTools: MaterialHighValueTool[];

    constructor(engineerId: string) {
        this.engineerId = engineerId;
        this.highValueTools = [];
    }
}
