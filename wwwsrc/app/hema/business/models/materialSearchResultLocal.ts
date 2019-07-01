import { MaterialWithQuantities } from "./materialWithQuantities";

export class MaterialSearchResultLocal  {
    public completionStatus:
        "FOUND"
        | "NOT_FOUND";
    public material: MaterialWithQuantities;
}
