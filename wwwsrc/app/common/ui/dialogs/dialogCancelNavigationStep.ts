import {Redirect, NavigationInstruction, AppRouter, Router} from "aurelia-router";
import {DialogService} from "aurelia-dialog";
import {Next} from "aurelia-router";
import {inject} from "aurelia-framework";

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
@inject(DialogService, AppRouter)
export class DialogCancelNavigationStep {

    private _dialogService: DialogService;
    private _router: Router;

    /**
     *
     * @param dialogService
     */
    constructor(dialogService: DialogService, router: Router) {
        this._dialogService = dialogService;
        this._router = router;
    }

    /**
     *
     * @param navigationInstruction
     * @param next
     * @returns {any}
     */
    public run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        let activeDialogs = this._dialogService.hasActiveDialog && this._dialogService.controllers;
        if (!!activeDialogs && activeDialogs.length > 0) {
            let cancelNavigation = next.cancel(new Redirect(this._router.currentInstruction.fragment, {
                trigger: false,
                replace: false
            }));

            return Promise.all(activeDialogs.map(ctrl => ctrl.cancel(true)))
                .finally(() => cancelNavigation);
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
    }
}
