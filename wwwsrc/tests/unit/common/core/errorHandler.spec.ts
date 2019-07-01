/// <reference path="../../../../typings/app.d.ts" />

import {ErrorHandler} from "../../../../app/common/core/errorHandler";
import {Aurelia} from "aurelia-framework";
import {Container} from "aurelia-dependency-injection";
import {PlatformHelper} from "../../../../app/common/core/platformHelper";

describe("ErrorHandler", () => {
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", (done) => {
        let errorHandler: ErrorHandler = new ErrorHandler();
        expect(errorHandler).toBeDefined();
        done();
    });

    it("can have init called", (done) => {
        let a: Aurelia = <Aurelia>{};
        let p: Promise<Aurelia> = ErrorHandler.init(a);
        expect(p).toBeDefined();
        done();
    });

    it("can not log an error without development", (done) => {
        PlatformHelper.isDevelopment = false;
        let m: string = "";
        let get: any = sandbox.stub();
        let containerStub: Container = <Container>{};
        containerStub.get = get;

        let a: Aurelia = <Aurelia>{};
        ErrorHandler.init(a).then(() => {
            window.onerror("message", "url", 10);
            expect(m.length === 0).toBeTruthy();
            done();
        });
    });
});
