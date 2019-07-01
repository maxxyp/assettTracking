/// <reference path="../../../../../../typings/app.d.ts" />

import {InfoDialogModel} from "../../../../../../app/common/ui/dialogs/models/infoDialogModel";

describe("the InfoDialogModel module", () => {
    let sandbox: Sinon.SinonSandbox;
    let infoDialogModel: InfoDialogModel;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        infoDialogModel = new InfoDialogModel("Title", "Messaqe");
        expect(infoDialogModel).toBeDefined();
    });
});
