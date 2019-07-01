import { CustomerInfoService } from "../../../../../app/hema/business/services/customerInfoService";
import { ICustomerInfoService } from "../../../../../app/hema/business/services/interfaces/ICustomerInfoService";
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";
import { LabelService } from "../../../../../app/hema/business/services/labelService";
import { ICustomerInfoConfiguration } from "../../../../../app/hema/business/services/interfaces/ICustomerInfoConfiguration";
import { IAppIntegrationRegistry } from "../../../../../app/common/core/services/IAppIntegrationRegistry";
import { DateHelper } from "../../../../../app/hema/core/dateHelper";

describe("the customerInfoService class", () => {
    let sandbox: Sinon.SinonSandbox;

    let configurationService: IConfigurationService;
    let appIntegrationRegistry: IAppIntegrationRegistry;
    let labelService: LabelService;

    let customerInfoService: ICustomerInfoService;
    let navigateStub: Sinon.SinonStub;
    let config: ICustomerInfoConfiguration;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        configurationService = <IConfigurationService>{};

        config = {
            customerInfoReOpenExpiryMinutes: 10,
            customerInfoAutoLaunch: true
        };

        configurationService.getConfiguration = sandbox.stub().returns(config);

        appIntegrationRegistry = <IAppIntegrationRegistry>{ customerInfo: { navigateTo: {} }};
        navigateStub = appIntegrationRegistry.customerInfo.navigateTo.premises = sandbox.stub();

        labelService = <LabelService>{};
        labelService.getGroup = sandbox.stub().resolves({customerInfoReturnToApp: "foo"});

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);
        expect(customerInfoService).toBeDefined();
    });

    describe("openApp", () => {
        it("will open the app", async done => {
            customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);

            await customerInfoService.openApp("123");
            expect(navigateStub.called).toBe(true);
            done();
        });
    });

    describe("openAppIfNotVisited", () => {
        it("will not run if not configured to", async done => {
            config.customerInfoAutoLaunch = false;
            customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);

            await customerInfoService.openAppIfNotVisited("123", true);
            expect(navigateStub.called).toBe(false);
            done();
        });

        it("will run first time for a given premises", async done => {
            customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);
            await customerInfoService.openAppIfNotVisited("123");
            expect(navigateStub.args[0]).toEqual(["123", {
                returnUri: true,
                returnUriText: "foo",
                fullScreen: true
            }]);
            done();
        })

        it("will run first time for a second given premises", async done => {
            customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);
            await customerInfoService.openAppIfNotVisited("123");

            await customerInfoService.openAppIfNotVisited("124");
            expect(navigateStub.args[0]).toEqual(["123", {
                returnUri: true,
                returnUriText: "foo",
                fullScreen: true
            }]);
            expect(navigateStub.args[1]).toEqual(["124", {
                returnUri: true,
                returnUriText: "foo",
                fullScreen: true
            }]);
            done();
        })

        it("will not run for a given premises the second time", async done => {
            customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);
            await customerInfoService.openAppIfNotVisited("123");
            await customerInfoService.openAppIfNotVisited("123");
            expect(navigateStub.callCount).toBe(1);
            done();
        })

        it("will run for a given premises the second time if forced", async done => {
            customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);
            await customerInfoService.openAppIfNotVisited("123");
            await customerInfoService.openAppIfNotVisited("123", true);
            expect(navigateStub.callCount).toBe(2);
            done();
        })

        it("will run for a given premises the second time if enough time has elapsed", async done => {
            customerInfoService = new CustomerInfoService(configurationService, appIntegrationRegistry, labelService);

            let timeNow = 98765;
            DateHelper.getTimestampMs = sandbox.stub().returns(timeNow);
            await customerInfoService.openAppIfNotVisited("123");
            expect(navigateStub.callCount).toBe(1);

            timeNow += 10 * 1000 * 60 - 1; // 1 ms less than full 10 mins elapsed
            DateHelper.getTimestampMs = sandbox.stub().returns(timeNow);
            await customerInfoService.openAppIfNotVisited("123");
            expect(navigateStub.callCount).toBe(1);

            timeNow += 1; // full 10 minutes elapsed
            DateHelper.getTimestampMs = sandbox.stub().returns(timeNow);
            await customerInfoService.openAppIfNotVisited("123");
            expect(navigateStub.callCount).toBe(2);

            timeNow += 10 * 1000 * 60 - 1; // 1 ms less than full 10 mins elapsed
            DateHelper.getTimestampMs = sandbox.stub().returns(timeNow);
            await customerInfoService.openAppIfNotVisited("123");
            expect(navigateStub.callCount).toBe(2);

            timeNow += 1; // full 10 minutes elapsed
            DateHelper.getTimestampMs = sandbox.stub().returns(timeNow);
            await customerInfoService.openAppIfNotVisited("123");
            expect(navigateStub.callCount).toBe(3);

            done();
        })

    });
});