/// <reference path="../../../../../../typings/app.d.ts" />

import {TimeRange} from "../../../../../../app/common/ui/elements/models/timeRange";

describe("the TimeRange module", () => {
    let timeRange: TimeRange;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        timeRange = new TimeRange("", "");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(timeRange).toBeDefined();
    });
});
