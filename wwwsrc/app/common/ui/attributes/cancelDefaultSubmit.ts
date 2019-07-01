/// <reference path="../../../../typings/app.d.ts" />
import {PlatformHelper} from "../../core/platformHelper";
import {customAttribute} from "aurelia-templating";
import {inject} from "aurelia-dependency-injection";

@customAttribute("cancel-default-submit")
@inject(Element)
export class CancelDefaultSubmit {
    private _element: HTMLInputElement;
    private _keyDown: (event: KeyboardEvent) => void;

    constructor(element: HTMLInputElement) {
        this._element = element;
        this._keyDown = (event) => {
            if (event.keyCode === 13) {
                if (PlatformHelper.getPlatform() === "wua") {
                    event.returnValue = false;
                } else {
                    this._element.blur();
                }
            }
        };
    }

    public attached(): void {
        this._element.addEventListener("keydown", this._keyDown);
    }

    public detached(): void {
        this._element.removeEventListener("keydown", this._keyDown);
    }
}
