/// <reference path="../../../typings/app.d.ts" />

import {DistanceTime} from "../geo/models/distanceTime";
import {IGeoService} from "./IGeoService";
import { GeoPosition } from "./models/geoPosition";
import {PlatformServiceBase} from "../core/platformServiceBase";

export class GeoService extends PlatformServiceBase<IGeoService> implements IGeoService {

    private _cache: { [hash: string ]: Promise<any> };

    constructor() {
        super("common/geo", "GeoService");
        this._cache = {};
    }

    public getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime> {
        let argsHash = JSON.stringify(arguments);
        if (this._cache[argsHash]) {
            return this._cache[argsHash];
        }

        return this.loadModule().then(module => {
           return this._cache[argsHash] = module.getDistanceTime(origin, destination).then((res) => {
               return res;
           });
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
        let argsHash = JSON.stringify(arguments);
        if (this._cache[argsHash]) {
            return this._cache[argsHash];
        }

        return this.loadModule().then(module => {
           return this._cache[argsHash] = module.getGeoPosition(address).then((res) => {
               return res;
           });
        });
    }
}
