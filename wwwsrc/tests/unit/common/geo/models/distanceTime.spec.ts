/// <reference path="../../../../../typings/app.d.ts" />

import {DistanceTime} from "../../../../../app/common/geo/models/distanceTime";

describe("the DistanceTime module", () => {
    let distanceTime: DistanceTime;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        distanceTime = new DistanceTime();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(distanceTime).toBeDefined();
    });
});
