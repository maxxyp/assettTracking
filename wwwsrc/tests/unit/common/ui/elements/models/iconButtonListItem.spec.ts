/// <reference path="../../../../../../typings/app.d.ts" />

import {IconButtonListItem} from "../../../../../../app/common/ui/elements/models/iconButtonListItem";

describe("the IconButtonListItem module", () => {
    let iconButtonListItem: IconButtonListItem;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        iconButtonListItem = new IconButtonListItem("aaa", 1, false, "");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(iconButtonListItem).toBeDefined();
    });
});
