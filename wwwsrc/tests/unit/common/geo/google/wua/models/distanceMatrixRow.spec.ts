/// <reference path="../../../../../../../typings/app.d.ts" />

import {DistanceMatrixRow} from "../../../../../../../app/common/geo/google/wua/models/distanceMatrixRow";

describe("the DistanceMatrixRow module", () => {
    let distanceMatrixRow: DistanceMatrixRow;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        distanceMatrixRow = new DistanceMatrixRow();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(distanceMatrixRow).toBeDefined();
    });
});
