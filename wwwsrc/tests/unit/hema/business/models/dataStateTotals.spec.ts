/// <reference path="../../../../../typings/app.d.ts" />

import {DataStateTotals} from "../../../../../app/hema/business/models/dataStateTotals";

describe("the DataStateTotals module", () => {
    let dataStateTotals: DataStateTotals;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        dataStateTotals = new DataStateTotals();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(dataStateTotals).toBeDefined();
    });
});
