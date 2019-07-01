/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-dependency-injection";
import {DistanceTime} from "../../geo/models/distanceTime";
import {IGeoService} from "../IGeoService";
import {GeoPosition} from "../models/geoPosition";
import {BingMapsService} from "../bing/wua/bingMapsService";
import {IGoogleMapsService} from "../google/IGoogleMapsService";
import {GoogleMapsService} from "../google/wua/googleMapsService";
import {IBingMapsService} from "../bing/IBingMapsService";

@inject(GoogleMapsService, BingMapsService)
export class GeoService implements IGeoService {
    private _googleMapsService: IGoogleMapsService;
    private _bingMapsService: IBingMapsService;

    constructor(googleMapsService: IGoogleMapsService, bingMapsService: IBingMapsService) {
        this._googleMapsService = googleMapsService;
        this._bingMapsService = bingMapsService;
    }

    public getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime> {
        return this._googleMapsService.getDistanceTime(origin, destination);
    }

    public launchMap(location: string | GeoPosition): Promise<void> {
        return this._bingMapsService.launchMap(location);
    }

    public launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void> {
        return this._bingMapsService.launchDirections(origin, destination);
    }

    public getGeoPosition(address: string): Promise<GeoPosition> {
        return this._googleMapsService.getGeoPosition(address);
    }
}
