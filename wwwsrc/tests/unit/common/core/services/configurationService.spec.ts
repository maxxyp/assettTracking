/// <reference path="../../../../../typings/app.d.ts" />

import {ConfigurationService} from "../../../../../app/common/core/services/configurationService";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";

describe("the ConfigurationService module", () => {
    let configurationService: ConfigurationService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        configurationService = new ConfigurationService();
        expect(configurationService).toBeDefined();
    });

    it("can get configuration", (done) => {
        let stub: IConfigurationService = <IConfigurationService>{};
        stub.getConfiguration = sandbox.stub().returns(true);

        configurationService.setService(stub);

        expect(configurationService.getConfiguration<boolean>()).toBeTruthy();
        done();
    });

    it("can load configuration", (done) => {
        let stub: IConfigurationService = <IConfigurationService>{};
        stub.load = sandbox.stub().returns(true);

        configurationService.setService(stub);

        expect(configurationService.load<boolean>()).toBeTruthy();
        done();
    });
});
