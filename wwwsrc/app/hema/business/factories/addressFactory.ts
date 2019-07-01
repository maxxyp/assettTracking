import {IAddressFactory} from "./interfaces/IAddressFactory";

import {IAddress as AddressApiModel} from "../../api/models/fft/jobs/IAddress";
import {Address as AddressBusinessModel} from "../models/address";
import {IAddress as AddressUpdateApiModel} from "../../api/models/fft/jobs/jobupdate/IAddress";

export class AddressFactory implements IAddressFactory {
    public createAddressBusinessModel(addressApiModel: AddressApiModel): AddressBusinessModel {
        let addressBusinessModel: AddressBusinessModel = new AddressBusinessModel();

        if (addressApiModel) {
            addressBusinessModel.premisesName = addressApiModel.premisesName;
            addressBusinessModel.houseNumber = addressApiModel.houseNumber;
            addressBusinessModel.flatNumber = addressApiModel.flatNumber;
            addressBusinessModel.line = addressApiModel.line;
            addressBusinessModel.town = addressApiModel.town;
            addressBusinessModel.county = addressApiModel.county;
            addressBusinessModel.postCodeOut = addressApiModel.postCodeOut;
            addressBusinessModel.postCodeIn = addressApiModel.postCodeIn;
            if (addressApiModel.postCodeIn && addressBusinessModel.postCodeOut) {
                addressBusinessModel.postCode = addressApiModel.postCodeOut + " " + addressApiModel.postCodeIn;
            }
            addressBusinessModel.country = addressApiModel.country;
        }

        return addressBusinessModel;
    }

    public createAddressApiModel(addressBusinessModel: AddressBusinessModel): AddressUpdateApiModel {
        return <AddressUpdateApiModel>{};
    }
}
