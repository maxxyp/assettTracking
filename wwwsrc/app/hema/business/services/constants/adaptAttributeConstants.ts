import {IAdaptModelAttribute} from "../../../api/models/adapt/IAdaptModelAttribute";

export class AdaptAttributeConstants {
    public static WITHDRAWN: IAdaptModelAttribute = {
        attributeType: "appVersionStatus",
        attributeValue: "Withdrawn"
    };

    public static FOLIO: IAdaptModelAttribute =  {
        attributeType: "appVersionStatus",
        attributeValue: "Issued - Folio Only"
    };

    public static SERVICE_LISTED: IAdaptModelAttribute = {
        attributeType: "serviceListed",
        attributeValue: "True"
    };

    public static REDUCED_PARTS_LIST: IAdaptModelAttribute = {
        attributeType: "reducedPartsList",
        attributeValue: "True"
    };

    public static SAFETY_NOTICE: IAdaptModelAttribute = {
        attributeType: "safetyNotice",
        attributeValue: "True"
    };

    public static CEASED_PRODUCTION: IAdaptModelAttribute = {
        attributeType: "ceasedProduction",
        // special case: if a ceased attribute exists the appliance is ceased, irrespective of the attribute value.
    };
}
