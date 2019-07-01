/// <reference path="../../../../typings/app.d.ts" />

import {GeoHelper} from "../../../../app/common/geo/geoHelper";

describe("the GeoHelper module", () => {
    let sandbox: Sinon.SinonSandbox;
    let geoHelper: GeoHelper;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        geoHelper = new GeoHelper();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(geoHelper).toBeDefined();
    });

    it("checkPostcodeFormat function checks", () => {
        expect(GeoHelper.isPostCodeValid("NG2 3AB")).toEqual(true);
        expect(GeoHelper.isPostCodeValid("xxx xxx")).toEqual(false);
    });

    it("formatPostCode function formats ", () => {
        expect(GeoHelper.formatPostCode("NG23AB")).toEqual("NG2 3AB");
    });

    it("formatPostCode too short", () => {
        expect(GeoHelper.formatPostCode("NG1")).toEqual(null);
    });

    it("formatPostCode invalid characters", () => {
        expect(GeoHelper.formatPostCode("NG1 !DG")).toEqual(null);
    });
});
