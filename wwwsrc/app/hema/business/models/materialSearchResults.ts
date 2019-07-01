import { MaterialSearchResultOnline } from "./materialSearchResultOnline";

export class MaterialSearchResults {
    public timestamp: number;
    public engineerId: string;
    public materialSearchResults: MaterialSearchResultOnline[];

    constructor(engineerId: string) {
        this.engineerId = engineerId;
        this.materialSearchResults = [];
    }
}
