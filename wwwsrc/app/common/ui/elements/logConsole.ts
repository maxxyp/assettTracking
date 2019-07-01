import {inject, customElement} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {UiConstants} from "./constants/uiConstants";
import {Log} from "../../core/services/models/log";

@inject(EventAggregator)
@customElement("log-console")
export class LogConsole {

    public logs: Log[];
    public hiddenText: HTMLTextAreaElement;
    public hiddenLog: string;
    private _ea: EventAggregator;

    constructor(ea: EventAggregator) {
        this._ea = ea;
        this.logs = [];
        this.hiddenLog = "";
        this._ea.subscribe(UiConstants.LOG_PUBLISHED, (logs: Log[]) => this.updateLog(logs));
    }

    public attached(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.clearHiddenText();
            resolve();
        });
    }

    public copy(): Promise<void> {
        return new Promise<void>((resolve, rejcet) => {
            if (this.populateHiddenText(this.logs)) {
                this.hiddenText.select();
                try {
                    let supported: boolean = document.queryCommandSupported("copy");
                    if (supported) {
                        document.execCommand("copy");
                    }
                    this.clearHiddenText();
                    resolve();
                } catch (err) {
                    this.clearHiddenText();
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    public clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.logs = [];
            let log: Log = new Log();
            this.logs.push(log);
            resolve();
        });
    }

    private updateLog(logs: Log[]): void {
        for (let i: number = 0; i < logs.length; i++) {
            this.logs.push(logs[i]);
        }
    }

    private clearHiddenText(): void {
        if (this.hiddenText) {
            this.hiddenText.innerText = " ";
        }
    }

    private populateHiddenText(logs: Log[]): boolean {
        let flag: boolean = false;
        if (this.hiddenText) {
            let log: string = "";
            for (let i: number = 0; i < logs.length; i++) {
                if (logs[i]) {
                    log = log.concat(" " + logs[i].logText);
                }
            }
            this.hiddenText.innerText = log;
            flag = true;
        }
        return flag;
    }
}
