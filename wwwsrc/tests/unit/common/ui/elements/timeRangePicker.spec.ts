/// <reference path="../../../../../typings/app.d.ts" />

import {TimeRangePicker} from "../../../../../app/common/ui/elements/timeRangePicker";

describe("the TimeRangePicker module", () => {
    let timeRangePicker: TimeRangePicker;
    let sandbox: Sinon.SinonSandbox;
    let elementStub: Element;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        elementStub = <Element>{};
        timeRangePicker = new TimeRangePicker(elementStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(timeRangePicker).toBeDefined();
    });
});
