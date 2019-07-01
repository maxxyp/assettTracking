/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-dialog", "../dialogs/busyDialog", "../dialogs/models/busyDialogModel"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, busyDialog_1, busyDialogModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModalBusyService = /** @class */ (function () {
        function ModalBusyService(dialogService) {
            this._dialogService = dialogService;
            this._model = new busyDialogModel_1.BusyDialogModel();
            this._contextMessages = {};
            this._model.isComplete = true;
        }
        ModalBusyService.prototype.showBusy = function (context, message, linkMessage, linkCallback) {
            var _this = this;
            var isNew = false;
            if (!this._contextMessages[context]) {
                isNew = true;
            }
            this._contextMessages[context] = message;
            this._model.linkMessage = linkMessage;
            this._model.linkCallback = linkCallback;
            if (this.updateMessages() === 1 && isNew) {
                this._model.isComplete = false;
                return this._dialogService.openAndYieldController({ viewModel: busyDialog_1.BusyDialog, model: this._model })
                    .then(function (controller) {
                    _this._dialogController = controller;
                });
            }
            return Promise.resolve();
        };
        ModalBusyService.prototype.hideBusy = function (context) {
            var _this = this;
            if (this._contextMessages[context]) {
                delete this._contextMessages[context];
            }
            if (this.updateMessages() === 0 && this._dialogController && this._dialogService.hasActiveDialog) {
                return this._dialogController.close(true, null)
                    .then(function () {
                    _this._model.isComplete = true;
                });
            }
            return Promise.resolve();
        };
        ModalBusyService.prototype.updateMessages = function () {
            var messages = [];
            for (var contextKey in this._contextMessages) {
                messages.push(this._contextMessages[contextKey]);
            }
            this._model.message = messages.join("<br/>");
            return messages.length;
        };
        ModalBusyService = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogService),
            aurelia_framework_1.singleton(),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogService])
        ], ModalBusyService);
        return ModalBusyService;
    }());
    exports.ModalBusyService = ModalBusyService;
});

//# sourceMappingURL=modalBusyService.js.map
