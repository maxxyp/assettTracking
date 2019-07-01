/// <reference path="../../../../../typings/app.d.ts" />

import {FormControllerElement} from "../../../../../app/common/ui/attributes/formControllerElement";

describe("the FormControllerElement module", () => {
    let formControllerElement: FormControllerElement;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        formControllerElement = new FormControllerElement();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(formControllerElement).toBeDefined();
    });
});
