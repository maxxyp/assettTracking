/// <reference path="../../../../../../typings/app.d.ts" />

import {PhoneService} from "../../../../../../app/common/ui/services/ios/phoneService";
import {IAppLauncher} from "../../../../../../app/common/core/services/IAppLauncher";

describe("the PhoneService module", () => {
    let phoneService: PhoneService;
    let sandbox: Sinon.SinonSandbox;
    let appLauncherStub: IAppLauncher

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        appLauncherStub = <IAppLauncher>{};
        phoneService = new PhoneService(appLauncherStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(phoneService).toBeDefined();
    });
});
