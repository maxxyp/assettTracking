/// <reference path="../../../../../../typings/app.d.ts" />

import {AssetService} from "../../../../../../app/common/core/services/ios/assetService";
import {ArrayBufferUtils} from "../../../../unitHelpers/arrayBufferHelpers.spec";

describe("the AssetService module", () => {
    let assetService: AssetService;
    let sandbox: Sinon.SinonSandbox;
    let resolveLocalFileSystemURISpy: Sinon.SinonSpy;

    let fakeResolveLocalFileError: any;
    let fakeFileEntryError: any;
    let fakeConfigOnDisk: any;


    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        window.cordova = <Cordova> {};
        window.cordova.file = <any> {};
        window.cordova.file.applicationDirectory = "";

        window.resolveLocalFileSystemURL = (
            configFile: any,
            callback: (entry: Entry) => void,
            errorCallback: (err: FileError) => void
        ) => {
            if (!!fakeResolveLocalFileError) {
                return errorCallback(fakeResolveLocalFileError);
            }
            callback(<any> {
                file: (
                    fileCallback: (file: File) => void,
                    fileEntryErrorCallback: (error: FileError) => void): void => {
                    if (!!fakeFileEntryError) {
                        return fileEntryErrorCallback(fakeFileEntryError);
                    }
                    fileCallback(<File> new Blob([fakeConfigOnDisk]));
                }
            });
        };

        resolveLocalFileSystemURISpy = sandbox.spy(window, "resolveLocalFileSystemURL");
        assetService = new AssetService();
    });

    afterEach(() => {
        sandbox.restore();
        
        fakeConfigOnDisk = null;
        fakeResolveLocalFileError = null;
        fakeFileEntryError = null;
        
        delete window.cordova;
        delete window.resolveLocalFileSystemURL;
    });

    it("can be created", () => {
        expect(assetService).toBeDefined();
    });
    
    it("should loadText from correct location", (done) => {
        fakeConfigOnDisk = "test data";

        assetService.loadText("testAssetName").then(() => {
            expect(resolveLocalFileSystemURISpy.calledWith("www/assets/testAssetName")).toEqual(true);
            done();
        });
    });
    
     it("loadText should return null asset when resolve local fails", (done) => {
        fakeResolveLocalFileError = "Error Object";

        assetService.loadText("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
     it("loadText should return null asset when file entry fails", (done) => {
        fakeFileEntryError = "Error Object";

         assetService.loadText("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
    it("loadText should return asset", (done) => {
        fakeConfigOnDisk = "test data";

        assetService.loadText("testAssetName").then((asset) => {
            expect(asset).toEqual("test data");
            done();
        });
    });
    
    it("should loadArrayBuffer from correct location", (done) => {
        fakeConfigOnDisk = "test data";

        assetService.loadArrayBuffer("testAssetName").then(() => {
            resolveLocalFileSystemURISpy.calledWith(["www/assets/testAssetName"]);
            done();
        });
    });
    
     it("loadArrayBuffer should return null asset when resolve local fails", (done) => {
        fakeResolveLocalFileError = "Error Object";

        assetService.loadArrayBuffer("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
     it("loadArrayBuffer should return null asset when file entry fails", (done) => {
        fakeFileEntryError = "Error Object";

         assetService.loadArrayBuffer("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
     it("loadArrayBuffer should return asset", (done) => {
        fakeConfigOnDisk = ArrayBufferUtils.stringToArrayBuffer("test data");

        assetService.loadArrayBuffer("testAssetName").then((asset) => {
            expect(ArrayBufferUtils.arrayBufferToString(asset)).toEqual("test data");
            done();
        });
    });
    
    it("should loadJson from correct location", (done) => {
        fakeConfigOnDisk = JSON.stringify({
            setting: 1
        });

        assetService.loadJson("testAssetName").then(() => {
            resolveLocalFileSystemURISpy.calledWith("www/assets/testAssetName");
            done();
        });
    });
    
     it("loadJson should return null asset when resolve local fails", (done) => {
        fakeResolveLocalFileError = "Error Object";

        assetService.loadJson("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
     it("loadJson should return null asset when file entry fails", (done) => {
        fakeFileEntryError = "Error Object";

         assetService.loadJson("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
    it("loadJson should return asset when json is valid", (done) => {
        fakeConfigOnDisk = JSON.stringify({
            setting: 1
        });

        assetService.loadJson("testAssetName").then((asset) => {
            expect(asset).toEqual({
                setting: 1
            });
            done();
        });
    });
    
     it("should return null asset when json is invalid", (done) => {
        fakeConfigOnDisk = "can't json parse this...";

        assetService.loadJson("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
});
