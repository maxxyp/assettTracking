/// <reference path="../../../../../typings/app.d.ts" />

import {ButtonList} from "../../../../../app/common/ui/elements/buttonList";
import {IconButtonListItem} from "../../../../../app/common/ui/elements/models/iconButtonListItem";
import {ButtonListItem} from "../../../../../app/common/ui/elements/models/buttonListItem";


describe("the ButtonList  module", () => {
    let buttonList: ButtonList;
    let mockEvent = new Event("");

    beforeAll(() => {
        sinon.stub(mockEvent, "stopPropagation").returns(null);
    });
	
    beforeEach(() => {
        buttonList = new ButtonList(<Element>{});
    });

    it("can be created", () => {
        expect(buttonList).toBeDefined();
    });

    it("can be populated with simple array ", () => {
        buttonList.values = ["one", "two", "three"];
        buttonList.attached();
        expect(buttonList.items.length === 3).toBeTruthy();
    });

    it("multi select option set and selectable", () => {
        buttonList.items = [
            {"text": "Button one", "value": "1", "disabled": false},
            {"text": "Button two", "value": "2", "disabled": false},
            {"text": "Button three", "value": "3", "disabled": false}];
        buttonList.multiSelect = true;
        buttonList.attached();
        expect(buttonList.buttonLayout).toBe("horizontal");
        expect(buttonList.multiSelect).toBe(true);
        buttonList.setValue(buttonList.items[1], 1, mockEvent);
        expect(buttonList.value).toEqual(["2"]);
    });

    it("multi select option value of undefined not present in value", () => {
        buttonList.items = [
            {"text": "Button one", "value": "1", "disabled": false},
            {"text": "Button two", "value": "2", "disabled": false},
            {"text": "Button three", "value": "3", "disabled": false}];
        buttonList.multiSelect = true;
        buttonList.buttonLayout = "horizontal";
        buttonList.attached();
        buttonList.setValue(buttonList.items[1], 1, mockEvent);
        expect(buttonList.value).toEqual(["2"]);
    });

    it("cannot setValue on disabled item ", () => {
        buttonList.multiSelect = false;
        buttonList.items = [{"text": "Button one", "value": "111", "disabled": true},
            {"text": "Button one", "value": "222", "disabled": true}];
        buttonList.attached();
        buttonList.setValue(buttonList.items[1], 1, mockEvent);
        expect(buttonList.value).toBe(undefined);
    });
    it("can setValue on active item ", () => {
        buttonList.multiSelect = false;
        buttonList.items = [{"text": "Button one", "value": "111", "disabled": false},
            {"text": "Button one", "value": "222", "disabled": false}];
        buttonList.attached();
        buttonList.setValue(buttonList.items[1], 1, mockEvent);
        expect(buttonList.value).toBe("222");
    });

    it("can setValues on multi active item ", () => {
        buttonList.multiSelect = false;
        buttonList.items = [{"text": "Button one", "value": "111", "disabled": false},
            {"text": "Button one", "value": "222", "disabled": false}];
        buttonList.attached();
        buttonList.setValue(buttonList.items[1], 1, mockEvent);
        expect(buttonList.value).toBe("222");
    });

    it("can setValue on no active item ", () => {
        buttonList.multiSelect = true;
        buttonList.items = [
            {"text": "Button one", "value": "111", "disabled": false},
            {"text": "Button one", "value": "222", "disabled": false}
        ];
        buttonList.attached();
        buttonList.setValue(buttonList.items[1], 1, mockEvent);
        expect(buttonList.value).toEqual(["222"]);
    });

    it("can attach with no items", () => {
        buttonList.attached();
        expect(buttonList.value).toBeUndefined();
    });

    it("can externally trigger value changing", () => {
        buttonList.multiSelect = false;
        buttonList.items = [
            {"text": "Button one", "value": "111", "disabled": false},
            {"text": "Button one", "value": "222", "disabled": false}
        ];
        buttonList.attached();
        buttonList.value = "222";
        expect(buttonList.value).toBe("222");
    });

    it("can recognise non-icon button list item", () => {
        expect(buttonList.isIconButton(new ButtonListItem("", "", false))).toBe(false);
    });

    it("can recognise icon button list item", () => {
        expect(buttonList.isIconButton(new IconButtonListItem("", "", false, "class"))).toBe(true);
    });

    it("reverts to normal icon if iconClassName is undefined", () => {
        expect(buttonList.isIconButton(new IconButtonListItem("", "", false, undefined))).toBe(false);
    });
});
