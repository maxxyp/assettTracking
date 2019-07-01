/// <reference path="../../../../../typings/app.d.ts" />

import {History} from "aurelia-history";
import {DOM} from "aurelia-pal";
import {PLATFORM} from "aurelia-pal";
import {ILinkHandler} from "./ILinkHandler";

export class DefaultLinkHandler implements ILinkHandler {
    private _history: History;
    private _handler: (event: MouseEvent) => void;

    constructor() {
        this._handler = (e) => {
            let eventInfo: {shouldHandleEvent: boolean, href: string, anchor: Element}
                = this.getEventInfo(e);

            if (eventInfo.shouldHandleEvent) {
                e.preventDefault();
                this._history.navigate(eventInfo.href);
            }
        };
    }

    public activate(history: History): void {
        this._history = history;
        DOM.addEventListener("click", this._handler, true);
    }

    public deactivate(): void {
        DOM.removeEventListener("click", this._handler, true);
    }

    private getEventInfo(event: MouseEvent): {shouldHandleEvent: boolean, href: string, anchor: Element} {
        let info: {shouldHandleEvent: boolean, href: string, anchor: Element} = {
            shouldHandleEvent: false,
            href: null,
            anchor: null
        };

        let target = this.findClosestAnchor(<Element>event.target);
        if (target && this.targetIsThisWindow(target)) {
            if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                let href = target.getAttribute("href");
                info.anchor = target;
                info.href = href;

                let leftButtonClicked = event.which === 1;
                let isRelative = href && href.charAt(0) === "#";

                info.shouldHandleEvent = leftButtonClicked && isRelative;
            }
        }
        return info;
    }

    private findClosestAnchor(el: Element): Element {
        while (el) {
            if (el.tagName === "A") {
                break;
            }

            el = <Element>el.parentNode;
        }

        return el;
    }

    private targetIsThisWindow(target: Element): boolean {
        let targetWindow = target.getAttribute("target");
        let win: Window = <Window>PLATFORM.global;

        return !targetWindow ||
            targetWindow === win.name ||
            targetWindow === "_self" ||
            (targetWindow === "top" && win === win.top);
    }
}
