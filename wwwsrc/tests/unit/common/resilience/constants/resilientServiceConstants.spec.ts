/// <reference path="../../../../../typings/app.d.ts" />

import {ResilientServiceConstants} from "../../../../../app/common/resilience/constants/resilientServiceConstants";

describe("the ResilientServiceConstants module", () => {
    let resilientServiceConstants: ResilientServiceConstants;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        resilientServiceConstants = new ResilientServiceConstants();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(resilientServiceConstants).toBeDefined();
    });
});
