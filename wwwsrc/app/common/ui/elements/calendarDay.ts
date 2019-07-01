export class CalendarDay {
    public dayNumber: number;
    public classMembers: string;
    public isDisabled: boolean;
    public lastDayOfWeek: boolean;

    constructor(dayNumber: number, classMembers: string, isDisabled: boolean, lastDayOfWeek: boolean) {
        this.dayNumber = dayNumber;
        this.classMembers = classMembers;
        this.isDisabled = isDisabled;
        this.lastDayOfWeek = lastDayOfWeek;
    }
}
