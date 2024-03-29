/// <reference path="../../../../../../typings/app.d.ts" />

import {GoogleMapsService} from "../../../../../../app/common/geo/google/web/googleMapsService";
import {IConfigurationService} from "../../../../../../app/common/core/services/IConfigurationService";
import {IGoogleMapsServiceConfiguration} from "../../../../../../app/common/geo/google/IGoogleMapsServiceConfiguration";
import {HttpClient} from "aurelia-http-client";

describe("the GoogleMapsService module", () => {
    let googleMapsService: GoogleMapsService;
    let sandbox: Sinon.SinonSandbox;
    let configurationService: IConfigurationService;
    let httpClient: HttpClient;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        configurationService = <IConfigurationService>{};
        configurationService.getConfiguration = sandbox.stub().returns(<IGoogleMapsServiceConfiguration>{
            googleClientKey: "",
            googleApiVersion: ""
        });
        httpClient = <HttpClient>{};
        googleMapsService = new GoogleMapsService(configurationService, httpClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(googleMapsService).toBeDefined();
    });
});
