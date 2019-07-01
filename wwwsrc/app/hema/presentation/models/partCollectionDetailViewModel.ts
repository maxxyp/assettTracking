import { PartsCollectionCustomerViewModel } from "./partsCollectionCustomerViewModel";
import { PartsCollectionViewModel } from "./partsCollectionViewModel";
export class PartCollectionDetailViewModel {
    public jobId: string;
    public parts: PartsCollectionViewModel[];
    public customer: PartsCollectionCustomerViewModel;        
}
