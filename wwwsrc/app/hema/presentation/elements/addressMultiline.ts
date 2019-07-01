import { Address as AddressBusinessModel } from "../../business/models/address";
import { CustomerHelper } from "../../core/customerHelper";

export class AddressMultiline {
    public addressLines: string[];

    public activate(address: AddressBusinessModel): void {
        this.addressLines = [];

        if (!address) {
            return;
        }

        this.addressLines = CustomerHelper.getAddressLines(address);

        if (address.town && address.town !== "") {
            this.addressLines.push(address.town);
        }

        if (address.county && address.county !== "") {
            this.addressLines.push(address.county);
        }

        if (address.postCode && address.postCode !== "") {
            this.addressLines.push(address.postCode);
        }

        if (address.country && address.country !== "") {
            this.addressLines.push(address.country);
        }
    }
}
