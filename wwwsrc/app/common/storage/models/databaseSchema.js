define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DatabaseSchema = /** @class */ (function () {
        function DatabaseSchema(name, version, storeSchemas) {
            this.name = name;
            this.version = version;
            this.storeSchemas = storeSchemas;
        }
        return DatabaseSchema;
    }());
    exports.DatabaseSchema = DatabaseSchema;
});

//# sourceMappingURL=databaseSchema.js.map
