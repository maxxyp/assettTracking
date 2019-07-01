/// <reference path="../../../../../typings/app.d.ts" />

import {Scenario} from "../../../../../app/common/simulation/models/scenario";

describe("the Scenario module", () => {
    let scenario: Scenario<string, string>;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        scenario = new Scenario<string, string>();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenario).toBeDefined();
    });
});
