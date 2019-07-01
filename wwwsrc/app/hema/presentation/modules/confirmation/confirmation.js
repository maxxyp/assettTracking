var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dialog", "aurelia-dependency-injection"], function (require, exports, aurelia_dialog_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Confirmation = /** @class */ (function () {
        function Confirmation(controller) {
            this.controller = controller;
        }
        Confirmation.prototype.activate = function (params) {
            this.title = params.title;
            this.message = params.message;
            this.yesLabel = params.yesLabel;
            this.noLabel = params.noLabel;
        };
        Confirmation = __decorate([
            aurelia_dependency_injection_1.inject(aurelia_dialog_1.DialogController),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
        ], Confirmation);
        return Confirmation;
    }());
    exports.Confirmation = Confirmation;
});

//# sourceMappingURL=confirmation.js.map
