/// <reference path="../../../../typings/app.d.ts" />

import {DistanceTime} from "../../geo/models/distanceTime";
import {IGoogleMapsService} from "./IGoogleMapsService";
import {GeoPosition} from "../../geo/models/geoPosition";
import {PlatformServiceBase} from "../../core/platformServiceBase";

export class GoogleMapsService extends PlatformServiceBase<IGoogleMapsService> implements IGoogleMapsService {
    constructor() {
        super("common/geo/google", "GoogleMapsService");
    }

    public getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime> {
        return this.loadModule().then(module => {
           return module.getDistanceTime(origin, destination);
        });
    }

    public launchMap(location: string | GeoPosition): Promise<void> {
        return this.loadModule().then(module => {
            return module.launchMap(location);
        });
    }

    public launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void> {
        return this.loadModule().then(module => {
            return module.launchDirections(origin, destination);
        });
    }

    public getGeoPosition(address: string): Promise<GeoPosition> {
        return this.loadModule().then(module => {
           return module.getGeoPosition(address);
        });
    }
}
