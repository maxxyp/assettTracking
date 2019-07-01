/// <reference path="../../../../../typings/app.d.ts" />

import {DataStateSummary} from "../../../../../app/hema/business/models/dataStateSummary";
import {DataState} from "../../../../../app/hema/business/models/dataState";

describe("the DataStateSummary module", () => {
    let dataStateSummary: DataStateSummary;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        dataStateSummary = new DataStateSummary(null);
        expect(dataStateSummary).toBeDefined();
    });

    it("can calculate null object", () => {
        dataStateSummary = new DataStateSummary(null);

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals).toBeNull();
    });

    it("can calculate no data state object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001"
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals).toBeNull();
    });

    it("can calculate single level object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.invalid,
            "dataStateGroup": "mygroup",
            "dataStateId": "000001"
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals.invalid).toEqual(1);
    });

    it("can calculate two level object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.invalid,
            "dataStateGroup": "mygroup",
            "dataStateId": "000001",
            "child": {
                "id": "00002",
                "dataState": DataState.valid,
                "dataStateGroup": "mygroup",
                "dataStateId": "000001"
            }
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals.invalid).toEqual(1);
        expect(totals.valid).toEqual(1);
    });

    it("can calculate two level null object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.notVisited,
            "dataStateGroup": "mygroup",
            "dataStateId": "000001",
            "child": null
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals.notVisited).toEqual(1);
    });

    it("can calculate two level undefined object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.notVisited,
            "dataStateGroup": "mygroup",
            "dataStateId": "000001",
            "child": undefined
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals.notVisited).toEqual(1);
    });

    it("can calculate child array with no data state object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.invalid,
            "dataStateGroup": "mygroup",
            "dataStateId": "000001",
            "children": [
                {
                    "id": "aaa"
                },
                {
                    "id": "bbb"
                }
            ]
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals.invalid).toEqual(1);
    });

    it("can calculate child array strings with no data state object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.invalid,
            "dataStateGroup": "mygroup",
            "dataStateId": "000001",
            "children": ["aaa", "bbb"]
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals.invalid).toEqual(1);
    });

    it("can calculate child array objects with data state object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.invalid,
            "dataStateGroup": "mygroup",
            "dataStateId": "000001",
            "children": [
                {
                    "id": "aaa",
                    "dataState": DataState.valid,
                    "dataStateId": "000001",
                    "dataStateGroup": "mygroup"
                },
                {
                    "id": "bbb",
                    "dataState": DataState.dontCare,
                    "dataStateId": "000001",
                    "dataStateGroup": "mygroup"
                }
            ]
        });

        let totals = dataStateSummary.getTotals("mygroup");

        expect(totals.invalid).toEqual(1);
        expect(totals.valid).toEqual(1);
        expect(totals.dontCare).toEqual(1);
    });

    it("can calculate child array objects with multiple data state groups object", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.invalid,
            "dataStateGroup": "mygroup1",
            "dataStateId": "000001",
            "children": [
                {
                    "id": "aaa",
                    "dataState": DataState.valid,
                    "dataStateId": "000001",
                    "dataStateGroup": "mygroup2"
                },
                {
                    "id": "bbb",
                    "dataState": DataState.dontCare,
                    "dataStateId": "000001",
                    "dataStateGroup": "mygroup2"
                }
            ]
        });

        let totals1 = dataStateSummary.getTotals("mygroup1");
        let totals2 = dataStateSummary.getTotals("mygroup2");

        expect(totals1.invalid).toEqual(1);
        expect(totals2.valid).toEqual(1);
        expect(totals2.dontCare).toEqual(1);
    });

    it("can get combined totals", () => {
        dataStateSummary = new DataStateSummary({
            "id": "00001",
            "dataState": DataState.invalid,
            "dataStateId": "000001",
            "dataStateGroup": "mygroup1",
            "children": [
                {
                    "id": "aaa",
                    "dataState": DataState.valid,
                    "dataStateId": "000001",
                    "dataStateGroup": "mygroup2"
                },
                {
                    "id": "bbb",
                    "dataState": DataState.dontCare,
                    "dataStateId": "000001",
                    "dataStateGroup": "mygroup2"
                },
                {
                    "id": "ccc",
                    "dataState": DataState.dontCare,
                    "dataStateId": "000001",
                    "dataStateGroup": "mygroup2"
                }
            ]
        });

        let totals = dataStateSummary.getCombinedTotals();

        expect(totals.invalid).toEqual(1);
        expect(totals.valid).toEqual(1);
        expect(totals.dontCare).toEqual(2);
    });

});
