/// <reference path="../../../../typings/app.d.ts" />

import {ScenarioRoutes} from "../../../../app/common/simulation/scenarioRoutes";

describe("the ScenarioRoutes module", () => {
    let scenarioRoutes: ScenarioRoutes;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        scenarioRoutes = new ScenarioRoutes();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenarioRoutes).toBeDefined();
    });
});
