/// <reference path="../../../../../typings/app.d.ts" />

import {Mutation} from "../../../../../app/common/simulation/models/mutation";

describe("the Mutation module", () => {
    let mutation: Mutation<string>;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        mutation = new Mutation<string>();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(mutation).toBeDefined();
    });
});
