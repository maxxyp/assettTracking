import {bindable, customElement} from "aurelia-framework";
import {Threading} from "../../core/threading";
import {inject} from "aurelia-dependency-injection";

@customElement("help-tip")
@inject(Element)
export class HelpTip {
    @bindable
    public content: string;
    @bindable
    public icon: string;
    @bindable
    public iconClass: string;
    public showStyle: string;

    public mainControl: HTMLElement;
    public popup: HTMLElement;

    private _scrollableParent: HTMLElement;
    private _eventTarget: EventTarget;

    private _repositionCallback: () => void;
    private _hidePopupCallback: (event: Event) => void;
    private _keyPress: (event: KeyboardEvent) => void;
    private _element: HTMLElement;

    constructor(element: HTMLElement) {
        this._element = element;
        this.content = "";
        this.showStyle = "";
        this.icon = "?";
        this._repositionCallback = () => this.reposition();
        this._hidePopupCallback = (event) => this.hidePopup(event);
        this._keyPress = (event: KeyboardEvent) => {
             this.hidePopup(event);
        };
    }

    public attached(): void {
        this._scrollableParent = this.findScrollableParent(this.mainControl);

        if (this._scrollableParent === null) {
            this._scrollableParent = window.document.body;
            this._eventTarget = window;
        } else {
            this._eventTarget = this._scrollableParent;
        }

        this._eventTarget.addEventListener("resize", this._repositionCallback);
        this._eventTarget.addEventListener("scroll", this._hidePopupCallback);
        this._element.addEventListener("keydown", this._keyPress);
    }

    public detached(): void {
        this.hidePopup(null);
        if (this._eventTarget) {
            this._eventTarget.removeEventListener("resize", this._repositionCallback);
            this._eventTarget.removeEventListener("scroll", this._hidePopupCallback);
            this._element.removeEventListener("keydown", this._keyPress);
        }
    }

    public showPopup(event: MouseEvent): void {
        if (this.showStyle === "") {
            this.showStyle = "visible";
            this.reposition();
            if (event) {
                event.stopPropagation();
            }
        }
    }

    public hidePopup(event: Event): void {
        if (this.showStyle === "visible") {
            this.showStyle = "";
            if (this.popup) {
                this.popup.style.left = "";
                this.popup.style.top = "";
            }
            if (event) {
                event.stopPropagation();
            }
        }
    }

    private reposition(): void {
        if (this.mainControl && this.popup && this._scrollableParent) {
            this.popup.style.transformOrigin = "100% 0%";

            /* keep updating the position as the scale transforms finish */
            let counter = 0;
            let doTransformLeft = false;
            let doTransformTop = false;
            let originSet = false;
            let timerId = Threading.startTimer(() => {
                if (!this._scrollableParent || !this.popup || !this.mainControl) {
                    Threading.stopTimer(timerId);
                } else {
                    let scrollRect = this._scrollableParent.getBoundingClientRect();

                    let popupRect = this.popup.getBoundingClientRect();
                    let mainRect = this.mainControl.getBoundingClientRect();

                    if (popupRect.bottom > scrollRect.bottom ||
                        popupRect.left < scrollRect.right ||
                        doTransformLeft || doTransformTop) {
                        let transformLeft = "100%";
                        let transformTop = "0%";

                        if (popupRect.bottom > scrollRect.bottom || doTransformTop) {
                            doTransformTop = true;
                            this.popup.style.top = "-" + (popupRect.height + mainRect.height + 5) + "px";
                            transformTop = "100%";
                        }

                        if (popupRect.left < scrollRect.left || doTransformLeft) {
                            doTransformLeft = true;
                            this.popup.style.left = "0px";
                            transformLeft = "0%";
                        }

                        if (!originSet) {
                            originSet = true;
                            this.popup.style.transformOrigin = transformLeft + " " + transformTop;
                        }
                    }

                    counter++;
                    if (counter === 30) {
                        Threading.stopTimer(timerId);
                    }
                }
            }, 10);
        }
    }

    private findScrollableParent(node: HTMLElement): HTMLElement {
        if (node === null) {
            return null;
        }

        if (node.classList && node.classList.contains("help-tip-container")) {
            return node;
        } else {
            return this.findScrollableParent(node.parentElement);
        }
    }
}
