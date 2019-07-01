/// <reference path="../../../../../typings/app.d.ts" />

import {AssetService} from "../../../../../app/common/core/services/assetService";
import {IAssetService} from "../../../../../app/common/core/services/IAssetService";

describe("the AssetService module", () => {
    let assetService: AssetService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        assetService = new AssetService();
        expect(assetService).toBeDefined();
    });

    it("can load text", (done) => {
        let stub: IAssetService = <IAssetService>{};
        stub.loadText = sandbox.stub().returns(Promise.resolve("hello"));

        assetService.loadModule = sandbox.stub().returns(Promise.resolve(stub));

        assetService.loadText("blah").then((val) => {
            expect(val).toEqual("hello");
            done();
        });
    });

    it("can load json", (done) => {
        let stub: IAssetService = <IAssetService>{};
        stub.loadJson = sandbox.stub().returns(Promise.resolve(true));

        assetService.loadModule = sandbox.stub().returns(Promise.resolve(stub));

        assetService.loadJson<boolean>("blah").then((val) => {
            expect(val).toBeTruthy();
            done();
        });
    });

    it("can load array buffer", (done) => {
        let stub: IAssetService = <IAssetService>{};
        stub.loadArrayBuffer = sandbox.stub().returns(Promise.resolve(new ArrayBuffer(5)));

        assetService.loadModule = sandbox.stub().returns(Promise.resolve(stub));

        assetService.loadArrayBuffer("blah").then((val) => {
            expect(val.byteLength).toEqual(5);
            done();
        });
    });
});
