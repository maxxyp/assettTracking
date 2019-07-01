/// <reference path="../../../../../typings/app.d.ts" />

import { DropDown } from "../../../../../app/common/ui/elements/dropDown";
import { Threading } from "../../../../../app/common/core/threading";
import { DropdownType } from "../../../../../app/common/ui/elements/models/dropdownType";

describe("the DropDown module", () => {
    let dropDown: DropDown;
    let sandbox: Sinon.SinonSandbox;
    let elementStub: HTMLElement;
    let listObjectArray = [
        {valueItem: "Value1", textItem: "textItem1"},
        {valueItem: "Value2", textItem: "textItem2"},
        {valueItem: "Value3", textItem: "textItem3"},
        {valueItem: "Value4", textItem: "textItem4"},
        {valueItem: "Value 4 and Number 5", textItem: "textItem 4 and textItem 5"}
    ];

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        elementStub = <HTMLElement>{};
        dropDown = new DropDown(elementStub);
        dropDown.valueProperty = "valueItem";
        dropDown.textProperty = "textItem";
        dropDown.values = listObjectArray;

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(dropDown).toBeDefined();
    });

    it("can build list", () => {
        dropDown.attached();
        expect(dropDown.filteredValues.length).toEqual(5);
    });
    it("can build ids into object array", () => {
        dropDown.searchProperties = ["textItem"];
        dropDown.attached();
        expect(dropDown.filteredValues[0]._id).toEqual(1);
    });
    it("can filter for value", () => {
        dropDown.searchProperties = ["valueItem"];
        dropDown.attached();
        dropDown.valueText = "1";
        expect(dropDown.filteredValues.length).toEqual(1);
    });
    it("can filter for multi keywords", () => {
        dropDown.searchProperties = ["valueItem"];
        dropDown.attached();
        dropDown.valueText = "5 4";
        expect(dropDown.filteredValues.length).toEqual(1);
        expect(dropDown.filteredValues[0].valueItem).toEqual("Value 4 and Number 5");
    });
    it("can filter for text", () => {
        dropDown.searchProperties = ["textItem"];
        dropDown.attached();
        dropDown.valueText = "3";
        expect(dropDown.filteredValues.length).toEqual(1);
    });

    it("set undefined for change to blank text", () => {
        dropDown.searchProperties = ["textItem"];
        dropDown.attached();
        dropDown.valueTextChanged("", "old");
        expect(dropDown.value).toEqual(undefined);
    });
    it("can select a dropdown item", () => {
        dropDown.lookupItems = <HTMLElement>{};
        dropDown.attached();
        dropDown.select(3);
        expect(dropDown.value).toEqual("Value3");
        expect(dropDown.valueText).toEqual("textItem3");
        expect(dropDown.filteredValues.length).toEqual(5);
        expect(dropDown.showDropDown).toEqual(false);
    });
    it("can select a dropdown smashbutton item", () => {
        dropDown.lookupItems = <HTMLElement>{};
        dropDown.dropdownType = 2;
        dropDown.smashButtonsSetValue("Value3");
        dropDown.attached();
        dropDown.select(3);
        expect(dropDown.value).toEqual("Value3");
        expect(dropDown.valueText).toEqual("textItem3");
        expect(dropDown.filteredValues.length).toEqual(5);
        expect(dropDown.showDropDown).toEqual(false);
    });
    it("can update selected item on value change", (done) => {
        dropDown.attached();
        dropDown.value = "Value2";
        dropDown.valueChanged(dropDown.value, undefined);
        Threading.delay(() => {
            expect(dropDown.valueText).toEqual("textItem2");
            expect(dropDown.filteredValues.length).toEqual(5);
            expect(dropDown.showDropDown).toEqual(false);
            done();
        }, 100);
    });
    it("can close on tab", (done) => {
        dropDown.attached();
        dropDown.showDropDown = true;
        let kbEvent: any = {};
        kbEvent.keyCode = 9;
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.showDropDown).toEqual(false);
            done();
        }, 100);
    });
    it("can close on escape", (done) => {
        dropDown.lookupItems = <HTMLElement>{};
        dropDown.attached();
        dropDown.showDropDown = true;
        let kbEvent: any = {};
        kbEvent.keyCode = 27;
        kbEvent.preventDefault = () => {
        };
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.showDropDown).toEqual(false);
            done();
        }, 100);
    });
    it("can navigate down", (done) => {
        dropDown.lookupItems = document.createElement("div");
        dropDown.lookupItems.appendChild(document.createElement("div"));
        dropDown.lookupItems.appendChild(document.createElement("div"));
        dropDown.attached();
        dropDown.selectedId = 0;
        dropDown.showDropDown = true;
        let kbEvent: any = {};
        kbEvent.keyCode = 40;
        kbEvent.preventDefault = () => {
        };
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.selectedId).toEqual(1);
            done();
        }, 100);
    });
    it("can navigate up", (done) => {
        dropDown.lookupItems = document.createElement("div");
        dropDown.lookupItems.appendChild(document.createElement("div"));
        dropDown.lookupItems.appendChild(document.createElement("div"));
        dropDown.attached();
        dropDown.showDropDown = true;
        dropDown.selectedId = 1;
        let kbEvent: any = {};
        kbEvent.keyCode = 38;
        kbEvent.preventDefault = () => {
        };
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.selectedId).toEqual(0);
            done();
        }, 100);
    });

    it("can select item using keyboard", (done) => {
        dropDown.lookupItems = <HTMLElement>{};
        dropDown.attached();
        dropDown.selectedId = 2;
        dropDown.showDropDown = true;
        let kbEvent: any = {};
        kbEvent.preventDefault = () => {
        };
        kbEvent.keyCode = 13;
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.value).toEqual("Value3");
            done();
        }, 100);
    });
    it("can select correct  item using enter from textbox", (done) => {
        dropDown.lookupItems = <HTMLElement>{};
        dropDown.attached();
        dropDown.selectedId = -1;
        dropDown.valueText = "textItem2";
        let kbEvent: any = {};
        kbEvent.preventDefault = () => {
        };
        kbEvent.keyCode = 13;
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.value).toEqual("Value2");
            done();
        }, 100);
    });
    it("can select correct item using enter from textbox with fromatted text", (done) => {
        dropDown.lookupItems = <HTMLElement>{};
        dropDown.formatTextValue = "(valueItem):(textItem)";
        dropDown.attached();
        dropDown.selectedId = -1;
        dropDown.valueText = "Value3:textItem3";
        let kbEvent = <any>{};
        kbEvent.preventDefault = () => {
        };
        kbEvent.keyCode = 13;
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.value).toEqual("Value3");
            done();
        }, 100);
    });
    it("cannot select incorrect item using enter from textbox", (done) => {
        dropDown.lookupItems = <HTMLElement>{};
        dropDown.attached();
        dropDown.selectedId = -1;
        dropDown.valueText = "I'm incorrect";
        let kbEvent: any = {};
        kbEvent.preventDefault = () => {
        };
        kbEvent.keyCode = 13;
        dropDown.keyDown(kbEvent);
        Threading.delay(() => {
            expect(dropDown.value).toEqual(undefined);
            expect(dropDown.valueText).toEqual("");
            expect(dropDown.item).toEqual(undefined);
            done();
        }, 100);
    });

    it("can repopulate values on change", () => {
        listObjectArray.push({valueItem: "Value5", textItem: "textItem5"});
        dropDown.searchProperties = ["textItem"];
        dropDown.attached();
        dropDown.valuesChanged();
        expect(dropDown.values.length).toEqual(6);
        expect(dropDown.filteredValues.length).toEqual(6);
        expect(dropDown.filteredValues[0]._id).toEqual(1);
        expect(dropDown.values[5]._id).toEqual(6);
        expect(dropDown.filteredValues[5]._id).toEqual(6);
    });

    it("can not filter if in smash button mode", () => {
        dropDown.noFilter = false;
        dropDown.dropdownType = DropdownType.smashbuttons;
        dropDown.attached();
        expect(dropDown.noFilter).toBe(true);
    });

    describe("smash buttons alphanumeric categories", () => {

        beforeAll(() => {
            listObjectArray = [
                {valueItem: "D1", textItem: "a123"},
                {valueItem: "E0", textItem: "0ASAS"},
                {valueItem: "F2", textItem: "a124"},
                {valueItem: "G3", textItem: "b123"}];
        });

        beforeEach(() => {
            dropDown.dropdownType = DropdownType.smashbuttons;
            dropDown.attached();
        });

        it("creates all letters", () => {
            expect(Object.keys(dropDown.alphabets).length).toEqual(37);
        });

        it("can categorise", () => {
            const {0: zero, A, B} = dropDown.alphabets;

            expect(zero.length).toEqual(1);
            expect(A.length).toEqual(2);
            expect(B.length).toEqual(1);
        });

        it("orders items within their respective category", () => {
            const {A} = dropDown.alphabets;
            const [item1, item2] = A;

            expect(item1.valueItem).toEqual("D1");
            expect(item2.valueItem).toEqual("F2");
        });

        it("get categeory keys", () => {
            const [All, first, second, third, ...rest] = dropDown.alphabetKeys;

            expect(All).toEqual("All");
            expect(first).toEqual("0");
            expect(second).toEqual("1");
            expect(third).toEqual("2");

            const {length} = rest;

            expect(rest[length - 1]).toEqual("Z");
        });

        it("defaults to all", () => {
            expect(dropDown.currentAlphabetLetter).toEqual("All");
        });

        it("sets current alphabet letter and filtered items on clicking a category", () => {
            dropDown.selectAlphabetLetter("A");

            expect(dropDown.currentAlphabetLetter).toEqual("A");

            expect(dropDown.filteredValues.length).toEqual(2);

            const [first, second] = dropDown.filteredValues;
            const {valueItem: v1, textItem: t1} = first;
            const {valueItem: v2, textItem: t2} = second;

            expect(v1).toEqual("D1");
            expect(t1).toEqual("a123");

            expect(v2).toEqual("F2");
            expect(t2).toEqual("a124");
        });

        it("sets filtered values when clicking 'All'", () => {
            dropDown.selectAlphabetLetter("A");
            dropDown.selectAlphabetLetter("All");
            console.log(dropDown.filteredValues);
            expect(dropDown.filteredValues.length).toEqual(4);
        });

        it("should reset alphabet on each attach", () => {

            dropDown.attached();
            expect(dropDown.alphabets["A"].length).toEqual(2);
        });

        it("should handle text properties that start with empty character", () => {

            listObjectArray.push({valueItem: "D1", textItem: " z"});
            dropDown.attached();

            expect(dropDown.alphabets["Z"].length).toEqual(1);
        });

        it("should handle text properties that are falsey", () => {

            listObjectArray = [];
            listObjectArray.push({valueItem: "D1", textItem: null});
            listObjectArray.push({valueItem: "D1", textItem: undefined});
            dropDown.attached();

            expect(dropDown.alphabets["All"].length).toEqual(0);
        });

        it("should handle invalid non alpha-numeric characters", () => {

            listObjectArray = [];
            listObjectArray.push({valueItem: "D1", textItem: ";sdsdsd"});
            dropDown.attached();

            expect(dropDown.alphabets["All"].length).toEqual(0);
        });

        it("showCategories should return true if minItemsToCategoriseSmashButtons undefined", () => {
            listObjectArray = [];
            dropDown.attached();

            expect(dropDown.showCategories).toBe(true);
        });

        it("showCategories should return false if no items", () => {
            listObjectArray = [];
            dropDown.attached();

            expect(dropDown.showCategories).toBe(true);
        });

        it("showCategories should return true if minItemsToCategoriseSmashButtons  = -1", () => {
            listObjectArray = [];
            dropDown.minItemsToCategoriseSmashButtons = -1;
            dropDown.attached();

            expect(dropDown.showCategories).toBe(true);
        });

        it("showCategories should return false if number of items equal to minItemsToCategoriseSmashButtons", () => {
            dropDown.minItemsToCategoriseSmashButtons = 1;
            listObjectArray = [];
            listObjectArray.push({valueItem: "D1", textItem: "sdsdsd"});
            dropDown.attached();

            expect(dropDown.showCategories).toBe(false);

        });

        it("showCategories should return false if number of items less than minItemsToCategoriseSmashButtons", () => {
            dropDown.minItemsToCategoriseSmashButtons = 2;
            listObjectArray = [];
            listObjectArray.push({valueItem: "D1", textItem: "sdsdsd"});
            dropDown.attached();

            expect(dropDown.showCategories).toBe(false);
        });

        it("showCategories should return true if number of items greater than minItemsToCategoriseSmashButtons", () => {
            dropDown.minItemsToCategoriseSmashButtons = 1;
            listObjectArray = [];
            listObjectArray.push({valueItem: "D1", textItem: "sdsdsd"});
            listObjectArray.push({valueItem: "D2", textItem: "sdsdsd"});

            dropDown.attached();

            expect(dropDown.showCategories).toBe(true);
        });        
    });

    describe("filterCount", () => {
        beforeEach(() => {
            listObjectArray = [
                {valueItem: "Value1", textItem: "textItem1"},
                {valueItem: "Value2", textItem: "textItem2"},
                {valueItem: "Value3", textItem: "textItem3"},
                {valueItem: "Value4", textItem: "textItem4"},
                {valueItem: "Value 4 and Number 5", textItem: "textItem 4 and textItem 5"}
            ];

            dropDown = new DropDown(elementStub);
            dropDown.valueProperty = "valueItem";
            dropDown.textProperty = "textItem";
            dropDown.values = listObjectArray;
            dropDown.dropdownType = DropdownType.normal;
            dropDown.attached();
        });

        afterEach(() => {
            dropDown.detached();
        });

    it("filterCount should not be zero once the dropdown is opened and if the list object is not empty", () => {
        dropDown.toggleDropdown();
        expect(dropDown.filterCount).toEqual(5);
    });

    it("filterCount should be zero after the dropdown is closed", () => {
        dropDown.showDropDown = true;
        dropDown.toggleDropdown();
        expect(dropDown.filterCount).toBe(0);
    });

    it("filterCount should be not zero as the entered value exist in the filtered list", () => {
        dropDown.valueText = "1";
        expect(dropDown.filterCount).toBe(1);
    });

    it("filterCount should be zero as the entered value doesn't exist in the filtered list", () => {
        dropDown.valueText = "6";
        expect(dropDown.filterCount).toBe(0);
    });
});
});
