define(["require", "exports", "aurelia-history", "./historyWua"], function (require, exports, aurelia_history_1, historyWua_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.singleton(aurelia_history_1.History, historyWua_1.HistoryWua);
    }
    exports.configure = configure;
});

//# sourceMappingURL=index.js.map
