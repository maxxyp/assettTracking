/// <reference path="../../../../../typings/app.d.ts" />

import {ScenarioItem} from "../../../../../app/common/simulation/view/scenarioItem";
import {IScenarioLoader} from "../../../../../app/common/simulation/IScenarioLoader";
import {Scenario} from "../../../../../app/common/simulation/models/scenario";
describe("the ScenarioItem module", () => {
    let scenarioItem: ScenarioItem;
    let sandbox: Sinon.SinonSandbox;
    let scenarioLoader: IScenarioLoader;
    let scenarioLoaderSpy: Sinon.SinonSpy;
    let scenarioStub = <Scenario<any, any>>{};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        scenarioLoader = <IScenarioLoader>{};
        scenarioItem = new ScenarioItem(scenarioLoader);
        scenarioLoaderSpy = scenarioLoader.loadScenario = sandbox.stub().returns(Promise.resolve(scenarioStub));

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenarioItem).toBeDefined();
    });

    it("can activate and set scenarioName", (done) => {
       scenarioItem.activate({ scenario: "_xx_"}).then(() => {
           expect(scenarioItem.scenarioName).toBe("/xx/");
           done();
       });
    });

    it("can activate and set scenario", (done) => {
       scenarioItem.activate({ scenario: "xyz"}).then(() => {
           expect(scenarioLoaderSpy.calledWith("xyz")).toBe(true);
           expect(scenarioItem.scenario).toBe(scenarioStub);
           done();
       });
    });
});
