/// <reference path="../../../../../typings/app.d.ts" />

import {ProgressBar} from "../../../../../app/common/ui/elements/progressBar";

describe("the ProgressBar module", () => {
    let progressBar: ProgressBar;

    beforeEach(() => {
        progressBar = new ProgressBar();
    });

    it("can be created", () => {
        expect(progressBar).toBeDefined();
    });

    it("can populated with no entries", () => {
        progressBar.attached();

        expect(progressBar.value).toEqual(0);
        expect(progressBar.minValue).toEqual(0);
        expect(progressBar.maxValue).toEqual(0);
    });

    it("can populated with no max value", () => {
        progressBar.value = 1;

        progressBar.attached();

        expect(progressBar.percent).toEqual("100%");
    });

    it("can populated with max value", () => {
        progressBar.value = 1;
        progressBar.maxValue = 3;

        progressBar.attached();

        expect(progressBar.percent).toEqual("50%");
    });

    it("can populated with min value", () => {
        progressBar.value = 7;
        progressBar.minValue = 5;
        progressBar.maxValue = 10;

        progressBar.attached();

        expect(progressBar.percent).toEqual("50%");
    });
});
