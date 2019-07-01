/// <reference path="../../../../typings/app.d.ts" />

import {GeoPosition} from "../models/geoPosition";

export interface IAppleMapsService {
    launchMap(location: string | GeoPosition): Promise<void>;
    launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void>;
}
