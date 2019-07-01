var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-dialog"], function (require, exports, aurelia_framework_1, aurelia_dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateVanStockItem = /** @class */ (function () {
        function UpdateVanStockItem(dialogController, bindingEngine) {
            this.controller = dialogController;
            this._bindingEngine = bindingEngine;
            if (this.controller) {
                this.controller.settings.lock = true;
                this.model = this.controller.settings.model;
            }
        }
        UpdateVanStockItem.prototype.attached = function () {
            var _this = this;
            this._subscription = this._bindingEngine.propertyObserver(this.model.material, "area")
                .subscribe(function () { return _this.checkArea(); });
            this.checkArea();
        };
        UpdateVanStockItem.prototype.detached = function () {
            if (this._subscription) {
                this._subscription.dispose();
            }
        };
        UpdateVanStockItem.prototype.checkArea = function () {
            var isThereABadChar = this.model
                && this.model.material
                && this.model.material.area
                && this.model.material.area.match(/[^\x20-\x7E|\xA3]/g);
            this.isAreaValid = !isThereABadChar;
        };
        UpdateVanStockItem = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController, aurelia_framework_1.BindingEngine),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController, aurelia_framework_1.BindingEngine])
        ], UpdateVanStockItem);
        return UpdateVanStockItem;
    }());
    exports.UpdateVanStockItem = UpdateVanStockItem;
});

//# sourceMappingURL=updateVanStockItem.js.map
