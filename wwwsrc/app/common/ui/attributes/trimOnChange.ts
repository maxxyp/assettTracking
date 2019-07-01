/// <reference path="../../../../typings/app.d.ts" />
import {customAttribute} from "aurelia-templating";
import {inject} from "aurelia-dependency-injection";

@customAttribute("trim-on-change")
@inject(Element)
export class TrimOnChange {
    private _element: HTMLInputElement;
    private _inputEvent: (event: Event) => void;

    constructor(element: HTMLInputElement) {
        this._element = element;
        this._inputEvent = (event) => {
            this._element.value = this._element.value.trim();
        };
    }

    public attached(): void {
        this._element.addEventListener("input", this._inputEvent);
    }

    public detached(): void {
        this._element.removeEventListener("input", this._inputEvent);
    }
}
