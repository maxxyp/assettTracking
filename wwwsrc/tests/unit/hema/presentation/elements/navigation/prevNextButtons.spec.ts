/// <reference path="../../../../../../typings/app.d.ts" />

import {PrevNextButtons} from "../../../../../../app/hema/presentation/elements/navigation/prevNextButtons";
import {Router, NavigationInstruction} from "aurelia-router";
import {EventAggregator} from "aurelia-event-aggregator";

describe("the PrevNextButtons module", () => {
    let prevNextButtons: PrevNextButtons;
    let sandbox: Sinon.SinonSandbox;
    let routerStub: Router;
    let eaStub: EventAggregator;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        routerStub = <Router>{};
        routerStub.currentInstruction = <NavigationInstruction>{};
        routerStub.currentInstruction.fragment = "myroute/1";
        routerStub.currentInstruction.params = { myid: "1" };

        eaStub = <EventAggregator>{};
        eaStub.publish = sandbox.stub();

        prevNextButtons = new PrevNextButtons(routerStub, eaStub);
        prevNextButtons.values = ["0", "1", "2"];
        prevNextButtons.paramId = "myid";
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(prevNextButtons).toBeDefined();
    });

    describe("hasMultipleItems", () => {

        it("can be called when there are multiple items", () => {
            expect(prevNextButtons.hasMultipleItems).toBe(true);
        });

        it("can be called when there is a single item", () => {
            prevNextButtons.values = ["0"];
            expect(prevNextButtons.hasMultipleItems).toBe(false);
        });

    });

    describe("navigateToNext", () => {

        let navigateSpy: Sinon.SinonSpy;
        beforeEach(() => {
            navigateSpy = routerStub.navigate = sandbox.spy();
        });

        it("can return the next id when at the start of sequence", () => {
            routerStub.currentInstruction.fragment = "myroute/0";
            routerStub.currentInstruction.params = { myid: "0" };
            prevNextButtons.navigateToNext();
            expect(navigateSpy.calledWith("myroute/1")).toBe(true);
        });

        it("can return the next id when in the middle of sequence", () => {
            routerStub.currentInstruction.fragment = "myroute/1";
            routerStub.currentInstruction.params = { myid: "1" };
            prevNextButtons.navigateToNext();
            expect(navigateSpy.calledWith("myroute/2")).toBe(true);
        });

        it("can stop at the last id when at the end of sequence", () => {
            routerStub.currentInstruction.fragment = "myroute/2";
            routerStub.currentInstruction.params = { myid: "2" };
            prevNextButtons.navigateToNext();
            expect(navigateSpy.notCalled).toBe(true);
        });

    });

    describe("navigateToPrevious", () => {

        let navigateSpy: Sinon.SinonSpy;
        beforeEach(() => {
            navigateSpy = routerStub.navigate = sandbox.spy();
        });

        it("can not navigate to the from the first id when at the start of sequence", () => {
            routerStub.currentInstruction.fragment = "myroute/0";
            routerStub.currentInstruction.params = { myid: "0" };
            prevNextButtons.navigateToPrevious();
            expect(navigateSpy.notCalled).toBe(true);
        });

        it("can navigate to the previous id when in the middle of sequence", () => {
            routerStub.currentInstruction.fragment = "myroute/1";
            routerStub.currentInstruction.params = { myid: "1" };
            prevNextButtons.navigateToPrevious();
            expect(navigateSpy.calledWith("myroute/0")).toBe(true);
        });

        it("can navigate to the previous id when at the end of sequence", () => {
            routerStub.currentInstruction.fragment = "myroute/2";
            routerStub.currentInstruction.params = { myid: "2" };
            prevNextButtons.navigateToPrevious();
            expect(navigateSpy.calledWith("myroute/1")).toBe(true);
        });

    });
});
