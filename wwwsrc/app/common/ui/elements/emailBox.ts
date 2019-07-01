import {bindable, customElement} from "aurelia-templating";
import {bindingMode} from "aurelia-binding";
import {inject} from "aurelia-dependency-injection";
import {DOM} from "aurelia-pal";

@customElement("email-box")
@inject(Element)
export class EmailBox {
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public classes: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public disabled: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public readonly: boolean;

    private _element: Element;

    constructor(element: Element) {
        this._element = element;
    }

    public blur() : void {
        this._element.dispatchEvent(DOM.createCustomEvent("blur", {
            detail: {
                value: this._element
            },
            bubbles: true
        }));
    }
}
