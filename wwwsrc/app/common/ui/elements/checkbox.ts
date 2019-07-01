import { bindable, customElement } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";
import { inject } from "aurelia-dependency-injection";
import { DOM } from "aurelia-pal";
import { Threading } from "../../../common/core/threading";

@customElement("checkbox")
@inject(Element)
export class Checkbox {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public classes: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public isChecked: boolean;
    private _element: HTMLInputElement;

    constructor(element: HTMLInputElement) {
        this._element = element;
    }
    public attached(): void {
        if (this.value === true) {
            this.isChecked = true;
        }
    }
    public click(): void {
        this.isChecked = this.isChecked === true ? false : true;
         Threading.nextCycle(() => {
        this._element. dispatchEvent(DOM.createCustomEvent("change", {
            detail: {
                value: this.value,
                checked: this.isChecked
            },
            bubbles: true
        }));
         });
    }

    public blur(): void {
        this._element.dispatchEvent(DOM.createCustomEvent("blur", {
            detail: {
                value: this._element
            },
            bubbles: true
        }));
    }
}
