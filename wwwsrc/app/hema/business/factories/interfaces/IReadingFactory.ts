import { Appliance } from "../../models/Appliance";
import { IReading } from "../../../api/models/fft/jobs/jobupdate/IReading";

export interface IReadingFactory {
    createReadingApiModels(appliance: Appliance): Promise<IReading[]>;
}
