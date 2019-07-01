import {UriSchemeService} from "../../../../../../app/common/core/services/wua/uriSchemeService";
import {Aurelia} from "aurelia-framework";
import {Container} from "aurelia-dependency-injection";
import {Router} from "aurelia-router";

describe("the uriSchemeService module", () => {
    let uriSchemeService: UriSchemeService;
    let sandbox: Sinon.SinonSandbox;
    let aurelia: Aurelia;
    let router: Router;
    let activatedCallback:
        (args: Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any>) => void;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        router = <Router>{};
        router.navigate = sandbox.stub();

        aurelia = <Aurelia>{};
        aurelia.container = <Container>{};
        aurelia.container.get = sandbox.stub().returns(router);

        uriSchemeService = new UriSchemeService();
        uriSchemeService.registerPlatform(() => {});
    });

    afterEach(() => {
        window.Windows = undefined;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(uriSchemeService).toBeDefined();
    });

    it("can register platform web", () => {
        uriSchemeService.registerPlatform(() => {});
        expect(activatedCallback).toBeUndefined();
    });

    it("can register platform wua", () => {
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.WebUI = {};
        window.Windows.UI.WebUI.WebUIApplication = {
            addEventListener: (event: string, callback: () => void): void => {
                activatedCallback = callback;
            }
        };

        uriSchemeService.registerPlatform(() => {});
        expect(activatedCallback).toBeDefined();
    });

    it("can call activated callback no uri", () => {
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.WebUI = {};
        window.Windows.UI.WebUI.WebUIApplication = {
            addEventListener: (event: string, callback: () => void): void => {
                activatedCallback = callback;
            }
        };

        let args: Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any> =
            <Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any>>{
                detail: [{
                    uri: null
                }]
            };

        uriSchemeService.registerPlatform(() => {});
        activatedCallback(args);
        expect(activatedCallback).toBeDefined();
    });

    it("can call activated callback no route", () => {
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.WebUI = {};
        window.Windows.UI.WebUI.WebUIApplication = {
            addEventListener: (event: string, callback: () => void): void => {
                activatedCallback = callback;
            }
        };

        let args: Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any> =
            <Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any>>{
                detail: [{
                    uri: {
                        rawUri: "my-app://",
                        schemeName: "my-app"
                    }
                }]
            };

        uriSchemeService.registerPlatform(() => {});
        activatedCallback(args);
        expect(activatedCallback).toBeDefined();
    });

    it("can call activated callback includes blank path", () => {
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.WebUI = {};
        window.Windows.UI.WebUI.WebUIApplication = {
            addEventListener: (event: string, callback: () => void): void => {
                activatedCallback = callback;
            }
        };

        let args: Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any> =
            <Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any>>{
                detail: [{
                    uri: {
                        rawUri: "my-app:///#",
                        schemeName: "my-app"
                    }
                }]
            };

        uriSchemeService.registerPlatform(() => {});
        activatedCallback(args);
        expect(activatedCallback).toBeDefined();
    });

    // it("can call activated callback includes path no routes", () => {
    //     window.Windows = {};
    //     window.Windows.UI = {};
    //     window.Windows.UI.WebUI = {};
    //     window.Windows.UI.WebUI.WebUIApplication = {
    //         addEventListener: (event: string, callback: () => void): void => {
    //             activatedCallback = callback;
    //         }
    //     };
    //     window.Windows.ViewManagement = {};
    //     window.Windows.ViewManagement.UIViewSettings = {};
    //     window.Windows.ViewManagement.UIViewSettings.getForCurrentView = () => {
    //         return window.Windows.ViewManagement.UserInteractionMode.touch;
    //     }
    //     window.Windows.UI.ViewManagement.ApplicationView = {}
    //     window.Windows.UI.ViewManagement.ApplicationView.preferredLaunchWindowingMode = 1;
    
    //     let args: Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any> =
    //         <Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any>>{
    //             detail: [{
    //                 uri: {
    //                     rawUri: "my-app:///#/mylocation",
    //                     schemeName: "my-app"
    //                 }
    //             }]
    //         };

    //     uriSchemeService.registerPlatform(() => {});
    //     activatedCallback(args);
    //     expect(activatedCallback).toBeDefined();
    // });
});
