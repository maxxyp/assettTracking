/// <reference path="../../../../../typings/app.d.ts" />

import {GeoService} from "../../../../../app/common/geo/web/geoService";
import {IGoogleMapsService} from "../../../../../app/common/geo/google/IGoogleMapsService";

describe("the GeoService module", () => {
    let geoService: GeoService;
    let sandbox: Sinon.SinonSandbox;
    let googleMapsService: IGoogleMapsService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        googleMapsService = <IGoogleMapsService>{};
        geoService = new GeoService(googleMapsService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(geoService).toBeDefined();
    });
});
