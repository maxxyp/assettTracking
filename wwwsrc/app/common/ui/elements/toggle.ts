/// <reference path="../../../../typings/app.d.ts" />

import {customElement, bindable, bindingMode} from "aurelia-framework";

@customElement("toggle")
export class Toggle {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    @bindable public value: boolean;
    @bindable public isTrueText: string;
    @bindable public isFalseText: string;

    constructor() {
        this.isTrueText = "Yes";
        this.isFalseText = "No";
        this.value = false;
    }

    public toggleClick(newValue: boolean): void {
        this.value = newValue;
    }
}
