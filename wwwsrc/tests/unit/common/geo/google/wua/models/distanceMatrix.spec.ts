/// <reference path="../../../../../../../typings/app.d.ts" />

import {DistanceMatrix} from "../../../../../../../app/common/geo/google/wua/models/distanceMatrix";

describe("the DistanceMatrix module", () => {
    let distanceMatrix: DistanceMatrix;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        distanceMatrix = new DistanceMatrix();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(distanceMatrix).toBeDefined();
    });
});
