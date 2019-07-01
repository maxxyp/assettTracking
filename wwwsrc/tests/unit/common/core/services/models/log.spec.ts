/// <reference path="../../../../../../typings/app.d.ts" />

import {Log} from "../../../../../../app/common/core/services/models/log";

describe("the Log module", () => {
    let log: Log;

    it("can be created", () => {
        log = new Log();
        expect(log).toBeDefined();
    });
});
