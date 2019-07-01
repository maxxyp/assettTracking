/// <reference path="../../../../../typings/app.d.ts" />

import {Slider} from "../../../../../app/common/ui/elements/slider";

describe("the Slider module", () => {
    let slider: Slider;
    let sandbox: Sinon.SinonSandbox;
    let elementStub: HTMLElement;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        elementStub = <HTMLElement>{};
        slider = new Slider(elementStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(slider).toBeDefined();
    });
});
