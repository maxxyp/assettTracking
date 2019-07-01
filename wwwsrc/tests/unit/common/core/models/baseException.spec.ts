/// <reference path="../../../../../typings/app.d.ts" />

import {BaseException} from "../../../../../app/common/core/models/baseException";

describe("the BaseException module", () => {
    let baseException: BaseException;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        baseException = new BaseException(undefined, undefined, undefined, undefined, undefined);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(baseException).toBeDefined();
    });
});
