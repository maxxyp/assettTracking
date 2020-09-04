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
define(["require", "exports", "./dataStateProvider", "./dataState"], function (require, exports, dataStateProvider_1, dataState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceOtherSafety = /** @class */ (function (_super) {
        __extends(ApplianceOtherSafety, _super);
        function ApplianceOtherSafety() {
            return _super.call(this, dataState_1.DataState.dontCare, "appliances") || this;
        }
        return ApplianceOtherSafety;
    }(dataStateProvider_1.DataStateProvider));
    exports.ApplianceOtherSafety = ApplianceOtherSafety;
});

//# sourceMappingURL=applianceOtherSafety.js.map