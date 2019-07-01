/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-dependency-injection";
import {DistanceTime} from "../../geo/models/distanceTime";
import {IGeoService} from "../IGeoService";
import {GeoPosition} from "../models/geoPosition";
import {AppleMapsService} from "../apple/ios/appleMapsService";
import {IGoogleMapsService} from "../google/IGoogleMapsService";
import {GoogleMapsService} from "../google/wua/googleMapsService";
import {IAppleMapsService} from "../apple/IAppleMapsService";

@inject(GoogleMapsService, AppleMapsService)
export class GeoService implements IGeoService {
    private _googleMapsService: IGoogleMapsService;
    private _appleMapsService: IAppleMapsService;

    constructor(googleMapsService: IGoogleMapsService, appleMapsService: IAppleMapsService) {
        this._googleMapsService = googleMapsService;
        this._appleMapsService = appleMapsService;
    }

    public getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime> {
        return this._googleMapsService.getDistanceTime(origin, destination);
    }

    public launchMap(location: string | GeoPosition): Promise<void> {
        return this._appleMapsService.launchMap(location);
    }

    public launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void> {
        return this._appleMapsService.launchDirections(origin, destination);
    }

    public getGeoPosition(address: string): Promise<GeoPosition> {
        return this._googleMapsService.getGeoPosition(address);
    }
}
