
import {inject} from "aurelia-dependency-injection";
import {IProximityService} from  "./IProximityService";
import {GeoPosition} from "./models/geoPosition";
import {Threading} from "../core/threading";
import {IGpsService} from "./IGpsService";
import {GpsService} from "./gpsService";
import {GeoHelper} from "./geoHelper";

@inject(GpsService)
export class ProximityService implements IProximityService {

    private _gpsService: IGpsService;
    private _distance: number;
    private _timerId: number;

    constructor(gpsService: IGpsService) {
        this._gpsService = gpsService;
        this._distance = null;
    }

    public startMonitoringDistance(destination: GeoPosition, delay: number): void {
        this._timerId = Threading.startTimer(() => {
            this._gpsService.getLocation()
                .then((postion: GeoPosition) => {
                    this._distance = GeoHelper.calculateDistance(postion.latitude,
                        postion.longitude,
                        destination.latitude,
                        destination.longitude);
                }).catch((err) => {
                });
        }, delay);
    }

    public getDistance(): number {
        return this._distance;
    }

    public stopMonitoringDistance(): void {
        if (this._timerId) {
            Threading.stopTimer(this._timerId);
            this._distance = null;
            this._timerId = undefined;
        }
    }
}
