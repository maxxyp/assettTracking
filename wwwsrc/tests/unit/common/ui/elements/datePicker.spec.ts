/// <reference path="../../../../../typings/app.d.ts" />

import * as moment from "moment";
import {DatePicker} from "../../../../../app/common/ui/elements/datePicker";
import {Threading} from "../../../../../app/common/core/threading";

describe("the DatePicker module", () => {
    let datePicker: DatePicker;

    beforeEach(() => {
        datePicker = new DatePicker(<Element>{});
    });

    it("can be created", () => {
        expect(datePicker).toBeDefined();
    });

    it("can be attached", () => {
        datePicker.attached();
        expect(datePicker.calendarDaysArray && datePicker.calendarDaysArray.length > 0).toBeTruthy();
    });

    it("can be detached", () => {
        let removeCalledCount: number = 0;
        window.removeEventListener = (name, listener): void => {
            removeCalledCount++;
        };
        datePicker.detached();
        expect(removeCalledCount).toEqual(3);
    });

    it("can be attached with options", () => {
        datePicker.calendarOnly = false;
        datePicker.selectedDateString = "2015-12-30";
        datePicker.startDate = new Date();
        datePicker.attached();
        expect(datePicker.calendarDaysArray && datePicker.calendarDaysArray.length > 0).toBeTruthy();
    });

    it("can select next month", () => {
        datePicker.startDate = new Date(2015, 10, 1);
        datePicker.attached();
        datePicker.nextMonth();
        expect(datePicker.calendarDaysArray &&
            datePicker.calendarDaysArray[datePicker.calendarDaysArray.length - 1].dayNumber === 31).toBeTruthy();
    });

    it("can select previous month", () => {
        datePicker.startDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.previousMonth();
        expect(datePicker.calendarDaysArray &&
            datePicker.calendarDaysArray[datePicker.calendarDaysArray.length - 1].dayNumber === 30).toBeTruthy();
    });

    it("can clear date", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.clearDate();
        expect(datePicker.value.getTime()).toBeNaN();
    });

    it("can hide calendar", () => {
        datePicker.calendarOnly = false;
        datePicker.showCalendar = false;
        datePicker.attached();
        datePicker.hideCalendar();
        expect(datePicker.showCalendar).toBeFalsy();
    });

    it("can not hide calendar for calendar only", () => {
        datePicker.calendarOnly = true;
        datePicker.showCalendar = false;
        datePicker.attached();
        datePicker.hideCalendar();
        expect(datePicker.showCalendar).toBeTruthy();
    });

    it("textbox readonly toggle calendar toBeTruthy", () => {
        datePicker.calendarOnly = false;
        datePicker.showCalendar = false;
        datePicker.readonlyInput = true;
        datePicker.attached();
        datePicker.calendarTextClick();
        expect(datePicker.showCalendar).toBeTruthy();
    });

    it("textbox readonly toggle calendar toBeFalsy", () => {
        datePicker.calendarOnly = false;
        datePicker.showCalendar = true;
        datePicker.readonlyInput = true;
        datePicker.attached();
        datePicker.calendarTextClick();
        expect(datePicker.showCalendar).toBeFalsy();
    });

    it("textbox click not readonly", () => {
        datePicker.calendarOnly = false;
        datePicker.showCalendar = true;
        datePicker.readonlyInput = false;
        datePicker.attached();
        datePicker.calendarTextClick();
        expect(datePicker.showCalendar).toBeTruthy();
    });

    it("can toggle calendar", () => {
        datePicker.calendarOnly = false;
        datePicker.attached();
        datePicker.showCalendar = false;
        datePicker.toggleCalender();
        expect(datePicker.showCalendar).toBeTruthy();
    });

    it("can not toggle calendar", () => {
        datePicker.calendarOnly = true;
        datePicker.attached();
        datePicker.showCalendar = false;
        datePicker.toggleCalender();
        expect(datePicker.showCalendar).toBeFalsy();
    });

    it("can not reposition on toggle", () => {
        datePicker.attached();
        datePicker.showCalendar = false;
        datePicker.toggleCalender();
        datePicker.toggleCalender();
        expect(datePicker.showCalendar).toBeFalsy();
    });

    it("when textbox is readonly can reposition on toggle", () => {
        datePicker.attached();
        datePicker.showCalendar = false;
        datePicker.readonlyInput = true;
        datePicker.toggleCalender();
        expect(datePicker.showCalendar).toBeFalsy();
    });

    it("can select day", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.clickedDay(2);
        expect(moment(datePicker.value).date() === 2).toBeTruthy();
    });

    it("can select day calendar only", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.calendarOnly = false;
        datePicker.attached();
        datePicker.clickedDay(2);
        expect(moment(datePicker.value).date() === 2).toBeTruthy();
    });

    it("can not select a disabled day", () => {
        datePicker.startDate = new Date(2015, 11, 1);
        datePicker.disabledDates = [new Date(2015, 11, 2)];
        datePicker.attached();
        datePicker.clickedDay(2);
        expect(moment(datePicker.value).date() === 1).toBeTruthy();
    });

    it("can select today", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.gotoToday();
        expect(moment(datePicker.value).format("DD-MM-YYYY") === moment(new Date()).format("DD-MM-YYYY")).toBeTruthy();
    });

    it("can set a value", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.valueChanged(new Date(2015, 11, 1), new Date(2015, 11, 1));
        expect(moment(datePicker.value).format("DD-MM-YYYY")).toEqual("01-12-2015");
    });

    it("can set an invalid value", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.valueChanged(new Date(""), new Date(2015, 11, 1));
        expect(isNaN(datePicker.value.getTime())).toBeTruthy();
    });

    it("can set a value with the date string", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.selectedDateStringChanged("01-01-2017", "");
        expect(moment(datePicker.value).format("DD-MM-YYYY")).toEqual("01-01-2017");
    });

    it("can set a value with the date string invalid", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.dateFormat = "DD-MM-YYYY";
        datePicker.attached();
        datePicker.selectedDateString = null;
        datePicker.selectedDateStringChanged("", "");
        expect(datePicker.value.getTime()).toBeNaN();
    });

    it("can set a value with the date string undefined", () => {
        datePicker.value = new Date(2015, 11, 1);
        datePicker.dateFormat = "DD-MM-YYYY";
        datePicker.attached();
        datePicker.selectedDateString = null;
        datePicker.selectedDateStringChanged(undefined, "");
        expect(datePicker.value.getTime()).toBeNaN();
    });

    it("can set a min and max date", () => {
        datePicker.startDate = new Date(2015, 5, 1);
        datePicker.minDate = new Date(2015, 5, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.clickedDay(3);
        expect(moment(datePicker.value).date() === 3).toBeTruthy();
    });

    it("can set a min and max date and not select outside the range", () => {
        datePicker.startDate = new Date(2015, 11, 1);
        datePicker.minDate = new Date(2015, 0, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.clickedDay(2);
        expect(moment(datePicker.value).date() === 1).toBeTruthy();
    });

    it("prevents setting date before mindate", () => {
        datePicker.startDate = new Date(2015, 5, 1);
        datePicker.minDate = new Date(2015, 5, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.selectedDateStringChanged("30-05-2015", "");
        expect(moment(datePicker.value).date() === moment(datePicker.minDate).date()).toBeTruthy();
    });

    it("prevents setting date same as mindate", () => {
        datePicker.startDate = new Date(2015, 5, 1);
        datePicker.minDate = new Date(2015, 5, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.selectedDateStringChanged("01-06-2015", "");
        expect(moment(datePicker.value).date() === moment(datePicker.minDate).date()).toBeTruthy();
    });

    it("prevents setting date after mindate", () => {
        datePicker.startDate = new Date(2015, 5, 1);
        datePicker.minDate = new Date(2015, 5, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.selectedDateStringChanged("02-06-2015", "");
        expect(moment(datePicker.value).date() === 2).toBeTruthy();
    });

    it("prevents setting date after maxdate", () => {
        datePicker.startDate = new Date(2015, 5, 1);
        datePicker.minDate = new Date(2015, 5, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.selectedDateStringChanged("01-12-2016", "");
        expect(moment(datePicker.value).date() === moment(datePicker.maxDate).date()).toBeTruthy();
    });

    it("prevents setting date same as maxdate", () => {
        datePicker.startDate = new Date(2015, 5, 1);
        datePicker.minDate = new Date(2015, 5, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.selectedDateStringChanged("01-12-2015", "");
        expect(moment(datePicker.value).date() === moment(datePicker.maxDate).date()).toBeTruthy();
    });

    it("prevents setting date before maxdate", () => {
        datePicker.startDate = new Date(2015, 5, 1);
        datePicker.minDate = new Date(2015, 5, 1);
        datePicker.maxDate = new Date(2015, 11, 1);
        datePicker.attached();
        datePicker.selectedDateStringChanged("30-11-2015", "");
        expect(moment(datePicker.value).date() === 30).toBeTruthy();
    });

    it("can position on screen", () => {
        let reposition: () => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: () => void): void => {
            if (name === "resize") {
                reposition = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 1000;

        datePicker.setEventTarget(evTarget, documentElement);
        datePicker.attached();

        let mainControl: any = {};
        mainControl.offsetLeft = 0;
        mainControl.offsetTop = 0;
        mainControl.offsetWidth = 1000;
        mainControl.offsetHeight = 1000;
        mainControl.scrollLeft = 0;
        mainControl.scrollTop = 100;
        mainControl.clientLeft = 0;
        mainControl.clientTop = 100;

        datePicker.mainControl = mainControl;

        let popup: any = {};
        popup.style = <CSSStyleDeclaration>{};
        popup.style.position = "";
        popup.offsetLeft = 10;
        popup.offsetTop = 10;
        popup.offsetWidth = 100;
        popup.offsetHeight = 100;

        datePicker.popup = popup;

        datePicker.calendarOnly = false;
        expect(reposition).toBeDefined();
        reposition();
        expect(datePicker.popup.style.position).toEqual("fixed");
    });

    it("can position on screen when off left", () => {
        let reposition: () => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: () => void): void => {
            if (name === "resize") {
                reposition = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 1000;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.attached();
        let mainControl: any = {};
        mainControl.offsetLeft = 0;
        mainControl.offsetTop = 0;
        mainControl.offsetWidth = 100;
        mainControl.offsetHeight = 100;
        mainControl.scrollLeft = 0;
        mainControl.scrollTop = 100;
        mainControl.clientLeft = 0;
        mainControl.clientTop = 100;
        let popup: any = {};
        popup.style = <CSSStyleDeclaration>{};
        popup.style.position = "";
        popup.offsetWidth = 200;
        popup.offsetHeight = 200;

        datePicker.mainControl = mainControl;
        datePicker.popup = popup;

        datePicker.calendarOnly = false;
        expect(reposition).toBeDefined();
        reposition();
        expect(datePicker.popup.style.left).toEqual("0px");
    });

    it("can position on screen when off bottom", () => {
        let reposition: () => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: () => void): void => {
            if (name === "resize") {
                reposition = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 50;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.attached();
        let mainControl: any = {};
        mainControl.offsetLeft = 0;
        mainControl.offsetTop = 0;
        mainControl.offsetWidth = 100;
        mainControl.offsetHeight = 100;
        mainControl.scrollLeft = 0;
        mainControl.scrollTop = 100;
        mainControl.clientLeft = 0;
        mainControl.clientTop = 100;
        let popup: any = {};
        popup.style = <CSSStyleDeclaration>{};
        popup.style.position = "";
        popup.offsetWidth = 200;
        popup.offsetHeight = 200;

        datePicker.mainControl = mainControl;
        datePicker.popup = popup;

        datePicker.calendarOnly = false;
        expect(reposition).toBeDefined();
        reposition();
        expect(datePicker.popup.style.top).toEqual("-150px");
    });

    it("does not reposition when datepicker is full screen", () => {
        let reposition: () => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: () => void): void => {
            if (name === "resize") {
                reposition = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 360;
        documentElement.clientWidth = 556;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.attached();
        let mainControl: any = {};
        mainControl.offsetLeft = 0;
        mainControl.offsetTop = 0;
        mainControl.offsetWidth = 0;
        mainControl.offsetHeight = 0;
        mainControl.scrollLeft = 0;
        mainControl.scrollTop = 100;
        mainControl.clientLeft = 0;
        mainControl.clientTop = 100;
        let popup: any = {};
        popup.style = <CSSStyleDeclaration>{};
        popup.style.position = "";
        popup.offsetLeft = 0;
        popup.offsetTop = 0;
        popup.offsetWidth = 100;
        popup.offsetHeight = 100;

        datePicker.mainControl = mainControl;
        datePicker.popup = popup;

        datePicker.calendarOnly = false;
        expect(reposition).toBeDefined();
        reposition();
        expect(datePicker.popup.style.position).toBeFalsy();
    });

    it("can not position on screen", () => {
        let reposition: () => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: () => void): void => {
            if (name === "resize") {
                reposition = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 1000;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.attached();
        let popup: any = {};
        popup.style = <CSSStyleDeclaration>{};
        popup.style.position = "";
        popup.offsetWidth = 100;
        popup.offsetHeight = 100;

        datePicker.popup = popup;

        datePicker.calendarOnly = true;
        expect(reposition).toBeDefined();
        reposition();
        expect(datePicker.popup.style.position).toEqual("");
    });

    it("can hide on scroll", () => {
        let scrollCb: () => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: () => void): void => {
            if (name === "scroll") {
                scrollCb = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 1000;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.attached();
        datePicker.showCalendar = true;
        datePicker.calendarOnly = false;
        expect(scrollCb).toBeDefined();
        scrollCb();
        expect(datePicker.showCalendar).toEqual(false);
    });

    it("can hide on delayed outside click", (done) => {
        let click: (evnt: MouseEvent) => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: (evnt: MouseEvent) => void): void => {
            if (name === "click") {
                click = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 50;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.calendarOnly = false;
        datePicker.attached();
        datePicker.showCalendar = false;
        datePicker.toggleCalender();

        let popup: any = {};
        popup.style = <CSSStyleDeclaration>{};
        popup.style.position = "";
        popup.offsetLeft = 0;
        popup.offsetTop = 0;
        popup.offsetWidth = 100;
        popup.offsetHeight = 100;
        popup.scrollLeft = 0;
        popup.scrollTop = 100;
        popup.clientLeft = 0;
        popup.clientTop = 100;
        popup.clientWidth = 100;
        popup.clientHeight = 100;

        datePicker.popup = popup;

        expect(click).toBeDefined();
        let mouseEvent: any = {};
        mouseEvent.x = 5000;
        mouseEvent.y = 5000;
        Threading.delay(() => {
            click(mouseEvent);
            expect(datePicker.showCalendar).toBeFalsy();
            done();
        }, 600);
    });

    it("can not hide on quick outside click", () => {
        let click: (evnt: MouseEvent) => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: (evnt: MouseEvent) => void): void => {
            if (name === "click") {
                click = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 50;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.calendarOnly = false;
        datePicker.attached();
        datePicker.showCalendar = false;
        datePicker.toggleCalender();

        let popup: any = {};
        popup.offsetLeft = 10;
        popup.offsetTop = 10;
        popup.offsetWidth = 100;
        popup.offsetHeight = 100;
        popup.scrollLeft = 0;
        popup.scrollTop = 100;
        popup.clientLeft = 0;
        popup.clientTop = 100;
        popup.clientWidth = 100;
        popup.clientHeight = 100;

        datePicker.popup = popup;

        datePicker.calendarOnly = false;
        expect(click).toBeDefined();
        let mouseEvent: any = {};
        mouseEvent.x = 5000;
        mouseEvent.y = 5000;
        click(mouseEvent);
        expect(datePicker.showCalendar).toBeTruthy();
    });

    it("can not hide on inside click", () => {
        let click: (evnt: MouseEvent) => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: (evnt: MouseEvent) => void): void => {
            if (name === "click") {
                click = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 50;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.calendarOnly = false;
        datePicker.attached();
        datePicker.showCalendar = false;
        datePicker.toggleCalender();

        let popup: any = {};
        popup.offsetLeft = 10;
        popup.offsetTop = 10;
        popup.offsetWidth = 100;
        popup.offsetHeight = 100;
        popup.scrollLeft = 0;
        popup.scrollTop = 100;
        popup.clientLeft = 0;
        popup.clientTop = 100;
        popup.clientWidth = 100;
        popup.clientHeight = 100;

        datePicker.popup = popup;

        datePicker.calendarOnly = false;
        expect(click).toBeDefined();
        let mouseEvent: any = {};
        mouseEvent.x = 50;
        mouseEvent.y = 50;
        click(mouseEvent);
        expect(datePicker.showCalendar).toBeTruthy();
    });

    it("click check with no popup", () => {
        let click: (evnt: MouseEvent) => void;
        let evTarget: EventTarget = <EventTarget>{};
        evTarget.addEventListener = (name: string, listener: (evnt: MouseEvent) => void): void => {
            if (name === "click") {
                click = listener;
            }
        };
        let documentElement: any = {};
        documentElement.clientHeight = 50;

        datePicker.setEventTarget(evTarget, documentElement);

        datePicker.attached();
        datePicker.calendarOnly = true;
        expect(click).toBeDefined();
        let mouseEvent: any = {};
        mouseEvent.x = 50;
        mouseEvent.y = 50;
        click(mouseEvent);
        expect(datePicker.showCalendar).toBeTruthy();
    });
});
