import { Contact } from "../business/models/contact";
import { Premises } from "../business/models/premises";
import { Address } from "../business/models/address";

export class CustomerHelper {
    public static formatCustomerContact(contact: Contact): string {
        let contactParts: string[] = [];

        if (contact.title) {
            contactParts.push(contact.title);
        }

        if (contact.firstName) {
            contactParts.push(contact.firstName);
        }

        if (contact.middleName) {
            contactParts.push(contact.middleName);
        }

        if (contact.lastName) {
            contactParts.push(contact.lastName);
        }
        return contactParts.join(" ");
    }

    public static formatCustomerAddress(premises: Premises): string {
        let parts: string[] = [];
        let lines = CustomerHelper.getAddressLines(premises.address);
        if (lines && lines.length > 0) {
            parts.push(lines[0]);
        }
        if (premises.address.postCode) {
            parts.push(premises.address.postCode);
        }

        return parts.join(", ");
    }

    public static getAddressLines(address: Address): string[] {
        let addressLines: string[] = [];

        if (address) {
            if (address.premisesName) {
                addressLines.push(address.premisesName);
            }

            let line = address.houseNumber || address.flatNumber || "";

            if (address.line && address.line.length > 0 && address.line[0].length > 0) {
                line += " " + address.line[0];
                line = line.trim();
            }

            if (line.length > 0) {
                addressLines.push(line);
            }

            if (address.line && address.line.length > 1 && address.line[1].length > 0) {
                addressLines.push(address.line[1]);
            }
        }

        return addressLines;
    }
}
