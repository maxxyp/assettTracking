/// <reference path="../../../../../typings/app.d.ts" />

import {DataState} from "../../../../../app/hema/business/models/dataState";

describe("the DataState module", () => {
    let dataState: DataState;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        dataState = DataState.dontCare;
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(dataState).toBeDefined();
    });
});
