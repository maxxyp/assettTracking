/// <reference path="../../../../../typings/app.d.ts" />
import { customElement, bindable, bindingMode } from "aurelia-framework";
import { inject } from "aurelia-dependency-injection";
import { Threading } from "../../../../common/core/threading";
import { AttributeConstants } from "../../../../common/ui/attributes/constants/attributeConstants";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { AnalyticsConstants } from "../../../../common/analytics/analyticsConstants";

const TOGGLE_FULL_SCREEN_LABEL: string = "Toggle Full Screen";

@customElement("full-screen")
@inject(EventAggregator)
export class FullScreen {
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public topOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public bottomOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public leftOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public rightOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideLeftOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideRightOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideBottomOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideTopOffset: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public transitionTime: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public originalPositions: any;
    private _isFullScreen: boolean;
    private _keyDown: (e: KeyboardEvent) => void;
    private _eventAggregator: EventAggregator;
    private _originator: boolean;
    
    private _subscription: Subscription;

    public constructor(eventAggregator: EventAggregator) {
        this._eventAggregator = eventAggregator;
        this._keyDown = (event: KeyboardEvent) => {
            if (event.keyCode === 90 && (event.ctrlKey)) {
                event.preventDefault();
                this.processContent();
            }
        };
    }

    public attached(): void {
        document.addEventListener("keydown", this._keyDown);
        this._isFullScreen = window.isFullScreen;
        this._subscription = this._eventAggregator.subscribe(AttributeConstants.FULL_SCREEN_TOGGLE, (isFullScreen: boolean) => {
            if (!this._originator) {
                if (isFullScreen) {
                    this.expand(true);
                    window.isFullScreen = true;
                } else {
                    this.contract(true);
                    window.isFullScreen = false;
                }
            } else {
                this._originator = false;
            }
        });
    }

    public detached(): void {
        if (this._subscription) {
            this._subscription.dispose();
        }
        document.removeEventListener("keydown", this._keyDown);
    }

    public processContent(): void {
        if (!this._isFullScreen) {
            this._originator = true;
            this.expand(false);
        } else {
            this._originator = true;
            this.contract(false);
        }
        this._eventAggregator.publish(AttributeConstants.FULL_SCREEN_TOGGLE, this._isFullScreen);
        this._eventAggregator.publish(AnalyticsConstants.ANALYTICS_EVENT, {
            category: AnalyticsConstants.FULL_SCREEN_CATEGORY,
            action: AnalyticsConstants.CLICK_ACTION,
            label: TOGGLE_FULL_SCREEN_LABEL,
            metric: AnalyticsConstants.METRIC
        });
    }

