/// <reference path="../../../../../../typings/app.d.ts" />

import {ConfigurationService} from "../../../../../../app/common/core/services/wua/configurationService";

describe("the ConfigurationService module", () => {
    let configurationService: ConfigurationService;
    let sandbox: Sinon.SinonSandbox;

    let getFileAsyncSpy: Sinon.SinonSpy;
    let readBufferAsyncSpy: Sinon.SinonSpy;

    let fakeStorageFile: any;
    let fakeStorageFileError: any;
    let fakeBufferError: any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        window.Windows = {
            ApplicationModel: {
                Package: {
                    current: {
                        installedLocation: {
                            getFileAsync: (configFile: string): any => {
                                return {
                                    then: (
                                        callback: (file: any) => void,
                                        errorCallback: (error: any
                                    ) => void): void => {
                                        if (fakeStorageFileError) {
                                            return errorCallback(fakeStorageFileError);
                                        }
                                        callback(fakeStorageFile);
                                    }
                                };
                            }
                        }
                    }
                }
            },
            Storage: {
                Streams: {
                  DataReader: {
                      fromBuffer: (buffer: any) => {
                          return {
                              readString: (length: number) => {
                                  return fakeStorageFile;
                              }
                          }
                      }

                  }
                },
                FileIO: {
                    readBufferAsync: (file: any): any => {
                        return {
                            then: (
                                callback: (file: any) => void,
                                errorCallback: (error: any) => void
                            ): void => {
                                if (fakeBufferError) {
                                    return errorCallback(fakeBufferError);
                                }
                                callback(fakeStorageFile);
                            }
                        };
                    }
                },
                ApplicationData: {
                    current: {
                        localFolder: {
                            getFileAsync: (configFile: string): any => {
                                return {
                                    then: (
                                        callback: (file: any) => void,
                                        errorCallback: (error: any
                                        ) => void): void => {
                                        errorCallback("no override file");
                                    }
                                };
                            }
                        }
                    }
                }
            }
         };

        getFileAsyncSpy = sandbox.spy(window.Windows.ApplicationModel.Package.current.installedLocation, "getFileAsync");
        readBufferAsyncSpy = sandbox.spy(window.Windows.Storage.FileIO, "readBufferAsync");
        configurationService = new ConfigurationService();
    });

    afterEach(() => {
        sandbox.restore();

        fakeStorageFile = null;
        fakeStorageFileError = null;
        fakeBufferError = null;

        delete window.Windows;
    });

    it("can be created", () => {
        expect(configurationService).toBeDefined();
    });

    it("getConfiguration before load should return null", () => {
        expect(configurationService.getConfiguration()).toBeNull();
    });

    it("should load correct storage file", (done) => {
        fakeStorageFile = JSON.stringify({
            setting: 1
        });

        configurationService.load().then(() => {
            expect(getFileAsyncSpy.calledWith("www\\app.config.json")).toEqual(true);
            done();
        });
    });

    it("should return null configuration when getFileAsync errors", (done) => {
        fakeStorageFileError = "Error Object";

        configurationService.load().then((configuration) => {
            expect(configuration).toBeNull();
            done();
        });
    });

    it("should read storage file", (done) => {
        fakeStorageFile = JSON.stringify({
            setting: 1
        });

        configurationService.load().then(() => {
            expect(readBufferAsyncSpy.calledWith(fakeStorageFile)).toEqual(true);
            done();
        });
    });

    it("should return null configuration when readBufferAsync errors", (done) => {
        fakeBufferError = "Error Object";

        configurationService.load().then((configuration) => {
            expect(configuration).toBeNull();
            done();
        });
    });

    it("should return configuration when json is valid", (done) => {
        fakeStorageFile = JSON.stringify({
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
        fakeStorageFile = "can't json parse this...";

        configurationService.load().then((configuration) => {
            expect(configuration).toBeNull();
            done();
        });
    });

    it("should only get configuration once", (done) => {
        fakeStorageFile = JSON.stringify({
            setting: 1
        });

        configurationService.load()
            .then(() => {
                expect(getFileAsyncSpy.calledOnce).toEqual(true);
                configurationService.load()
                    .then(() => {
                        expect(getFileAsyncSpy.calledOnce).toEqual(true);
                        done();
                    });
            });
    });

    it("should override values", async done => {
        fakeStorageFile = JSON.stringify({
            existingVal: "bar"
        });
        await configurationService.load();
        configurationService.overrideSettings({existingVal: "baz", newVal: 2});
        expect(configurationService.getConfiguration("existingVal")).toBe("baz");
        expect(configurationService.getConfiguration("newVal")).toBe(2);
        done();
    });
});

