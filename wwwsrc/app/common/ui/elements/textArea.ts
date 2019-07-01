import {bindable, customElement} from "aurelia-templating";
import {bindingMode} from "aurelia-binding";
import {inject} from "aurelia-dependency-injection";
import {DOM} from "aurelia-pal";

@customElement("text-area")
@inject(Element)
export class TextArea {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public classes: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public readonly: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public placeholder: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public spellCheck: boolean;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public charactersLeft: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxlength: number;
    public maxLengthSet: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxlengthText: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public charactersLeft2: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxlength2: number;
    public maxLength2Set: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxlength2Text: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxlength2ExceededText: string;

    private _element: Element;
    private _defaultMaxLength: number ;

    constructor(element: Element) {
        this._defaultMaxLength = this.maxlength = this.maxlength2 = 65535;
        this.maxLengthSet = false;
        this.maxlengthText = "characters left";
        this.spellCheck = true;
        this.placeholder = "";
        this._element = element;
    }

    public attached() : void {
        this.updateCharCount();
    }

    public valueChanged(newValue: string, oldValue: string): void {
        this.updateCharCount();
    }

    public maxlengthChanged(newValue: string, oldValue: string): void {
        if (newValue) {
            this.maxlength = parseInt(newValue, 10);
            this.maxLengthSet = true;
            this.updateCharCount();
        } else {
            this.maxlength = this._defaultMaxLength;
            this.maxLengthSet = false;
        }
    }

    public maxlength2Changed(newValue: string, oldValue: string): void {
        if (newValue) {
            this.maxlength2 = parseInt(newValue, 10);
            this.maxLength2Set = true;
            this.updateCharCount();
        } else {
            this.maxlength2 = this._defaultMaxLength;
            this.maxLength2Set = false;
        }
    }

    public updateCharCount(): void {
        if (this.maxLengthSet) {
            let totalLength: number = (this.value ? this.value.length : 0);
            let val: number = this.maxlength - totalLength;

            if (val >= 0) {
                this.charactersLeft = `${val} ${this.maxlengthText}`;
            } else if (val < 0) {
                let truncval = this.value.substr(0, this.maxlength);
                this.value = truncval;
            }

            if (this.maxLength2Set && this.maxlength2 < this.maxlength) {
                let val2: number = this.maxlength2 - totalLength;
                if (val2 > 0) {
                    this.charactersLeft2 = `(${val2} ${this.maxlength2Text})`;
                } else if (val2 < 0) {
                    this.charactersLeft2 = `(${this.maxlength2ExceededText})`;
                } else {
                    this.charactersLeft2 = "";
                }
            }
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
