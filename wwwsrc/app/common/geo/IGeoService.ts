/// <reference path="../../../typings/app.d.ts" />

import {DistanceTime} from "./models/distanceTime";
import {GeoPosition} from "./models/geoPosition";

export interface IGeoService {
    getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime>;
    launchMap(location: string | GeoPosition): Promise<void>;
    launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void>;
    getGeoPosition(address: string): Promise<GeoPosition>;
}
