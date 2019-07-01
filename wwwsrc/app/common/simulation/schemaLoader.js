var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "tv4", "../core/services/assetService"], function (require, exports, aurelia_framework_1, tv4, assetService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SchemaLoader = /** @class */ (function () {
        function SchemaLoader(assetService) {
            this._loaded = false;
            this._assetService = assetService;
        }
        SchemaLoader.prototype.getSchema = function (name) {
            if (this._loaded) {
                return Promise.resolve(tv4.getSchema(name));
            }
            return this.loadAllSchemas().then(function () {
                return tv4.getSchema(name);
            });
        };
        SchemaLoader.prototype.loadAllSchemas = function () {
            var _this = this;
            return this._assetService.loadJson("schemas/schemaList.json")
                .then(function (preload) {
                return Promise.all(preload.map(function (schemaName) {
                    return _this._assetService.loadJson("schemas/" + schemaName);
                }));
            })
                .then(function (schemas) {
                schemas.forEach(function (schema) {
                    /* if a schema was invalid json the loadJson will return null, so don't add it to tv4 */
                    if (schema) {
                        tv4.addSchema(schema);
                    }
                });
                _this._loaded = true;
            });
        };
        SchemaLoader = __decorate([
            aurelia_framework_1.inject(assetService_1.AssetService),
            __metadata("design:paramtypes", [Object])
        ], SchemaLoader);
        return SchemaLoader;
    }());
    exports.SchemaLoader = SchemaLoader;
});

//# sourceMappingURL=schemaLoader.js.map
