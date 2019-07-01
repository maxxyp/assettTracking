/// <reference path="../../../../typings/app.d.ts" />

import {Threading} from "../../../../app/common/core/threading";

describe("the Threading module", () => {
    let threading: Threading;
    let sandbox: Sinon.SinonSandbox;
    let oldSetTimeout: any;
    let oldClearTimeout: any;
    let oldSetInterval: any;
    let oldClearInterval: any;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        threading = new Threading();
        oldSetTimeout = window.setTimeout;
        oldClearTimeout = window.clearTimeout;
        oldSetInterval = window.setInterval;
        oldClearInterval = window.clearInterval;
    });

    afterEach(() => {
        window.setTimeout = oldSetTimeout;
        window.clearTimeout = oldClearTimeout;
        window.setInterval = oldSetInterval;
        window.clearInterval = oldClearInterval;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(threading).toBeDefined();
    });

    it("can call nextCycle", () => {
        let delay: number;
        window.setTimeout = (cb: any, d: number): number => {
            delay = d;
            return 1;
        };
        Threading.nextCycle(() => {});
        expect(delay).toEqual(1);
    });

    it("can call delay", () => {
        let delay: number;
        window.setTimeout = (cb: any, d: number): number => {
            delay = d;
            return 1;
        };
        Threading.delay(() => {}, 1000);
        expect(delay).toEqual(1000);
    });

    it("can call stopDelay", () => {
        let clearId: number;
        window.clearTimeout = (id): number => {
            clearId = id;
            return 1;
        };
        Threading.stopDelay(500);
        expect(clearId).toEqual(500);
    });

    it("can call startTimer", () => {
        let delay: number;
        window.setInterval = (cb: any, d: number): number => {
            delay = d;
            return 1;
        };
        Threading.startTimer(() => {}, 1000);
        expect(delay).toEqual(1000);
    });

    it("can call stopTimer", () => {
        let clearId: number;
        window.clearInterval = (id): number => {
            clearId = id;
            return 1;
        };
        Threading.stopTimer(500);
        expect(clearId).toEqual(500);
    });
});
