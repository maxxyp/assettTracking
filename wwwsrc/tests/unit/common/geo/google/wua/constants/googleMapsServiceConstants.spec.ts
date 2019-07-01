/// <reference path="../../../../../../../typings/app.d.ts" />

import {GoogleMapsServiceConstants} from "../../../../../../../app/common/geo/google/wua/constants/googleMapsServiceConstants";

describe("the GoogleMapsServiceConstants module", () => {
    let googleMapsServiceConstants: GoogleMapsServiceConstants;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        googleMapsServiceConstants = new GoogleMapsServiceConstants();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(googleMapsServiceConstants).toBeDefined();
    });
});
