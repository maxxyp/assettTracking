/// <reference path="../../../../typings/app.d.ts" />

import { UrlParamService } from "../../../../app/common/core/urlParamService";

describe("urlParamService module", () => {

    it("can be constructed", () => {
        var ups = new UrlParamService();
        expect(ups).toBeDefined();
    });

    it("can be created", () => {
        expect(UrlParamService).toBeDefined();
    });

    it("should transpose parameters in url", () => {
        let endpoint: string = "engineer/{id}";
        let params: { [id: string]: any } = { id: 3 };
        let endpointWithParams: string = UrlParamService.getParamEndpoint(endpoint, params);
        expect(endpointWithParams).toEqual("engineer/3");
    });

    it("should not transpose parameters in url if not passed through", () => {
        let endpoint: string = "engineer/{id}/{clientId}";
        let params: { [id: string]: any } = { id: 3 };
        let endpointWithParams: string = UrlParamService.getParamEndpoint(endpoint, params);
        expect(endpointWithParams).toEqual("engineer/3/{clientId}");
    });

    it("should throw an exception if parameter is not in url", () => {
        let endpoint: string = "engineer/{id}";
        let params: { [id: string]: any } = { clientId: 3 };
        try {
            UrlParamService.getParamEndpoint(endpoint, params);
            fail();
        } catch (exception) {
            expect(exception).toBeDefined();
        }
    });

    it("should add a param prefixed with `?` to the url", () => {
        let endpoint: string = "engineer/{id}";
        let params: { [id: string]: any } = { id: 3, "?env": "blue"};
        let endpointWithParams: string = UrlParamService.getParamEndpoint(endpoint, params);
        expect(endpointWithParams).toEqual("engineer/3?env=blue");
    });

    it("should add multiple params prefixed with `?` to the url", () => {
        let endpoint: string = "engineer/{id}";
        let params: { [id: string]: any } = { id: 3, "?env": "blue", "?mode": "debug" };
        let endpointWithParams: string = UrlParamService.getParamEndpoint(endpoint, params);
        expect(endpointWithParams).toEqual("engineer/3?env=blue&mode=debug");
    })

});
