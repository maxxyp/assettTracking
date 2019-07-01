/// <reference path="../../../../../../typings/app.d.ts" />

import {BusyDialogModel} from "../../../../../../app/common/ui/dialogs/models/busyDialogModel";

describe("the BusyDialogModel module", () => {
    let sandbox: Sinon.SinonSandbox;
    let busyDialogModel: BusyDialogModel;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        busyDialogModel = new BusyDialogModel();
        expect(busyDialogModel).toBeDefined();
    });
});
