import {inject} from "aurelia-framework";

import {IPremisesFactory} from "./interfaces/IPremisesFactory";
import {IAddressFactory} from "./interfaces/IAddressFactory";
import {AddressFactory} from "./addressFactory";

import {IPremises as PremisesApiModel} from "../../api/models/fft/jobs/IPremises";
import {IPremises as PremisesUpdateApiModel} from "../../api/models/fft/jobs/jobupdate/IPremises";
import {Premises as PremisesBusinessModel} from "../models/premises";

@inject(AddressFactory)
export class PremisesFactory implements IPremisesFactory {
    private _addressFactory: IAddressFactory;

    constructor(addressFactory: IAddressFactory) {
        this._addressFactory = addressFactory;
    }

    public createPremisesBusinessModel(premisesApiModel: PremisesApiModel): PremisesBusinessModel {
        let premisesBusinessModel: PremisesBusinessModel = new PremisesBusinessModel();

        if (premisesApiModel) {
            premisesBusinessModel.id = premisesApiModel.id;
            premisesBusinessModel.accessInfo = premisesApiModel.specialAccessInstructions;

            // todo - Data Mapping - currently unused
            // premisesApiModel.previousVisitCount;
            // premisesApiModel.chirpAICode

            /* These are converted externally by additional factories called from the JobFactory
            premisesApiModel.contact */

            if (premisesApiModel.address) {
                premisesBusinessModel.address = this._addressFactory.createAddressBusinessModel(premisesApiModel.address);
            }
        }

        return premisesBusinessModel;
    }

    public createPremisesApiModel(premisesBusinessModel: PremisesBusinessModel): PremisesUpdateApiModel {
        let premisesApiModel = <PremisesUpdateApiModel>{};

        if (premisesBusinessModel) {
            premisesApiModel.id = premisesBusinessModel.id;
            if (premisesBusinessModel.address) {
                premisesApiModel.address = this._addressFactory.createAddressApiModel(premisesBusinessModel.address);
            }
        }

        return premisesApiModel;
    }
}
