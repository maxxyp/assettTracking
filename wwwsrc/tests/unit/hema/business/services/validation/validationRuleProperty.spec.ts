/// <reference path="../../../../../../typings/app.d.ts" />

import {ValidationRuleProperty} from "../../../../../../app/hema/business/services/validation/validationRuleProperty";

describe("the ValidationRuleProperty module", () => {
    let validationRuleProperty: ValidationRuleProperty;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        validationRuleProperty = new ValidationRuleProperty(null);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(validationRuleProperty).toBeDefined();
    });
});
