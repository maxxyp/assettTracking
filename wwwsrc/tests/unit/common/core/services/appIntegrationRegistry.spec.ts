/// <reference path="../../../../../typings/app.d.ts" />

import {AppIntegrationRegistry} from "../../../../../app/common/core/services/appIntegrationRegistry";
import { IAppLauncher } from "../../../../../app/common/core/services/IAppLauncher";
import { IObserver } from "../../../../../app/common/core/services/IObserver";
import { IAppCommand } from "../../../../../app/common/core/services/IAppCommand";

describe("the AppIntegrationRegistry module", () => {
    let sandbox: Sinon.SinonSandbox;
    let uriSchemeService: IObserver<IAppCommand>;
    let appLauncher: IAppLauncher;
    let invokeAppCommand: (command: IAppCommand) => void;
    let appIntegrationRegistry: AppIntegrationRegistry;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        uriSchemeService = <IObserver<IAppCommand>>{};
        invokeAppCommand = null;
        uriSchemeService.subscribe = (callback: (command: IAppCommand) => void) => {  invokeAppCommand = callback; };

        appLauncher = <IAppLauncher>{};
        appLauncher.launch = sandbox.stub();

        appIntegrationRegistry = new AppIntegrationRegistry(
            uriSchemeService,
            appLauncher
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(appIntegrationRegistry).toBeDefined();
    });

    describe("boilerEfficiencyGuide", () => {

        let launchStub: Sinon.SinonStub;

        beforeEach(() => {
            launchStub = (<Sinon.SinonStub>appLauncher.launch);
        });

        it ("navigateTo gcCode should call launcher with beg uri and gc param", () => {
            appIntegrationRegistry
                .boilerEfficiencyGuide.navigateTo.gcCode("44-44-44");

            expect(launchStub.alwaysCalledWith(
                "boilerefficiencyguide://{gcCode}",
                { gcCode: "44-44-44" }
            )).toBeTruthy();
        });
    });

    describe("customerInfo", () => {

        let launchStub: Sinon.SinonStub;

        beforeEach(() => {
            launchStub = (<Sinon.SinonStub>appLauncher.launch);
        });

        it ("navigateTo premises should call launcher with customerinfo uri and premises param", () => {
            appIntegrationRegistry
                .customerInfo.navigateTo.premises("1234567");

            expect(launchStub.alwaysCalledWith(
                "customerinfo://premises/{premisesId}",
                { premisesId: "1234567" }
            )).toBeTruthy();
        });

        it ("subscribe customerTipsComplete can be invoked by command", (done) => {
            appIntegrationRegistry
            .customerInfo.subscribe
            .customerTipsComplete((premisesId: string) => {
                expect(premisesId).toEqual("1234567");
                done();
            });

            invokeAppCommand({
                methodName: "customerTipsComplete",
                args: {
                    premisesId: "1234567"
                }
            });
        });
    });

    describe("engineerWorkBench", () => {

        let launchStub: Sinon.SinonStub;

        beforeEach(() => {
            launchStub = (<Sinon.SinonStub>appLauncher.launch);
        });

        it ("notify customerTipsComplete should call launcher with ewb uri and premises param", () => {
            appIntegrationRegistry
                .engineerWorkBench.notify.customerTipsComplete("1234567");

            expect(launchStub.alwaysCalledWith(
                "hema://command/customerTipsComplete",
                { "?premisesId": "1234567" }
            )).toBeTruthy();
        });
    });

});