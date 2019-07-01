/// <reference path="../../../../typings/app.d.ts" />

import {Startup} from "../../../../app/common/core/startup";
import {Aurelia} from "aurelia-framework";
import {PlatformHelper} from "../../../../app/common/core/platformHelper";
import {Container} from "aurelia-dependency-injection";
import {Router} from "aurelia-router";
import {IConfigurationService} from "../../../../app/common/core/services/IConfigurationService";
import {ConfigurationService} from "../../../../app/common/core/services/configurationService";
import {UriSchemeService} from "../../../../app/common/core/services/uriSchemeService";
import { LoggerService } from "../../../../app/common/core/services/loggerService";

describe("the Startup module", () => {
    let startup: Startup;
    let sandbox: Sinon.SinonSandbox;
    let frameworkConfiguration: any = {};
    let aur: Aurelia;
    let flag: boolean;
    let configObj: any = {};
    let router: Router;
    let configStub: IConfigurationService;
    let uriSchemeServiceStub: UriSchemeService;

    beforeEach(() => {
        startup = new Startup();
        sandbox = sinon.sandbox.create();

        configObj.useDefaults = sandbox.stub().returns({ useCSS: sandbox.stub() });

        frameworkConfiguration.defaultBindingLanguage = sandbox.stub().returns(frameworkConfiguration);
        frameworkConfiguration.defaultResources = sandbox.stub().returns(frameworkConfiguration);
        frameworkConfiguration.router = sandbox.stub().returns(frameworkConfiguration);
        frameworkConfiguration.eventAggregator = sandbox.stub().returns(frameworkConfiguration);
        frameworkConfiguration.plugin = (name: string, configCb: (config: any) => void) => {
            if (configCb) {
                configCb(configObj);
            }
            return frameworkConfiguration;
        };
        frameworkConfiguration.developmentLogging = sandbox.stub().returns(frameworkConfiguration);
        frameworkConfiguration.globalResources = sandbox.stub().returns(frameworkConfiguration);
        frameworkConfiguration.history = sandbox.stub().returns(frameworkConfiguration);

        aur = <Aurelia>{
            use: frameworkConfiguration,
            start: (): Promise<Aurelia> => new Promise<Aurelia>((resolve, reject) => resolve(aur)),
            setRoot: (root?: string, applicationHost?: string | Element): any => {
                flag = true;
            },
            container: <Container>{}
        };

        router = <Router>{};
        router.navigate = sandbox.stub();

        configStub = <IConfigurationService>{};
        configStub.load = sandbox.stub().returns(Promise.resolve());
        configStub.getConfiguration = sandbox.stub().returns({});

        uriSchemeServiceStub = <UriSchemeService>{};
        uriSchemeServiceStub.registerPlatform = sandbox.stub();
        uriSchemeServiceStub.navigateToInitialRoute = sandbox.stub();

        aur.container.get = (obj) => {
            if (obj === ConfigurationService) {
                return configStub;
            }  else if (obj === UriSchemeService) {
                return uriSchemeServiceStub;
            } else if (obj === LoggerService) {
                return { initialize: () =>  {} }
            } else {
                return router;
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(startup).toBeDefined();
    });

    it("can call configure", (done) => {
        window.appIsDevelopment = false;
        window.appVersion = null;
        window.appIsSource  = null;

        Startup.configure(aur, null, null).then(() => {
            expect(flag).toBeTruthy();
            done();
        });
    });

    it("can call configure as development", (done) => {
        flag = false;

        window.appIsDevelopment = true;
        window.appVersion = "<local>";
        window.appIsSource  = true;

        Startup.configure(aur, null, null).then(() => {
            expect(flag).toBeTruthy();
            done();
        });
    });

    it("can call configure with plugins and resources", (done) => {
        flag = false;

        window.appIsDevelopment = true;
        window.appVersion = "<local>";
        window.appIsSource  = true;

        Startup.configure(aur, ["plugin"], ["resource"]).then(() => {
            expect(flag).toBeTruthy();
            done();
        });
    });

    it("can call configure as wua", (done) => {
        flag = false;

        PlatformHelper.navigatorAppVersion = "MSAppHost";
        PlatformHelper.resetPlatform();

        Startup.configure(aur, null, null).then(() => {
            expect(flag).toBeTruthy();
            done();
        });
    });
    
    it("can call configure where Platform is non wua", (done) => {
        flag = false;
      
        sandbox.stub(PlatformHelper, 'getPlatform').returns("nonwua");
        Startup.configure(aur, null, null).then(() => {
            expect(flag).toBeTruthy();
            done();
        });
    });

    it("can call configure as cordova", (done) => {
        flag = false;

        window.cordova = <Cordova>{};
        window.cordova.version = "1.0.0";
        window.cordova.platformId = "windows";

        Startup.configure(aur, null, null).then(() => {
            expect(flag).toBeTruthy();
            done();
            delete window.cordova;
        });
    });
});
