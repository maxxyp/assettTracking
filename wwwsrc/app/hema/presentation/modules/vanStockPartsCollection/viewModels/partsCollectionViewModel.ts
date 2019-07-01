import {PartCollectionItemViewModel} from "./partCollectionItemViewModel";
import { Material } from "../../../../business/models/material";

export class PartsCollectionViewModel {

    public parts: PartCollectionItemViewModel[];
    public isDone: boolean;
    public expectedReturns: Material[];
}
