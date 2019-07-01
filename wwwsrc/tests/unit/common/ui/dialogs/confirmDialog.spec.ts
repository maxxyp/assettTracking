/// <reference path="../../../../../typings/app.d.ts" />

import {ConfirmDialog} from "../../../../../app/common/ui/dialogs/confirmDialog";
import {DialogController} from "aurelia-dialog";

describe("the ConfirmDialog module", () => {
    let sandbox: Sinon.SinonSandbox;
    let confirmDialog: ConfirmDialog;
    let dialogController: DialogController;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        dialogController = <DialogController>{};
        dialogController.settings = { lock: false, centerHorizontalOnly: false, model: { isComplete: false }};
        dialogController.close = (ok, result) => { closed = true; return null; };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created with no controller", () => {
        confirmDialog = new ConfirmDialog(null);
        expect(confirmDialog).toBeDefined();
    });

    it("can be created with a controller", () => {
        confirmDialog = new ConfirmDialog(dialogController);
        expect(confirmDialog).toBeDefined();
    });

});
