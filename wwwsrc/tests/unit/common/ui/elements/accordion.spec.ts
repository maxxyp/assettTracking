/// <reference path="../../../../../typings/app.d.ts" />

import {Accordion} from "../../../../../app/common/ui/elements/accordion";
import {Collapsible} from "../../../../../app/common/ui/elements/collapsible";

describe("the Accordion module", () => {
    let accordion: Accordion;
    let collapsible: Collapsible;

    beforeEach(() => {
        accordion = new Accordion();
        collapsible = new Collapsible();
        accordion.sections = [];
        accordion.sections.push(collapsible);
    });

    it("can be created", () => {
        expect(accordion).toBeDefined();
    });

    it("can be attached", () => {
        spyOn(collapsible, "setClickCallback").and.callThrough();
        accordion.attached();
        expect(collapsible.setClickCallback).toHaveBeenCalledWith(jasmine.any(Function));
        spyOn(accordion, "clickCallback");
        spyOn(collapsible, "show");
        collapsible.toggle();
        expect(accordion.clickCallback).toHaveBeenCalledWith(collapsible);
        expect(collapsible.show).toHaveBeenCalledTimes(1);
    });

    it("should expand all collapsible sections when expandAll()is called", () => {
        spyOn(collapsible, "show");
        accordion.expandAll();
        expect(collapsible.show).toHaveBeenCalledTimes(1);
    });

    it("should collapse all collapsible sections when collapseAll()is called", () => {
        spyOn(collapsible, "hide");
        accordion.collapseAll();
        expect(collapsible.hide).toHaveBeenCalledTimes(1);
    });

    it("should hide collapsible sections on collapsible click", () => {
        let collapsible2: Collapsible = new Collapsible();
        collapsible.isCollapsed = false;
        spyOn(collapsible, "hide");
        accordion.clickCallback(collapsible2);
        expect(collapsible.hide).toHaveBeenCalledTimes(1);
    });

    it("should skip hiding the collapsible if its the same one clicked", () => {
        collapsible.isCollapsed = false;
        spyOn(collapsible, "hide");
        accordion.clickCallback(collapsible);
        let result = <any>collapsible.hide;
        expect(result.calls.count()).toEqual(0);
    });

    it("should set isCollapsed to true on passed collapsible if all expanded", () => {
        let collapsible2: Collapsible = new Collapsible();
        collapsible.isCollapsed = false;

        spyOn(collapsible, "hide");
        spyOn(collapsible, "show");
        spyOn(collapsible2, "hide");

        accordion.expandAll();
        accordion.clickCallback(collapsible2);
        expect(collapsible2.isCollapsed).toBeTruthy();
        expect(collapsible.show).toHaveBeenCalledTimes(1);
        expect(collapsible.hide).toHaveBeenCalledTimes(1);
    });

    it("should exit clickCallback if controls are showing", () => {
        let collapsible2: Collapsible = new Collapsible();
        spyOn(collapsible, "hide");
        let hide = <any>collapsible.hide;
        accordion.showControls = true;
        accordion.clickCallback(collapsible2);
        expect(hide.calls.count()).toEqual(0);
    });

});
