/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-dependency-injection";
import {DistanceTime} from "../../geo/models/distanceTime";
import {IGeoService} from "../IGeoService";
import {GeoPosition} from "../models/geoPosition";
import {IGoogleMapsService} from "../google/IGoogleMapsService";
import {GoogleMapsService} from "../google/web/googleMapsService";

@inject(GoogleMapsService)
export class GeoService implements IGeoService {
    private _googleMapsService: IGoogleMapsService;

    constructor(googleMapsService: IGoogleMapsService) {
        this._googleMapsService = googleMapsService;
    }

    public getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime> {
        return this._googleMapsService.getDistanceTime(origin, destination);
    }

    public launchMap(location: string | GeoPosition): Promise<void> {
        return this._googleMapsService.launchMap(location);
    }

    public launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void> {
        return this._googleMapsService.launchDirections(origin, destination);
    }

    public getGeoPosition(address: string): Promise<GeoPosition> {
        return this._googleMapsService.getGeoPosition(address);
    }
}
