/// <reference path="../../../../typings/app.d.ts" />

import {customElement, bindable, bindingMode} from "aurelia-framework";
import {IconDetailItem} from "./models/iconDetailItem";

@customElement("collapsible")
export class Collapsible {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public titleText : string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public titleTextExpanded : string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public animate : boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public isCollapsed: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public headerIcons: IconDetailItem[];
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public collapseIcon : string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public expandIcon : string;
    public contentElement: any;
    private _clickCallback: (collapsible: Collapsible) => void;

    constructor() {
        this.titleText = "";
        this.titleTextExpanded = "";
        this.animate = false;
        this.isCollapsed = true;
        this.headerIcons = [];
        this.collapseIcon = "";
        this.expandIcon = "";
    }

    public attached() : void {
        !this.isCollapsed ? this.show() : this.hide();

        if (this.contentElement) {
            this.contentElement.style.height = "auto";
        }
    }

    public show(): void {
        this.isCollapsed = false;
        this.contentElement.style.display = "inline";
    }

    public hide(): void {
        this.isCollapsed = true;
        this.contentElement.style.display = "none";
    }

    public isCollapsedChanged(newValue: boolean): void {
        if (this.contentElement) {
            newValue ? this.hide() : this.show();
        }
    }

    public toggle(): void {
        if (this._clickCallback) {
            this._clickCallback(this);
        }
        this.isCollapsed ? this.show() : this.hide();
    }

    public setClickCallback(callback: (collapsible: Collapsible) => void): void {
        this._clickCallback = callback;
    }

    public hasHeaderIcons() : boolean {
        return this.headerIcons && this.headerIcons.length > 0;
    }
}
