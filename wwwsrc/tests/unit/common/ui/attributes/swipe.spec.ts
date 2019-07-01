/// <reference path="../../../../../typings/app.d.ts" />

import {Swipe} from "../../../../../app/common/ui/attributes/swipe";

describe("the Swipe module", () => {
    let swipe: Swipe;
    let sandbox: Sinon.SinonSandbox;
    let elementStub: HTMLElement;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        elementStub = <HTMLElement>{};
        swipe = new Swipe(elementStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(swipe).toBeDefined();
    });
});