    private moveItems(headerOnly: boolean): void {

        document.styleSheets[0].insertRule(".full-screen {position:absolute !important;"
            + " overflow:auto !important;  top:-" + this.topOffset
            + " !important;  left:-" + this.leftOffset
            + " !important; right:-" + this.rightOffset + "!important;"
            + " bottom:-" + this.bottomOffset + " !important; "
            + " z-index:200 !important;"
            + " transition: all " + this.transitionTime + "ms ease-in-out;}", 0);
        if (!headerOnly) {
            document.styleSheets[0].insertRule(".hide-left {position:relative !important;"
                + " transform: translateX(-" + this.hideLeftOffset + "); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            document.styleSheets[0].insertRule(".hide-right {position:relative !important;"
                + " transform: translateX(" + this.hideRightOffset + "); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            document.styleSheets[0].insertRule(".hide-top {position:absolute !important;"
                + " width:100% !important;   transform: translateY(-" + this.hideTopOffset + ") !important; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            document.styleSheets[0].insertRule(".hide-bottom {position:relative !important;"
                + "   transform: translateY(-" + this.hideBottomOffset + ") !important; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
        }
    }

    private deleteItems(headerOnly: boolean): void {
        for (let ruleCount = 0; ruleCount < document.styleSheets[0].cssRules.length; ruleCount++) {
            if (document.styleSheets[0].cssRules[ruleCount].selectorText === ".full-screen" && headerOnly) {
                document.styleSheets[0].deleteRule(ruleCount);
            } else if (!headerOnly && (document.styleSheets[0].cssRules[ruleCount].selectorText === ".full-screen" ||
                document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-bottom" ||
                document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-top" ||
                document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-left" ||
                document.styleSheets[0].cssRules[ruleCount].selectorText === ".hide-right")) {
                document.styleSheets[0].deleteRule(ruleCount);
            }
        }
    }

    private revertItems(headerOnly: boolean): void {
        document.styleSheets[0].insertRule(".full-screen {position:absolute !important;"
            + "overflow:auto !important; !important;  top:" + this.originalPositions.top + " left:" + this.originalPositions.left
            + " !important; right:" + this.originalPositions.right + " !important; bottom:" + this.originalPositions.bottom + " !important; "
            + " z-index:200 !important;margin-bottom: 0px!important; transition: all " + this.transitionTime + "ms ease-in-out;}", 0);
        if (!headerOnly) {
            document.styleSheets[0].insertRule(".hide-left {position:relative !important;"
                + " transform: translateX(0px); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            document.styleSheets[0].insertRule(".hide-right {position:relative !important;"
                + " transform: translateX(0px); transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            document.styleSheets[0].insertRule(".hide-top {position:absolute !important;"
                + " width:100% !important; transform: translateY(0px) !important; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
            document.styleSheets[0].insertRule(".hide-bottom {position:relative !important;"
                + "  transform: translateY(0px) !important    ; transition: all " + this.transitionTime + "ms ease-in-out; }", 0);
        }
    }

    private removeTabbing(element: Element): void {
        let allDecendents = element.querySelectorAll("*");
        for (let nodeIndex: number = 0; nodeIndex < allDecendents.length; nodeIndex++) {
            let elementItem: Element = allDecendents[nodeIndex];
            if (elementItem.getAttribute("tabindex")) {
                let tabIndex = parseInt(elementItem.getAttribute("tabindex"), 10);
                if (tabIndex > -1) {
                    tabIndex = tabIndex * -1;
                }
                elementItem.setAttribute("tabindex", tabIndex.toString());
            } else {
                elementItem.setAttribute("tabindex", "-999");
            }
        }
    }

    private applyTabbing(element: Element): void {
        let allDecendents = element.querySelectorAll("*");
        for (let nodeIndex: number = 0; nodeIndex < allDecendents.length; nodeIndex++) {
            let elementItem: Element = allDecendents[nodeIndex];
            if (elementItem.getAttribute("tabindex")) {
                if (elementItem.getAttribute("tabindex") === "-999") {
                    elementItem.removeAttribute("tabindex");
                } else {
                    let tabIndex = parseInt(elementItem.getAttribute("tabindex"), 10);
                    if (tabIndex < 0) {
                        tabIndex = tabIndex * -1;
                    }
                    elementItem.setAttribute("tabindex", tabIndex.toString());
                }
            }
        }
    }

    private toggleTabbing(): void {
        let hideTabArray: NodeListOf<Element> = document.getElementsByClassName("de-tab");
        let nodeIndex: number;
        let element: Element;
        if (hideTabArray.length) {
            for (nodeIndex = 0; nodeIndex < hideTabArray.length; nodeIndex++) {
                element = hideTabArray[nodeIndex];
                if (this._isFullScreen) {
                    this.removeTabbing(element);
                } else {
                    this.applyTabbing(element);
                }
            }
        }
    }

    private expand(headerOnly: boolean): void {
        this.moveItems(headerOnly);
        window.isFullScreen = true;
        this._isFullScreen = true;
        Threading.delay(() => {
            this.toggleTabbing();
        }, this.transitionTime);
    }

    private contract(headerOnly: boolean): void {
        this.deleteItems(headerOnly);
        this.revertItems(headerOnly);
        window.isFullScreen = false;
        this._isFullScreen = false;

        Threading.delay(() => {
            this.deleteItems(headerOnly);
            this.toggleTabbing();
        }, this.transitionTime);
    }
}
