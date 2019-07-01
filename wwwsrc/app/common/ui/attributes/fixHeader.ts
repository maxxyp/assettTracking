/// <reference path="../../../../typings/app.d.ts" />
import { inject } from "aurelia-framework";
import { bindable, customAttribute } from "aurelia-templating";
import { IAssetService } from "../../core/services/IAssetService";
import { AssetService } from "../../core/services/assetService";
import { FixedHeaderConfigItem } from "./models/fixedHeaderConfigItem";
import { AttributeConstants } from "./constants/attributeConstants";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { Threading } from "../../core/threading";

 // must be less than the aurelia dialog overlay z-index of 1000 otherwise it renders above dialogs
const Z_INDEX = 999;

@customAttribute("fix-header")
@inject(Element, AssetService, EventAggregator, Router)

export class FixHeader {

    public isFloating: boolean;
    @bindable
    public isAlt: boolean;

    private _topOffset: number;
    private _leftOffset: number;
    private _rightOffset: number;
    private _transitionTime: number;
    private _enableForRoutePartial: string;

    private _element: HTMLElement;
    private _assetService: IAssetService;
    private _eventAggregator: EventAggregator;
    private _elementConfig: FixedHeaderConfigItem;
    private _router: Router;
    private _additionalStyle: string;
    private _timer: number;
    private _subscriptions: Subscription[];

    constructor(element: HTMLElement, assetService: IAssetService, eventAggregator: EventAggregator, router: Router) {
        this._assetService = assetService;
        this._element = element;
        this._topOffset = 0;
        this._leftOffset = 0;
        this._rightOffset = 0;
        this._transitionTime = 0;
        this.isFloating = false;
        this._eventAggregator = eventAggregator;
        this._router = router;
        this._subscriptions = [];
    }

    public attached(): void {
        this._assetService.loadJson<FixedHeaderConfigItem[]>("services/fixedHeader/fixedHeaderConfig.json").then((config) => {
            if (config) {
                this._elementConfig = config.find(item => item.selector === this._element.id);
                if (this._elementConfig) {
                    this._topOffset = this._elementConfig.topOffset;
                    this._leftOffset = this._elementConfig.leftOffset;
                    this._rightOffset = this._elementConfig.rightOffset;
                    this._additionalStyle = this._elementConfig.additionalStyle;
                    this._enableForRoutePartial = this._elementConfig.enableForRoutePartial;
                    this._transitionTime = this._elementConfig.transitionTime;
                    this._element.setAttribute("style", "transition: all " + this._transitionTime + "ms ease-in-out; display:none;");
                    this._timer = Threading.startTimer(() => this.checkFreezeFrame(), 50);
                    if (!this.isAlt) {
                        this._topOffset = this._elementConfig.topOffset;
                        this._leftOffset = this._elementConfig.leftOffset;
                        this._rightOffset = this._elementConfig.rightOffset;
                        this._transitionTime = this._elementConfig.transitionTime;
                        this._additionalStyle = this._elementConfig.additionalStyle;
                    } else {
                        this._topOffset = this._elementConfig.altTopOffset;
                        this._leftOffset = this._elementConfig.altLeftOffset;
                        this._rightOffset = this._elementConfig.altRightOffset;
                        this._transitionTime = this._elementConfig.transitionTime;
                        this._additionalStyle = this._elementConfig.additionalStyle;
                    }
                }
            }
            this._subscriptions.push(this._eventAggregator.subscribe("router:navigation:success", () => this.resetLayout()));
            this._subscriptions.push(this._eventAggregator.subscribe(AttributeConstants.FULL_SCREEN_TOGGLE, (isAlt: boolean) => {

                if (!isAlt) {
                    this._topOffset = this._elementConfig.topOffset;
                    this._leftOffset = this._elementConfig.leftOffset;
                    this._rightOffset = this._elementConfig.rightOffset;
                    this._transitionTime = this._elementConfig.transitionTime;
                    this._additionalStyle = this._elementConfig.additionalStyle;
                } else {
                    this._topOffset = this._elementConfig.altTopOffset;
                    this._leftOffset = this._elementConfig.altLeftOffset;
                    this._rightOffset = this._elementConfig.altRightOffset;
                    this._transitionTime = this._elementConfig.transitionTime;
                    this._additionalStyle = this._elementConfig.additionalStyle;
                }

                this.isFloating = false;
                this.resetLayout();
                this.checkFreezeFrame();
            }));
        });

    }

    public detached(): void {
        Threading.stopTimer(this._timer);
        this._subscriptions.forEach(subscription => subscription.dispose());
        this._subscriptions = [];
    }

    private resetLayout(): void {
        this.isFloating = false;
        let top = " display: none; ";
        this._element.setAttribute("style", top);
    }

    private checkFragment(enableForRoutePartialList: string, extractedFragment: string): boolean {
        let partialList = enableForRoutePartialList.split(",");
        let result: boolean = false;
        for (let partialCount = 0; partialCount < partialList.length; partialCount++) {
            if (!!~extractedFragment.indexOf(partialList[partialCount], 0)) {
                result = true;
                break;
            } else {
                result = false;
            }
        }
        return result;
    }

    private extractFragment(router: Router): string {
        let fragmentParts = router.currentInstruction.fragment.split("/");
        if (fragmentParts.length === 1) {
            return fragmentParts[0];
        } else {

            for (let fragmentCount = 0; fragmentCount < fragmentParts.length; fragmentCount++) {
                if (Number(fragmentParts[fragmentCount]) || (fragmentParts[fragmentCount].length === 36 && fragmentParts[fragmentCount].indexOf("-") === 8)) {
                    fragmentParts[fragmentCount] = "item";
                }
            }
            return fragmentParts.join("/");
        }
    }
    private updateStyle(setFixed: boolean): void {
        if (this.checkFragment(this._elementConfig.enableForRoutePartial, this.extractFragment(this._router)) || !this._enableForRoutePartial) {
            let top: string;
            if (setFixed) {
                top = "z-index:" + Z_INDEX + "; position:fixed; top:" + this._topOffset + "px; left:" + this._leftOffset + "px; right:"
                    + this._rightOffset + "px;transition: all " + this._transitionTime + "ms ease-in-out; "
                    + this._additionalStyle;
            } else {
                top = " display: none; "
                    + this._additionalStyle;
            }
            this._element.setAttribute("style", top);
            this.isFloating = setFixed;
        } else {
            this.isFloating = false;
        }
    }

    private checkFreezeFrame(): void {

        if (this._element.nextElementSibling.getBoundingClientRect().top <= this._topOffset) {
            this.updateStyle(true);
        } else if (this._element.nextElementSibling.getBoundingClientRect().top  >= this._topOffset && this.isFloating) {
            this.updateStyle(false);
        }

    }
}
