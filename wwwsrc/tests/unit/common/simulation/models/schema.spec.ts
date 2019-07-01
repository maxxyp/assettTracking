/// <reference path="../../../../../typings/app.d.ts" />

import {Schema} from "../../../../../app/common/simulation/models/schema";

describe("the Schema module", () => {
    let schema: Schema;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        schema = new Schema();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(schema).toBeDefined();
    });
});
