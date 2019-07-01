/// <reference path="../../../../../../typings/app.d.ts" />

import {DefaultLinkHandler} from "../../../../../../app/common/core/plugins/historyWua/defaultLinkHandler";
import {History} from "aurelia-history";
import {DOM} from "aurelia-pal";
import {PLATFORM} from "aurelia-pal";

describe("the DefaultLinkHandler module", () => {
    let defaultLinkHandler: DefaultLinkHandler;
    let sandbox: Sinon.SinonSandbox;
    let clickCallback: (mouseEvent: MouseEvent) => void;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        defaultLinkHandler = new DefaultLinkHandler();
        DOM.addEventListener = (event: string, callback: () => void): void => {
            clickCallback = callback;
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(defaultLinkHandler).toBeDefined();
    });

    it("can activate", () => {
        let history: History = <History>{};
        defaultLinkHandler.activate(history);

        expect(clickCallback).toBeDefined();
    });

    it("can deactivate", () => {
        DOM.removeEventListener = (event: string, callback: () => void): void => {
            clickCallback = callback;
        };
        defaultLinkHandler.deactivate();

        expect(clickCallback).toBeDefined();
    });

    it("can call click handler shouldnt handle event with no target", () => {
        let history: History = <History>{};
        let preventDefault = false;
        defaultLinkHandler.activate(history);

        let mouseEvent: MouseEvent = <MouseEvent>{};
        mouseEvent.preventDefault = () => {
            preventDefault = true;
        };

        clickCallback(mouseEvent);
        expect(preventDefault).toBeFalsy();
    });

    it("can call click handler shouldnt handle event with target but not is this window", () => {
        let history: History = <History>{};
        let preventDefault = false;
        defaultLinkHandler.activate(history);

        let target: Element = <any>{
            getAttribute: sinon.stub().returns(null),
            tagName: "A"
        };
        let mouseEvent: MouseEvent = <MouseEvent><any>{
            target: target,
            preventDefault: () => { preventDefault = true; }
        };

        clickCallback(mouseEvent);
        expect(preventDefault).toBeFalsy();
    });

    it("can call click handler shouldnt handle event with target as child", () => {
        let history: History = <History>{};
        let preventDefault = false;
        defaultLinkHandler.activate(history);

        let target: Element = <any>{
            getAttribute: sinon.stub().returns((<Window>PLATFORM.global).name),
            tagName: "A"
        };
        let targetChild: Element = <any>{
            tagName: "DIV",
            parentNode: target
        };
        let mouseEvent: MouseEvent =<any>{
            target: targetChild,
            preventDefault: () => { preventDefault = true; }
        };

        clickCallback(mouseEvent);
        expect(preventDefault).toBeFalsy();
    });

    it("can call click handler shouldnt handle event with self and key modifiers", () => {
        let history: History = <History>{};
        let preventDefault = false;
        defaultLinkHandler.activate(history);

        let target: Element = <any>{
            tagName: "A",
            getAttribute: sinon.stub().returns("_self")
        };
        let mouseEvent: MouseEvent = <any>{
            altKey: true,
            target: target,
            preventDefault: () => { preventDefault = true; }
        };

        clickCallback(mouseEvent);
        expect(preventDefault).toBeFalsy();
    });

    it("can call click handler shouldnt handle event with top", () => {
        let history: History = <History>{};
        let preventDefault = false;
        defaultLinkHandler.activate(history);

        let target: Element = <any>{
            tagName: "A",
            getAttribute: sinon.stub().returns("top")
        };
        let mouseEvent: MouseEvent = <any>{
            altKey: true,
            target: target,
            preventDefault: () => { preventDefault = true; }
        };

        clickCallback(mouseEvent);
        expect(preventDefault).toBeFalsy();
    });

    it("can call click handler should handle event with relative link", () => {
        let history: History = <History>{};
        history.navigate = sinon.stub();
        let preventDefault = false;
        defaultLinkHandler.activate(history);

        let target: Element = <any>{
            tagName: "A",
            getAttribute: (name: string): string => { return name === "target" ? null : "#blah"; }
        };
        let mouseEvent: MouseEvent = <any>{
            which: 1,
            target: target,
            preventDefault: () => { preventDefault = true; }
        };

        clickCallback(mouseEvent);
        expect(preventDefault).toBeTruthy();
    });
});
