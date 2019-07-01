/// <reference path="../../../../../../typings/app.d.ts" />

import {TabButtons} from "../../../../../../app/hema/presentation/elements/navigation/tabButtons";
import {Router} from "aurelia-router";
import {EventAggregator} from "aurelia-event-aggregator";

describe("the TabButtons module", () => {
    let tabButtons: TabButtons;
    let sandbox: Sinon.SinonSandbox;
    let routerStub: Router;
    let eaStub: EventAggregator;
    let disposed: boolean;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        routerStub = <Router>{};

        disposed = false;

        eaStub = <EventAggregator>{};
        eaStub.subscribe = sandbox.stub().returns({ dispose: () => { disposed = true; } });

        tabButtons = new TabButtons(routerStub, eaStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(tabButtons).toBeDefined();
    });

    it("can call attached", () => {
        tabButtons.attached();
        expect(this.activeTab).toEqual(undefined);
        expect(disposed).toBe(false);
    });

    it("can call detached", () => {
        tabButtons.attached();
        tabButtons.detached();
        expect(disposed).toBe(true);
    });

    it("can get activeTab", () => {
        tabButtons.activeTab = "x";
        expect(tabButtons.activeTab).toBe("x");
    });
});
