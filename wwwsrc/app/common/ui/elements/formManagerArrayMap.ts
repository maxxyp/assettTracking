import {bindable, customElement} from "aurelia-templating";
import {bindingMode} from "aurelia-binding";

@customElement("form-manager-array-map")
export class FormManagerArrayMap {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public index: number;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public itemName: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public arrayName: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public item: any;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public array: any[];

    public itemChanged() : void {
        this.updateIndex();
    }

    public arrayChanged() : void {
        this.updateIndex();
    }

    private updateIndex() : void {
        if (this.array && this.item) {
            this.index = this.array.indexOf(this.item);
        } else {
            this.index = -1;
        }
    }
}
