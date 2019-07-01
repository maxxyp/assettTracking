/// <reference path="../../../../../typings/app.d.ts" />

import {SecureStorage} from "../../../../../app/common/storage/wua/secureStorage";

describe("the SecureStorage module", () => {
    let secureStorage: SecureStorage;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        secureStorage = new SecureStorage();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(secureStorage).toBeDefined();
    });
});
