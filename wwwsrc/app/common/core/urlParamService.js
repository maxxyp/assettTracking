define(["require", "exports", "./models/baseException"], function (require, exports, baseException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UrlParamService = /** @class */ (function () {
        function UrlParamService() {
        }
        // supports construction of query params by adding params prefixed with ? e.g. ?env: red
        UrlParamService.getParamEndpoint = function (endPoint, params) {
            var endPointWithVariables = endPoint;
            if (params) {
                var queryParamParts = [];
                for (var id in params) {
                    if (params[id]) {
                        var subParam = "{" + id + "}";
                        if (endPointWithVariables.indexOf(subParam) >= 0 && id.indexOf("?") !== 0) {
                            endPointWithVariables = endPointWithVariables.replace(subParam, encodeURIComponent(params[id]));
                        }
                        else if (id.indexOf("?") === 0) {
                            queryParamParts.push(encodeURIComponent(id.substring(1)) + "=" + encodeURIComponent(params[id]));
                        }
                        else {
                            throw new baseException_1.BaseException(this, "getParamEndpoint", "Substitute parameter name does not exist '{0}'", [subParam], null);
                        }
                    }
                }
                if (queryParamParts.length > 0) {
                    endPointWithVariables = endPointWithVariables + "?" + queryParamParts.join("&");
                }
            }
            return endPointWithVariables;
        };
        return UrlParamService;
    }());
    exports.UrlParamService = UrlParamService;
});

//# sourceMappingURL=urlParamService.js.map
