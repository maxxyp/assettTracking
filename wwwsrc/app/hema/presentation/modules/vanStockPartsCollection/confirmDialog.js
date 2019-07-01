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
    var ConfirmDialog = /** @class */ (function () {
        function ConfirmDialog(dialogController) {
            this.controller = dialogController;
            if (this.controller) {
                this.controller.settings.lock = true;
                this.model = this.controller.settings.model;
                this.qtyMissing = this.model.expected - this.model.collected;
                this.styleCollected = this.qtyMissing > 0 ? "color: red;" : "color: green";
                var partWork = function (qty) { return qty === 1 ? "part" : "parts"; };
                var _a = this, qtyMissing = _a.qtyMissing, model = _a.model;
                var collected = model.collected;
                this.summaryMessage = collected + " " + partWork(this.model.collected) + " collected / " + qtyMissing + " " + partWork(this.qtyMissing) + " missing";
            }
        }
        ConfirmDialog = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController, aurelia_framework_1.BindingEngine),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
        ], ConfirmDialog);
        return ConfirmDialog;
    }());
    exports.ConfirmDialog = ConfirmDialog;
});

//# sourceMappingURL=confirmDialog.js.map
