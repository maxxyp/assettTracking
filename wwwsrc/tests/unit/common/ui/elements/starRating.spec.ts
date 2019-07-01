/// <reference path="../../../../../typings/app.d.ts" />

import {StarRating} from "../../../../../app/common/ui/elements/starRating";

describe("the StarRating module", () => {
    let starRating: StarRating;

    beforeEach(() => {
        starRating = new StarRating();
    });

    it("can be created", () => {
        expect(starRating).toBeDefined();
    });

    it("can populated with no entries", () => {
        starRating.attached();

        expect(starRating.valueText === "").toBeTruthy();
    });

    it("can populated", () => {
        starRating.value = 1;
        starRating.ratingTexts = ["First", "Second", "Third"];

        starRating.attached();

        expect(starRating.valueText === "Second").toBeTruthy();
    });

    it("can select a rating", () => {
        starRating.value = 1;
        starRating.ratingTexts = ["First", "Second", "Third"];

        starRating.attached();
        starRating.ratingClick(2);

        expect(starRating.valueText === "Third").toBeTruthy();
    });

    it("can select a rating with no ratings", () => {
        starRating.attached();
        starRating.ratingClick(0);

        expect(starRating.valueText === "").toBeTruthy();
    });
});
