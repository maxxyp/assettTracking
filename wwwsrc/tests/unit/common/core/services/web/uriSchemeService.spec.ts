/// <reference path="../../../../../../typings/app.d.ts" />

import {UriSchemeService} from "../../../../../../app/common/core/services/web/uriSchemeService";

describe("the UriSchemeService module", () => {
    let uriSchemeService: UriSchemeService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        uriSchemeService = new UriSchemeService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(uriSchemeService).toBeDefined();
    });
});
