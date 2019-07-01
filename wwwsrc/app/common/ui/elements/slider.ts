/// <reference path="../../../../typings/app.d.ts" />
import {customElement, bindable, bindingMode} from "aurelia-framework";
import {Threading} from "../../core/threading";
import {inject} from "aurelia-dependency-injection";
@customElement("slider")
@inject(Element)
export class Slider {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public setSlider: number;
    private _timerId: number;
    private _element: HTMLElement;
    private _sliderWidth: number;
    private _previousScrollPosition: number; 
    private _scrollPosition: number;
    private _lastChangedTime: number; 
    constructor(element: HTMLElement) {
        this._element = element;
    }

    public attached(): void {
        this._lastChangedTime = new Date().getTime();
        let swipeItems = this._element.getElementsByClassName("slider-item");
        this._sliderWidth = this._element.getBoundingClientRect().width;

        let swipeContent = <HTMLElement>this._element.getElementsByClassName("swipe-content")[0];
        swipeContent.style.width = (this._sliderWidth * swipeItems.length).toString() + "px";

        for (let intcount = 0; intcount < swipeItems.length; intcount++) {
            let swipeItem = <HTMLElement>swipeItems[intcount];
            swipeItem.style.width = this._sliderWidth.toString() + "px";
        }

        this._timerId = Threading.startTimer(() => {
            this.getCurrentSlider();
        }, 500);
    }
    public valueChanged(newValue: number, oldValue: number): void {
        // only fire if the scroller is not in movement
        if (new Date().getTime() - this._lastChangedTime > 300) {
            this._element.getElementsByClassName("swipe-container")[0].scrollLeft = this._sliderWidth * newValue;
        }
    }
    public detached(): void {
        Threading.stopTimer(this._timerId);
    }
    private getCurrentSlider(): void {
        let containerLeftPosition: number;
        let containerRightPosition: number;
        this._scrollPosition = this._element.getElementsByClassName("swipe-container")[0].scrollLeft;
        let intcount: number;
        containerLeftPosition = this._element.getElementsByClassName("swipe-container")[0].getBoundingClientRect().left;
        containerRightPosition = this._element.getElementsByClassName("swipe-container")[0].getBoundingClientRect().right;
        let swipeItems = this._element.getElementsByClassName("slider-item");
        if (this._scrollPosition > this._previousScrollPosition) {
            for (intcount = 0; intcount < swipeItems.length; intcount++) {
                if (Math.floor(swipeItems[intcount].getBoundingClientRect().left - containerLeftPosition) <= 0) {
                    this.value = intcount;
                    this._lastChangedTime = new Date().getTime();
                }
            }
        } else if (this._scrollPosition < this._previousScrollPosition) {
            for (intcount = swipeItems.length; intcount--; ) {
                if (Math.floor(swipeItems[intcount].getBoundingClientRect().right - containerRightPosition) >= 0) {
                    this.value = intcount;
                    this._lastChangedTime = new Date().getTime();
                }
            }
        }
        if (this._previousScrollPosition !== this._scrollPosition) {
            this._previousScrollPosition = this._scrollPosition;
        }
    }
}
