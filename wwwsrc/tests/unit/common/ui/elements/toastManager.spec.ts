/// <reference path="../../../../../typings/app.d.ts" />
import {Threading} from "../../../../../app/common/core/threading";
import {ToastManager} from "../../../../../app/common/ui/elements/toastManager";
import {EventAggregator} from "aurelia-event-aggregator";
import {UiConstants} from "../../../../../app/common/ui/elements/constants/uiConstants";
import {IToastItem} from "../../../../../app/common/ui/elements/models/IToastItem";
import {ISoundService} from "../../../../../app/common/ui/services/ISoundService";

describe("the ToastManager module", () => {
    let toastManager: ToastManager;
    let sandbox: Sinon.SinonSandbox;
    let eventAggregator: EventAggregator;
    let soundServiceStub: ISoundService;

    let _delay = Threading.delay;
    let _stop = Threading.stopDelay;

    let delayCallback: Sinon.SinonStub;
    let delayCancelCallback: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        delayCallback = sandbox.stub();
        Threading.delay = (func: any, timeout: number): any => {
            delayCallback(func, timeout);
            func();
        };

        delayCancelCallback = sandbox.stub();
        Threading.stopDelay = delayCancelCallback;

        eventAggregator = new EventAggregator();
        soundServiceStub = <ISoundService>{};
        toastManager = new ToastManager(eventAggregator,soundServiceStub );
    });

    afterEach(() => {
        Threading.delay = _delay;
        Threading.stopDelay = _stop;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(toastManager).toBeDefined();
    });

    it("should display toast on toast added event", () => {

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: 0,
        });

        expect(toastManager.toasts.length).toBe(1);
    });

    it("should fade out toast after dismiss time (seconds)", () => {
        let delayTimeSeconds = 1;

        let delayTicks: any[] = [];

        Threading.delay = (func: any, timeout: number): any => {
            delayTicks.push(func);
            return 1;
        };

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: delayTimeSeconds
        });

        delayTicks[0]();

        expect(toastManager.toasts[0].style).toContain("fade-out");

        delayTicks[1]();

        expect(toastManager.toasts.length).toBe(0);
    });

    it("should remove toast after dismiss time (seconds) and 900 ms of fade out time", () => {
        let delayTimeSeconds = 1;

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: delayTimeSeconds
        });

        expect(delayCallback.firstCall.args[1]).toBe(delayTimeSeconds * 1000);
        expect(delayCallback.secondCall.args[1]).toBe(900);
        expect(toastManager.toasts.length).toBe(0);
    });

    it("should pubish toast removed event", (done) => {
        let delayTimeSeconds = 1;

        eventAggregator.subscribe(UiConstants.TOAST_REMOVED, (toast: IToastItem) => {
            expect(delayCallback.firstCall.args[1]).toBe(delayTimeSeconds * 1000);
            expect(delayCallback.secondCall.args[1]).toBe(900);
            expect(toastManager.toasts.length).toBe(0);
            expect(toast.content).toEqual("content");

            done();
        });

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            id: "jgfskljhgfd",
            title: "Title",
            content: "content",
            dismissTime: delayTimeSeconds,
            style: ""
        });
    });

    it("should restart the toasts timer (cancel and restart) when the new toasts content is the same", () => {
        let delayTimeSeconds = 1;
        let delayTicks: any[] = [];

        Threading.delay = (func: any, timeout: number): any => {
            delayTicks.push(delayTicks);
            return 1;
        };

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: delayTimeSeconds
        });

        expect(toastManager.toasts.length).toBe(1);

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: delayTimeSeconds
        });

        expect(delayCancelCallback.callCount).toBe(1);
    });

    it("should stop the fade out time when the new toasts content is the same and close is scheduled", () => {
        let delayTimeSeconds = 1;
        let delayTicks: any[] = [];

        Threading.delay = (func: any, timeout: number): any => {
            delayTicks.push(func);
            return 1;
        };

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: delayTimeSeconds
        });

        expect(toastManager.toasts.length).toBe(1);

        delayTicks[0]();

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: delayTimeSeconds
        });

        expect(delayCancelCallback.callCount).toBe(2);
    });

    it("should call threading.delay when autoDismiss = true", () => {
        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: 1,
            autoDismiss: true
        });
        expect((delayCallback as Sinon.SinonSpy).called).toBeTruthy();
    });

    it("should call threading.delay when autoDismiss is undefined", () => {
        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: 1
        });
        expect((delayCallback as Sinon.SinonSpy).called).toBeTruthy();
    });

    it("should not call threading.delay when autoDismiss = false", () => {

        eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
            title: "Title",
            content: "content",
            dismissTime: 0,
            autoDismiss: false
        });
        expect((delayCallback as Sinon.SinonSpy).called).toBeFalsy();
    });

});
