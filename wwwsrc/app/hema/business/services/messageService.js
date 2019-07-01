var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-framework", "../models/message", "aurelia-event-aggregator", "./constants/messageServiceConstants", "./storageService", "moment"], function (require, exports, aurelia_framework_1, message_1, aurelia_event_aggregator_1, messageServiceConstants_1, storageService_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageService = /** @class */ (function () {
        function MessageService(eventAggregator, storageService) {
            this._eventAggregator = eventAggregator;
            this._storageService = storageService;
            this.unreadCount = 0;
        }
        MessageService.prototype.initialise = function () {
            return this.archive();
        };
        MessageService.prototype.getLiveMessages = function () {
            return this.getMessages().filter(function (m) { return !m.deleted; });
        };
        MessageService.prototype.updateMessages = function (memos) {
            var _this = this;
            // currently no duplicates allowed until unique id is resolved
            if (!memos || !(memos instanceof Array)) {
                return Promise.resolve();
            }
            return this.getMessages()
                .then(function (messages) {
                memos.forEach(function (memo) {
                    if (_this.memoShouldBeAdded(memo, messages)) {
                        messages.push(new message_1.Message(memo.id, memo.memo));
                    }
                });
                _this._lastUpdated = new Date();
                return messages;
            })
                .then(function (messages) { return _this.saveMessages(messages); });
        };
        MessageService.prototype.markAsRead = function (message) {
            var _this = this;
            return this.getMessages()
                .then(function (messages) {
                var storedMessage = messages.find(function (m) { return m.id === message.id; });
                if (storedMessage) {
                    storedMessage.read = true;
                }
                return messages;
            })
                .then(function (messages) { return _this.saveMessages(messages); });
        };
        MessageService.prototype.delete = function (message) {
            var _this = this;
            return this.getMessages()
                .then(function (messages) { return messages.filter(function (m) { return m.id !== message.id; }); })
                .then(function (messages) { return _this.saveMessages(messages); });
        };
        MessageService.prototype.deleteRead = function () {
            var _this = this;
            return this.getMessages()
                .then(function (messages) {
                messages.forEach(function (m) {
                    if (m.read) {
                        m.deleted = true;
                    }
                });
                return messages;
            })
                .then(function (messages) { return _this.saveMessages(messages); });
        };
        MessageService.prototype.lastUpdated = function () {
            return Promise.resolve(this._lastUpdated);
        };
        MessageService.prototype.getMessages = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._storageService.getMessages()];
                        case 1: return [2 /*return*/, (_a.sent()) || []];
                    }
                });
            });
        };
        MessageService.prototype.saveMessages = function (messages) {
            var _this = this;
            return this._storageService.setMessages(messages)
                .then(function () { return _this.updateUnreadCount(); })
                .then(function () { return _this._eventAggregator.publish(messageServiceConstants_1.MessageServiceConstants.MESSAGE_SERVICE_UPDATED, _this.unreadCount); });
        };
        MessageService.prototype.archive = function () {
            var _this = this;
            return this.getMessages()
                .then(function (messages) { return messages.filter(function (message) { return moment().diff(moment(message.date), "days") < 1; }); })
                .then(function (messages) { return _this.saveMessages(messages); });
        };
        MessageService.prototype.memoShouldBeAdded = function (memo, messages) {
            return (memo.id && memo.memo && memo.memo.length > 0 && !messages.find(function (m) { return m.id === memo.id; }));
        };
        MessageService.prototype.updateUnreadCount = function () {
            var _this = this;
            return this.getLiveMessages().then(function (messages) { _this.unreadCount = messages.filter(function (m) { return m.read === false && m.deleted === false; }).length; });
        };
        MessageService = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, storageService_1.StorageService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, Object])
        ], MessageService);
        return MessageService;
    }());
    exports.MessageService = MessageService;
});

//# sourceMappingURL=messageService.js.map
