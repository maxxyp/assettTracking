/// <reference path="../../../../../typings/app.d.ts" />

import {Collapsible} from "../../../../../app/common/ui/elements/collapsible";
import {IconDetailItem} from "../../../../../app/common/ui/elements/models/iconDetailItem";

describe("the Collapsible module", () => {

    let collapsible: Collapsible;

    beforeEach(() => {
        collapsible = new Collapsible();
        collapsible.contentElement = <HTMLElement>{ style: {}};
        collapsible.titleText = "My collapsed title";
    });

    it("can be created", () => {
        expect(collapsible).toBeDefined();
    });

    it("should show itself if isCollapsed flag is false upon attach", () => {
        spyOn(collapsible, "show");
        collapsible.isCollapsed = false;
        collapsible.attached();
        expect(collapsible.show).toHaveBeenCalledTimes(1);
    });

    it("should show itself if isCollapsed flag is true upon attach", () => {
        spyOn(collapsible, "hide");
        collapsible.isCollapsed = true;
        collapsible.attached();
        expect(collapsible.hide).toHaveBeenCalledTimes(1);
    });

    describe("show() method", () => {

        it("can set the isCollapsed flag", () => {
            collapsible.show();
            expect(collapsible.isCollapsed).toBe(false);
        });

        it("can set display to inline", () => {
            collapsible.contentElement.style.display = "none";
            collapsible.show();
            expect(collapsible.contentElement.style.display).toEqual("inline");
        });
    });

    describe("hide() method", () => {

        it("can set the display to none", () => {
            collapsible.contentElement.style.display = "inline";
            collapsible.hide();
            expect(collapsible.contentElement.style.display).toEqual("none");
        });

        it("can set the isCollapsed flag", () => {
            collapsible.hide();
            expect(collapsible.isCollapsed).toBe(true);
        });
    });

    describe("toggle() method", () => {

        it("should call show() if isCollapsed is true", () => {
            collapsible.isCollapsed = true;
            spyOn(collapsible, "show");
            collapsible.toggle();
            expect(collapsible.show).toHaveBeenCalledTimes(1);
        });

        it("should call hide() if isCollapsed is false", () => {
            collapsible.isCollapsed = false;
            spyOn(collapsible, "hide");
            collapsible.toggle();
            expect(collapsible.hide).toHaveBeenCalledTimes(1);
        });

        it("should call the click callback when set", () => {
            let timesCalled = 0;
            collapsible.setClickCallback(() => {
                timesCalled++;
            });

            collapsible.toggle();

            expect(timesCalled).toEqual(1);

        });

        it("should return true if there are any icons", () => {
            collapsible.headerIcons = [new IconDetailItem("fa fa-thumbs-up"), new IconDetailItem("fa fa-thumbs-down")];
            
            expect(collapsible.hasHeaderIcons()).toEqual(true);
        });

        it("should return false if there is empty list of icons", () => {
            collapsible.headerIcons = [];
            
            expect(collapsible.hasHeaderIcons()).toEqual(false);
        });        

        it("should return false if there are no icons", () => {
            expect(collapsible.hasHeaderIcons()).toEqual(false);
        });        

    });

});
