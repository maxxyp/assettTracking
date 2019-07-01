/// <reference path="../../../../../typings/app.d.ts" />

import {ScenarioStore} from "../../../../../app/common/simulation/wua/scenarioStore";
import {IAssetService} from "../../../../../app/common/core/services/IAssetService";

describe("the ScenarioStore module", () => {
    let scenarioStore: ScenarioStore;
    let sandbox: Sinon.SinonSandbox;
    let assetService: IAssetService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        assetService = <IAssetService>{};
        scenarioStore = new ScenarioStore(assetService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenarioStore).toBeDefined();
    });
});
