/// <reference path="../../../../../typings/app.d.ts" />

import {CancelDefaultSubmit} from "../../../../../app/common/ui/attributes/cancelDefaultSubmit";
import {PlatformHelper} from "../../../../../app/common/core/platformHelper";

describe("the CancelDefaultSubmit module WUA", () => {
    let cancelDefaultSubmit: CancelDefaultSubmit;
    let inputElement: HTMLInputElement;
    let keyDownEvent: (event: KeyboardEvent) => void;

    beforeEach(() => {
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.ViewManagement = {};
        window.Windows.UI.ViewManagement.InputPane = {};
        window.Windows.UI.ViewManagement.InputPane.getForCurrentView = () => { return window.Windows.UI.ViewManagement.InputPane; };

        PlatformHelper.navigatorAppVersion = "MSAppHost";
        PlatformHelper.resetPlatform();
        inputElement = <HTMLInputElement>{};
        inputElement.getAttribute = (attribName): any => { return null; };
        inputElement.value = "";
        inputElement.addEventListener = (eventName: string, cb: (ev: any) => void) => {
            if (eventName === "keydown") {
                keyDownEvent = cb;
            }
        };
        inputElement.removeEventListener = (eventName: string, cb: (ev: any) => void) => {
            if (eventName === "keydown") {
                keyDownEvent = undefined;
            }
        };
        cancelDefaultSubmit = new CancelDefaultSubmit(inputElement);
    });
    it("can be created", () => {
        expect(cancelDefaultSubmit).toBeDefined();
    });

    it("can be attached", () => {
        cancelDefaultSubmit.attached();
        expect(keyDownEvent).toBeDefined();
    });

    it("can be detached", () => {
        cancelDefaultSubmit.detached();
        expect(keyDownEvent).toBeUndefined();
    });

    it("can send a enter keydown", () => {
        cancelDefaultSubmit.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 13;
        event.keyCode = 13;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can send a enter keydown but cancel default submit", () => {
        cancelDefaultSubmit.attached();
        let event: any = {};
        event.which = 13;
        event.keyCode = 13;
        keyDownEvent(event);
        expect(event.returnValue).toBeFalsy();
    });

    it("can send other keydown", () => {
        cancelDefaultSubmit.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 110;
        event.keyCode = 110;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

});

describe("the CancelDefaultSubmit module web", () => {
    let cancelDefaultSubmit: CancelDefaultSubmit;
    let inputElement: HTMLInputElement;
    let keyDownEvent: (event: KeyboardEvent) => void;

    beforeEach(() => {
        PlatformHelper.navigatorAppVersion = "web";
        PlatformHelper.resetPlatform();
        inputElement = <HTMLInputElement>{};
        inputElement.blur = () => { };
        inputElement.getAttribute = (attribName): any => { return null; };
        inputElement.value = "";
        inputElement.addEventListener = (eventName: string, cb: (ev: any) => void) => {
            if (eventName === "keydown") {
                keyDownEvent = cb;
            }
        };
        inputElement.removeEventListener = (eventName: string, cb: (ev: any) => void) => {
            if (eventName === "keydown") {
                keyDownEvent = undefined;
            }
        };
        cancelDefaultSubmit = new CancelDefaultSubmit(inputElement);
    });

    it("can send a enter keydown", () => {
        cancelDefaultSubmit.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 13;
        event.keyCode = 13;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

});
