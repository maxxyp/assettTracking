import {IPhoneService} from "../../../../../../app/common/ui/services/IPhoneService";
import {PhoneService} from "../../../../../../app/common/ui/services/wua/phoneService";

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
        window.Windows = {};
        window.Windows.ApplicationModel = {};
        expect(phoneService).toBeDefined();
    });

    it("can be created without AppModel", () => {
        expect(phoneService).toBeDefined();
    });

    describe("showPhoneCallUI returns truthy", () => {

        beforeEach(() => {
            window.Windows = {};
            window.Windows.ApplicationModel = {};
            window.Windows.ApplicationModel.Calls = {};
            window.Windows.ApplicationModel.Calls.PhoneCallManager = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
            phoneService = null;
        });

        it("returns truthy", (done) => {
            window.Windows.ApplicationModel.Calls.PhoneCallManager.showPhoneCallUI = sandbox.stub();
            phoneService.showPhoneCallUI("01233456", "").then((res) => {
                expect(res).toBeTruthy();
                done();
            });
        });
    });

    describe("showPhoneCallUI returns falsy", () => {

        beforeEach(() => {
            window.Windows = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
        });

        it("without ApplicationModel", (done) => {
            phoneService.showPhoneCallUI("01233456", "").then((res) => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });

    describe("showPhoneCallUI returns falsy", () => {

        beforeEach(() => {
            window.Windows = {};
            window.Windows.ApplicationModel = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
        });

        it("without Calls", (done) => {
            phoneService.showPhoneCallUI("01233456", "").then((res) => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });

    describe("showPhoneCallUI returns falsy", () => {

        beforeEach(() => {
            window.Windows = {};
            window.Windows.ApplicationModel = {};
            window.Windows.ApplicationModel.Calls = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
        });

        it("without PhoneCallManager", (done) => {
            phoneService.showPhoneCallUI("01233456", "").then((res) => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });

    describe("showPhoneCallUI returns falsy", () => {

        beforeEach(() => {
            window.Windows = {};
            window.Windows.ApplicationModel = {};
            window.Windows.ApplicationModel.Calls = {};
            window.Windows.ApplicationModel.Calls.PhoneCallManager = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
            phoneService = null;
        });

        it("showPhoneCallUI throws error", (done) => {
            window.Windows.ApplicationModel.Calls.PhoneCallManager.showPhoneCallUI = sandbox.stub().throws(new Error());
            phoneService.showPhoneCallUI("01233456", "").then((res) => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });
    ///--------------------

    describe("showPhoneSMSUI returns truthy", () => {

        beforeEach(() => {
            window.Windows = {};
            window.Windows.ApplicationModel = {};
            window.Windows.ApplicationModel.Chat = {};
            window.Windows.ApplicationModel.Chat = { ChatMessage: ChatMessage };
            window.Windows.ApplicationModel.Chat.ChatMessageManager = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
            phoneService = null;
        });

        it("returns truthy", (done) => {
            window.Windows.ApplicationModel.Chat.ChatMessageManager.showComposeSmsMessageAsync =
                sandbox.stub().returns(new Promise<void>((resolve, reject) => {
                    resolve();
                }));
            let phones: string[] = [];
            phones.push("01233456");
            phoneService.showPhoneSMSUI(phones, "Hi this is SMS test").then((res) => {
                expect(res).toBeTruthy();
                done();
            });
        });
    });

    describe("showPhoneSMSUI returns falsy", () => {

        beforeEach(() => {
            window.Windows = {};
            window.Windows.ApplicationModel = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
            phoneService = null;
        });

        it("Chat is undefined", (done) => {
            let phones: string[] = [];
            phones.push("01233456");
            phoneService.showPhoneSMSUI(phones, "Hi this is SMS test").then((res) => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });

    describe("showPhoneSMSUI returns falsy", () => {

        beforeEach(() => {
            window.Windows = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
            phoneService = null;
        });

        it("ApplicationModel is undefined", (done) => {
            let phones: string[] = [];
            phones.push("01233456");
            phoneService.showPhoneSMSUI(phones, "Hi this is SMS test").then((res) => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });

    describe("showPhoneSMSUI returns falsy", () => {

        beforeEach(() => {
            window.Windows = {};
            window.Windows.ApplicationModel = {};
            window.Windows.ApplicationModel.Chat = {};
            window.Windows.ApplicationModel.Chat = { ChatMessage: ChatMessage };
            window.Windows.ApplicationModel.Chat.ChatMessageManager = {};
            phoneService = new PhoneService();
        });

        afterEach(() => {
            window.Windows = null;
            phoneService = null;
        });

        it("showComposeSmsMessageAsync rejects", (done) => {
            window.Windows.ApplicationModel.Chat.ChatMessageManager.showComposeSmsMessageAsync =
                sandbox.stub().returns(new Promise<void>((resolve, reject) => {
                    reject();
                }));
            let phones: string[] = [];
            phones.push("01233456");
            phoneService.showPhoneSMSUI(phones, "Hi this is SMS test").then((res) => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });

    class ChatMessage {
        public message: string;
        public recipients: string[];

        constructor() {
            this.recipients = [];
        }
    }
});

