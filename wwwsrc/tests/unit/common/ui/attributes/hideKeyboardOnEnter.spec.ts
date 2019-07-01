/// <reference path="../../../../../typings/app.d.ts" />

import {HideKeyboardOnEnter} from "../../../../../app/common/ui/attributes/hideKeyboardOnEnter";
import {PlatformHelper} from "../../../../../app/common/core/platformHelper";

describe("the HideKeyboardOnEnter module WUA", () => {
    let hideKeyboard: HideKeyboardOnEnter;
    let inputElement: HTMLInputElement;
    let keyDownEvent: (event: KeyboardEvent) => void;

    beforeEach(() => {
            window.Windows = {};
            window.Windows.UI = {};
            window.Windows.UI.ViewManagement = {};
            window.Windows.UI.ViewManagement.InputPane = {};
            window.Windows.UI.ViewManagement.InputPane.getForCurrentView = () => {return window.Windows.UI.ViewManagement.InputPane;};
            window.Windows.UI.ViewManagement.InputPane.tryHide = () => {return true;};
            
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
        hideKeyboard = new HideKeyboardOnEnter(inputElement);
    });
    it("can be created", () => {
        expect(hideKeyboard).toBeDefined();
    });

    it("can be attached", () => {
        hideKeyboard.attached();
        expect(keyDownEvent).toBeDefined();
    });

    it("can be detached", () => {
        hideKeyboard.detached();
        expect(keyDownEvent).toBeUndefined();
    });

    it("can send a enter keydown", () => {
        hideKeyboard.attached();
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
      it("can send other keydown", () => {
        hideKeyboard.attached();
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

describe("the HideKeyboardOnEnter module web", () => {
    let hideKeyboard: HideKeyboardOnEnter;
    let inputElement: HTMLInputElement;
    let keyDownEvent: (event: KeyboardEvent) => void;

    beforeEach(() => {           
        PlatformHelper.navigatorAppVersion = "web";
        PlatformHelper.resetPlatform();
        inputElement = <HTMLInputElement>{};
        inputElement.blur = () => {};
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
        hideKeyboard = new HideKeyboardOnEnter(inputElement);
    });

    it("can send a enter keydown", () => {
        hideKeyboard.attached();
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
