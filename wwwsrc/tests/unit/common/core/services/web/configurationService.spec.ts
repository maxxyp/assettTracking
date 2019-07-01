/// <reference path="../../../../../../typings/app.d.ts" />

import * as AurHttp from "aurelia-fetch-client";
import {HttpClient} from "../../../../../../app/common/core/httpClient";
import {PlatformHelper} from "../../../../../../app/common/core/platformHelper";
import {IHttpClient} from "../../../../../../app/common/core/IHttpClient";
import {Interceptor} from "aurelia-fetch-client";
import {ConfigurationService} from "../../../../../../app/common/core/services/web/configurationService";

describe("the ConfigurationService module", () => {
    let configurationService: ConfigurationService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        PlatformHelper.loaderPrefix = "/base/";
        PlatformHelper.appVersion = "";
        PlatformHelper.isSource = true;
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        configurationService = new ConfigurationService(new HttpClient(new AurHttp.HttpClient()));
        expect(configurationService).toBeDefined();
    });

    it("can load configuration", (done) => {
        configurationService = new ConfigurationService(new HttpClient(new AurHttp.HttpClient()));
        configurationService.load().then(() => {
            expect(configurationService.getConfiguration<any>() !== null).toBeTruthy();
            done();
        });
    });

    it("can load configuration cached", (done) => {
        configurationService = new ConfigurationService(new HttpClient(new AurHttp.HttpClient()));
        configurationService.load().then(() => {
            configurationService.load().then(() => {
                expect(configurationService.getConfiguration<any>() !== null).toBeTruthy();
                done();
            });
        });
    });

    it("can fail to load version config", (done) => {
        PlatformHelper.isSource = false;
        PlatformHelper.loaderPrefix = "/sssss/";
        configurationService = new ConfigurationService(new HttpClient(new AurHttp.HttpClient()));
        configurationService.load().then(() => {
            expect(configurationService.getConfiguration<any>() === null).toBeTruthy();
            done();
        });
    });

    it("can fail loading configuration", (done) => {
        let hc = <IHttpClient>{};
        hc.fetch = (url: string, request?: Request, interceptor?: Interceptor) : Promise<Response> => {
                return new Promise<Response>((resolve, reject) => {
                    reject(null);
                });
            };

        configurationService = new ConfigurationService(hc);

        configurationService.load().then(() => {
            expect(configurationService.getConfiguration<any>() === null).toBeTruthy();
            done();
        });
    });
});
