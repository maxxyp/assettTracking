var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-dependency-injection", "aurelia-templating", "aurelia-binding"], function (require, exports, aurelia_templating_1, aurelia_dependency_injection_1, aurelia_templating_2, aurelia_binding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Swipe = /** @class */ (function () {
        function Swipe(element) {
            this._element = element;
            this._threshold = 300; // required min distance traveled to be considered swipe
            this._restraint = 100; // maximum distance allowed at the same time in perpendicular direction
            this._allowedTime = 250; // maximum time allowed to travel that distance
        }
        Swipe.prototype.attached = function () {
            var _this = this;
            this._element.addEventListener("mouseup", function (e) {
                _this.touchend(e);
            });
            this._element.addEventListener("mousedown", function (e) {
                _this.touchstart(e);
            });
            this._element.addEventListener("mousemove", function (e) {
                _this.touchmove(e);
            });
            this._element.addEventListener("touchend", function (e) {
                _this.touchend(e);
            });
            this._element.addEventListener("touchstart", function (e) {
                _this.touchstart(e);
            });
        };
        Swipe.prototype.detached = function () {
            var _this = this;
            this._element.removeEventListener("mouseup", function (e) {
                _this.touchend(e);
            });
            this._element.removeEventListener("mousedown", function (e) {
                _this.touchstart(e);
            });
            this._element.removeEventListener("mousemove", function (e) {
                _this.touchmove(e);
            });
            this._element.removeEventListener("touchend", function (e) {
                _this.touchend(e);
            });
            this._element.removeEventListener("touchstart", function (e) {
                _this.touchstart(e);
            });
        };
        Swipe.prototype.touchmove = function (e) {
            e.preventDefault();
        };
        Swipe.prototype.touchstart = function (e) {
            var touchobj = e;
            this._swipedir = "none";
            if (e.constructor.name === "TouchEvent") {
                this._startX = touchobj.touches[0].pageX;
                this._startY = touchobj.touches[0].pageY;
            }
            else {
                this._startX = touchobj.pageX;
                this._startY = touchobj.pageY;
            }
            this._startTime = new Date().getTime(); // record time when finger first makes contact with surface;
        };
        Swipe.prototype.touchend = function (e) {
            var touchobj = e;
            if (e.constructor.name === "TouchEvent") {
                this._distX = touchobj.changedTouches[0].pageX - this._startX;
                this._distY = touchobj.changedTouches[0].pageY - this._startY;
            }
            else {
                this._distX = touchobj.pageX - this._startX;
                this._distY = touchobj.pageY - this._startY;
            }
            this._elapsedTime = new Date().getTime() - this._startTime; // get time elapsed
            if (this._elapsedTime <= this._allowedTime) {
                if (Math.abs(this._distX) >= this._threshold && Math.abs(this._distY) <= this._restraint) {
                    this._swipedir = (this._distX < 0) ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(this._distY) >= this._threshold && Math.abs(this._distX) <= this._restraint) {
                    this._swipedir = (this._distY < 0) ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
                }
            }
            this.callback.apply(this.scope, [this._swipedir]);
        };
        __decorate([
            aurelia_templating_2.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Object)
        ], Swipe.prototype, "callback", void 0);
        __decorate([
            aurelia_templating_2.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Object)
        ], Swipe.prototype, "scope", void 0);
        Swipe = __decorate([
            aurelia_templating_1.customAttribute("swipe"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLElement])
        ], Swipe);
        return Swipe;
    }());
    exports.Swipe = Swipe;
});

//# sourceMappingURL=swipe.js.map
