/// <reference path="../../../../../typings/app.d.ts" />

import {NumericOnly} from "../../../../../app/common/ui/attributes/numericOnly";

describe("the NumericOnly module", () => {
    let numericOnly: NumericOnly;
    let inputElement: HTMLInputElement;
    let keyDownEvent: (event: KeyboardEvent) => void;
    let pasteEvent: (event: ClipboardEvent) => void;

    beforeEach(() => {
        inputElement = <HTMLInputElement>{};
        inputElement.getAttribute = (attribName): any => { return null; };
        inputElement.value = "";
        inputElement.addEventListener = (eventName: string, cb: (ev: any) => void) => {
            if (eventName === "keydown") {
                keyDownEvent = cb;
            } else if (eventName === "paste") {
                pasteEvent = cb;
            }
        };
        inputElement.removeEventListener = (eventName: string, cb: (ev: any) => void) => {
            if (eventName === "keydown") {
                keyDownEvent = undefined;
            } else if (eventName === "paste") {
                pasteEvent = undefined;
            }
        };
        numericOnly = new NumericOnly(inputElement);
    });

    it("can be created", () => {
        expect(numericOnly).toBeDefined();
    });

    it("can be attached", () => {
        numericOnly.attached();
        expect(keyDownEvent).toBeDefined();
        expect(pasteEvent).toBeDefined();
    });

    it("can be detached", () => {
        numericOnly.detached();
        expect(keyDownEvent).toBeUndefined();
        expect(pasteEvent).toBeUndefined();
    });

    it("can be send a numeric keydown", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 48;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can send a dot keydown", () => {
        numericOnly.allowFloat = true;
        inputElement.value = "33";
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 110;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can not send a second dot keydown", () => {
        inputElement.value = "33.";
        numericOnly.allowFloat = true;
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 110;
        keyDownEvent(event);
        expect(prevented).toBeTruthy();
    });

    it("can be send a copy", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 67;
        event.ctrlKey = true;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can be send a cut", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 88;
        event.ctrlKey = true;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can be send a paste", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 86;
        event.ctrlKey = true;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can be send a select all", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 65;
        event.ctrlKey = true;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can be send a shift insert paste", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 45;
        event.shiftKey = true;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can prevent a non numeric keydown", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 40;
        keyDownEvent(event);
        expect(prevented).toBeTruthy();
    });

    it("can be send a clipboard event", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.clipboardData = <DataTransfer>{};
        event.clipboardData.getData = (type: any) : string => { return "1"; };
        pasteEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can fail a clipboard event", () => {
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.clipboardData = <DataTransfer>{};
        event.clipboardData.getData = (type: any) : string => { return "a"; };
        pasteEvent(event);
        expect(prevented).toBeTruthy();
    });

    it("can be send a clipboard event with float", () => {
        numericOnly.allowFloat = true;
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.clipboardData = <DataTransfer>{};
        event.clipboardData.getData = (type: any) : string => { return "1.5"; };
        pasteEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can not exceed a max length", () => {
        numericOnly.maxLength = 10;
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 48;
        keyDownEvent(event);
        expect(prevented).toBeFalsy();
    });

    it("can exceed a max length", () => {
        inputElement.value = "12";
        numericOnly.maxLength = 2;
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.which = 48;
        keyDownEvent(event);
        expect(prevented).toBeTruthy();
    });

    it("can exceed a max length with selection set from clipboard", () => {
        inputElement.value = "12345";
        inputElement.selectionStart = 1;
        inputElement.selectionEnd = 3;
        numericOnly.maxLength = 2;
        numericOnly.attached();
        let prevented: boolean = false;
        let event: any = {};
        event.preventDefault = () => {
            prevented = true;
        };
        event.clipboardData = <DataTransfer>{};
        event.clipboardData.getData = (type: any) : string => { return "12345"; };
        pasteEvent(event);
        expect(prevented).toBeTruthy();
    });

});
