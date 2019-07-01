import { MaterialSearchResultLocal } from "./materialSearchResultLocal";
import { MaterialSearchResultOnline } from "./materialSearchResultOnline";

export class MaterialSearchResult {
    public stockReferenceId: string;
    public description: string;    
    public local: MaterialSearchResultLocal;
    public online: MaterialSearchResultOnline;

    constructor() {
        this.local = new MaterialSearchResultLocal();
        this.online = new MaterialSearchResultOnline();
    }
}
