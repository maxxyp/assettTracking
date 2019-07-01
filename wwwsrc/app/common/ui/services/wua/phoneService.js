define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PhoneService = /** @class */ (function () {
        function PhoneService() {
            if (window.Windows && window.Windows.ApplicationModel) {
                this._appModel = window.Windows.ApplicationModel;
            }
        }
        PhoneService.prototype.hasPhone = function () {
            return Promise.resolve(!!this._appModel.Calls.PhoneCallManager);
        };
        PhoneService.prototype.showPhoneCallUI = function (phone, name) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this._appModel) {
                    if (_this._appModel.Calls && _this._appModel.Calls.PhoneCallManager) {
                        try {
                            _this._appModel.Calls.PhoneCallManager.showPhoneCallUI(phone, name);
                            resolve(true);
                        }
                        catch (err) {
                            resolve(false);
                        }
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            });
        };
        PhoneService.prototype.showPhoneSMSUI = function (recipientsPhone, message) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this._appModel) {
                    if (_this._appModel.Chat &&
                        _this._appModel.Chat.ChatMessage &&
                        _this._appModel.Chat.ChatMessageManager) {
                        var chatMessage = new _this._appModel.Chat.ChatMessage();
                        chatMessage.body = message;
                        for (var i = 0; i < recipientsPhone.length; i++) {
                            chatMessage.recipients.push(recipientsPhone[i]);
                        }
                        _this._appModel.Chat.ChatMessageManager.showComposeSmsMessageAsync(chatMessage)
                            .then(function () {
                            resolve(true);
                        }).catch(function () {
                            resolve(false);
                        });
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            });
        };
        return PhoneService;
    }());
    exports.PhoneService = PhoneService;
});

//# sourceMappingURL=phoneService.js.map
