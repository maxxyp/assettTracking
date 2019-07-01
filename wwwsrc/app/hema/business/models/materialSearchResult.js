define(["require", "exports", "./materialSearchResultLocal", "./materialSearchResultOnline"], function (require, exports, materialSearchResultLocal_1, materialSearchResultOnline_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MaterialSearchResult = /** @class */ (function () {
        function MaterialSearchResult() {
            this.local = new materialSearchResultLocal_1.MaterialSearchResultLocal();
            this.online = new materialSearchResultOnline_1.MaterialSearchResultOnline();
        }
        return MaterialSearchResult;
    }());
    exports.MaterialSearchResult = MaterialSearchResult;
});

//# sourceMappingURL=materialSearchResult.js.map
