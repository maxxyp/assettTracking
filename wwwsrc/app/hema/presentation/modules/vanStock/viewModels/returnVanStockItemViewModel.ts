import { MaterialWithQuantities } from "../../../../business/models/materialWithQuantities";

export class ReturnVanStockItemViewModel {
    public material: MaterialWithQuantities;
    public quantityToReturn: number;
    public returnReason: string;
}
