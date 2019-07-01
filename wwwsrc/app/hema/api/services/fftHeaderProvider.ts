import {IHttpHeaderProvider} from "../../../common/resilience/services/interfaces/IHttpHeaderProvider";
import {IHttpHeader} from "../../../common/core/IHttpHeader";
import {inject} from "aurelia-dependency-injection";

@inject()
export class FftHeaderProvider implements IHttpHeaderProvider {

    private _staticHeaders: IHttpHeader[];

    constructor() {
    }

    public setStaticHeaders(staticHeaders: IHttpHeader[]): void {
        this._staticHeaders = staticHeaders;
    }

    public getHeaders(routeName: string): Promise<IHttpHeader[]> {

        let headers: IHttpHeader[] = [];
        let engineerIdHeader = (this._staticHeaders || []).slice(0)
                                .find(header => header.name === "engineerId");

        if (engineerIdHeader) {
            headers.push(engineerIdHeader);
        }
        return Promise.resolve(headers);

        // let headers: IHttpHeader[] = (this._staticHeaders || []).slice(0);
        // return this._gpsService.getLocation()
        //     .catch(() => {
        //         /* swallow any errors from the gps service, we definitely don't want this to stop API calls */
        //     })
        //     .then((location) => {
        //         if (location && location.latitude !== undefined && location.longitude !== undefined) {
        //             headers.push({name: "latitude", value: location.latitude.toString()});
        //             headers.push({name: "longitude", value: location.longitude.toString()});
        //         }

        //         // #14682 - reintroducing all other headers but keep "date" disabled
        //         // headers.push({name: "date", value: DateHelper.toJsonDateTimeString(new Date())});

        //         return headers;
        //     });
    }
}
