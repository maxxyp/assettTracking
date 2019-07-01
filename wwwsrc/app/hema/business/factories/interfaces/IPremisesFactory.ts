import {IPremises as PremisesApiModel} from "../../../api/models/fft/jobs/IPremises";
import {IPremises as PremisesUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/IPremises";
import {Premises as PremisesBusinessModel} from "../../models/premises";

export interface IPremisesFactory {
    createPremisesBusinessModel(premisesApiModel: PremisesApiModel): PremisesBusinessModel;
    createPremisesApiModel(premisesBusinessModel: PremisesBusinessModel): PremisesUpdateApiModel;
}
