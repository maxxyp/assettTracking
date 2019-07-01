define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HemaStorage = /** @class */ (function () {
        function HemaStorage() {
        }
        HemaStorage.prototype.get = function (container, key) {
            var ret = undefined;
            var data = window.localStorage.getItem(this.calcId(container, key));
            if (data) {
                try {
                    ret = JSON.parse(data);
                }
                catch (e) {
                    return Promise.reject(e);
                }
            }
            return Promise.resolve(ret);
        };
        HemaStorage.prototype.set = function (container, key, data) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (data === undefined || data === null) {
                    window.localStorage.removeItem(_this.calcId(container, key));
                }
                else {
                    window.localStorage.setItem(_this.calcId(container, key), JSON.stringify(data));
                }
                resolve();
            });
        };
        HemaStorage.prototype.getSynchronous = function (container, key) {
            var data = window.localStorage.getItem(this.calcId(container, key));
            return data ? JSON.parse(data) : undefined;
        };
        HemaStorage.prototype.setSynchronous = function (container, key, data) {
            if (data === undefined || data === null) {
                window.localStorage.removeItem(this.calcId(container, key));
            }
            else {
                window.localStorage.setItem(this.calcId(container, key), JSON.stringify(data));
            }
        };
        HemaStorage.prototype.remove = function (container, key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                window.localStorage.removeItem(_this.calcId(container, key));
                resolve();
            });
        };
        HemaStorage.prototype.clear = function () {
            return new Promise(function (resolve, reject) {
                var archiveKey = "db:archive:archive"; // horrible kludge
                var archive = window.localStorage.getItem(archiveKey);
                window.localStorage.clear();
                if (archive) {
                    window.localStorage.setItem(archiveKey, archive);
                }
                resolve();
            });
        };
        HemaStorage.prototype.calcId = function (container, key) {
            return container + "_" + key;
        };
        return HemaStorage;
    }());
    exports.HemaStorage = HemaStorage;
});

//# sourceMappingURL=hemaStorage.js.map
