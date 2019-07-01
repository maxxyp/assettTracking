import {PropertyGasSafetyDetail as PropertyGasSafetyDetailBusinessModel} from "../../models/propertyGasSafetyDetail";
import {PropertyElectricalSafetyDetail} from "../../models/propertyElectricalSafetyDetail";
import {PropertyUnsafeDetail} from "../../models/propertyUnsafeDetail";
import {UnsafeReason} from "../../models/unsafeReason";
import {PropertySafety} from "../../models/propertySafety";

export interface IPropertySafetyService {
    getPropertySafetyDetails(jobId: string): Promise<PropertySafety>;
    saveGasSafetyDetails(jobId: string,
                         safetyDetail: PropertyGasSafetyDetailBusinessModel,
                         unsafeDetail: PropertyUnsafeDetail): Promise<void>;

    saveElectricalSafetyDetails(jobId: string,
                                safetyDetail: PropertyElectricalSafetyDetail,
                                unsafeDetail: PropertyUnsafeDetail): Promise<void>;

    populateGasUnsafeReasons(pressureDrop: number,
                             gasMeterInstallationSatisfactorySelected: string,
                             pressureDropThreshold: number,
                             installationSatisfactoryNoType: string,
                             installationSatisfactoryNoMeterType: string,
                             noEliReadings: boolean): Promise<UnsafeReason[]>;

    populateElectricalUnsafeReasons(safetyDetail: PropertyElectricalSafetyDetail,
                                    unableToCheckSystemType: string,
                                    ttSystemType: string,
                                    rcdPresentThreshold: number,
                                    safeInTopsThreshold: number): Promise<UnsafeReason[]>;
}
