import {bindable, customElement} from "aurelia-templating";
import {bindingMode} from "aurelia-binding";
import {inject} from "aurelia-dependency-injection";
import {DOM} from "aurelia-pal";

@customElement("text-box")
@inject(Element)
export class TextBox {
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public classes: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public hideKeyboardOnEnter: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public disabled: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public readonly: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public cancelDefaultSubmit: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public placeholder: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public maxLength: number;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public type: string;

    private _element: Element;

    constructor(element: Element) {
        this.maxLength = 65535;
        this.placeholder = "";
        this._element = element;
    }
    public attached(): void {
        if (!this.type) {
            this.type = "textbox";
        }
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
