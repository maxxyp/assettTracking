/// <reference path="../../../../../../typings/app.d.ts" />

import {AppLauncher} from "../../../../../../app/common/core/services/ios/appLauncher";

describe("the AppLauncher module", () => {
    let appLauncher: AppLauncher;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        appLauncher = new AppLauncher();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(appLauncher).toBeDefined();
    });
});
