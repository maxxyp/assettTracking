/// <reference path="../../../../../../../typings/app.d.ts" />

import {DistanceMatrixRowElement} from "../../../../../../../app/common/geo/google/wua/models/distanceMatrixRowElement";

describe("the DistanceMatrixRowElement module", () => {
    let distanceMatrixRowElement: DistanceMatrixRowElement;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        distanceMatrixRowElement = new DistanceMatrixRowElement();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(distanceMatrixRowElement).toBeDefined();
    });
});
