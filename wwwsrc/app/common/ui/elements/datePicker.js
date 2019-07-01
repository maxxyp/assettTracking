/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "moment", "aurelia-framework", "./calendarDay", "../../core/threading", "aurelia-dependency-injection", "aurelia-pal"], function (require, exports, moment, aurelia_framework_1, calendarDay_1, threading_1, aurelia_dependency_injection_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DatePicker = /** @class */ (function () {
        function DatePicker(element) {
            var _this = this;
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
            this._clickCheckCallback = function (evt) { return _this.clickCheck(evt); };
            this._repositionCallback = function () { return _this.reposition(); };
            this._hideCalendarCallback = function () { return _this.hideCalendar(); };
        }
        DatePicker.prototype.setEventTarget = function (eventTarget, rootElement) {
            this._eventTarget = eventTarget;
            this._rootElement = rootElement;
        };
        DatePicker.prototype.attached = function () {
            if (this.calendarOnly === true) {
                this.showCalendar = true;
            }
            var mDate;
            if (this.startDate) {
                mDate = moment(this.startDate);
                this.selectedDateString = mDate.format(this.dateFormat);
                this.currentSelectedDate = mDate.toDate();
                this.value = this.currentSelectedDate;
                this.updateCurrentDateItems();
                this.updateSelectedDateItems();
            }
            else {
                mDate = moment(new Date());
                this.currentSelectedDate = mDate.toDate();
                this.updateCurrentDateItems();
            }
            this.createCalendarDaysArray();
            this._eventTarget.addEventListener("click", this._clickCheckCallback);
            this._eventTarget.addEventListener("resize", this._repositionCallback);
            this._eventTarget.addEventListener("scroll", this._hideCalendarCallback);
        };
        DatePicker.prototype.detached = function () {
            this._eventTarget.removeEventListener("click", this._clickCheckCallback);
            this._eventTarget.removeEventListener("resize", this._repositionCallback);
            this._eventTarget.removeEventListener("scroll", this._hideCalendarCallback);
        };
        DatePicker.prototype.nextMonth = function () {
            this.currentSelectedDate = moment(this.currentSelectedDate).add(1, "month").toDate();
            this.updateCurrentDateItems();
            this.createCalendarDaysArray();
        };
        DatePicker.prototype.previousMonth = function () {
            this.currentSelectedDate = moment(this.currentSelectedDate).add(-1, "month").toDate();
            this.updateCurrentDateItems();
            this.createCalendarDaysArray();
        };
        DatePicker.prototype.minDateChanged = function () {
            this.createCalendarDaysArray();
        };
        DatePicker.prototype.maxDateChanged = function () {
            this.createCalendarDaysArray();
        };
        DatePicker.prototype.clickedDay = function (dayNumber) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var emptyDays = moment([_this.currentYear, _this.currentMonth, 1]).weekday();
                var realArrayNumber = emptyDays + dayNumber - 1;
                if (!_this.calendarDaysArray[realArrayNumber].isDisabled && dayNumber > 0) {
                    _this.value = moment([_this.currentYear, _this.currentMonth, dayNumber]).toDate();
                    _this.updateCurrentDateItems();
                    _this.updateSelectedDateItems();
                    _this.createCalendarDaysArray();
                    if (!_this.calendarOnly) {
                        _this.showCalendar = false;
                    }
                }
                resolve();
            });
        };
        DatePicker.prototype.valueChanged = function (newValue, oldValue) {
            if (newValue && !isNaN(newValue.getTime())) {
                this.gotoDate(this.value);
            }
            else {
                var isClear = oldValue === undefined || isNaN(oldValue.getTime());
                if (!isClear) {
                    this.clearDate();
                }
            }
        };
        DatePicker.prototype.selectedDateStringChanged = function (newValue, oldValue) {
            if (!(newValue === undefined || (newValue === "" && oldValue === undefined))) {
                var newDate = moment(newValue, this.dateFormat, true);
                if (newDate.isValid()) {
                    if (this.minDate && moment(this.minDate).isAfter(newDate) === true) {
                        this.value = this.minDate;
                    }
                    else if (this.maxDate
                        && (moment(this.maxDate).isBefore(newDate) === true
                            || moment(this.maxDate).isSame(newDate) === true)) {
                        this.value = this.maxDate;
                    }
                    else {
                        this.value = newDate.toDate();
                    }
                    this.updateCurrentDateItems();
                    this.updateSelectedDateItems();
                    this.createCalendarDaysArray();
                }
                else {
                    if (this.value === undefined || !isNaN(this.value.getTime())) {
                        this.value = new Date("");
                    }
                }
                this.currentSelectedDate = this.value;
            }
            else {
                if (this.value === undefined || !isNaN(this.value.getTime())) {
                    this.value = new Date("");
                }
            }
        };
        DatePicker.prototype.gotoToday = function () {
            this.gotoDate(new Date());
            this.hideCalendar();
        };
        DatePicker.prototype.clearDate = function () {
            this.value = new Date("");
            var md = moment(new Date());
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
        };
        DatePicker.prototype.calendarTextClick = function () {
            if (this.readonlyInput) {
                this.toggleCalender();
            }
        };
        DatePicker.prototype.hideCalendar = function () {
            if (!this.calendarOnly) {
                this.showCalendar = false;
            }
        };
        DatePicker.prototype.toggleCalender = function () {
            var _this = this;
            if (!this.calendarOnly) {
                this.showCalendar = !this.showCalendar;
                if (this.showCalendar) {
                    this._lastShow = new Date().getTime();
                    threading_1.Threading.delay(function () {
                        _this.reposition();
                    }, 500);
                }
            }
        };
        DatePicker.prototype.blur = function () {
            this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                detail: {
                    value: this._element
                },
                bubbles: true
            }));
        };
        DatePicker.prototype.gotoDate = function (newDate) {
            this.currentSelectedDate = newDate;
            this.value = newDate;
            var md = moment(newDate);
            this.selectedDay = md.date();
            this.currentMonth = md.month();
            this.currentYear = md.year();
            this.currentMonthName = md.format("MMMM");
            this.updateSelectedDateItems();
            this.createCalendarDaysArray();
        };
        DatePicker.prototype.updateSelectedDateItems = function () {
            var md = moment(this.value);
            this.selectedDay = md.date();
            this.selectedMonth = this.currentMonth;
            this.selectedYear = this.currentYear;
            this.selectedMonthName = this.currentMonthName;
            this.selectedDateString = md.format(this.dateFormat);
        };
        DatePicker.prototype.updateCurrentDateItems = function () {
            var md = moment(this.currentSelectedDate);
            this.currentMonth = md.month();
            this.currentYear = md.year();
            this.currentMonthName = md.format("MMMM");
        };
        DatePicker.prototype.createCalendarDaysArray = function () {
            var daysArray = [];
            var classMember = "";
            var setNewWeek = false;
            var isDisabled = false;
            var today = moment(new Date());
            // get the initial day and create blank divs up till that day.
            var emptyDays = moment([this.currentYear, this.currentMonth, 1]).weekday();
            for (var emptyDaysCount = 0; emptyDaysCount < emptyDays; emptyDaysCount++) {
                daysArray.push(new calendarDay_1.CalendarDay(0, "cal-day no-day", false, false));
            }
            var momentMinDate = moment(this.minDate).add(-1, "days");
            var momentMaxDate = moment(this.maxDate);
            for (var intDayCount = 1; intDayCount < this.daysInMonth(this.currentMonth, this.currentYear) + 1; intDayCount++) {
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
                }
                else if (this.minDate
                    && !moment([this.currentYear, this.currentMonth, intDayCount])
                        .isAfter(momentMinDate)) {
                    classMember += "is-disabled ";
                    isDisabled = true;
                }
                else if (this.maxDate
                    && !moment([this.currentYear, this.currentMonth, intDayCount])
                        .isBefore(momentMaxDate)) {
                    classMember += "is-disabled ";
                    isDisabled = true;
                }
                for (var disabledDaysCount = 0; disabledDaysCount < this.disabledDates.length; disabledDaysCount++) {
                    var disabledDateItem = this.disabledDates[disabledDaysCount];
                    if (intDayCount === moment(disabledDateItem).date()
                        && this.currentMonth === moment(disabledDateItem).month()
                        && this.currentYear === moment(disabledDateItem).year() && isDisabled === false) {
                        classMember += "is-disabled ";
                        isDisabled = true;
                    }
                }
                daysArray.push(new calendarDay_1.CalendarDay(intDayCount, classMember, isDisabled, setNewWeek));
                if (((intDayCount + emptyDays) / 7) % 1 === 0) {
                    setNewWeek = true;
                }
            }
            this.calendarDaysArray = daysArray;
        };
        DatePicker.prototype.daysInMonth = function (month, year) {
            return new Date(year, month + 1, 0).getDate();
        };
        DatePicker.prototype.reposition = function () {
            if (!this.calendarOnly &&
                this.mainControl &&
                this.popup &&
                this._rootElement &&
                !(this.popup.offsetLeft === 0 && this.popup.offsetTop === 0)) {
                var mainPosition = this.getPosition(this.mainControl);
                var newLeft = mainPosition.x + this.mainControl.offsetWidth - this.popup.offsetWidth;
                var newTop = mainPosition.y + this.mainControl.offsetHeight + this.mainControl.scrollTop;
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
        };
        DatePicker.prototype.getPosition = function (element) {
            var xPosition = 0;
            var yPosition = 0;
            while (element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            return { x: xPosition, y: yPosition };
        };
        DatePicker.prototype.clickCheck = function (event) {
            if (!this.calendarOnly && this.showCalendar && this.popup) {
                var popupPosition = this.getPosition(this.popup);
                if (!this.isInside(event.x, event.y, popupPosition.x, popupPosition.y, this.popup.clientWidth, this.popup.clientHeight)) {
                    // only hide if we have not just shown it
                    if (new Date().getTime() - this._lastShow > 500) {
                        this.hideCalendar();
                    }
                }
            }
        };
        DatePicker.prototype.isInside = function (x, y, left, top, width, height) {
            var x1 = left;
            var x2 = left + width;
            var y1 = top;
            var y2 = top + height;
            if ((x1 <= x) && (x <= x2) && (y1 <= y) && (y <= y2)) {
                return true;
            }
            else {
                return false;
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Date)
        ], DatePicker.prototype, "minDate", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Date)
        ], DatePicker.prototype, "maxDate", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Date)
        ], DatePicker.prototype, "startDate", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], DatePicker.prototype, "selectedDateString", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], DatePicker.prototype, "selectedDay", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], DatePicker.prototype, "selectedMonth", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], DatePicker.prototype, "selectedYear", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DatePicker.prototype, "dateFormat", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Date)
        ], DatePicker.prototype, "value", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], DatePicker.prototype, "selectedMonthName", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], DatePicker.prototype, "disabledDates", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
            __metadata("design:type", Boolean)
        ], DatePicker.prototype, "calendarOnly", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DatePicker.prototype, "readonlyInput", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DatePicker.prototype, "showToday", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DatePicker.prototype, "showClear", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DatePicker.prototype, "disabled", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DatePicker.prototype, "highlightToday", void 0);
        DatePicker = __decorate([
            aurelia_framework_1.customElement("date-picker"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], DatePicker);
        return DatePicker;
    }());
    exports.DatePicker = DatePicker;
});

//# sourceMappingURL=datePicker.js.map
