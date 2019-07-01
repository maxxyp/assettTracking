/// <reference path="../../../../../../typings/app.d.ts" />

import {AssetService} from "../../../../../../app/common/core/services/wua/assetService";
import {ArrayBufferUtils} from "../../../../unitHelpers/arrayBufferHelpers.spec";

describe("the AssetService module", () => {
    let assetService: AssetService;
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
                                }
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
                              readBytes: (bytes: number[]): void => {
                                  // create byte array from test data
                                  for (let i = 0; i < buffer.length; ++i) {
                                     bytes[i] = buffer.charCodeAt(i);
                                  }
                              },
                              readString: (length: number): void => {
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
                }
            }
         };
         
        getFileAsyncSpy = sandbox.spy(window.Windows.ApplicationModel.Package.current.installedLocation, "getFileAsync");
        readBufferAsyncSpy = sandbox.spy(window.Windows.Storage.FileIO, "readBufferAsync");
        assetService = new AssetService();
    });

    afterEach(() => {
        sandbox.restore();
        
        fakeStorageFile = null;
        fakeStorageFileError = null;
        fakeBufferError = null;
        
        delete window.Windows;
    });
    
    it("should loadText from correct storage file", (done) => {
        fakeStorageFile = "test data";

        assetService.loadText("testAssetName").then(() => {
            expect(getFileAsyncSpy.calledWith("www\\assets\\testAssetName")).toEqual(true);
            done();
        });
    });
    
    it("loadText should return null asset when getFileAsync errors", (done) => {
        fakeStorageFileError = "Error Object";

         assetService.loadText("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
    xit("loadText should read storage file", (done) => {
        fakeStorageFile = JSON.stringify({
            setting: 1
        });

         assetService.loadText("testAssetName").then(() => {
            expect(readBufferAsyncSpy.calledWith(fakeStorageFile)).toEqual(true);
            done();
        });
    });
    
    it("loadText should return null asset when readBufferAsync errors", (done) => {
        fakeBufferError = "Error Object";

         assetService.loadText("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });

    xit("should loadArrayBuffer from correct storage file", (done) => {
        fakeStorageFile = [];

        assetService.loadArrayBuffer("testAssetName").then(() => {
             expect(getFileAsyncSpy.calledWith("www\\assets\\testAssetName")).toEqual(true);
            done();
        });
    });
    
      it("loadText should return null asset when readBufferAsync errors", (done) => {
         fakeBufferError = "Error Object";

         assetService.loadArrayBuffer("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
     it("loadArrayBuffer should return null asset when getFileAsync errors", (done) => {
        fakeStorageFileError = "Error Object";

        assetService.loadArrayBuffer("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
     it("loadArrayBuffer should read storage file", (done) => {
        fakeStorageFile = "test data";

        assetService.loadArrayBuffer("testAssetName").then((asset) => {
            expect(ArrayBufferUtils.arrayBufferUint8ToString(asset)).toEqual("test data");
            done();
        });
    });
    
     it("loadArrayBuffer should return asset", (done) => {
        fakeStorageFile = "test data";

        assetService.loadArrayBuffer("testAssetName").then((asset) => {
            expect(ArrayBufferUtils.arrayBufferUint8ToString(asset)).toEqual("test data");
            done();
        });
    });
    
     xit("should loadJson from correct storage file", (done) => {
        fakeStorageFile = JSON.stringify({
            setting: 1
        });

        assetService.loadJson("testAssetName").then(() => {
            expect(getFileAsyncSpy.calledWith("www\\assets\\testAssetName")).toEqual(true);
            done();
        });
    });
    
     it("loadJson should return null asset when readBufferAsync errors", (done) => {
        fakeBufferError = "Error Object";

         assetService.loadJson("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });

     it("loadJson should return null asset when getFileAsync errors", (done) => {
        fakeStorageFileError = "Error Object";

        assetService.loadJson("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
    
    it("loadJson should return asset when json is valid", (done) => {
        fakeStorageFile = JSON.stringify({
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
        fakeStorageFile = "can't json parse this...";

        assetService.loadJson("testAssetName").then((asset) => {
            expect(asset).toBeNull();
            done();
        });
    });
});

