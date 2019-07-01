define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BrowserLocalStorage = /** @class */ (function () {
        function BrowserLocalStorage() {
        }
        BrowserLocalStorage.prototype.get = function (container, key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var ret = null;
                var data = window.localStorage.getItem(_this.calcId(container, key));
                if (data) {
                    ret = JSON.parse(data);
                }
                resolve(ret);
            });
        };
        BrowserLocalStorage.prototype.set = function (container, key, data) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                window.localStorage.setItem(_this.calcId(container, key), JSON.stringify(data));
                resolve();
            });
        };
        BrowserLocalStorage.prototype.remove = function (container, key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                window.localStorage.removeItem(_this.calcId(container, key));
                resolve();
            });
        };
        BrowserLocalStorage.prototype.clear = function () {
            return new Promise(function (resolve, reject) {
                window.localStorage.clear();
                resolve();
            });
        };
        BrowserLocalStorage.prototype.calcId = function (container, key) {
            return container + "_" + key;
        };
        return BrowserLocalStorage;
    }());
    exports.BrowserLocalStorage = BrowserLocalStorage;
});

//# sourceMappingURL=browserLocalStorage.js.map
