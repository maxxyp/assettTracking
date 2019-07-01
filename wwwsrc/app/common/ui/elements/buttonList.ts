import {bindable, bindingMode} from "aurelia-framework";
import {ButtonListItem} from "./models/buttonListItem";
import {IconButtonListItem} from "./models/iconButtonListItem";
import {Threading} from "../../core/threading";
import {DOM} from "aurelia-pal";
import {inject} from "aurelia-dependency-injection";

@inject(Element)
export class ButtonList {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public items: ButtonListItem[];
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public buttonLayout: string;
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value: any;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public multiSelect: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public buttonWidth: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public buttonHeight: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public values: string[];
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public disabled: boolean;

    private _element: Element;

    private _buttonHasFocus: boolean;

    constructor(element: Element) {
        this.multiSelect = false;
        this.buttonWidth = "auto";
        this.buttonHeight = "auto";
        this.buttonLayout = "horizontal";
        this._element = element;
    }

    public attached(): void {
        // if we have values and not button list items then convert our values array into a ButtonListItem array.
        if (this.values) {
            this.items = [];
            for (let indexValueItem = 0; indexValueItem < this.values.length; indexValueItem++) {
                this.items.push(new ButtonListItem(this.values[indexValueItem], this.values[indexValueItem], false));
            }
        }
    }

    public setValue(buttonListItem: ButtonListItem, index: number, event: Event): void {
        if (!buttonListItem.disabled) {
            if (!this.multiSelect) {
                this.value = buttonListItem.value;
            } else {
                let pos: number = this.value ? this.value.indexOf(buttonListItem.value) : -1;
                if (pos > -1) {
                    this.value.splice(pos, 1);
                } else {
                    if (!this.value) {
                        this.value = [];
                    }
                    this.value.push(buttonListItem.value);
                }
                /* Do a shallow copy to make the outside world notice the array change */
                this.value = this.value.slice(0);
            }
            if (event) {
                event.stopPropagation();
                DOM.dispatchEvent(new Event("click"));
            }
        }
    }

    public isIconButton(buttonListItem: ButtonListItem): boolean {
        return !!(<IconButtonListItem>buttonListItem)
                    && (<IconButtonListItem>buttonListItem).iconClassName !== undefined;
    }

    public blur(index: number) : void {
        this._buttonHasFocus = false;
        Threading.nextCycle(() => {
            if (!this._buttonHasFocus) {
                this._element.dispatchEvent(DOM.createCustomEvent("blur", {
                    detail: {
                        value: this._element
                    },
                    bubbles: true
                }));
            }
        });
    }

    public focus(index: number) : void {
        this._buttonHasFocus = true;
    }
}
