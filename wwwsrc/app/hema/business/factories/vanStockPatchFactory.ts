import { IVanStockPatchFactory } from "./interfaces/IVanStockPatchFactory";

import { IVanStockPatch as VanStockPatchApiModel } from "../../api/models/vanStock/IVanStockPatch";
import { IVanStockPatchListItem as VanStockPatchListItemApiModel } from "../../api/models/vanStock/IVanStockPatchListItem";
import { VanStockPatchListItem as VanStockPatchListItemBusinessModel } from "../models/vanStockPatchListItem";
import { VanStockPatch as VanStockPatchBusinessModel } from "../models/vanStockPatch";

export class VanStockPatchFactory implements IVanStockPatchFactory {
    public createVanStockPatchBusinessModel(vanStockPatchApiModel: VanStockPatchApiModel): VanStockPatchBusinessModel {
        let vanStockPatchBusinessModel: VanStockPatchBusinessModel = new VanStockPatchBusinessModel();
        if (vanStockPatchApiModel) {
            vanStockPatchBusinessModel.patchCode = vanStockPatchApiModel.patchCode;
            vanStockPatchBusinessModel.engineers = vanStockPatchApiModel.engineers;
        }

        return vanStockPatchBusinessModel;
    }

    public createVanStockPatchListBusinessModel(vanStockPatchListApiModel: VanStockPatchListItemApiModel[]): VanStockPatchListItemBusinessModel[] {
        let vanStockPatchListItemBusinessModel: VanStockPatchListItemBusinessModel[] = [];
        if (vanStockPatchListApiModel) {
            vanStockPatchListItemBusinessModel = vanStockPatchListApiModel;
        }
        return vanStockPatchListItemBusinessModel;
    }
}
