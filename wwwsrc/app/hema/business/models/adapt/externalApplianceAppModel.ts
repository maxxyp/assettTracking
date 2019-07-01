import {AdaptAvailabilityAttributeType} from "../../services/constants/adaptAvailabilityAttributeType";

export class ExternalApplianceAppModel {
    public foundInAdapt: boolean;
    public availabilityStatus: AdaptAvailabilityAttributeType;
    public ceased: boolean;
    public safetyNotice: boolean;

    public description: string;
    public manufacturer: string;

    constructor(foundInAdapt: boolean) {
        this.foundInAdapt = foundInAdapt;
    }
}
