import { bindable, customElement } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";
import { inject } from "aurelia-dependency-injection";
import { Threading } from "../../core/threading";

@customElement("badge")
@inject(Element)
export class Badge {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any;

    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public disabled: boolean;

    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public showCount: boolean;

    public newValue: any;
    public animationClass: string;

    constructor(element: Element) {
    }
    public valueChanged(): void {
        this.animationClass = "holder-out";
        Threading.delay(() => {
            this.animationClass = "holder-bottom";
            this.newValue = this.value;
            Threading.delay(() => {
                this.animationClass = "";
            }, 100);
        }, 150);
    }
}
