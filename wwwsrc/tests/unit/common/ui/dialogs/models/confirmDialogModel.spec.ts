/// <reference path="../../../../../../typings/app.d.ts" />

import {ConfirmDialogModel} from "../../../../../../app/common/ui/dialogs/models/confirmDialogModel";

describe("the ConfirmDialogModel module", () => {
    let sandbox: Sinon.SinonSandbox;
    let confirmDialogModel: ConfirmDialogModel;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        confirmDialogModel = new ConfirmDialogModel();
        expect(confirmDialogModel).toBeDefined();
    });
});
