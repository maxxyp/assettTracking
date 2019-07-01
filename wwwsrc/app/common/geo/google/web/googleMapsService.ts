/// <reference path="../../../../../typings/app.d.ts" />

import {inject} from "aurelia-dependency-injection";
import {HttpClient} from "aurelia-http-client";
import {IGoogleMapsServiceConfiguration} from "../IGoogleMapsServiceConfiguration";
import {IGoogleMapsService} from "../IGoogleMapsService";
import {ConfigurationService} from "../../../core/services/configurationService";
import {IConfigurationService} from "../../../core/services/IConfigurationService";
import {GeoPosition} from "../../models/geoPosition";
import {DistanceTime} from "../../models/distanceTime";
import { UrlParamService } from "../../../core/urlParamService";
import { GoogleMapsServiceConstants } from "../wua/constants/googleMapsServiceConstants";
import { DistanceMatrix } from "../wua/models/distanceMatrix";
import { BaseException } from "../../../core/models/baseException";

const GOOGLE_MAPS_URI = "https://maps.googleapis.com/";
const KEY_QS = "&key=";

@inject(ConfigurationService, HttpClient)
export class GoogleMapsService implements IGoogleMapsService {
    private _configuration: IGoogleMapsServiceConfiguration;
    private _httpClient: HttpClient;

    constructor(configurationService: IConfigurationService, httpClient: HttpClient) {
        this._configuration = configurationService.getConfiguration<IGoogleMapsServiceConfiguration>();
        this._httpClient = httpClient;
    }

    public getDistanceTime(origin: string | GeoPosition, destination: string | GeoPosition): Promise<DistanceTime> {
        if (origin && destination) {
            let finalOrigin: string;
            let finalDestination: string;

            if (origin instanceof GeoPosition) {
                let originGeo: GeoPosition = <GeoPosition>origin;
                finalOrigin = originGeo.latitude + "," + originGeo.longitude;
            } else {
                finalOrigin = origin;
            }

            if (destination instanceof GeoPosition) {
                let desinationGeo: GeoPosition = <GeoPosition>destination;
                finalDestination = desinationGeo.latitude + "," + desinationGeo.longitude;
            } else {
                finalDestination = destination;
            }

            let endPointWithVariables = UrlParamService.getParamEndpoint(GoogleMapsServiceConstants.DISTANCE_MATRIX, {
                "origins": finalOrigin,
                "destinations": finalDestination
            });

            endPointWithVariables += KEY_QS + this._configuration.googleClientKey;
            endPointWithVariables = GOOGLE_MAPS_URI + endPointWithVariables;

            return this._httpClient.get(endPointWithVariables)
                .then((res) => {
                    let response: DistanceMatrix = JSON.parse(res.response);
                    let dt = new DistanceTime();

                    if (response && response.rows && response.rows.length > 0) {
                        if (response.rows[0].elements && response.rows[0].elements.length > 0) {
                            if (response.rows[0].elements[0].distance) {
                                dt.distanceInMetres = response.rows[0].elements[0].distance.value;
                            }
                            if (response.rows[0].elements[0].duration) {
                                dt.timeInSeconds = response.rows[0].elements[0].duration.value;
                            }
                        }
                    }
                    return dt;
                })
                .catch((err) => {
                    throw new BaseException(this, "getDistanceTime", "Unable to call distancematrix API", undefined, err);
                });
        } else {
            return Promise.resolve(null);
        }
    }

    public launchMap(location: string | GeoPosition): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let finalLocation: any;

            if (location instanceof GeoPosition) {
                let originGeo: GeoPosition = <GeoPosition>location;
                finalLocation = originGeo.latitude + "," + originGeo.longitude;
            } else {
                finalLocation = encodeURIComponent(location);
            }

            let mapsUrl = "https://www.google.com/maps?q={location}";
            mapsUrl = mapsUrl.replace("{location}", finalLocation);

            window.open(mapsUrl, "_blank");

            resolve();
        });
    }

    public launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let finalOrigin: any;
            let finalDestination: any;

            if (origin instanceof GeoPosition) {
                let originGeo: GeoPosition = <GeoPosition>origin;
                finalOrigin = originGeo.latitude + "," + originGeo.longitude;
            } else {
                finalOrigin = encodeURIComponent(origin);
            }

            if (destination instanceof GeoPosition) {
                let desinationGeo: GeoPosition = <GeoPosition>destination;
                finalDestination = desinationGeo.latitude + "," + desinationGeo.longitude;
            } else {
                finalDestination = encodeURIComponent(destination);
            }

            let mapsUrl = "https://www.google.com/maps?saddr={origin}&daddr={destination}";
            mapsUrl = mapsUrl.replace("{origin}", finalOrigin);
            mapsUrl = mapsUrl.replace("{destination}", finalDestination);

            window.open(mapsUrl, "_blank");

            resolve();
        });
    }

    public async getGeoPosition(address: string): Promise<GeoPosition> {
        if (address) {
            let endPointWithVariables = UrlParamService.getParamEndpoint(GoogleMapsServiceConstants.GEOCODING, {
                "address": address,
            });

            endPointWithVariables += KEY_QS + this._configuration.googleClientKey;
            endPointWithVariables = GOOGLE_MAPS_URI + endPointWithVariables;

            return this._httpClient.get(endPointWithVariables)
                .then((res) => {
                    let response = JSON.parse(res.response);
                    let geoPosition = new GeoPosition(0, 0);
                    
                    if (response && response.results && response.results.length > 0 
                            && response.results[0] && response.results[0].geometry && response.results[0].geometry.location) {
                        geoPosition.latitude = response.results[0].geometry.location.lat || 0;
                        geoPosition.longitude = response.results[0].geometry.location.lng || 0;
                    }
                    return geoPosition;
                })
                .catch((err) => {
                    throw new BaseException(this, "getGeoPosition", "Unable to call geocoding API", undefined, err);
                });
        } else {
            return Promise.resolve(null);
        }
    }
}
