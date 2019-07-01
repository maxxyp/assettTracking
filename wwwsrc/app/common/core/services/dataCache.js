define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataCache = /** @class */ (function () {
        function DataCache() {
            this._cache = {};
        }
        DataCache.prototype.get = function (container, key) {
            var _this = this;
            return new Promise(function (resolve) {
                var ret = null;
                var itemId = _this.calcId(container, key);
                if (_this._cache[itemId]) {
                    ret = JSON.parse(_this._cache[itemId]);
                }
                resolve(ret);
            });
        };
        DataCache.prototype.set = function (container, key, data) {
            var _this = this;
            return new Promise(function (resolve) {
                var itemId = _this.calcId(container, key);
                _this._cache[itemId] = JSON.stringify(data);
                resolve();
            });
        };
        DataCache.prototype.remove = function (container, key) {
            var _this = this;
            return new Promise(function (resolve) {
                var itemId = _this.calcId(container, key);
                if (_this._cache[itemId]) {
                    delete _this._cache[itemId];
                }
                resolve();
            });
        };
        DataCache.prototype.clear = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this._cache = {};
                resolve();
            });
        };
        DataCache.prototype.calcId = function (container, key) {
            return container + "." + key;
        };
        return DataCache;
    }());
    exports.DataCache = DataCache;
});

//# sourceMappingURL=dataCache.js.map
