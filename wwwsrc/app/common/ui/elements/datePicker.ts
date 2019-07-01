/// <reference path="../../../../typings/app.d.ts" />

import * as moment from "moment";
import {customElement, bindable, bindingMode} from "aurelia-framework";
import {CalendarDay} from "./calendarDay";
import {Threading} from "../../core/threading";
import {inject} from "aurelia-dependency-injection";
import {DOM} from "aurelia-pal";

@customElement("date-picker")
@inject(Element)
export class DatePicker {
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public minDate: Date;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxDate: Date;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public startDate: Date;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public selectedDateString: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public selectedDay: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public selectedMonth: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public selectedYear: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public dateFormat: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: Date;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public selectedMonthName: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabledDates: Date[];
    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public calendarOnly: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public readonlyInput: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public showToday: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public showClear: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public highlightToday: boolean;

    public mainControl: HTMLElement;
    public popup: HTMLElement;

    public calendarDaysArray: CalendarDay[];
    public currentMonth: number;
    public currentYear: number;
    public currentMonthName: string;
    public currentSelectedDate: Date;
    public showCalendar: boolean;

    private _element: Element;
    private _eventTarget: EventTarget;
    private _rootElement: HTMLElement;
    private _lastShow: number;
    private _clickCheckCallback: (evt: MouseEvent) => void;
    private _repositionCallback: () => void;
    private _hideCalendarCallback: () => void;

    public constructor(element: Element) {
        this.disabledDates = [];
        this.dateFormat = "DD-MM-YYYY";
        this.calendarOnly = true;
        this.showCalendar = false;
        this.readonlyInput = false;
        this.showToday = true;
        this.showClear = true;
        this.highlightToday = false;

        this._eventTarget = window;
        this._element = element;
        this._rootElement = document.documentElement;
        this._clickCheckCallback = (evt) => this.clickCheck(evt);
        this._repositionCallback = () => this.reposition();
        this._hideCalendarCallback = () => this.hideCalendar();
    }

    public setEventTarget(eventTarget: EventTarget, rootElement: HTMLElement): void {
        this._eventTarget = eventTarget;
        this._rootElement = rootElement;
    }

    public attached(): void {
        if (this.calendarOnly === true) {
            this.showCalendar = true;
        }

        let mDate: moment.Moment;
        if (this.startDate) {
            mDate = moment(this.startDate);
            this.selectedDateString = mDate.format(this.dateFormat);
            this.currentSelectedDate = mDate.toDate();
            this.value = this.currentSelectedDate;
            this.updateCurrentDateItems();
            this.updateSelectedDateItems();
        } else {
            mDate = moment(new Date());
            this.currentSelectedDate = mDate.toDate();
            this.updateCurrentDateItems();
        }
        this.createCalendarDaysArray();

        this._eventTarget.addEventListener("click", this._clickCheckCallback);
        this._eventTarget.addEventListener("resize", this._repositionCallback);
        this._eventTarget.addEventListener("scroll", this._hideCalendarCallback);
    }

    public detached(): void {
        this._eventTarget.removeEventListener("click", this._clickCheckCallback);
        this._eventTarget.removeEventListener("resize", this._repositionCallback);
        this._eventTarget.removeEventListener("scroll", this._hideCalendarCallback);
    }

    public nextMonth(): void {
        this.currentSelectedDate = moment(this.currentSelectedDate).add(1, "month").toDate();
        this.updateCurrentDateItems();
        this.createCalendarDaysArray();
    }

    public previousMonth(): void {
        this.currentSelectedDate = moment(this.currentSelectedDate).add(-1, "month").toDate();
        this.updateCurrentDateItems();
        this.createCalendarDaysArray();
    }

    public minDateChanged(): void {
        this.createCalendarDaysArray();
    }

    public maxDateChanged(): void {
        this.createCalendarDaysArray();
    }

