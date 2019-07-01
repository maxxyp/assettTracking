import { IHttpHeaderProvider } from "../../../common/resilience/services/interfaces/IHttpHeaderProvider";
import { IHttpHeader } from "../../../common/core/IHttpHeader";
import { inject } from "aurelia-dependency-injection";
import { IGpsService } from "../../../common/geo/IGpsService";
import { GpsService } from "../../../common/geo/gpsService";
import { EngineerService } from "../../business/services/engineerService";
import { IEngineerService } from "../../business/services/interfaces/IEngineerService";
import { Guid } from "../../../common/core/guid";
import { GeoPosition } from "../../../common/geo/models/geoPosition";
import { StorageService } from "../../business/services/storageService";
import { IStorageService } from "../../business/services/interfaces/IStorageService";
import { GeoService } from "../../../common/geo/geoService";
import { IGeoService } from "../../../common/geo/IGeoService";
import { JobCacheService } from "../../business/services/jobCacheService";
import { IJobCacheService } from "../../business/services/interfaces/IJobCacheService";
import { JobState } from "../../business/models/jobState";

const DUMMY_GEOPOSTION: GeoPosition = <GeoPosition>{ latitude: 0, longitude: 0 };
@inject(GpsService, EngineerService, StorageService, GeoService, JobCacheService)
export class VanStockHeaderProvider implements IHttpHeaderProvider {

    private _staticHeaders: IHttpHeader[];
    private _gpsService: IGpsService;
    private _engineerService: IEngineerService;
    private _storageService: IStorageService;
    private _geoService: IGeoService;
    private _jobCacheService: IJobCacheService;

    constructor(gpsService: IGpsService, engineerService: IEngineerService, storageService: IStorageService, geoService: IGeoService, jobCacheService: IJobCacheService) {
        this._gpsService = gpsService;
        this._engineerService = engineerService;
        this._storageService = storageService;
        this._geoService = geoService;
        this._jobCacheService = jobCacheService;
    }

    public setStaticHeaders(staticHeaders: IHttpHeader[]): void {
        this._staticHeaders = staticHeaders;
    }

    public async getHeaders(routeName: string): Promise<IHttpHeader[]> {
        const headers: IHttpHeader[] = (this._staticHeaders || []).slice(0);
        headers.push({ name: "X-Request-ID", value: Guid.newGuid() });

        let isSignedOn: boolean = false;
        try {
            isSignedOn = (await this._engineerService.getCurrentEngineer()).isSignedOn;
        } catch (error) {

        }
        headers.push(
            { name: "X-Engineer-Status", value: isSignedOn.toString() }
        );

        let location = DUMMY_GEOPOSTION;
        try {
            let result = await this._gpsService.getLocation();
            if (result && result.latitude !== undefined && result.longitude !== undefined) {
                location = result;
                this._storageService.setLastKnownLocation(location);
            }

            if (location === DUMMY_GEOPOSTION) {
                result = this._storageService.getLastKnownLocation();

                if (result && result.latitude !== undefined && result.longitude !== undefined) {
                    location = result;
                } else {
                    let getJobPostCode = async () => {
                        const jobsToDo = await this._jobCacheService.getJobsToDo() || [];
                        const liveJob = jobsToDo.find(x => x.state === JobState.arrived);
                        const liveJobs = jobsToDo.filter(x => x.state !== JobState.done) || [];
                        const attendedJob = jobsToDo.filter(x => x.state === JobState.done) || [];
                        const job = liveJob ? liveJob : liveJobs.length && liveJobs[0] || attendedJob.length && attendedJob[0];
                        return job && job.customerAddress && job.customerAddress.postCode || undefined;
                    };

                    const postCode = await getJobPostCode();
                    if (postCode) {
                        let geoPosition = await this._geoService.getGeoPosition(postCode);

                        if (geoPosition && geoPosition.latitude && geoPosition.longitude) {
                            location = geoPosition;
                            this._storageService.setLastKnownLocation(location);
                        }
                    }
                }
            }
        } catch (error) {

        }
        headers.push(
            { name: "X-Engineer-Lat", value: location.latitude.toString() },
            { name: "X-Engineer-Lon", value: location.longitude.toString() }
        );

        return headers;
    }
}
