import {IFieldOperativeStatus} from "../../models/reference/IFieldOperativeStatus";
import {Engineer} from "../../models/engineer";
import { IWhoAmI } from "../../../api/models/fft/whoAmI/IWhoAmI";

export interface IEngineerService {
    isPartCollectionInProgress: boolean;
    initialise(hasWhoAmISucceeded: boolean, whoAmI?: IWhoAmI): Promise<void>;

    getCurrentEngineer() : Promise<Engineer>;

    getAllStatus(): Promise<IFieldOperativeStatus[]>;

    setStatus(engineerStatus: string): Promise<void>;
    getStatus(): Promise<string>;
    isWorking() : Promise<boolean>;
    isSignedOn() : Promise<boolean>;

    getEngineerStateText(state: string): Promise<string>;

    overrideEngineerId(engineer: Engineer): Promise<Engineer>;
}