    public clickedDay(dayNumber: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let emptyDays: number = moment([this.currentYear, this.currentMonth, 1]).weekday();
            let realArrayNumber = emptyDays + dayNumber - 1;
            if (!this.calendarDaysArray[realArrayNumber].isDisabled && dayNumber > 0) {
                this.value = moment([this.currentYear, this.currentMonth, dayNumber]).toDate();
                this.updateCurrentDateItems();
                this.updateSelectedDateItems();
                this.createCalendarDaysArray();
                if (!this.calendarOnly) {
                    this.showCalendar = false;
                }
            }
            resolve();
        });
    }

    public valueChanged(newValue: Date, oldValue: Date): void {
        if (newValue && !isNaN(newValue.getTime())) {
            this.gotoDate(this.value);
        } else {
            let isClear = oldValue === undefined || isNaN(oldValue.getTime());
            if (!isClear) {
                this.clearDate();
            }
        }
    }

    public selectedDateStringChanged(newValue: string, oldValue: string): void {
        if (!(newValue === undefined || (newValue === "" && oldValue === undefined))) {
            let newDate: moment.Moment = moment(newValue, this.dateFormat, true);
            if (newDate.isValid()) {
                if (this.minDate && moment(this.minDate).isAfter(newDate) === true) {
                    this.value = this.minDate;
                } else if (this.maxDate
                    && (moment(this.maxDate).isBefore(newDate) === true
                    || moment(this.maxDate).isSame(newDate) === true)) {
                    this.value = this.maxDate;
                } else {
                    this.value = newDate.toDate();
                }
                this.updateCurrentDateItems();
                this.updateSelectedDateItems();
                this.createCalendarDaysArray();
            } else {
                if (this.value === undefined || !isNaN(this.value.getTime())) {
                    this.value = new Date("");
                }
            }
            this.currentSelectedDate = this.value;
        } else {
            if (this.value === undefined || !isNaN(this.value.getTime())) {
                this.value = new Date("");
            }
        }
    }

    public gotoToday(): void {
        this.gotoDate(new Date());
        this.hideCalendar();
    }

    public clearDate(): void {
        this.value = new Date("");
        let md: moment.Moment = moment(new Date());
        this.currentSelectedDate = md.toDate();
        this.selectedDay = undefined;
        this.selectedMonth = undefined;
        this.selectedYear = undefined;
        this.selectedMonthName = undefined;
        this.selectedDateString = undefined;
        this.currentMonth = md.month();
        this.currentYear = md.year();
        this.currentMonthName = md.format("MMMM");
        this.createCalendarDaysArray();
        this.hideCalendar();
    }

    public calendarTextClick(): void {
        if (this.readonlyInput) {
            this.toggleCalender();
        }
    }

    public hideCalendar(): void {
        if (!this.calendarOnly) {
            this.showCalendar = false;
        }
    }

    public toggleCalender(): void {
        if (!this.calendarOnly) {
            this.showCalendar = !this.showCalendar;

            if (this.showCalendar) {
                this._lastShow = new Date().getTime();

                Threading.delay(() => {
                    this.reposition();
                }, 500);
            }
        }
    }

    public blur(): void {
        this._element.dispatchEvent(DOM.createCustomEvent("blur", {
            detail: {
                value: this._element
            },
            bubbles: true
        }));
    }

    private gotoDate(newDate: Date): void {
        this.currentSelectedDate = newDate;
        this.value = newDate;

        let md = moment(newDate);
        this.selectedDay = md.date();
        this.currentMonth = md.month();
        this.currentYear = md.year();
        this.currentMonthName = md.format("MMMM");
        this.updateSelectedDateItems();
        this.createCalendarDaysArray();
    }

    private updateSelectedDateItems(): void {
        let md = moment(this.value);
        this.selectedDay = md.date();
        this.selectedMonth = this.currentMonth;
        this.selectedYear = this.currentYear;
        this.selectedMonthName = this.currentMonthName;
        this.selectedDateString = md.format(this.dateFormat);
    }

    private updateCurrentDateItems(): void {
        let md = moment(this.currentSelectedDate);
        this.currentMonth = md.month();
        this.currentYear = md.year();
        this.currentMonthName = md.format("MMMM");
    }

    private createCalendarDaysArray(): void {
        let daysArray: CalendarDay[] = [];
        let classMember: string = "";
        let setNewWeek: boolean = false;
        let isDisabled: boolean = false;
        let today: moment.Moment = moment(new Date());

        // get the initial day and create blank divs up till that day.
        let emptyDays: number = moment([this.currentYear, this.currentMonth, 1]).weekday();
        for (let emptyDaysCount = 0; emptyDaysCount < emptyDays; emptyDaysCount++) {
            daysArray.push(
                new CalendarDay(0, "cal-day no-day", false, false)
            );
        }

        let momentMinDate = moment(this.minDate).add(-1, "days");
        let momentMaxDate = moment(this.maxDate);

        for (let intDayCount = 1;
             intDayCount < this.daysInMonth(this.currentMonth, this.currentYear) + 1;
             intDayCount++) {
            classMember = "cal-day ";
            isDisabled = false;

            if (this.highlightToday === true && today.date() === intDayCount && today.month() === this.currentMonth && today.year() === this.currentYear) {
                classMember += "cal-day-today ";
            }
            if (setNewWeek === true) {
                classMember += "last-day-of-week ";
                setNewWeek = false;
            }
            if (intDayCount === this.selectedDay
                && this.selectedMonth === this.currentMonth
                && this.selectedYear === this.currentYear) {
                classMember += "day-selected ";
            }
            if (this.minDate && this.maxDate
                && !moment([this.currentYear, this.currentMonth, intDayCount])
                    .isBetween(momentMinDate, momentMaxDate)) {
                classMember += "is-disabled ";
                isDisabled = true;
            } else if (this.minDate
                && !moment([this.currentYear, this.currentMonth, intDayCount])
                    .isAfter(momentMinDate)) {
                classMember += "is-disabled ";
                isDisabled = true;
            } else if (this.maxDate
                && !moment([this.currentYear, this.currentMonth, intDayCount])
                    .isBefore(momentMaxDate)) {
                classMember += "is-disabled ";
                isDisabled = true;
            }
            for (let disabledDaysCount = 0; disabledDaysCount < this.disabledDates.length; disabledDaysCount++) {
                let disabledDateItem = this.disabledDates[disabledDaysCount];
                if (intDayCount === moment(disabledDateItem).date()
                    && this.currentMonth === moment(disabledDateItem).month()
                    && this.currentYear === moment(disabledDateItem).year() && isDisabled === false) {
                    classMember += "is-disabled ";
                    isDisabled = true;
                }
            }

            daysArray.push(
                new CalendarDay(intDayCount, classMember, isDisabled, setNewWeek)
            );

            if (((intDayCount + emptyDays) / 7) % 1 === 0) {
                setNewWeek = true;
            }
        }
        this.calendarDaysArray = daysArray;
    }

    private daysInMonth(month: number, year: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    private reposition(): void {
        if (!this.calendarOnly &&
            this.mainControl &&
            this.popup &&
            this._rootElement &&
            !(this.popup.offsetLeft === 0 && this.popup.offsetTop === 0)) {
            let mainPosition: { x: number, y: number } = this.getPosition(this.mainControl);
            let newLeft: number =
                mainPosition.x + this.mainControl.offsetWidth - this.popup.offsetWidth;
            let newTop: number =
                mainPosition.y + this.mainControl.offsetHeight + this.mainControl.scrollTop;

            if (newLeft < 0) {
                newLeft = 0;
            }
            if (newTop + this.popup.offsetHeight > this._rootElement.clientHeight) {
                newTop = this._rootElement.clientHeight - this.popup.offsetHeight;
            }

            this.popup.style.position = "fixed";
            this.popup.style.left = newLeft + "px";
            this.popup.style.top = newTop + "px";

        }
    }

    private getPosition(element: HTMLElement): { x: number, y: number } {
        let xPosition = 0;
        let yPosition = 0;

        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = <HTMLElement>element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

    private clickCheck(event: MouseEvent): void {
        if (!this.calendarOnly && this.showCalendar && this.popup) {
            let popupPosition: { x: number, y: number } = this.getPosition(this.popup);

            if (!this.isInside(event.x, event.y,
                    popupPosition.x, popupPosition.y, this.popup.clientWidth, this.popup.clientHeight)) {
                // only hide if we have not just shown it
                if (new Date().getTime() - this._lastShow > 500) {
                    this.hideCalendar();
                }
            }
        }
    }

    private isInside(x: number, y: number, left: number, top: number, width: number, height: number): boolean {
        let x1: number = left;
        let x2: number = left + width;
        let y1: number = top;
        let y2: number = top + height;
        if ((x1 <= x) && (x <= x2) && (y1 <= y) && (y <= y2)) {
            return true;
        } else {
            return false;
        }
    }
}
