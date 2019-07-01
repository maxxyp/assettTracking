var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../business/services/catalogService"], function (require, exports, aurelia_framework_1, catalogService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CatalogLookup = /** @class */ (function () {
        function CatalogLookup(catalogService) {
            this._catalogService = catalogService;
        }
        CatalogLookup.prototype.catalogChanged = function () {
            this.updateDisplay();
        };
        CatalogLookup.prototype.keyFieldChanged = function () {
            this.updateDisplay();
        };
        CatalogLookup.prototype.descriptionFieldChanged = function () {
            this.updateDisplay();
        };
        CatalogLookup.prototype.valueChanged = function () {
            this.updateDisplay();
        };
        CatalogLookup.prototype.splitIndexChanged = function () {
            this.updateDisplay();
        };
        CatalogLookup.prototype.updateDisplay = function () {
            var _this = this;
            this.display = this.value;
            if (this.catalog && this.keyField && this.descriptionField && this.value) {
                var keyFields = void 0;
                var values = void 0;
                if (this.keyField.indexOf("|") > 0) {
                    keyFields = this.keyField.split("|");
                }
                else {
                    keyFields = [this.keyField];
                }
                if (this.value.indexOf("|") > 0) {
                    values = this.value.split("|");
                }
                else {
                    values = [this.value];
                }
                this._catalogService.getItemDescription(this.catalog, keyFields, values, this.descriptionField)
                    .then(function (description) {
                    if (description) {
                        if (_this.splitIndex !== undefined) {
                            // this is the extra long hyphen
                            var splitParts = description.split("–");
                            if (splitParts.length === 1) {
                                // regular hyphen
                                splitParts = description.split("–");
                            }
                            if (splitParts.length > _this.splitIndex) {
                                _this.display = splitParts[_this.splitIndex].trim();
                            }
                            else {
                                _this.display = description;
                            }
                        }
                        else {
                            _this.display = description;
                        }
                    }
                })
                    .catch(function () { });
            }
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], CatalogLookup.prototype, "catalog", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], CatalogLookup.prototype, "keyField", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], CatalogLookup.prototype, "descriptionField", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Number)
        ], CatalogLookup.prototype, "splitIndex", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], CatalogLookup.prototype, "value", void 0);
        CatalogLookup = __decorate([
            aurelia_framework_1.inject(catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object])
        ], CatalogLookup);
        return CatalogLookup;
    }());
    exports.CatalogLookup = CatalogLookup;
});

//# sourceMappingURL=catalogLookup.js.map
