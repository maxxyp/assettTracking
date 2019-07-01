/// <reference path="../../typings/app.d.ts" />

import {Configuration} from "../../app/configuration";

describe("the Configuration module", () => {
    let configuration: Configuration;

    beforeEach(() => {
        configuration = new Configuration();
    });

    afterEach(() => {
    });

    it("can be created", () => {
        expect(configuration).toBeDefined();
    });
});
