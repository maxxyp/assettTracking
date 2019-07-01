import {PropertyGasSafetyDetail} from "./propertyGasSafetyDetail";
import {PropertyElectricalSafetyDetail} from "./propertyElectricalSafetyDetail";
import {PropertyUnsafeDetail} from "./propertyUnsafeDetail";
import {PreviousPropertySafetyDetail} from "./previousPropertySafetyDetail";

export class PropertySafety {
    public propertyGasSafetyDetail: PropertyGasSafetyDetail;
    public propertyElectricalSafetyDetail: PropertyElectricalSafetyDetail;
    public propertyUnsafeDetail: PropertyUnsafeDetail;
    public previousPropertySafetyDetail: PreviousPropertySafetyDetail;
}
