var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../core/threading", "aurelia-dependency-injection"], function (require, exports, aurelia_framework_1, threading_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Slider = /** @class */ (function () {
        function Slider(element) {
            this._element = element;
        }
        Slider.prototype.attached = function () {
            var _this = this;
            this._lastChangedTime = new Date().getTime();
            var swipeItems = this._element.getElementsByClassName("slider-item");
            this._sliderWidth = this._element.getBoundingClientRect().width;
            var swipeContent = this._element.getElementsByClassName("swipe-content")[0];
            swipeContent.style.width = (this._sliderWidth * swipeItems.length).toString() + "px";
            for (var intcount = 0; intcount < swipeItems.length; intcount++) {
                var swipeItem = swipeItems[intcount];
                swipeItem.style.width = this._sliderWidth.toString() + "px";
            }
            this._timerId = threading_1.Threading.startTimer(function () {
                _this.getCurrentSlider();
            }, 500);
        };
        Slider.prototype.valueChanged = function (newValue, oldValue) {
            // only fire if the scroller is not in movement
            if (new Date().getTime() - this._lastChangedTime > 300) {
                this._element.getElementsByClassName("swipe-container")[0].scrollLeft = this._sliderWidth * newValue;
            }
        };
        Slider.prototype.detached = function () {
            threading_1.Threading.stopTimer(this._timerId);
        };
        Slider.prototype.getCurrentSlider = function () {
            var containerLeftPosition;
            var containerRightPosition;
            this._scrollPosition = this._element.getElementsByClassName("swipe-container")[0].scrollLeft;
            var intcount;
            containerLeftPosition = this._element.getElementsByClassName("swipe-container")[0].getBoundingClientRect().left;
            containerRightPosition = this._element.getElementsByClassName("swipe-container")[0].getBoundingClientRect().right;
            var swipeItems = this._element.getElementsByClassName("slider-item");
            if (this._scrollPosition > this._previousScrollPosition) {
                for (intcount = 0; intcount < swipeItems.length; intcount++) {
                    if (Math.floor(swipeItems[intcount].getBoundingClientRect().left - containerLeftPosition) <= 0) {
                        this.value = intcount;
                        this._lastChangedTime = new Date().getTime();
                    }
                }
            }
            else if (this._scrollPosition < this._previousScrollPosition) {
                for (intcount = swipeItems.length; intcount--;) {
                    if (Math.floor(swipeItems[intcount].getBoundingClientRect().right - containerRightPosition) >= 0) {
                        this.value = intcount;
                        this._lastChangedTime = new Date().getTime();
                    }
                }
            }
            if (this._previousScrollPosition !== this._scrollPosition) {
                this._previousScrollPosition = this._scrollPosition;
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], Slider.prototype, "value", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], Slider.prototype, "setSlider", void 0);
        Slider = __decorate([
            aurelia_framework_1.customElement("slider"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLElement])
        ], Slider);
        return Slider;
    }());
    exports.Slider = Slider;
});

//# sourceMappingURL=slider.js.map
