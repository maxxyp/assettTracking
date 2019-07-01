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
    var UpdateDialog = /** @class */ (function () {
        function UpdateDialog(dialogController, bindingEngine) {
            this._subscriptions = [];
            this.controller = dialogController;
            this._bindingEngine = bindingEngine;
            if (this.controller) {
                this.controller.settings.lock = true;
                this.part = this.controller.settings.model.part;
                this.isEmptyQuantity = this.part.quantityCollected === 0;
                this.myVanAreas = this.controller.settings.model.myVanAreas;
            }
        }
        UpdateDialog.prototype.attached = function () {
            var _this = this;
            var quantityCollectedChanged = function (newVal, oldVal) {
                if (newVal === 0) {
                    _this.part.area = undefined;
                    _this.isEmptyQuantity = true;
                    return;
                }
                _this.isEmptyQuantity = false;
            };
            this._subscriptions.push(this._bindingEngine.propertyObserver(this.part, "quantityCollected")
                .subscribe(quantityCollectedChanged), this._bindingEngine.propertyObserver(this.part, "area")
                .subscribe(function () { return _this.checkArea(); }));
            this.checkArea();
        };
        UpdateDialog.prototype.detached = function () {
            (this._subscriptions || [])
                .forEach(function (subscription) {
                if (subscription) {
                    subscription.dispose();
                }
            });
        };
        UpdateDialog.prototype.toggleNoPartsCollected = function () {
            this.part.area = undefined;
            this.part.quantityCollected = this.part.quantityCollected === 0 ? this.part.quantityExpected : 0;
        };
        UpdateDialog.prototype.checkArea = function () {
            var isThereABadChar = this.part
                && this.part.area
                && this.part.area.match(/[^\x20-\x7E|\xA3]/g);
            this.isAreaValid = !isThereABadChar;
        };
        UpdateDialog = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController, aurelia_framework_1.BindingEngine),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController, aurelia_framework_1.BindingEngine])
        ], UpdateDialog);
        return UpdateDialog;
    }());
    exports.UpdateDialog = UpdateDialog;
});

//# sourceMappingURL=updateDialog.js.map
