/// <reference path="../../../../../typings/app.d.ts" />

import {GoogleMapsService} from "../../../../../app/common/geo/google/googleMapsService";

describe("the GoogleMapsService module", () => {
    let googleMapsService: GoogleMapsService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        googleMapsService = new GoogleMapsService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(googleMapsService).toBeDefined();
    });
});
