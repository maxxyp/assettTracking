import { ICustomer as CustomerApiModel } from "../../../api/models/fft/jobs/ICustomer";
import { CustomerContact as CustomerContactBusinessModel  } from "../../models/customerContact";

export interface ICustomerFactory {
    createCustomerContactBusinessModel(customerApiModel: CustomerApiModel): CustomerContactBusinessModel;
}
