/// <reference path="../../../../../../typings/app.d.ts" />

import { UriSchemeService } from "../../../../../../app/common/core/services/ios/uriSchemeService";

describe("the UriSchemeService (ios) module", () => {

    let uriSchemeService: UriSchemeService;
    let sandbox: Sinon.SinonSandbox;
   
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        uriSchemeService = new UriSchemeService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it ("should extract the uri path", (done) => {
        uriSchemeService.registerPlatform((uriPath) => {
            expect(uriPath).toEqual("/home");
            done();
        });

        window.handleOpenURL("customerinfo://home");
    });

    it ("should remove hash paths", (done) => {
        uriSchemeService.registerPlatform((uriPath) => {
            expect(uriPath).toEqual("/#home");
            done();
        });
        
        window.handleOpenURL("customerinfo://#home");
    });

   
});
