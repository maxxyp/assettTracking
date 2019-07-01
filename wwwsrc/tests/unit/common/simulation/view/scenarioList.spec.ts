/// <reference path="../../../../../typings/app.d.ts" />

import {ScenarioList} from "../../../../../app/common/simulation/view/scenarioList";
import {IScenarioLoader} from "../../../../../app/common/simulation/IScenarioLoader";

describe("the ScenarioList module", () => {
    let scenarioList: ScenarioList;
    let sandbox: Sinon.SinonSandbox;
    let scenarioLoader: IScenarioLoader;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        scenarioLoader = <IScenarioLoader>{};
        scenarioLoader.listScenarios = sandbox.stub().returns(Promise.resolve(["aaa", "bbb"]));

        scenarioList = new ScenarioList(scenarioLoader);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenarioList).toBeDefined();
    });

    it("paramName should replace slashes with underscores", () => {
        let resolvedName = scenarioList.paramName("/aaa/bbb/");
        expect(resolvedName).toBe("_aaa_bbb_");
    });

    it("can call attached", (done) => {
        scenarioList.attached().then(() => {
            expect(scenarioList.scenarios).toEqual(["aaa", "bbb"]);
            done();
        });
    });
});
