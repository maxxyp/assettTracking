/// <reference path="../../../../typings/app.d.ts" />
import { customAttribute } from "aurelia-templating";
import { inject } from "aurelia-dependency-injection";
import { bindable } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";

@customAttribute("swipe")
@inject(Element)

export class Swipe {
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public callback: any;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public scope: any;
    private _element: HTMLElement;
    private _swipedir: string;
    private _startX: number;
    private _startY: number;
    private _distX: number;
    private _distY: number;
    private _threshold: number;
    private _restraint: number;
    private _allowedTime: number;
    private _elapsedTime: number;
    private _startTime: number;

    constructor(element: HTMLElement) {
        this._element = element;
        this._threshold = 300; // required min distance traveled to be considered swipe
        this._restraint = 100; // maximum distance allowed at the same time in perpendicular direction
        this._allowedTime = 250; // maximum time allowed to travel that distance
    }

    public attached(): void {
        this._element.addEventListener("mouseup", (e: MouseEvent) => {
            this.touchend(e);
        });
        this._element.addEventListener("mousedown", (e: MouseEvent) => {
            this.touchstart(e);
        });
        this._element.addEventListener("mousemove", (e: MouseEvent) => {
            this.touchmove(e);
        });
        this._element.addEventListener("touchend", (e: TouchEvent) => {
            this.touchend(e);
        });
        this._element.addEventListener("touchstart", (e: TouchEvent) => {
            this.touchstart(e);
        });

    }

    public detached(): void {
        this._element.removeEventListener("mouseup", (e: MouseEvent) => {
            this.touchend(e);
        });
        this._element.removeEventListener("mousedown", (e: MouseEvent) => {
            this.touchstart(e);
        });
        this._element.removeEventListener("mousemove", (e: MouseEvent) => {
            this.touchmove(e);
        });
        this._element.removeEventListener("touchend", (e: TouchEvent) => {
            this.touchend(e);
        });
        this._element.removeEventListener("touchstart", (e: TouchEvent) => {
            this.touchstart(e);
        });
    }

    private touchmove(e: MouseEvent): void {
        e.preventDefault();
    }

    private touchstart(e: any): void {
        let touchobj = e;
        this._swipedir = "none";
        if (e.constructor.name === "TouchEvent") {
            this._startX = touchobj.touches[0].pageX;
            this._startY = touchobj.touches[0].pageY;
        } else {
            this._startX = touchobj.pageX;
            this._startY = touchobj.pageY;
        }
        this._startTime = new Date().getTime(); // record time when finger first makes contact with surface;
    }

    private touchend(e: any): void {
        let touchobj = e;
        if (e.constructor.name === "TouchEvent") {
            this._distX = touchobj.changedTouches[0].pageX - this._startX;
            this._distY = touchobj.changedTouches[0].pageY - this._startY;
        } else {
            this._distX = touchobj.pageX - this._startX;
            this._distY = touchobj.pageY - this._startY;
        }
        this._elapsedTime = new Date().getTime() - this._startTime; // get time elapsed
        if (this._elapsedTime <= this._allowedTime) { // first condition for awipe met
            if (Math.abs(this._distX) >= this._threshold && Math.abs(this._distY) <= this._restraint) { // 2nd condition for horizontal swipe met
                this._swipedir = (this._distX < 0) ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
            } else if (Math.abs(this._distY) >= this._threshold && Math.abs(this._distX) <= this._restraint) { // 2nd condition for vertical swipe met
                this._swipedir = (this._distY < 0) ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
            }
        }
        this.callback.apply(this.scope, [this._swipedir]);
    }
}
