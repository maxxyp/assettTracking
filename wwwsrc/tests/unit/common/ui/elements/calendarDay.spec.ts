/// <reference path="../../../../../typings/app.d.ts" />

import {CalendarDay} from "../../../../../app/common/ui/elements/calendarDay";

describe("the CalendarDay module", () => {
    let calendarDay: CalendarDay;

    beforeEach(() => {
        calendarDay = new CalendarDay(1, "", false, false);
    });

    it("can be created", () => {
        expect(calendarDay).toBeDefined();
    });
});
