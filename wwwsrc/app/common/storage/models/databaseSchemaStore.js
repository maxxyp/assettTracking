define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DatabaseSchemaStore = /** @class */ (function () {
        function DatabaseSchemaStore(name, keyPath, autoIncrement, indexes) {
            this.name = name;
            this.keyPath = keyPath;
            this.autoIncrement = autoIncrement;
            this.indexes = indexes;
        }
        return DatabaseSchemaStore;
    }());
    exports.DatabaseSchemaStore = DatabaseSchemaStore;
});

//# sourceMappingURL=databaseSchemaStore.js.map
