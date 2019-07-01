/// <reference path="../../../../../typings/app.d.ts" />

export class ButtonListItem {
    public text: string;
    public value: any;
    public disabled: boolean;

    constructor(text: string, value: any, disabled: boolean) {
        this.text = text;
        this.value = value;
        this.disabled = disabled;
    }
}
