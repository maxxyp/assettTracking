/// <reference path="../../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttributeBase = /** @class */ (function () {
        function AttributeBase(element) {
            var _this = this;
            this._element = element;
            this._keyDown = function (event) {
                if (!_this.eventKeyIsValid(event)) {
                    event.preventDefault();
                }
            };
            this._paste = function (event) {
                if (!_this.clipboardIsValid(event)) {
                    event.preventDefault();
                }
            };
        }
        AttributeBase.prototype.attached = function () {
            this._element.addEventListener("keydown", this._keyDown);
            this._element.addEventListener("paste", this._paste);
        };
        AttributeBase.prototype.detached = function () {
            this._element.removeEventListener("keydown", this._keyDown);
            this._element.removeEventListener("paste", this._paste);
        };
        AttributeBase.prototype.defineKeyType = function (event) {
            var keyType;
            if (this.keyboardEventIsNumerical(event)) {
                keyType = AttributeBase.NUMERICAL;
            }
            else if (this.keyboardEventIsDecimalMark(event)) {
                keyType = AttributeBase.DECIMALMARK;
            }
            else if (this.keyboardEventIsControl(event)) {
                keyType = AttributeBase.CONTROL;
            }
            return keyType;
        };
        AttributeBase.prototype.exceedsMaxLength = function (maxLength, addLength) {
            return this.exceedsMax(this.numericalLengthOfElement(), maxLength, addLength);
        };
        AttributeBase.prototype.exceedsMaxDecimalPlaces = function (maxLength, valueMask) {
            return maxLength && this.calculateDecimalPlaceValues(valueMask) > maxLength;
        };
        AttributeBase.prototype.exceedsMaxWholePlaces = function (maxLength, valueMask) {
            return maxLength && this.calculateWholePlaceValues(valueMask) > maxLength;
        };
        AttributeBase.prototype.keyboardEventIsNumerical = function (event) {
            return ((event.which >= 48 && event.which <= 57 && !event.shiftKey) || /* Digits */
                (event.which >= 96 && event.which <= 105) /* NumPad */);
        };
        AttributeBase.prototype.keyboardEventIsDecimalMark = function (event) {
            return (event.which === 190 || event.which === 110);
        };
        AttributeBase.prototype.keyboardEventIsControl = function (event) {
            return (event.which === 8 || /* Backspace */
                event.which === 9 || /* Tab */
                event.which === 46 || /* Delete */
                event.which === 35 || /* End */
                event.which === 36 || /* Home */
                event.which === 37 || /* Left arrow */
                event.which === 39 || /* right arrow */
                (event.which === 67 && event.ctrlKey) || /* Ctrl-C copy */
                (event.which === 88 && event.ctrlKey) || /* Ctrl-X cut */
                (event.which === 86 && event.ctrlKey) || /* Ctrl-V paste */
                (event.which === 65 && event.ctrlKey) || /* Ctrl-A select all */
                (event.which === 45 && event.shiftKey) /* Shift-Insert paste */);
        };
        AttributeBase.prototype.valueMaskFromKeyType = function (keyType) {
            if (this._element && this._element.value !== undefined) {
                var selectionStart = 0;
                var selectionEnd = 0;
                try {
                    selectionStart = this._element.selectionStart || this._element.value.length;
                    selectionEnd = this._element.selectionEnd || this._element.value.length;
                }
                catch (e) {
                    selectionStart = this._element.value.length;
                    selectionEnd = this._element.value.length;
                }
                var firstPart = this._element.value.substring(0, selectionStart);
                var lastPart = this._element.value.substring(selectionEnd, this._element.value.length);
                var newKey = keyType === AttributeBase.DECIMALMARK ? "." : "9";
                return firstPart + newKey + lastPart;
            }
            else {
                return "";
            }
        };
        AttributeBase.prototype.valueMaskFromClipboardData = function (clipboardData) {
            if (this._element && this._element.value !== undefined) {
                var selectionStart = 0;
                var selectionEnd = 0;
                try {
                    selectionStart = this._element.selectionStart || this._element.value.length;
                    selectionEnd = this._element.selectionEnd || this._element.value.length;
                }
                catch (e) {
                    selectionStart = this._element.value.length;
                    selectionEnd = this._element.value.length;
                }
                var firstPart = this._element.value.substring(0, selectionStart);
                var lastPart = this._element.value.substring(selectionEnd, this._element.value.length);
                return firstPart + clipboardData + lastPart;
            }
            else {
                return "";
            }
        };
        AttributeBase.prototype.exceedsMax = function (currentLength, maxLength, addLength) {
            var exceeds = false;
            if (maxLength) {
                var selectionLength = 0;
                try {
                    selectionLength = this._element.selectionEnd && this._element.selectionStart ?
                        this._element.selectionEnd - this._element.selectionStart : 0;
                }
                catch (e) {
                }
                var newLength = void 0;
                if (selectionLength === 0) {
                    newLength = currentLength + addLength;
                }
                else {
                    newLength = (currentLength - selectionLength) + addLength;
                }
                if (newLength > maxLength) {
                    exceeds = true;
                }
            }
            return exceeds;
        };
        AttributeBase.prototype.numericalLengthOfElement = function () {
            if (this._element && this._element.value !== undefined) {
                return this._element.value.replace(/\D/g, "").length;
            }
            else {
                return 0;
            }
        };
        AttributeBase.prototype.calculateDecimalPlaceValues = function (value) {
            var actualDecimalPlaces = 0;
            var decimalPointIndex = value.indexOf(".");
            if (decimalPointIndex !== -1) {
                actualDecimalPlaces = value.length - decimalPointIndex - 1;
            }
            return actualDecimalPlaces;
        };
        AttributeBase.prototype.calculateWholePlaceValues = function (value) {
            var actualWholePlaces = value.length;
            var decimalPointIndex = value.indexOf(".");
            if (decimalPointIndex !== -1) {
                actualWholePlaces = decimalPointIndex;
            }
            return actualWholePlaces;
        };
        AttributeBase.NUMERICAL = "numerical";
        AttributeBase.DECIMALMARK = "decimalmark";
        AttributeBase.CONTROL = "control";
        return AttributeBase;
    }());
    exports.AttributeBase = AttributeBase;
});

//# sourceMappingURL=attributeBase.js.map
