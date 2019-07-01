import {IAddress as AddressApiModel} from "../../../api/models/fft/jobs/IAddress";
import {Address as AddressBusinessModel} from "../../models/address";
import {IAddress as AddressApiUpdateModel} from "../../../api/models/fft/jobs/jobupdate/IAddress";

export interface IAddressFactory {
    createAddressBusinessModel(addressApiModel: AddressApiModel): AddressBusinessModel;
    createAddressApiModel(addressBusinessModel: AddressBusinessModel): AddressApiUpdateModel;
}
