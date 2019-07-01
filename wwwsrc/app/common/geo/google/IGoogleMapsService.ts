/// <reference path="../../../../typings/app.d.ts" />

import {DistanceTime} from "../../geo/models/distanceTime";
import {GeoPosition} from "../../geo/models/geoPosition";

export interface IGoogleMapsService {
    getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime>;
    launchMap(location: string | GeoPosition): Promise<void>;
    launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void>;
    getGeoPosition(address: string): Promise<GeoPosition>;
}
