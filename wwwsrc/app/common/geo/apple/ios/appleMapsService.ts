/// <reference path="../../../../../typings/app.d.ts" />

import {GeoPosition} from "../../../geo/models/geoPosition";
import {IAppleMapsService} from "../IAppleMapsService";

export class AppleMapsService implements IAppleMapsService {
    public launchMap(location: string | GeoPosition): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let uri: string = "maps:?";

            if (location instanceof GeoPosition) {
                let originGeo: GeoPosition = <GeoPosition>location;
                uri += "ll=" + originGeo.latitude + "," + originGeo.longitude;
            } else {
                uri += "address=" + encodeURIComponent(location);
            }

            cordova.InAppBrowser.open(uri, "_system");
            resolve();
        });
    }

    public launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let uri: string = "maps:?";

            if (origin instanceof GeoPosition) {
                let originGeo: GeoPosition = <GeoPosition>origin;
                uri += "saddr=" + originGeo.latitude + "," + originGeo.longitude;
            } else {
                uri += "saddr=" + encodeURIComponent(origin || "Current Location");
            }

            uri += "&";

            if (destination instanceof GeoPosition) {
                let desinationGeo: GeoPosition = <GeoPosition>destination;
                uri += "daddr=" + desinationGeo.latitude + "," + desinationGeo.longitude;
            } else {
                uri += "daddr=" + encodeURIComponent(destination);
            }

            uri += "&dirflg=d";

            cordova.InAppBrowser.open(uri, "_system");
            resolve();
        });
    }
}
