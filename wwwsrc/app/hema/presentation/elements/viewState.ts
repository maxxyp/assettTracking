import {customElement, bindable} from "aurelia-templating";
import {ViewModelState} from "./viewModelState";
import {bindingMode} from "aurelia-binding";

@customElement("view-state")
export class ViewState {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public viewState: ViewModelState;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public viewStateText: string;
}
