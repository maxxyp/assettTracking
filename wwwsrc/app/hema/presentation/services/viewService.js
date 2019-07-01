var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-router", "../models/editableViewModel", "aurelia-framework"], function (require, exports, aurelia_router_1, editableViewModel_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewService = /** @class */ (function () {
        function ViewService(router) {
            this._router = router;
        }
        ViewService.prototype.saveAll = function () {
            var vms = this.findViewModels(this._router.currentInstruction, editableViewModel_1.EditableViewModel);
            return Promise.all(vms.map(function (x) { return x.isNew ? null : x.save(); }))
                .return(null);
        };
        ViewService.prototype.findViewModels = function (navigationInstruction, withType) {
            var viewModels = [];
            var viewPortInstructions = navigationInstruction.viewPortInstructions;
            var defaultVP = viewPortInstructions && viewPortInstructions.default;
            if (defaultVP && defaultVP.component && defaultVP.component.viewModel && (!withType || defaultVP.component.viewModel instanceof withType)) {
                viewModels.push(defaultVP.component.viewModel);
            }
            if (defaultVP.childNavigationInstruction) {
                viewModels = viewModels.concat(this.findViewModels(defaultVP.childNavigationInstruction, withType));
            }
            return viewModels;
        };
        ViewService = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], ViewService);
        return ViewService;
    }());
    exports.ViewService = ViewService;
});

//# sourceMappingURL=viewService.js.map
