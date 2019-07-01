/// <reference path="../../../../../typings/app.d.ts" />

import {ScenarioStore} from "../../../../../app/common/simulation/web/scenarioStore";
import {IAssetService} from "../../../../../app/common/core/services/IAssetService";

describe("the ScenarioStore module", () => {
    let scenarioStore: ScenarioStore;
    let sandbox: Sinon.SinonSandbox;
    let assetService: IAssetService;
    let loadJsonSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        assetService = <IAssetService>{};
        loadJsonSpy = assetService.loadJson = sandbox.stub().returns(Promise.resolve());
        scenarioStore = new ScenarioStore(assetService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenarioStore).toBeDefined();
    });

    it("can initialise", (done) => {
        scenarioStore.initialise("scenarios").then(() => {
            done();
        });
    });

    it("can loadScenarios", (done) => {
        scenarioStore.initialise("scenarios").then(() => {
            scenarioStore.loadScenarios().then(() => {
                expect(loadJsonSpy.calledWith("scenarios/scenarioList.json")).toBe(true);
                done();
             });
        });
    });

    it("can loadScenario", (done) => {
        scenarioStore.initialise("scenarios").then(() => {
            scenarioStore.loadScenario("_route_").then(() => {
                expect((loadJsonSpy.args[0][0] as string).indexOf("scenarios/_route_/scenario.json") === 0).toBe(true);
                done();
             });
        });
    });
});
