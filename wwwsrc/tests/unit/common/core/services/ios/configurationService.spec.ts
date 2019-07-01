/// <reference path="../../../../../../typings/app.d.ts" />

import { ConfigurationService } from "../../../../../../app/common/core/services/ios/configurationService";

describe("the ConfigurationService module", () => {
    let configurationService: ConfigurationService;
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
        configurationService = new ConfigurationService();
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
        expect(configurationService).toBeDefined();
    });

    it("getConfiguration before load should return null", () => {
        expect(configurationService.getConfiguration()).toBeNull();
    });

    it("should load correct configFile", (done) => {
        fakeConfigOnDisk = JSON.stringify({
            setting: 1
        });

        configurationService.load().then(() => {
            expect(resolveLocalFileSystemURISpy.calledWith("www/app.config.json")).toEqual(true);
            done();
        });
    });

    it("should return configuration when json is valid", (done) => {
        fakeConfigOnDisk = JSON.stringify({
            setting: 1
        });

        configurationService.load().then((configuration) => {
            expect(configuration).toEqual({
                setting: 1
            });
            done();
        });
    });

    it("should return null configuration when json is invalid", (done) => {
        fakeConfigOnDisk = "can't json parse this...";

        configurationService.load().then((configuration) => {
            expect(configuration).toBeNull();
            done();
        });
    });

    it("should return null configuration when resolve local fails", (done) => {
        fakeConfigOnDisk = "can't json parse this...";
        fakeResolveLocalFileError = "Error Object";

        configurationService.load().then((configuration) => {
            expect(configuration).toBeNull();
            done();
        });
    });
    
    it("should return null configuration when file entry fails", (done) => {
        fakeConfigOnDisk = "can't json parse this...";
        fakeFileEntryError = "Error Object";

        configurationService.load().then((configuration) => {
            expect(configuration).toBeNull();
            done();
        });
    });

    it("should only get configuration once", (done) => {
        fakeConfigOnDisk = JSON.stringify({
            setting: 1
        });
        
        configurationService.load()
            .then(() => {
                expect(resolveLocalFileSystemURISpy.calledOnce).toEqual(true);
                configurationService.load()
                    .then(() => {
                        expect(resolveLocalFileSystemURISpy.calledOnce).toEqual(true);
                        done();
                    });
            });
    });
});
