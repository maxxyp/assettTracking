/// <reference path="../../../../../typings/app.d.ts" />
///<reference path="../../../../../app/common/core/threading.ts"/>

import {HelpTip} from "../../../../../app/common/ui/elements/helpTip";

describe("the HelpTip module", () => {
    let helpTip: HelpTip;
    let element: HTMLElement;

    beforeEach(() => {
    });

    it("can be created", () => {
        helpTip = new HelpTip(element);
        expect(helpTip).toBeDefined();
    });

    it("can be shown", () => {
        helpTip = new HelpTip(element);
        helpTip.showPopup(null);
        expect(helpTip.showStyle === "visible").toBeTruthy();
    });

    it("can be shown only once", () => {
        helpTip = new HelpTip(element);
        helpTip.showPopup(null);
        helpTip.showPopup(null);
        expect(helpTip.showStyle === "visible").toBeTruthy();
    });

    it("can be hidden", () => {
        helpTip = new HelpTip(element);
        helpTip.showPopup(null);
        helpTip.hidePopup(null);
        expect(helpTip.showStyle === "").toBeTruthy();
    });

    it("can be hidden only once", () => {
        helpTip = new HelpTip(element);
        helpTip.showPopup(null);
        helpTip.hidePopup(null);
        helpTip.hidePopup(null);
        expect(helpTip.showStyle === "").toBeTruthy();
    });

    it("is hidden after detach", () => {
        helpTip = new HelpTip(element);
        helpTip.showPopup(null);
        helpTip.detached();
        expect(helpTip.showStyle === "").toBeTruthy();
    });
});
