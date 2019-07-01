/// <reference path="../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NamedRedirect = /** @class */ (function () {
        function NamedRedirect(name, params, options) {
            this._name = name;
            this._params = params;
            this._options = options;
        }
        NamedRedirect.prototype.setRouter = function (router) {
            this._childRouter = router;
        };
        NamedRedirect.prototype.navigate = function (appRouter) {
            var _this = this;
            var router = this._options && this._options.useChildRouter && this._childRouter
                ? this._childRouter
                : appRouter;
            return new Promise(function (resolve, reject) {
                if (_this._name) {
                    var url = router.generate(_this._name, _this._params);
                    resolve(router.navigate(url, _this._options));
                }
                else {
                    resolve(router.navigate("", _this._options));
                }
            });
        };
        return NamedRedirect;
    }());
    exports.NamedRedirect = NamedRedirect;
});

//# sourceMappingURL=namedRedirect.js.map
