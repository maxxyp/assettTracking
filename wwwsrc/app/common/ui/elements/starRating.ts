/// <reference path="../../../../typings/app.d.ts" />

import {customElement, bindable} from "aurelia-framework";
import {bindingMode} from "aurelia-framework";

@customElement("star-rating")
export class StarRating {
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value : number;
    @bindable()
    public ratingTexts : string[];
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public valueText : string;

    constructor() {
        this.value = 0;
        this.ratingTexts = [];
        this.valueText = "";
    }

    public attached() : void {
        if (this.ratingTexts.length > 0) {
            this.valueText = this.ratingTexts[this.value];
        }
    }

    public ratingClick(index: number) : void {
        this.value = index;
        if (this.ratingTexts.length > 0) {
            this.valueText = this.ratingTexts[this.value];
        }
    }
}
