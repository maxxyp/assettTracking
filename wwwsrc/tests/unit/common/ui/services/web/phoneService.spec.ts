import {IPhoneService} from "../../../../../../app/common/ui/services/IPhoneService";
import {PhoneService} from "../../../../../../app/common/ui/services/web/phoneService";

describe("phoneService", () => {
    let sandbox: Sinon.SinonSandbox;
    let phoneService: IPhoneService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        phoneService = new PhoneService();
    });

    afterEach(() => {
        sandbox.restore();
        phoneService = null;
    });

    it("can be created", () => {
        expect(phoneService).toBeDefined();
    });

    it("showPhoneCallUI returns true", (done) => {
        phoneService.showPhoneCallUI("1111111", null).then((res) => {
            expect(res).toBeTruthy();
            done();
        });
    });

    it("showPhoneCallUI returns false", (done) => {
        phoneService.showPhoneCallUI(null, null).then((res) => {
            expect(res).toBeFalsy();
            done();
        });
    });

    it("showPhoneSMSUI returns true", (done) => {
        phoneService.showPhoneSMSUI(["aaaaa"], null).then((res) => {
            expect(res).toBeTruthy();
            done();
        });
    });

    it("showPhoneSMSUI returns false", (done) => {
        phoneService.showPhoneSMSUI(null, null).then((res) => {
            expect(res).toBeFalsy();
            done();
        });
    });
});
