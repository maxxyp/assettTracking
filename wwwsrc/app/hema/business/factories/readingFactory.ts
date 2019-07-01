import { IReadingFactory } from "./interfaces/IReadingFactory";
import { IReading } from "../../api/models/fft/jobs/jobupdate/IReading";
import { Appliance } from "../models/appliance";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { DateHelper } from "../../core/dateHelper";
import { ApplianceSafety } from "../models/applianceSafety";
import { inject } from "aurelia-dependency-injection";
import { CatalogService } from "../services/catalogService";
import { ICatalogService } from "../services/interfaces/ICatalogService";
import { IReadTypeMapping } from "../models/reference/IReadTypeMapping";
import { IReadingType } from "../models/reference/IReadingType";
import { IPerformanceTestReason } from "../models/reference/IPerformanceTestReason";

@inject(CatalogService)
export class ReadingFactory implements IReadingFactory {

    private _catalogService: ICatalogService;

    constructor(catalogService: ICatalogService) {
        this._catalogService = catalogService;
    }

    public createReadingApiModels(appliance: Appliance): Promise<IReading[]> {
        return Promise.all([
            this._catalogService.getReadTypeMappings(),
            this._catalogService.getReadingTypes()
        ]).spread<IReading[]>((readTypeMappings: IReadTypeMapping[], readTypes: IReadingType[]) => {
            let readings: IReading[] = [];
            if (appliance && appliance.safety) {
                return this.findReadings(appliance.safety, readTypeMappings, readTypes, readings, appliance.isCentralHeatingAppliance)
                    .then(() => {
                        if (appliance.safety.applianceGasSafety && appliance.safety.applianceGasSafety.performanceTestsNotDoneReason) {
                            return this.populatePerformanceTestNotDoneReason(appliance.safety.applianceGasSafety.performanceTestsNotDoneReason, 
                                                                        readings, readTypes, appliance.isCentralHeatingAppliance);
                        }
                        return Promise.resolve();                                     
                    })
                    .then(() => {
                        if (appliance.safety.applianceGasSafety && appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary) {
                            return this.populatePerformanceTestNotDoneReason(appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary, 
                                                                        readings, readTypes, appliance.isCentralHeatingAppliance);
                        }
                        return Promise.resolve();  
                    })
                    .then(() => this.sortAndGenerateSequenceNumber(readings));
            } 
            return Promise.resolve();
        });
    }

    private findReadings(applianceSafety: ApplianceSafety, readTypeMappings: IReadTypeMapping[], validReadTypes: IReadingType[], readings: IReading[],
                         isCentralHeatingAppliance: boolean): Promise<void> {
        readTypeMappings.forEach(readType => {
            let reading = ObjectHelper.getPathValue(applianceSafety, readType.group + "." + readType.id);
            let validReadType = validReadTypes.find(x => x.readingTypeCode === readType.value);
            if (reading !== undefined && !!validReadType) {
                readings.push({
                    dateTime: DateHelper.toJsonDateTimeString(new Date()),
                    type: isCentralHeatingAppliance === true ? readType.value : readType.value.split("").reverse().join(""),
                    value: reading,
                    sequenceNumber: 0
                });
            }
        });
        return Promise.resolve();
    }

    private sortAndGenerateSequenceNumber(readings: IReading[]): IReading[] {
        return readings.sort((a, b) => {
            let x = DateHelper.fromJsonDateTimeString(a.dateTime);
            let y = DateHelper.fromJsonDateTimeString(b.dateTime);
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }).map((reading, index) => {
            reading.sequenceNumber = ++index;
            return reading;
        });
    }

    // performance Test not done reasons always has value 1
    private populatePerformanceTestNotDoneReason(performanceTestsNotDoneReason: string, readings: IReading[], validReadTypes: IReadingType[],
        isCentralHeatingAppliance: boolean): Promise<void> {
        return this._catalogService.getPerformanceTestReasons().then((performanceTestReasons: IPerformanceTestReason[]) => {
            if (performanceTestReasons) {
                let reason = performanceTestReasons.find(x => x.id === performanceTestsNotDoneReason);
                let validReadType = validReadTypes.find(x => x.readingTypeCode === reason.id);
                if (reason && validReadType) {
                    if (readings === null || readings === undefined) {
                        readings = [];
                    }
                    readings.push({
                        dateTime: DateHelper.toJsonDateTimeString(new Date()),
                        type: isCentralHeatingAppliance === true ? reason.id : reason.id.split("").reverse().join(""),
                        value: validReadType.readingHighRangeValue.toString(),
                        sequenceNumber: 0
                    });
                }
            }
            return Promise.resolve();                                        
        });
    }     
}
