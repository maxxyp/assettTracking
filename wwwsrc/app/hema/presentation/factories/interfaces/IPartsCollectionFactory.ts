import { JobPartsCollection } from "../../../business/models/jobPartsCollection";
import { PartCollectionDetailViewModel } from "../../models/partCollectionDetailViewModel";

export interface IPartsCollectionFactory {
    createPartsCollectionViewModel(businesModel: JobPartsCollection[]): PartCollectionDetailViewModel[];
}
