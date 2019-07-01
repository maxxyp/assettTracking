/// <reference path="../../../../../../typings/app.d.ts" />

import {LogLevel} from "../../../../../../app/common/core/services/constants/logLevel";

describe("LogLevel", () => {

    it("can be created", (done) => {
        let logLevel: LogLevel = new LogLevel();
        expect(logLevel).toBeDefined();
        done();
    });
  
});
