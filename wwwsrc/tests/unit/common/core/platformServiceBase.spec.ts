/// <reference path="../../../../typings/app.d.ts" />

import {Container} from "aurelia-dependency-injection";
import {PlatformServiceBase} from "../../../../app/common/core/platformServiceBase";
import {ITestModule} from "./services/ITestModule";

describe("the PlatformServiceBase module", () => {
    let platformServiceBase: PlatformServiceBase<ITestModule>;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    beforeAll(() => {
        Container.instance = new Container();
    });

    it("can be created", () => {
        platformServiceBase = new PlatformServiceBase<ITestModule>("tests/unit/common/core/services", "TestModule");
        expect(platformServiceBase).toBeDefined();
    });

    it("can load a module", (done) => {
        platformServiceBase = new PlatformServiceBase<ITestModule>("tests/unit/common/core/services", "TestModule");
        platformServiceBase.loadModule().then((module) => {
            expect(module.getValue()).toEqual(42);
            done();
        });
    });

    it("can fail to load a module", (done) => {
        platformServiceBase = new PlatformServiceBase<ITestModule>("tests/unit/common/core/services", "MissingModule");
        platformServiceBase.loadModule()
            .then((module) => {
                fail("module should not load");
            })
            .catch(() => {
                done();
            });
    });

    it("can load a cached module", (done) => {
        platformServiceBase = new PlatformServiceBase<ITestModule>("tests/unit/common/core/services", "TestModule");
        platformServiceBase.loadModule()
            .then((module) => {
                module.setValue(20);

                platformServiceBase.loadModule()
                    .then((module2) => {
                        expect(module2.getValue()).toEqual(20);
                        done();
                    });
            });
    });
});
