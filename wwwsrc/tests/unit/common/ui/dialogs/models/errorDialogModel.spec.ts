/// <reference path="../../../../../../typings/app.d.ts" />

import {ErrorDialogModel} from "../../../../../../app/common/ui/dialogs/models/errorDialogModel";

describe("the ErrorDialogModel module", () => {
    let sandbox: Sinon.SinonSandbox;
    let errorDialogModel: ErrorDialogModel;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        errorDialogModel = new ErrorDialogModel();
        expect(errorDialogModel).toBeDefined();
    });
});
