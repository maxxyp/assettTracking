/// <reference path="../../../../../typings/app.d.ts" />

import {AppLauncher} from "../../../../../app/common/core/services/appLauncher";
import { IPlatformAppLauncher } from "../../../../../app/common/core/services/IPlatformAppLauncher";

describe("the AppLauncher module", () => {
    let appLauncher: AppLauncher;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        appLauncher = new AppLauncher();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(appLauncher).toBeDefined();
    });

    it("checkInstalled should delegate to platform specific module", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            checkApplicationInstalled: (uri: string) => {
                expect(uri).toEqual("hema://");
                done();
            }
        });
        
        appLauncher.checkInstalled("hema://");
    });

    it("launchApplication should delegate to platform specific module", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            launchApplication: (uri: string) => {
                expect(uri).toEqual("hema://");
                done();
            }
        });
        
        appLauncher.launchApplication("hema://");
    });

    it("launch should format uri with inline parameters", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            launchApplication: (uri: string) => {
                expect(uri).toEqual("customerInfo://premises/abc");
                done();
            }
        });
        
        appLauncher.launch("customerInfo://premises/{premisesId}", {
            premisesId: "abc"
        });
    });

    it("launch should append parameters starting with ? as query params", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            launchApplication: (uri: string) => {
                expect(uri).toEqual("customerInfo://premises/abc?extraData=123");
                done();
            }
        });
        
        appLauncher.launch("customerInfo://premises/{premisesId}", {
            premisesId: "abc",
            "?extraData": "123"
        });
    });

    it("launch should append returnUri when present in options", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            getUriScheme: () => {
                return Promise.resolve("hema");
            },
            launchApplication: (uri: string) => {
                expect(uri).toEqual("customerInfo://premises/abc?extraData=123&returnappuri=hema");
                done();
            }
        });
        
        appLauncher.launch("customerInfo://premises/{premisesId}", {
            premisesId: "abc",
            "?extraData": "123"
        }, {
            returnUri: true
        });
    });

    it("launch should append returnAppText when present in options", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            getUriScheme: () => {
                return Promise.resolve("hema");
            },
            launchApplication: (uri: string) => {
                expect(uri).toEqual("customerInfo://premises/abc?extraData=123&returnappuri=hema&returnapptext=return%20to%20hema");
                done();
            }
        });
        
        appLauncher.launch("customerInfo://premises/{premisesId}", {
            premisesId: "abc",
            "?extraData": "123"
        }, {
            returnUri: true,
            returnUriText: "return to hema"
        });
    });

    it("launch should append fullscreen true when present in options", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            launchApplication: (uri: string) => {
                expect(uri).toEqual("customerInfo://premises/abc?fullscreen=true");
                done();
            }
        });
        
        appLauncher.launch("customerInfo://premises/{premisesId}", {
            premisesId: "abc",
        }, {
           fullScreen: true
        });
    });

    it("launch should filter out any falsey params", (done) => {
        appLauncher.loadModule = () => Promise.resolve(<IPlatformAppLauncher>{
            launchApplication: (uri: string) => {
                expect(uri).toEqual("customerInfo://premises/abc");
                done();
            }
        });
        
        appLauncher.launch("customerInfo://premises/{premisesId}", {
            premisesId: "abc",
            "?name": undefined,
            "?fullname": null,
            "?surname": ""
        });
    });






});
