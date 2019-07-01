var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "./constants/uiConstants", "../../core/services/models/log"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, uiConstants_1, log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LogConsole = /** @class */ (function () {
        function LogConsole(ea) {
            var _this = this;
            this._ea = ea;
            this.logs = [];
            this.hiddenLog = "";
            this._ea.subscribe(uiConstants_1.UiConstants.LOG_PUBLISHED, function (logs) { return _this.updateLog(logs); });
        }
        LogConsole.prototype.attached = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.clearHiddenText();
                resolve();
            });
        };
        LogConsole.prototype.copy = function () {
            var _this = this;
            return new Promise(function (resolve, rejcet) {
                if (_this.populateHiddenText(_this.logs)) {
                    _this.hiddenText.select();
                    try {
                        var supported = document.queryCommandSupported("copy");
                        if (supported) {
                            document.execCommand("copy");
                        }
                        _this.clearHiddenText();
                        resolve();
                    }
                    catch (err) {
                        _this.clearHiddenText();
                        resolve();
                    }
                }
                else {
                    resolve();
                }
            });
        };
        LogConsole.prototype.clear = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.logs = [];
                var log = new log_1.Log();
                _this.logs.push(log);
                resolve();
            });
        };
        LogConsole.prototype.updateLog = function (logs) {
            for (var i = 0; i < logs.length; i++) {
                this.logs.push(logs[i]);
            }
        };
        LogConsole.prototype.clearHiddenText = function () {
            if (this.hiddenText) {
                this.hiddenText.innerText = " ";
            }
        };
        LogConsole.prototype.populateHiddenText = function (logs) {
            var flag = false;
            if (this.hiddenText) {
                var log = "";
                for (var i = 0; i < logs.length; i++) {
                    if (logs[i]) {
                        log = log.concat(" " + logs[i].logText);
                    }
                }
                this.hiddenText.innerText = log;
                flag = true;
            }
            return flag;
        };
        LogConsole = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator),
            aurelia_framework_1.customElement("log-console"),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator])
        ], LogConsole);
        return LogConsole;
    }());
    exports.LogConsole = LogConsole;
});

//# sourceMappingURL=logConsole.js.map
