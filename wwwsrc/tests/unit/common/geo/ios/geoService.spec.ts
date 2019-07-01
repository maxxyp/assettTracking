/// <reference path="../../../../../typings/app.d.ts" />

import {GeoService} from "../../../../../app/common/geo/ios/geoService";
import {IGoogleMapsService} from "../../../../../app/common/geo/google/IGoogleMapsService";
import {IAppleMapsService} from "../../../../../app/common/geo/apple/IAppleMapsService";

describe("the GeoService module", () => {
    let geoService: GeoService;
    let sandbox: Sinon.SinonSandbox;
    let googleMapsServiceStub: IGoogleMapsService;
    let appleMapsServiceStub: IAppleMapsService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        googleMapsServiceStub = <IGoogleMapsService>{};
        appleMapsServiceStub = <IAppleMapsService>{};
        geoService = new GeoService(googleMapsServiceStub, appleMapsServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(geoService).toBeDefined();
    });
});
