import {IVanStockPatch as VanStockPatchApiModel} from "../../../api/models/vanStock/IVanStockPatch";
import {VanStockPatch as VanStockPatchBusinessModel} from "../../models/vanStockPatch";
import {IVanStockPatchListItem as VanStockPatchListItemApiModel} from "../../../api/models/vanStock/IVanStockPatchListItem";
import {VanStockPatchListItem as VanStockPatchListItemBusinessModel} from "../../models/vanStockPatchListItem";

export interface IVanStockPatchFactory {
    createVanStockPatchBusinessModel(vanStockPatchApiModel: VanStockPatchApiModel): VanStockPatchBusinessModel;
    createVanStockPatchListBusinessModel(vanStockPatchListApiModel: VanStockPatchListItemApiModel[]): VanStockPatchListItemBusinessModel[];
}
