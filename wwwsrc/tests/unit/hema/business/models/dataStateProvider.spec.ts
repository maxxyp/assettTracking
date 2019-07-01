/// <reference path="../../../../../typings/app.d.ts" />

import {DataStateProvider} from "../../../../../app/hema/business/models/dataStateProvider";
import {DataState} from "../../../../../app/hema/business/models/dataState";

describe("the DataStateProvider module", () => {
    let dataStateProvider: DataStateProvider;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        dataStateProvider = new DataStateProvider(DataState.dontCare, "mygroup");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(dataStateProvider).toBeDefined();
    });
});
