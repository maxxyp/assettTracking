/// <reference path="../../../../typings/app.d.ts" />

import {ApiException} from "../../../../app/common/resilience/apiException";

describe("the ApiException module", () => {
    let apiException: ApiException;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        apiException = new ApiException(undefined, undefined, undefined, undefined, undefined);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(apiException).toBeDefined();
    });

    describe("httpStatusCode", () => {
        it("can accept an undefined httpStatus code", () => {
            apiException = new ApiException(undefined, undefined, undefined, undefined, undefined, undefined);
            expect(apiException.httpStatusCode).toBeUndefined();
        });

        it("can accept a null httpStatus code", () => {
            apiException = new ApiException(undefined, undefined, undefined, undefined, undefined, null);
            expect(apiException.httpStatusCode).toBeUndefined();
        });

        it("can accept an numeric httpStatus code", () => {
            apiException = new ApiException(undefined, undefined, undefined, undefined, undefined, 404);
            expect(apiException.httpStatusCode).toBe("404");
        });

        it("can accept a string httpStatus code", () => {
            apiException = new ApiException(undefined, undefined, undefined, undefined, undefined, "404");
            expect(apiException.httpStatusCode).toBe("404");
        });

        it("can accept a zero numeric httpStatus code", () => {
            apiException = new ApiException(undefined, undefined, undefined, undefined, undefined, 0);
            expect(apiException.httpStatusCode).toBe("0");
        });
    });
});
