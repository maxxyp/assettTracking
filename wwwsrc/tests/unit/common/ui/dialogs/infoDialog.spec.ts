/// <reference path="../../../../../typings/app.d.ts" />

import {DialogController} from "aurelia-dialog";
import {InfoDialog} from "../../../../../app/common/ui/dialogs/infoDialog";

describe("the InfoDialog module", () => {
    let sandbox: Sinon.SinonSandbox;
    let infoDialog: InfoDialog;
    let dialogController: DialogController;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        dialogController = <DialogController>{};
        dialogController.settings = { lock: false, centerHorizontalOnly: false, model: { isComplete: false }};
        dialogController.close = (ok, result) => { closed = true; return null; };
        dialogController.cancel = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created with no controller", () => {
        infoDialog = new InfoDialog(null);
        expect(infoDialog).toBeDefined();
    });

    it("can be created with a controller", () => {
        infoDialog = new InfoDialog(dialogController);
        expect(infoDialog).toBeDefined();
    });

});
