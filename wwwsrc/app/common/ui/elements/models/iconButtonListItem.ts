/// <reference path="../../../../../typings/app.d.ts" />
import {ButtonListItem} from "./buttonListItem";

export class IconButtonListItem extends ButtonListItem {

    public iconClassName: string;

    constructor(text: string, value: any, disabled: boolean, iconClassName: string) {
        super(text, value, disabled);
        this.iconClassName = iconClassName;
    }
}
