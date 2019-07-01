import { IPartsCollectionFactory } from "./interfaces/IPartsCollectionFactory";
import { JobPartsCollection } from "../../business/models/jobPartsCollection";
import { PartCollectionDetailViewModel } from "../models/partCollectionDetailViewModel";
import { PartsCollectionViewModel } from "../models/partsCollectionViewModel";
import { PartsCollectionCustomerViewModel } from "../models/partsCollectionCustomerViewModel";

export class PartsCollectionFactory implements IPartsCollectionFactory {
    public createPartsCollectionViewModel(businessModel: JobPartsCollection[]): PartCollectionDetailViewModel[] {
        if (businessModel) {
            const viewModel: PartCollectionDetailViewModel[] = [];
            businessModel.forEach(bm => {
                const vm = new PartCollectionDetailViewModel();
                vm.jobId = bm.id;
                if (bm.parts) {
                    vm.parts = [];
                    bm.parts.forEach(x => {
                        const part = new PartsCollectionViewModel();
                        part.stockReferenceId = x.stockReferenceId;
                        part.quantity = x.quantity;
                        part.description = x.description;
                        vm.parts.push(part);
                    });
                }
                if (bm.customer) {
                    vm.customer = new PartsCollectionCustomerViewModel();
                    let contactParts: string[] = [];

                    if (bm.customer.title) {
                        contactParts.push(bm.customer.title);
                    }

                    if (bm.customer.firstName) {
                        contactParts.push(bm.customer.firstName);
                    }

                    if (bm.customer.middleName) {
                        contactParts.push(bm.customer.middleName);
                    }

                    if (bm.customer.lastName) {
                        contactParts.push(bm.customer.lastName);
                    }

                    vm.customer.contactName = contactParts.join(" ");
                    if (bm.customer.address) {
                        vm.customer.shortAddress = bm.customer.address.join(", ");
                    }
                }
                viewModel.push(vm);
            });
            return viewModel;
        }
        return [];
    }
}
