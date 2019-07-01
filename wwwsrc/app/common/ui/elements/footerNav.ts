/// <reference path="../../../../typings/app.d.ts" />

import {customElement, bindable, bindingMode} from "aurelia-framework";
import {FooterNavObject} from "./models/footerNavObject";
import {Router} from "aurelia-router";
import {inject} from "aurelia-dependency-injection";

@customElement("footer-nav")
@inject(Router)
export class FooterNav {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public footerNavObject: FooterNavObject[];
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public setSelected: number;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public navStyle: string;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public expanded: boolean;

    public navPosition: string;
    public showHideNav: boolean;
    private _router: Router;

    constructor(router: Router) {
        this._router = router;
    }

    public attached(): void {
        this.setActiveButton(this.setSelected);
        if (this.navStyle === "card") {
            this.navPosition = "styleAbsolute";
        } else {
            this.navPosition = "styleFixed";
        }
        if (this.navStyle !== "card") {
            this.navStyle = "";
        }
        if (this.expanded !== undefined) {
            this.showHideNav = this.expanded;
        }
    }

    public setSelectedChanged() : void {
        this.setActiveButton(this.setSelected);
    }

    public footerNavObjectChanged() : void {
        this.setActiveButton(this.setSelected);
    }

    public setActiveButton(activeButton: number): void {
        if (!isNaN(activeButton)) {
            if (this.footerNavObject && activeButton < this.footerNavObject.length) {
                this.footerNavObject[activeButton].selected = true;
            }
        }
    }

    public showHideNavDetails(): void {
        this.showHideNav = this.showHideNav === true ? false : true;
    }

    public navigate(navObject: FooterNavObject): void {
        navObject.selected = true;
        if (navObject.callback) {
            navObject.callback();
        } else {
            this._router.navigateToRoute(navObject.routeName, navObject.paramObject);
        }
    }
}
