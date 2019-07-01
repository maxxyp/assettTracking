/// <reference path="../../../../../typings/app.d.ts" />

import {AuthenticationService} from "../../../../../app/hema/business/services/authenticationService";
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";
import { IWhoAmIService } from "../../../../../app/hema/api/services/interfaces/IWhoAmIService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IHemaConfiguration } from "../../../../../app/hema/IHemaConfiguration";
import { IWhoAmI } from "../../../../../app/hema/api/models/fft/whoAmI/IWhoAmI";
import { AuthenticationServiceConstants } from "../../../../../app/hema/business/services/authenticationServiceConstants";
import { ApiException } from "../../../../../app/common/resilience/apiException";
import { WhoAmIServiceConstants } from "../../../../../app/hema/business/services/constants/whoAmIServiceConstants";

describe("the AuthenticationService module", () => {
    let authenticationService: AuthenticationService;
    let sandbox: Sinon.SinonSandbox;

    let testingConstants = <AuthenticationServiceConstants> {
        FEEDBACK_INTERVAL_MS: 10,
        DEFAULT_TIME_OUT_MS: 99,
        SUCCESS_WAIT_MS: 98,
        FAIL_WAIT_MS: 97
    }

    let configurationServiceStub: IConfigurationService;
    let whoAmIServiceStub: IWhoAmIService;
    let eventAggregatorStub: EventAggregator;
    let whoAmIResult: IWhoAmI;
    let whoAmIStub: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        configurationServiceStub = <IConfigurationService>{};
        configurationServiceStub.getConfiguration = sandbox.stub().returns(<IHemaConfiguration>{});

        whoAmIResult = <IWhoAmI> {};
        whoAmIServiceStub = <IWhoAmIService>{};
        whoAmIStub = whoAmIServiceStub.whoAmI = sandbox.stub().resolves(whoAmIResult);

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();

        authenticationService = new AuthenticationService(
            configurationServiceStub,
            whoAmIServiceStub,
            eventAggregatorStub,
            testingConstants
        );

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(authenticationService).toBeDefined();
    });

    describe("without already being logged-in", () => {

        beforeEach(() => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns(<IHemaConfiguration>{
                whoAmITimeoutMs: 50,
                whoAmITimeoutRetries: 3
            });
        });

        it("can follow config polling and return a result on the first attempt", async done => {
            let result = await authenticationService.authenticate("cat", false);

            expect(result.hasWhoAmISucceeded).toBe(true);
            expect(result.result).toBe(whoAmIResult);
            expect(whoAmIStub.callCount).toBe(1);
            done();
        });

        it("can follow config polling and fail on http status code", async done => {
            whoAmIStub = whoAmIServiceStub.whoAmI = sandbox.stub().rejects(new ApiException(this, "foo", "bar {0}", ["baz"], {}, 500));

            let result = await authenticationService.authenticate("cat", false);

            expect(result.hasWhoAmISucceeded).toBe(false);
            expect(whoAmIStub.callCount).toBe(3);
            done();
        });

        it("can follow config polling and fail on timeout", async done => {
            let delay = 1;
            whoAmIServiceStub.whoAmI = () => Promise.delay(delay).then(() => whoAmIResult);
            let whoAmISpy = sinon.spy(whoAmIServiceStub, "whoAmI");

            let result = await authenticationService.authenticate("cat", false);

            expect(result.hasWhoAmISucceeded).toBe(true);

            delay = 100;
            whoAmIServiceStub.whoAmI = () => Promise.delay(delay).then(() => whoAmIResult);
            whoAmISpy = sinon.spy(whoAmIServiceStub, "whoAmI");

            result = await authenticationService.authenticate("cat", false);

            expect(result.hasWhoAmISucceeded).toBe(false);
            expect(whoAmISpy.callCount).toBe(3);
            done();
        });

        it("can follow config polling and return a result on an nth attempt", async done => {
            whoAmIStub = whoAmIServiceStub.whoAmI = sandbox.stub().rejects(new ApiException(this, "foo", "bar {0}", ["baz"], {}, 500));
            whoAmIStub.onThirdCall().resolves(whoAmIResult);

            let result = await authenticationService.authenticate("cat", false);

            expect(result.hasWhoAmISucceeded).toBe(true);
            expect(whoAmIStub.callCount).toBe(3);
            done();
        });

        it("will not poll if the user is already logged on", async done => {
            whoAmIStub = whoAmIServiceStub.whoAmI = sandbox.stub().rejects(new ApiException(this, "foo", "bar {0}", ["baz"], {}, 500));
            let result = await authenticationService.authenticate("cat", true);

            expect(result.hasWhoAmISucceeded).toBe(false);
            expect(whoAmIStub.callCount).toBe(1);
            done();
        });
    });

    describe("configs", () => {
        it("will observe config roles", async done => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns(<IHemaConfiguration>{
                whoAmITimeoutMs: 50,
                whoAmITimeoutRetries: 3,
                activeDirectoryRoles: ["foo", "bar"]
            });

            await authenticationService.authenticate("cat", false);

            expect(whoAmIStub.calledWith(WhoAmIServiceConstants.WHO_AM_I_ATTRIBUTES, ["foo", "bar"])).toBe(true);
            done();
        });
    });
});
