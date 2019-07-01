/// <reference path="../../../../../../typings/app.d.ts" />

import {FooterNavObject} from "../../../../../../app/common/ui/elements/models/footerNavObject";

describe("the FooterNavObject module", () => {
    let footerObject: FooterNavObject;

    beforeEach(() => {
        footerObject = new FooterNavObject();
    });

    it("can be created", () => {
        expect(footerObject).toBeDefined();
    });
});
