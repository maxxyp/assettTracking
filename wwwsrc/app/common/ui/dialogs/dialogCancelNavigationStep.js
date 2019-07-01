var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-router", "aurelia-dialog", "aurelia-framework"], function (require, exports, aurelia_router_1, aurelia_dialog_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This solution is based on https://github.com/aurelia/dialog/issues/96
     *
     * Use this to cancel the navigation and close the dialog box, for e.g. when the user presses back whilst a modal is
     * open
     *
     * Note: for now this has to be used in the authorize step for the pipeline at some point hoping we can use
     * another more meaningful step. See https://github.com/aurelia/router/issues/26 for more details re. authorize step
     *
     * this following needs to go in your router configuration for now
     *
     * routerConfiguration.addPipelineStep("authorize", DialogCloseStep);
     */
    var DialogCancelNavigationStep = /** @class */ (function () {
        /**
         *
         * @param dialogService
         */
        function DialogCancelNavigationStep(dialogService, router) {
            this._dialogService = dialogService;
            this._router = router;
        }
        /**
         *
         * @param navigationInstruction
         * @param next
         * @returns {any}
         */
        DialogCancelNavigationStep.prototype.run = function (navigationInstruction, next) {
            var activeDialogs = this._dialogService.hasActiveDialog && this._dialogService.controllers;
            if (!!activeDialogs && activeDialogs.length > 0) {
                var cancelNavigation_1 = next.cancel(new aurelia_router_1.Redirect(this._router.currentInstruction.fragment, {
                    trigger: false,
                    replace: false
                }));
                return Promise.all(activeDialogs.map(function (ctrl) { return ctrl.cancel(true); }))
                    .finally(function () { return cancelNavigation_1; });
            }
            return next();
            // if (this._dialogService.controllers && this._dialogService.controllers.length > 0) { // dialog is open
            //     // get the active controller
            //     let controller: DialogController = this._dialogService.controllers[0];
            //     // cancel the dialog
            //     if (controller) {
            //         let prom = next.cancel(new Redirect(this._router.currentInstruction.fragment, {
            //             trigger: false,
            //             replace: false
            //         }));
            //         let closePromise = controller.cancel(true);
            //         if (closePromise) {
            //             return closePromise.finally(() => prom);
            //             /* Try catch this in case the dialog has already been closed, calling close twice
            //                     triggers an exception in Aurelia dialog */
            //         } else {
            //             return prom;
            //         }
            //     }
            // }
            // return next();
        };
        DialogCancelNavigationStep = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogService, aurelia_router_1.AppRouter),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogService, aurelia_router_1.Router])
        ], DialogCancelNavigationStep);
        return DialogCancelNavigationStep;
    }());
    exports.DialogCancelNavigationStep = DialogCancelNavigationStep;
});

//# sourceMappingURL=dialogCancelNavigationStep.js.map
