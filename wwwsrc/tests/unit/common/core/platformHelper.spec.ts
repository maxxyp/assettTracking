/// <reference path="../../../../typings/app.d.ts" />

import {PlatformHelper} from "../../../../app/common/core/platformHelper";

describe("the PlatformHelper module", () => {
    let platformHelper: PlatformHelper;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        platformHelper = new PlatformHelper();
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(platformHelper).toBeDefined();
    });

    it("platform to be web", () => {
        expect(PlatformHelper.getPlatform()).toEqual("web");
    });

    it("platform to be wua", () => {
        PlatformHelper.navigatorAppVersion = "MSAppHost";
        PlatformHelper.resetPlatform();
        expect(PlatformHelper.getPlatform()).toEqual("wua");
        PlatformHelper.navigatorAppVersion = navigator.appVersion;
        PlatformHelper.resetPlatform();
    });

    it("platform to be ios as iPad", () => {
        PlatformHelper.navigatorPlatform = "iPad";
        PlatformHelper.resetPlatform();
        expect(PlatformHelper.getPlatform()).toEqual("ios");
        PlatformHelper.navigatorPlatform = navigator.platform;
        PlatformHelper.resetPlatform();
    });

    it("platform to be ios as iPod", () => {
        PlatformHelper.navigatorPlatform = "iPod";
        PlatformHelper.resetPlatform();
        expect(PlatformHelper.getPlatform()).toEqual("ios");
        PlatformHelper.navigatorPlatform = navigator.platform;
        PlatformHelper.resetPlatform();
    });

    it("platform to be ios as iPhone", () => {
        PlatformHelper.navigatorPlatform = "iPhone";
        PlatformHelper.resetPlatform();
        expect(PlatformHelper.getPlatform()).toEqual("ios");
        PlatformHelper.navigatorPlatform = navigator.platform;
        PlatformHelper.resetPlatform();
    });

    it("isCordova to be false", () => {
        expect(PlatformHelper.isCordova() === false).toBeTruthy();
    });

    it("isCordova to be true", () => {
        window.cordova = <Cordova>{};
        window.cordova.exec = sandbox.stub();
        window.cordova.version = "1.0.0";
        window.cordova.platformId = "windows";
        expect(PlatformHelper.isCordova() === true).toBeTruthy();
        delete window.cordova;
    });

    it("cordovaVersion to be empty", () => {
        window.cordova = null;
        expect(PlatformHelper.cordovaVersion() === "").toBeTruthy();
    });

    it("cordovaVersion to be 1.0.0", () => {
        window.cordova = <Cordova>{};
        window.cordova.exec = sandbox.stub();
        window.cordova.version = "1.0.0";
        window.cordova.platformId = "windows";
        expect(PlatformHelper.cordovaVersion() === "1.0.0").toBeTruthy();
        delete window.cordova;
    });

    it("cordovaPlatformId to be empty", () => {
        window.cordova = null;
        expect(PlatformHelper.cordovaPlatformId() === "").toBeTruthy();
    });

    it("cordovaPlatformId to be windows", () => {
        window.cordova = <Cordova>{};
        window.cordova.exec = sandbox.stub();
        window.cordova.version = "1.0.0";
        window.cordova.platformId = "windows";

        expect(PlatformHelper.cordovaPlatformId() === "windows").toBeTruthy();
        delete window.cordova;
    });

    it("load a module no parameters", (done) => {
        PlatformHelper.resetPlatform();
        PlatformHelper.loadModule("", "")
            .then((module) => {
                fail("module success should not be called");
                done();
            }).catch(() => {
                done();
            });
    });

    it("load a non existent module requirejs", (done) => {
        PlatformHelper.resetPlatform();
        PlatformHelper.loaderPrefix = "base/"
        PlatformHelper.loadModule("tests/unit/common/core/services", "testModuleMissing")
            .then((module) => {
                fail("module success should not be called");
                done();
            }).catch(() => {
                done();
            });
    });

    it("load a module requirejs", (done) => {
        PlatformHelper.resetPlatform();
        PlatformHelper.loadModule("tests/unit/common/core/services", "testModule")
            .then((module) => {
                expect(module !== null).toBeTruthy();
                done();
            }).catch(() => {
                fail("module not loaded");
                done();
            });
    });

    it("load a module systemjs", (done) => {
        let old = window.require;
        let old2 = window.System;
        window.require = null;
        window.System = <System>{};
        window.System.normalize = (folder: string, param: string) => {
            return new Promise<string>((resolve, reject) => resolve(folder));
        };
        window.System.import = (name: string, normalizedName: string): Promise<any> => {
            return new Promise<any>((resolve, reject) => resolve("My Module"));
        };
        PlatformHelper.resetPlatform();
        PlatformHelper.loadModule("tests/unit/common/core/services", "testModule")
            .then((module) => {
                expect(module !== null).toBeTruthy();
                window.require = old;
                window.System = old2;
                done();
            })
            .catch(() => {
                fail("module not loaded");
                window.require = old;
                window.System = old2;
                done();
            });
    });

    it("load a non existent module systemjs", (done) => {
        let old = window.require;
        let old2 = window.System;
        window.require = null;
        window.System = <System>{};
        window.System.normalize = (folder: string, param: string) => {
            return new Promise<string>((resolve, reject) => resolve(folder));
        };
        window.System.import = (name: string, normalizedName: string) => {
            return new Promise<any>((resolve, reject) => reject());
        };
        PlatformHelper.resetPlatform();
        PlatformHelper.loaderPrefix = "base/";
        PlatformHelper.loadModule("tests/unit/common/core/services", "testModuleMissing")
            .then((module) => {
                fail("module success should not be called");
                window.require = old;
                window.System = old2;
                done();
            }).catch(() => {
                window.require = old;
                window.System = old2;
                done();
            });
    });

    it("is requirejs", () => {
        expect(PlatformHelper.isRequreJs()).toBeTruthy();
    });

    it("is not requirejs", () => {
        let old = window.require;
        window.require = null;
        expect(PlatformHelper.isRequreJs()).toBeFalsy();
        window.require = old;
    });

    it("appRoot without requirejs", () => {
        let old = window.require;
        window.require = null;
        expect(PlatformHelper.appRoot()).toEqual("./app/");
        window.require = old;
    });

    it("appRoot with requirejs", () => {
        expect(PlatformHelper.appRoot()).toEqual("./");
    });

    it("is mobile", () => {
        PlatformHelper.navigatorAppVersion = "MSAppHost";
        PlatformHelper.resetPlatform();
        window.Windows = {};
        window.Windows.Foundation = {};
        window.Windows.Foundation.Metadata = {};
        window.Windows.Foundation.Metadata.ApiInformation = {};
        window.Windows.Foundation.Metadata.ApiInformation.isTypePresent =
            sandbox.stub().returns("Windows.Phone.UI.Input.HardwareButtons");
        expect(PlatformHelper.isMobile()).toBeTruthy();
        PlatformHelper.navigatorAppVersion = navigator.appVersion;
        PlatformHelper.resetPlatform();
    });

});
