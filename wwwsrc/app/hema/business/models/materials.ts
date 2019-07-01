import { Material } from "./material";
export class Materials {
    public timestamp: number;
    public engineerId: string;
    public materials: Material[];

    constructor(engineerId: string) {
        this.engineerId = engineerId;
        this.materials = [];
    }
}
