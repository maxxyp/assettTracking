/// <reference path="../../../../../typings/app.d.ts" />

import {RetryPayload} from "../../../../../app/common/resilience/models/retryPayload";

describe("the RetryPayload module", () => {
    let retryPayload: RetryPayload;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        retryPayload = new RetryPayload();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(retryPayload).toBeDefined();
    });
});
