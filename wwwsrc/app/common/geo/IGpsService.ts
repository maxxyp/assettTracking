/// <reference path="../../../typings/app.d.ts" />

import {GeoPosition} from "./models/geoPosition";

export interface IGpsService {
    getLocation(): Promise<GeoPosition>;
    startWatch(callback: (position: GeoPosition) => void): number;
    stopWatch(watchId: number): void;
}
