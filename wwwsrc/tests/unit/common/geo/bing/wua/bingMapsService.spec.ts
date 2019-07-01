/// <reference path="../../../../../../typings/app.d.ts" />

import {BingMapsService} from "../../../../../../app/common/geo/bing/wua/bingMapsService";

describe("the BingMapsService module", () => {
    let bingMapsService: BingMapsService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        bingMapsService = new BingMapsService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(bingMapsService).toBeDefined();
    });
});
