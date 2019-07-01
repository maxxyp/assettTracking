/// <reference path="../../../../../typings/app.d.ts" />

import {TimeOnly} from "../../../../../app/common/ui/attributes/timeOnly";

describe("the TimeOnly module", () => {
    let timeOnly: TimeOnly;
    let sandbox: Sinon.SinonSandbox;
    let elementStub: HTMLInputElement;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        elementStub = <HTMLInputElement>{};
        timeOnly = new TimeOnly(elementStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(timeOnly).toBeDefined();
    });
});
