/// <reference path="../../../../../typings/app.d.ts" />

import {ErrorDialog} from "../../../../../app/common/ui/dialogs/errorDialog";
import {DialogController} from "aurelia-dialog";

describe("the ErrorDialog module", () => {
    let sandbox: Sinon.SinonSandbox;
    let errorDialog: ErrorDialog;
    let dialogController: DialogController;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        dialogController = <DialogController>{};
        dialogController.settings = { lock: false, centerHorizontalOnly: false, model: { isComplete: false } };
        dialogController.close = (ok, result) => { closed = true; return null; };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created with no controller", () => {
        errorDialog = new ErrorDialog(null);
        expect(errorDialog).toBeDefined();
    });

    it("can be created with a controller", () => {
        errorDialog = new ErrorDialog(dialogController);
        expect(errorDialog).toBeDefined();
    });
    
});
