/// <reference path="../../../../../typings/app.d.ts" />

import {GeoPosition} from "../../../../../app/common/geo/models/geoPosition";

describe("the GeoPosition module", () => {
    let sandbox: Sinon.SinonSandbox;
    let geoPosition: GeoPosition;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        geoPosition = new GeoPosition(100, 200);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(geoPosition).toBeDefined();
    });

    it("can set longitude values", () => {
        expect(geoPosition.longitude === 100).toBeTruthy();
    });

    it("can set latitude values", () => {
        expect(geoPosition.latitude === 200).toBeTruthy();
    });
});
