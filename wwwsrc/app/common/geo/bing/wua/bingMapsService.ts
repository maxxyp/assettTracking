/// <reference path="../../../../../typings/app.d.ts" />

import {GeoPosition} from "../../../geo/models/geoPosition";
import {IBingMapsService} from "../IBingMapsService";

export class BingMapsService implements IBingMapsService {
    public launchMap(location: string | GeoPosition): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let uri: string = "bingmaps:?";

            if (location instanceof GeoPosition) {
                let originGeo: GeoPosition = <GeoPosition>location;
                uri += "cp=" + originGeo.latitude + "~" + originGeo.longitude;
            } else {
                uri += "where=" + encodeURIComponent(location);
            }

            window.Windows.System.Launcher.launchUriAsync(new window.Windows.Foundation.Uri(uri));
            resolve();
        });
    }

    public launchDirections(origin: string | GeoPosition, destination: string | GeoPosition): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let uri: string = "bingmaps:?rtp=";

            if (origin instanceof GeoPosition) {
                let originGeo: GeoPosition = <GeoPosition>origin;
                uri += "pos." + originGeo.latitude + "_" + originGeo.longitude;
            } else {
                uri += "adr." + encodeURIComponent(origin);
            }

            uri += "~";

            if (destination instanceof GeoPosition) {
                let desinationGeo: GeoPosition = <GeoPosition>destination;
                uri += "pos." + desinationGeo.latitude + "_" + desinationGeo.longitude;
            } else {
                uri += "adr." + encodeURIComponent(destination);
            }

            uri += "&mode=d";

            window.Windows.System.Launcher.launchUriAsync(new window.Windows.Foundation.Uri(uri));
            resolve();
        });
    }
}
