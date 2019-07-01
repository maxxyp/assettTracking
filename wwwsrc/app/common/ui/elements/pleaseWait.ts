/// <reference path="../../../../typings/app.d.ts" />

import {customElement, bindable} from "aurelia-framework";
@customElement("please-wait")
export class PleaseWait {
    @bindable public complete: boolean;
    @bindable public waitingText: string;
    @bindable public showLogo: boolean;
    @bindable public inline: boolean;

    constructor() {
        this.complete = false;
        this.waitingText = "";
        this.showLogo = false;
        this.inline = false;
    }
}
