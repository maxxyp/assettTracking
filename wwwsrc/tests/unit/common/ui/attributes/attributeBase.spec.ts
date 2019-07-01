/// <reference path="../../../../../typings/app.d.ts" />

import {AttributeBase} from "../../../../../app/common/ui/attributes/attributeBase";

describe("the AttributeBase module", () => {
    let attributeBase: AttributeBase;
    let sandbox: Sinon.SinonSandbox;
    let elementStub: HTMLInputElement;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        elementStub = <HTMLInputElement>{};
        attributeBase = AttributeBase.constructor.call(elementStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(attributeBase).toBeDefined();
    });
});
