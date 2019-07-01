/// <reference path="../../../../../typings/app.d.ts" />

import {GroupByValueConverter} from "../../../../../app/common/ui/converters/groupByValueConverter";

describe("the GroupByValueConverter module", () => {
    let groupByValueConverter: GroupByValueConverter;

    beforeEach(() => {
        groupByValueConverter = new GroupByValueConverter();
    });

    it("can be created", () => {
        expect(groupByValueConverter).toBeDefined();
    });

    it("can group by key", () => {
        expect(groupByValueConverter.toView([
            { name: "dan", team: "alpha" },
            { name: "dave", team: "beta"}
        ], "team").length === 2).toBeTruthy();
    });

    it ("no groups when no key is found", () => {
        let groupBy = groupByValueConverter.toView([
            { name: "dan", team: "alpha" },
            { name: "dave", team: "beta"}
        ], "something");

        expect(groupBy.length === 0).toBeTruthy();
    });

});
