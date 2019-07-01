import {Threading} from "../core/threading";
export class DomHelper {
    private static _scrollInterval: number = -1;
    private static _scrollPos: number;
    private static _win: Window;

    public static setWindowTarget(win: Window): void {
        DomHelper._win = win;
    }

    public static scrollToTop(): void {
        DomHelper.scrollToElement(document.getElementsByTagName("body")[0], 10);
    }

    public static jumpToTop(): void {
        DomHelper.scrollToElement(document.getElementsByTagName("body")[0], -1);
    }

    public static scrollToElement(scrollTarget: HTMLElement, stepRate?: number, adjustment?: number): void {
        /* When a menu entry is navigated make sure the page is reset to be at the top */
        if (!DomHelper._win) {
            DomHelper._win = window;
        }
        if (stepRate === -1) {
            Threading.nextCycle(() => {
                if (!adjustment) {
                    adjustment = 0;
                }
                DomHelper._win.scrollTo(0, scrollTarget.offsetTop + adjustment);
            });
        } else {
            if (DomHelper._scrollInterval === -1) {
                DomHelper._scrollPos = DomHelper._win.scrollY;

                if (DomHelper._scrollPos > scrollTarget.offsetTop) {
                    DomHelper._scrollInterval = Threading.startTimer(() => {
                        if (DomHelper._scrollPos > scrollTarget.offsetTop) {
                            DomHelper._scrollPos -= stepRate;
                            DomHelper._win.scrollTo(0, DomHelper._scrollPos);
                        } else {
                            Threading.stopTimer(DomHelper._scrollInterval);
                            DomHelper._scrollInterval = -1;
                        }
                    }, 1);
                } else {
                    DomHelper._scrollInterval = Threading.startTimer(() => {
                        if (DomHelper._scrollPos < scrollTarget.offsetTop) {
                            DomHelper._scrollPos += stepRate;
                            DomHelper._win.scrollTo(0, DomHelper._scrollPos);
                        } else {
                            Threading.stopTimer(DomHelper._scrollInterval);
                            DomHelper._scrollInterval = -1;
                        }
                    }, 1);
                }
            }
        }
    }

    public static closest(element: Element, selector: string): Element {
        while (element && element.nodeType === 1) {
            if (element.matches(selector)) {
                return element;
            }

            element = <Element>(element.parentNode);
        }

        return null;
    }

    public static closestTag(element: Element, tagName: string): Element {
        while (element && element.nodeType === 1) {
            if (element.parentNode) {
                for (let i = 0; i < element.parentNode.childNodes.length; i++) {
                    let elem = <Element>element.parentNode.childNodes[i];
                    if (elem.nodeType === 1 && elem.tagName.toLowerCase() === tagName) {
                        return elem;
                    }
                }
            }

            element = <Element>(element.parentNode);
        }

        return null;
    }

    public static getAureliaComponentFromElement<T>(element: any, componentName: string): T {
        if (element && element.au && element.au[componentName]) {
            return <T>element.au[componentName].viewModel;
        } else {
            return undefined;
        }
    }

    // aurelia converters mean that | and & may be present in the binding expression, the property name is always the first segment though
    public static getModelPropertyNameFromBindingPath(path: string): string {
          return path && path.split(/\||\&/)[0].trim();
    }
}
