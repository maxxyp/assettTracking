import { inject } from "aurelia-framework";
import { CssAnimator } from "aurelia-animator-css";
import { Threading } from "../../../common/core/threading";
import { IAnimationService } from "./IAnimationService";
@inject(CssAnimator)
export class AnimationService implements IAnimationService {
    private _cssAnimator: CssAnimator;
    private _targetElement: HTMLElement;
    private _itemArray: any[];
    private _swipeDirection: string;
    private _inClass: string;
    private _outClass: string;
    private _animationTime: number;
    private _itemPosition: number;

    constructor(cssAnimator: CssAnimator) {
        this._cssAnimator = cssAnimator;
    }
    public swipe(element: HTMLElement,
        itemArray: any[],
        itemPosition: number,
        swipeDirection: string,
        inClass: string,
        outClass: string,
        animationTime = 300
    ): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._targetElement = element;
            this._itemArray = itemArray;
            this._itemPosition = itemPosition;
            this._swipeDirection = swipeDirection;
            this._inClass = inClass;
            this._outClass = outClass;
            this._animationTime = animationTime;
            if (swipeDirection === "left") {
                if (this._itemPosition >= 0 && this._itemPosition < this._itemArray.length - 1) {
                    this.animateSwipe()
                        .then(() => {
                            this._itemPosition++;
                            resolve(this._itemPosition);
                        });
                } else {
                    this.animate(this._targetElement, "shake-animation", 300)
                        .then(() => {
                            reject();
                        });
                }
            } else if (swipeDirection === "right") {
                if (this._itemPosition > 0) {
                    this.animateSwipe()
                        .then(() => {
                            this._itemPosition--;
                            resolve(this._itemPosition);
                        });
                } else {
                    this.animate(this._targetElement, "shake-animation", 300)
                        .then(() => {
                            reject();
                        });
                }
            } else {
                reject();
            }
        });
    }
    public animate(element: HTMLElement, animateClass: string, animationTime = 300): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._cssAnimator.addClass(element, animateClass);
            Threading.delay(() => {
                this._cssAnimator.removeClass(element, animateClass);
                resolve();
            }, animationTime);
        });
    }

    private animateSwipe(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._cssAnimator.removeClass(this._targetElement, this._swipeDirection);
            this._cssAnimator.addClass(this._targetElement, this._outClass);
            resolve();
            Threading.delay(() => {
                this._cssAnimator.removeClass(this._targetElement, this._outClass);
                this._cssAnimator.addClass(this._targetElement, this._inClass);
                Threading.delay(() => {
                    this._cssAnimator.removeClass(this._targetElement, this._inClass);
                }, this._animationTime);
            }, this._animationTime);
        });
    }
}
