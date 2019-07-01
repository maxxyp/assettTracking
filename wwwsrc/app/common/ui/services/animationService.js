var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-animator-css", "../../../common/core/threading"], function (require, exports, aurelia_framework_1, aurelia_animator_css_1, threading_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnimationService = /** @class */ (function () {
        function AnimationService(cssAnimator) {
            this._cssAnimator = cssAnimator;
        }
        AnimationService.prototype.swipe = function (element, itemArray, itemPosition, swipeDirection, inClass, outClass, animationTime) {
            var _this = this;
            if (animationTime === void 0) { animationTime = 300; }
            return new Promise(function (resolve, reject) {
                _this._targetElement = element;
                _this._itemArray = itemArray;
                _this._itemPosition = itemPosition;
                _this._swipeDirection = swipeDirection;
                _this._inClass = inClass;
                _this._outClass = outClass;
                _this._animationTime = animationTime;
                if (swipeDirection === "left") {
                    if (_this._itemPosition >= 0 && _this._itemPosition < _this._itemArray.length - 1) {
                        _this.animateSwipe()
                            .then(function () {
                            _this._itemPosition++;
                            resolve(_this._itemPosition);
                        });
                    }
                    else {
                        _this.animate(_this._targetElement, "shake-animation", 300)
                            .then(function () {
                            reject();
                        });
                    }
                }
                else if (swipeDirection === "right") {
                    if (_this._itemPosition > 0) {
                        _this.animateSwipe()
                            .then(function () {
                            _this._itemPosition--;
                            resolve(_this._itemPosition);
                        });
                    }
                    else {
                        _this.animate(_this._targetElement, "shake-animation", 300)
                            .then(function () {
                            reject();
                        });
                    }
                }
                else {
                    reject();
                }
            });
        };
        AnimationService.prototype.animate = function (element, animateClass, animationTime) {
            var _this = this;
            if (animationTime === void 0) { animationTime = 300; }
            return new Promise(function (resolve, reject) {
                _this._cssAnimator.addClass(element, animateClass);
                threading_1.Threading.delay(function () {
                    _this._cssAnimator.removeClass(element, animateClass);
                    resolve();
                }, animationTime);
            });
        };
        AnimationService.prototype.animateSwipe = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._cssAnimator.removeClass(_this._targetElement, _this._swipeDirection);
                _this._cssAnimator.addClass(_this._targetElement, _this._outClass);
                resolve();
                threading_1.Threading.delay(function () {
                    _this._cssAnimator.removeClass(_this._targetElement, _this._outClass);
                    _this._cssAnimator.addClass(_this._targetElement, _this._inClass);
                    threading_1.Threading.delay(function () {
                        _this._cssAnimator.removeClass(_this._targetElement, _this._inClass);
                    }, _this._animationTime);
                }, _this._animationTime);
            });
        };
        AnimationService = __decorate([
            aurelia_framework_1.inject(aurelia_animator_css_1.CssAnimator),
            __metadata("design:paramtypes", [aurelia_animator_css_1.CssAnimator])
        ], AnimationService);
        return AnimationService;
    }());
    exports.AnimationService = AnimationService;
});

//# sourceMappingURL=animationService.js.map
