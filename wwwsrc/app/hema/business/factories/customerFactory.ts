import { ICustomerFactory } from "./interfaces/ICustomerFactory";
import { ICustomer as CustomerApiModel } from "../../api/models/fft/jobs/ICustomer";
import { CustomerContact as CustomerContactBusinessModel } from "../models/customerContact";
import { AddressFactory } from "./addressFactory";
import { IAddressFactory } from "./interfaces/IAddressFactory";
import { inject } from "aurelia-framework";

@inject(AddressFactory)
export class CustomerFactory implements ICustomerFactory {

    private readonly _addressFactory: IAddressFactory;

    constructor(addressFactory: IAddressFactory) {
        this._addressFactory = addressFactory;
    }

    public createCustomerContactBusinessModel(customerApiModel: CustomerApiModel): CustomerContactBusinessModel {
        let customerContactBusinessModel: CustomerContactBusinessModel = new CustomerContactBusinessModel();
        if (customerApiModel) {
            customerContactBusinessModel.id = customerApiModel.id;
            customerContactBusinessModel.password = customerApiModel.password;
            customerContactBusinessModel.initials = customerApiModel.initials;
            customerContactBusinessModel.title = customerApiModel.title;
            customerContactBusinessModel.firstName = customerApiModel.firstName;
            customerContactBusinessModel.middleName = customerApiModel.middleName;
            customerContactBusinessModel.lastName = customerApiModel.lastName;
            customerContactBusinessModel.homePhone = customerApiModel.homePhone;
            customerContactBusinessModel.workPhone = customerApiModel.workPhone;
            if (customerApiModel.address) {
                customerContactBusinessModel.address = this._addressFactory.createAddressBusinessModel(customerApiModel.address);
            }
        }
        return customerContactBusinessModel;
    }
}
