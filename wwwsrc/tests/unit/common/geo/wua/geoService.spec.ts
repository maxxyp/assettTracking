/// <reference path="../../../../../typings/app.d.ts" />

import {GeoService} from "../../../../../app/common/geo/wua/geoService";
import {IGoogleMapsService} from "../../../../../app/common/geo/google/IGoogleMapsService";
import {IBingMapsService} from "../../../../../app/common/geo/bing/IBingMapsService";

describe("the GeoService module", () => {
    let geoService: GeoService;
    let sandbox: Sinon.SinonSandbox;
    let googleMapsService: IGoogleMapsService;
    let bingMapsService: IBingMapsService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        googleMapsService = <IGoogleMapsService>{};
        bingMapsService = <IBingMapsService>{};
        geoService = new GeoService(googleMapsService, bingMapsService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(geoService).toBeDefined();
    });
});
