/// <reference path="../../../../typings/app.d.ts" />
import {Guid} from "../../../../app/common/core/guid";

describe("guid module", () => {
    let g: Guid;

    beforeEach(() => {
        g = new Guid();
    });

    it("can be constructed", () => {
        expect(g).toBeDefined();
    });

    it("can create a guid", () => {
        let gu = Guid.newGuid()
        expect(gu && gu.length === 36).toBeTruthy();
    });

    it("can create a guid", () => {
        let gu = Guid.newGuid();
        expect(gu && gu.length === 36).toBeTruthy();
    });

    it("isGuid", () => {
        expect(Guid.isGuid(Guid.newGuid())).toEqual(true);
    });
});
