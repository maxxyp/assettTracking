/// <reference path="../../../../../../typings/app.d.ts" />

import {AssetService} from "../../../../../../app/common/core/services/web/assetService";
import {IHttpClient} from "../../../../../../app/common/core/IHttpClient";
import {IResponse} from "../../../../../../app/common/core/IResponse";

describe("the AssetService module", () => {
    let httpClientStub: IHttpClient = <IHttpClient>{};
    let assetService: AssetService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        assetService = new AssetService(httpClientStub);
        expect(assetService).toBeDefined();
    });

    it("can load text", (done) => {
        httpClientStub.fetch = sandbox.stub().returns(new Promise<IResponse>((resolve, reject) => {
            let body: string;
            body = "abcdefg";
            let respo: Response = new Response(body);
            resolve(respo);
        }));

        assetService = new AssetService(httpClientStub);
        assetService.loadText("myassset.txt").then((txt) => {
            expect(txt === "abcdefg").toBeTruthy();
            done();
        });
    });

    it("can fail load text", (done) => {
        httpClientStub.fetch = sandbox.stub().returns(new Promise<IResponse>((resolve, reject) => {
            reject();
        }));

        assetService = new AssetService(httpClientStub);
        assetService.loadText("myassset.txt").then((txt) => {
            expect(txt === null).toBeTruthy();
            done();
        });
    });

    it("can load json", (done) => {
        httpClientStub.fetch = sandbox.stub().returns(new Promise<IResponse>((resolve, reject) => {
            let body: string;
            body = JSON.stringify( {testValue: "123" });
            let respo: Response = new Response(body);
            resolve(respo);
        }));

        assetService = new AssetService(httpClientStub);
        assetService.loadJson<{testValue: string}>("myassset.json").then((val) => {
            expect(val.testValue === "123").toBeTruthy();
            done();
        });
    });

    it("can fail load json", (done) => {
        httpClientStub.fetch = sandbox.stub().returns(new Promise<IResponse>((resolve, reject) => {
            reject();
        }));
        assetService = new AssetService(httpClientStub);
        assetService.loadJson<{testValue: string}>("myassset.json").then((val) => {
            expect(val === null).toBeTruthy();
            done();
        });
    });

    it("can load array buffer", (done) => {
        httpClientStub.fetch = sandbox.stub().returns(new Promise<IResponse>((resolve, reject) => {
            let body: string;
            body = "0000000000";
            let respo: Response = new Response(body);
            resolve(respo);
        }));

        assetService = new AssetService(httpClientStub);
        assetService.loadArrayBuffer("myassset.bin").then((bin) => {
            expect(bin.byteLength === 10).toBeTruthy();
            done();
        });
    });

    it("can fail load array buffer", (done) => {
        httpClientStub.fetch = sandbox.stub().returns(new Promise<IResponse>((resolve, reject) => {
            reject();
        }));

        assetService = new AssetService(httpClientStub);
        assetService.loadArrayBuffer("myassset.bin").then((bin) => {
            expect(bin === null).toBeTruthy();
            done();
        });
    });
});
