var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./buttonListItem"], function (require, exports, buttonListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IconButtonListItem = /** @class */ (function (_super) {
        __extends(IconButtonListItem, _super);
        function IconButtonListItem(text, value, disabled, iconClassName) {
            var _this = _super.call(this, text, value, disabled) || this;
            _this.iconClassName = iconClassName;
            return _this;
        }
        return IconButtonListItem;
    }(buttonListItem_1.ButtonListItem));
    exports.IconButtonListItem = IconButtonListItem;
});

//# sourceMappingURL=iconButtonListItem.js.map
