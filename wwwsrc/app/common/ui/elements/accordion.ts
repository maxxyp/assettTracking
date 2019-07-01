/// <reference path="../../../../typings/app.d.ts" />

import {customElement, bindable, bindingMode} from "aurelia-framework";
import {children} from "aurelia-templating";

import {Collapsible} from "./collapsible";

@customElement("accordion")
export class Accordion {

    @children({ name: "sections", selector: "collapsible" })
    public sections: Collapsible[];
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public showControls : boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public controlsExpandedText : string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public controlsCollapsedText : string;
    private _allExpanded: boolean;

    constructor() {
        this.showControls = false;
        this.controlsExpandedText = "<i class='fa fa-plus'></i> Expand All";
        this.controlsCollapsedText = "<i class='fa fa-minus'></i> Collapse All";
        this._allExpanded = false;
    }

    public attached(): void {
        if (this.sections) {
            for (let collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                this.sections[collapsibleCount].setClickCallback((item: Collapsible) => this.clickCallback(item));
            }
        }
    }

    public expandAll(): void {
        if (this.sections) {
            for (let collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                this.sections[collapsibleCount].show();
            }
            this._allExpanded = true;
        }
    }

    public collapseAll() : void {
        if (this.sections) {
            for (let collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                this.sections[collapsibleCount].hide();
            }
            this._allExpanded = false;
        }
    }

    public clickCallback(collapsible: Collapsible) : void {

        if (this.showControls) {
            return;
        }

        if (this.sections) {
            for (let collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                if (!this.sections[collapsibleCount].isCollapsed
                    && this.sections[collapsibleCount] !== collapsible) {
                    this.sections[collapsibleCount].hide();
                }
            }

            if (this._allExpanded) {
                collapsible.isCollapsed = true;
                this._allExpanded = false;
            }
        }
    }
}
