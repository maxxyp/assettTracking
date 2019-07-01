import {IAppLauncher} from "../../../../../../app/common/core/services/IAppLauncher";
import {IPhoneService} from "../../../../../../app/common/ui/services/IPhoneService";
import {PhoneService} from "../../../../../../app/common/ui/services/ios/phoneService";

describe("phoneService", () => {
    let sandbox: Sinon.SinonSandbox;
    let appLauncher: IAppLauncher;
    let phoneService: IPhoneService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        cordova = <any>{};
        cordova.InAppBrowser = {
            open: (uri: string, target: string): void => {}
        };

        appLauncher = <IAppLauncher>{ 
            checkInstalled: (uri: string): Promise<boolean> => { 
                return Promise.resolve(true); 
            }
        };
        phoneService = new PhoneService(appLauncher);
    });

    afterEach(() => {
        cordova = null;
        sandbox.restore();
        phoneService = null;
    });

    it("can be created", () => {
        expect(phoneService).toBeDefined();
    });

    it("should return true when tel uri is available", (done) => {
        phoneService.showPhoneCallUI("01233456", "").then((res) => {
            expect(res).toBeTruthy();
            done();
        });
    });
    
    it("should return false when tel uri is unavailable", (done) => {
            appLauncher = <IAppLauncher>{ 
            checkInstalled: (uri: string): Promise<boolean> => { 
                return Promise.resolve(false); 
            }
        };

        phoneService.showPhoneCallUI("01233456", "").then((res) => {
            expect(res).toBeFalsy();
            done();
        });
    });

    it("should return true when sms uri is available", (done) => {
        phoneService.showPhoneSMSUI(["01233456"], "msg").then((res) => {
            expect(res).toBeTruthy();
            done();
        });
    });
    
    it("should return false when sms uri is unavailable", (done) => {
            appLauncher = <IAppLauncher>{ 
            checkInstalled: (uri: string): Promise<boolean> => { 
                return Promise.resolve(false); 
            }
        };

        phoneService.showPhoneSMSUI(["01233456"], "msg").then((res) => {
            expect(res).toBeFalsy();
            done();
        });
    });

});

