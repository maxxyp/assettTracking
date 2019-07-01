/// <reference path="../../../../../../typings/app.d.ts" />

import {AboutData} from "../../../../../../app/common/ui/views/models/aboutData";

describe("the AboutData module", () => {
    let aboutData: AboutData;

    beforeEach(() => {
        aboutData = new AboutData();
    });

    it("can be created", () => {
        expect(aboutData).toBeDefined();
    });
});
