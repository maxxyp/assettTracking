/// <reference path="../../../../../../../typings/app.d.ts" />

import {TextValue} from "../../../../../../../app/common/geo/google/wua/models/textValue";

describe("the TextValue module", () => {
    let textValue: TextValue;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        textValue = new TextValue();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(textValue).toBeDefined();
    });
});
