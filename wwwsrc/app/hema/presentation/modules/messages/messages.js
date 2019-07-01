/// <reference path="../../../../../typings/app.d.ts" />
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/messageService", "../../../business/services/constants/messageServiceConstants"], function (require, exports, aurelia_framework_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, messageService_1, messageServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Messages = /** @class */ (function (_super) {
        __extends(Messages, _super);
        function Messages(labelService, eventAggregator, dialogService, messageService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._messageService = messageService;
            _this._subscription = _this._eventAggregator.subscribe(messageServiceConstants_1.MessageServiceConstants.MESSAGE_SERVICE_UPDATED, function (count) { return _this.updateMessages(); });
            return _this;
        }
        Messages.prototype.attachedAsync = function () {
            return this.updateMessages();
        };
        Messages.prototype.detachedAsync = function () {
            if (this._subscription) {
                this._subscription.dispose();
            }
            return Promise.resolve();
        };
        Messages.prototype.markAsRead = function (message) {
            this._messageService.markAsRead(message);
        };
        Messages.prototype.delete = function (message) {
            this._messageService.delete(message);
        };
        Messages.prototype.deleteRead = function () {
            this._messageService.deleteRead();
        };
        Messages.prototype.updateMessages = function () {
            var _this = this;
            return this._messageService.getLiveMessages()
                .then(function (messages) { _this.messages = messages; })
                .then(function () { return _this._messageService.lastUpdated(); })
                .then(function (lastUpdated) { _this.lastUpdated = lastUpdated; });
        };
        Messages = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, messageService_1.MessageService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object])
        ], Messages);
        return Messages;
    }(baseViewModel_1.BaseViewModel));
    exports.Messages = Messages;
});

//# sourceMappingURL=messages.js.map
