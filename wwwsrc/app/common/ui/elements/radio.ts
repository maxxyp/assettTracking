import {bindable, customElement} from "aurelia-templating";
import {bindingMode} from "aurelia-binding";

@customElement("radio")
export class Radio {
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value: any;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public classes: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public name: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public disabled: boolean;
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public selectedValue: any;
}
