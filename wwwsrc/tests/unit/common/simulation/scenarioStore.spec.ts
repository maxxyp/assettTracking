/// <reference path="../../../../typings/app.d.ts" />

import {ScenarioStore} from "../../../../app/common/simulation/scenarioStore";
import {IScenarioStore} from "../../../../app/common/simulation/IScenarioStore";
describe("the ScenarioStore module", () => {
    let scenarioStore: ScenarioStore;
    let sandbox: Sinon.SinonSandbox;
    let scenarioInitialiseSpy: Sinon.SinonSpy;
    let scenarioLoadScenariosSpy: Sinon.SinonSpy;
    let scenarioLoadScenarioSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        scenarioStore = new ScenarioStore();

        let scenarioStoreStub = <IScenarioStore>{};
        scenarioInitialiseSpy = scenarioStoreStub.initialise = sandbox.spy();
        scenarioLoadScenariosSpy = scenarioStoreStub.loadScenarios = sandbox.spy();
        scenarioLoadScenarioSpy = scenarioStoreStub.loadScenario = sandbox.spy();

        scenarioStore.setService(scenarioStoreStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenarioStore).toBeDefined();
    });

    it("can initialise", (done) => {
        scenarioStore.initialise("").then(() => {
           expect(scenarioInitialiseSpy.called).toBe(true);
           done();
        });
    });

    it("can loadScenarios", (done) => {
        scenarioStore.initialise("").then(() => {
            scenarioStore.loadScenarios().then(() => {
                expect(scenarioLoadScenariosSpy.called).toBe(true);
                done();
            });
        });
    });

    it("can loadScenario", (done) => {
        scenarioStore.initialise("").then(() => {
            scenarioStore.loadScenario("_route_").then(() => {
                expect(scenarioLoadScenarioSpy.calledWith("_route_")).toBe(true);
                done();
             });
        });
    });
});
