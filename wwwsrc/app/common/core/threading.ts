/// <reference path="../../../typings/app.d.ts" />

/* tslint:disable:ban-functions */

export class Threading {
    public static nextCycle(method: () => void) : void {
        setTimeout(method, 1);
    }

    public static delay(method: () => void, delay: number) : number {
        return setTimeout(method, delay);
    }

    public static stopDelay(delayId: number) : void {
        clearTimeout(delayId);
    }

    public static startTimer(method: () => void, delay: number) : number {
        return setInterval(method, delay);
    }

    public static stopTimer(timerId: number) : void {
        clearInterval(timerId);
    }
}
/* tslint:enable:ban-functions */
