/// <reference path="../../../../../../typings/app.d.ts" />

import {ReleaseNote} from "../../../../../../app/common/ui/views/models/releaseNote";

describe("the ReleaseNote module", () => {
    let releaseNote: ReleaseNote;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        releaseNote = new ReleaseNote();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(releaseNote).toBeDefined();
    });
});
