export class Ticker {
    public exchange: string;
    public symbol: string;
    public price: string;
    public date: Date;
    public change: string;
    public percentageChange: string;
    public volume: string;

    get isUp(): boolean {
        return this.change.indexOf("+") === 0;
    }

    get isDown(): boolean {
        return this.change.indexOf("-") === 0;
    }

    get movement(): "up" | "down" | "" {
        return this.isUp ? "up" : (this.isDown ? "down" : "");
    }
}
