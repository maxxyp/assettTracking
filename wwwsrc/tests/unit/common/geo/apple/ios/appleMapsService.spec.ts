/// <reference path="../../../../../../typings/app.d.ts" />

import {AppleMapsService} from "../../../../../../app/common/geo/apple/ios/appleMapsService";

describe("the AppleMapsService module", () => {
    let appleMapsService: AppleMapsService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        appleMapsService = new AppleMapsService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(appleMapsService).toBeDefined();
    });
});
