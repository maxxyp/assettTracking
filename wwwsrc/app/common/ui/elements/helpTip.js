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
    var HelpTip = /** @class */ (function () {
        function HelpTip(element) {
            var _this = this;
            this._element = element;
            this.content = "";
            this.showStyle = "";
            this.icon = "?";
            this._repositionCallback = function () { return _this.reposition(); };
            this._hidePopupCallback = function (event) { return _this.hidePopup(event); };
            this._keyPress = function (event) {
                _this.hidePopup(event);
            };
        }
        HelpTip.prototype.attached = function () {
            this._scrollableParent = this.findScrollableParent(this.mainControl);
            if (this._scrollableParent === null) {
                this._scrollableParent = window.document.body;
                this._eventTarget = window;
            }
            else {
                this._eventTarget = this._scrollableParent;
            }
            this._eventTarget.addEventListener("resize", this._repositionCallback);
            this._eventTarget.addEventListener("scroll", this._hidePopupCallback);
            this._element.addEventListener("keydown", this._keyPress);
        };
        HelpTip.prototype.detached = function () {
            this.hidePopup(null);
            if (this._eventTarget) {
                this._eventTarget.removeEventListener("resize", this._repositionCallback);
                this._eventTarget.removeEventListener("scroll", this._hidePopupCallback);
                this._element.removeEventListener("keydown", this._keyPress);
            }
        };
        HelpTip.prototype.showPopup = function (event) {
            if (this.showStyle === "") {
                this.showStyle = "visible";
                this.reposition();
                if (event) {
                    event.stopPropagation();
                }
            }
        };
        HelpTip.prototype.hidePopup = function (event) {
            if (this.showStyle === "visible") {
                this.showStyle = "";
                if (this.popup) {
                    this.popup.style.left = "";
                    this.popup.style.top = "";
                }
                if (event) {
                    event.stopPropagation();
                }
            }
        };
        HelpTip.prototype.reposition = function () {
            var _this = this;
            if (this.mainControl && this.popup && this._scrollableParent) {
                this.popup.style.transformOrigin = "100% 0%";
                /* keep updating the position as the scale transforms finish */
                var counter_1 = 0;
                var doTransformLeft_1 = false;
                var doTransformTop_1 = false;
                var originSet_1 = false;
                var timerId_1 = threading_1.Threading.startTimer(function () {
                    if (!_this._scrollableParent || !_this.popup || !_this.mainControl) {
                        threading_1.Threading.stopTimer(timerId_1);
                    }
                    else {
                        var scrollRect = _this._scrollableParent.getBoundingClientRect();
                        var popupRect = _this.popup.getBoundingClientRect();
                        var mainRect = _this.mainControl.getBoundingClientRect();
                        if (popupRect.bottom > scrollRect.bottom ||
                            popupRect.left < scrollRect.right ||
                            doTransformLeft_1 || doTransformTop_1) {
                            var transformLeft = "100%";
                            var transformTop = "0%";
                            if (popupRect.bottom > scrollRect.bottom || doTransformTop_1) {
                                doTransformTop_1 = true;
                                _this.popup.style.top = "-" + (popupRect.height + mainRect.height + 5) + "px";
                                transformTop = "100%";
                            }
                            if (popupRect.left < scrollRect.left || doTransformLeft_1) {
                                doTransformLeft_1 = true;
                                _this.popup.style.left = "0px";
                                transformLeft = "0%";
                            }
                            if (!originSet_1) {
                                originSet_1 = true;
                                _this.popup.style.transformOrigin = transformLeft + " " + transformTop;
                            }
                        }
                        counter_1++;
                        if (counter_1 === 30) {
                            threading_1.Threading.stopTimer(timerId_1);
                        }
                    }
                }, 10);
            }
        };
        HelpTip.prototype.findScrollableParent = function (node) {
            if (node === null) {
                return null;
            }
            if (node.classList && node.classList.contains("help-tip-container")) {
                return node;
            }
            else {
                return this.findScrollableParent(node.parentElement);
            }
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], HelpTip.prototype, "content", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], HelpTip.prototype, "icon", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], HelpTip.prototype, "iconClass", void 0);
        HelpTip = __decorate([
            aurelia_framework_1.customElement("help-tip"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLElement])
        ], HelpTip);
        return HelpTip;
    }());
    exports.HelpTip = HelpTip;
});

//# sourceMappingURL=helpTip.js.map
