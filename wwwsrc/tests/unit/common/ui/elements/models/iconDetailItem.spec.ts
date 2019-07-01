/// <reference path="../../../../../../typings/app.d.ts" />

import {IconDetailItem} from "../../../../../../app/common/ui/elements/models/iconDetailItem";

describe("the IconDetailItem module", () => {
    let iconDetailItem: IconDetailItem;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        iconDetailItem = new IconDetailItem("");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(iconDetailItem).toBeDefined();
    });
});
