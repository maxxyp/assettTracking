/// <reference path="../../../../typings/app.d.ts" />

import { bindable, bindingMode, customElement } from "aurelia-framework";
import { computedFrom, observable } from "aurelia-binding";
import { inject } from "aurelia-dependency-injection";
import { Threading } from "../../core/threading";
import { DOM } from "aurelia-pal";
import { DropdownType } from "./models/dropdownType";

@customElement("drop-down")
@inject(Element)
export class DropDown {
    private static _ID_PROPERTY: string = "_id";
    private static _SHOW_ALL_ITEMS: string = "All";
    private static _ALPHABET_ITEMS: string = "All,0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public placeholder: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public limit: number;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value: string;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    public valueItem: any;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public disabled: boolean;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public readonly: boolean;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public values: any[];

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public valueProperty: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public textProperty: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public searchProperties: string[];

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public crossClass: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public caretClass: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public clearOnSelect: boolean;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public formatTextValue: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public errorMessage: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public showErrorMessage: boolean;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public noFilter: boolean;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public dropdownType: DropdownType;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public minItemsToCategoriseSmashButtons: number;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    public filterCount: number;

    @observable
    public valueText: string;
    public item: any;
    public errorMsg: string;
    public showSmash: boolean;
    public heightStyle: string;
    public alphabets: { [index: string]: any };

    public showDropDown: boolean;
    public filteredValues: any[];
    public lookupItems: HTMLElement;
    public selectedId: number;
    public focusListener: (event: FocusEvent) => void;
    public blurListener: (event: FocusEvent) => void;
    public keyDown: (event: KeyboardEvent) => void;
    public alphabetKeys: string[];

    private _hasFocus: boolean;
    private _element: HTMLElement;
    private _lastShow: number;
    private _clickCheck: () => void;

    // following related smash buttons and grouping items alphanumerically
    private _selectedAlphabetLetter: string;

    constructor(element: HTMLElement) {
        this.noFilter = false;
        this.showSmash = false;
        this.minItemsToCategoriseSmashButtons = -1;
        this.heightStyle = "";
        this._element = element;
        this.selectedId = -1;
        this.showDropDown = false;
        this.filteredValues = [];
        this.filterCount = 0;

        this.keyDown = (event: KeyboardEvent) => {
            if (this.showDropDown) {
                if (event.keyCode === 9) { // tab key press
                    this.checkForListValue();
                    this.closeDropdown();
                }
                if (event.keyCode === 13) { // enter key press
                    event.preventDefault();
                    if (this.selectedId > -1) {
                        this.select(this.filteredValues[this.selectedId][DropDown._ID_PROPERTY]);
                    } else {
                        this.checkForListValue();
                    }
                    this.closeDropdown();
                }
                if (event.keyCode === 27) { // escape key press
                    event.preventDefault();
                    this.checkForListValue();
                    this.closeDropdown();
                }
                if (event.keyCode === 38) { // up key press
                    event.preventDefault();
                    if (this.selectedId > 0) {
                        this.selectedId--;
                        this.lookupItems.scrollTop = this.lookupItems.scrollTop - this.findItemHeight();
                    }
                }
                if (event.keyCode === 40) { // down key press
                    event.preventDefault();
                    if (this.selectedId < this.filteredValues.length - 1) {
                        this.selectedId++;
                        if (this.selectedId > 1) {
                            this.lookupItems.scrollTop = this.lookupItems.scrollTop + this.findItemHeight();
                        }
                    }
                }
            } else {
                if (event.keyCode === 40 && this._hasFocus) { // down key press
                    event.preventDefault();
                    this.openDropdown();
                }
            }
        };
        this._clickCheck = () => {
            if (new Date().getTime() - this._lastShow > 500) {
                this.closeDropdown();
                this.checkForListValue();
            }
        };
        this.focusListener = () => {
            this._element.children[0].classList.add("ctrl-focus");
            this._hasFocus = true;
        };
        this.blurListener = () => {
            this._element.children[0].classList.remove("ctrl-focus");
            this._hasFocus = false;
            Threading.nextCycle(() => {
                if (!this._hasFocus) {
                    this.blur();
                }
            });
        };

    }

    public attached(): void {
        if (this.dropdownType === DropdownType.smashbuttons) {
            this.noFilter = true;
        }

        if (!this.caretClass) {
            this.caretClass = "fa-caret-down";
        }
        if (!this.crossClass) {
            this.crossClass = "fa-close";
        }
        if (!this.placeholder) {
            this.placeholder = "Please select or type...";
        }
        if (!this.searchProperties) {
            this.searchProperties = [this.textProperty];
        }
        if (this.values) {
            this.addIdsToObjectArray();
        }
        if (!this.limit) {
            this.limit = 99999;
        }

        this.processValue(this.value);

        this.setupAlphabeticalKeys();

        document.addEventListener("keydown", this.keyDown);
    }

    public detached(): void {
        document.removeEventListener("click", this._clickCheck);
        document.removeEventListener("keydown", this.keyDown);
    }

    public openDropdown(): void {
        this.selectedId = -1;
        this._lastShow = new Date().getTime();
        this.showDropDown = true;
        this.filterCount = this.filteredValues.length;
        document.addEventListener("click", this._clickCheck);
    }

    public closeDropdown(): void {
        this.showDropDown = false;
        document.removeEventListener("click", this._clickCheck);
        if (!this.value) {
            this.filterCount = 0;
        }        
    }

    public valuesChanged(): void {
        this.addIdsToObjectArray();
        this.resetFiltered();
        this.setupAlphabeticalKeys();
    }

    public valueChanged(newValue: any, oldValue: any): void {
        this.processValue(newValue);
    }

    public valueTextChanged(newValue: string, oldValue: string): void {
        if (newValue === "") {
            this.value = undefined;
            this.item = undefined;
            this.valueItem = undefined;
            this.filterCount = this.filteredValues.length;
        }
        this.filterValues();

        this.errorMsg = (this.showErrorMessage && newValue !== "" && this.filteredValues.length === 0) ? this.errorMessage : undefined;
    }

    public select(id: number): void {
        if (id > -1) {
            let currentId: number = this.values.map((v: any) => {
                return v[DropDown._ID_PROPERTY];
            }).indexOf(id);
            if (this.clearOnSelect) {
                this.valueText = "";
            } else {
                this.valueText = this.formatValueTextString(id - 1);
            }
            this.value = this.values[currentId][this.valueProperty];
            this.item = this.values[id];
            this.valueItem = this.values[currentId];
            this.closeDropdown();
            this.lookupItems.scrollTop = 0;
            this.resetFiltered();

            /* Allow the current value to propogate before clearing it */
            if (this.clearOnSelect) {
                Threading.nextCycle(() => {
                    this.value = undefined;
                });
            }
        }
    }

    public filterValues(): void {
        this.selectedId = -1;
        this.resetFiltered();
        if (this.valueText && this.valueText.length > 0) {
            this.filteredValues = this.filteredValues.filter((value) => {
                let found: boolean = false;
                let keywords: string[] = this.valueText.toLocaleLowerCase().split(" ");
                for (let index = 0; index < this.searchProperties.length; index++) {
                    let foundCount: number = 0;
                    let property = this.searchProperties[index];
                    for (let keywordsCount: number = 0; keywordsCount < keywords.length; keywordsCount++) {
                        if (value && value[property] && value[property].toString().toLowerCase().indexOf(keywords[keywordsCount].toLowerCase()) > -1
                            || this.formatValueTextString(value._id - 1).toString().toLowerCase().indexOf(keywords[keywordsCount].toLowerCase()) > -1) {
                            foundCount++;
                        }
                    }
                    if (foundCount >= keywords.length) {
                        found = true;
                        break;
                    }
                }
                return found;
            });
            this.filterCount = this.filteredValues.length;
            this.openDropdown();
        }
    }

    public toggleDropdown(): void {
        if (!this.disabled) {
            if (this.dropdownType === DropdownType.smashbuttons) {
                if (this.isDoubleHeightNeeded(this.filteredValues, this.textProperty)) {
                    this.heightStyle = "height:100px !important";
                }
                this.showSmash = true;
            } else {
                if (this.showDropDown) {
                    this.closeDropdown();
                } else {
                    this.openDropdown();
                }
            }
        }
    }

    public blur(): void {
        this._element.dispatchEvent(DOM.createCustomEvent("blur", {
            detail: {
                value: this._element
            },
            bubbles: true
        }));
    }

    public smashButtonsSetValue(selectedValue: string): void {
        this.value = selectedValue;
        this.showSmash = false;
    }

    public cancel(): void {
        if (this.dropdownType === DropdownType.smashbuttons) {
            this.selectAlphabetLetter(DropDown._SHOW_ALL_ITEMS);
        }
        this.showSmash = false;
    }

    public selectAlphabetLetter(alphabetLetter: string): void {

        if (alphabetLetter === DropDown._SHOW_ALL_ITEMS) {
            this.filteredValues = [...this.values];
            this._selectedAlphabetLetter = alphabetLetter;
            return;
        }

        if (this.alphabets[alphabetLetter].length > 0) {
            this.filteredValues = this.alphabets[alphabetLetter];
            this._selectedAlphabetLetter = alphabetLetter;
        }
    }

    public get currentAlphabetLetter(): string {
        return this._selectedAlphabetLetter;
    }

    @computedFrom("showSmash", "values")
    public get showCategories(): boolean {
        const noItems = this.values ? this.values.length : 0;
        return this.minItemsToCategoriseSmashButtons === -1 || noItems >= this.minItemsToCategoriseSmashButtons;
    }

    private checkForListValue(): void {
        let foundPos: number = this.values.map((v: any) => {
            return this.formatValueTextString(v._id - 1);
        }).indexOf(this.valueText);

        if (foundPos > -1) {
            this.valueText = this.formatValueTextString(foundPos); // this.values[foundPos][this.textProperty];
            this.value = this.values[foundPos][this.valueProperty];
            this.item = this.values[foundPos];
            this.valueItem = this.values[foundPos];
        } else {
            this.valueText = "";
            this.value = undefined;
            this.item = undefined;
            this.valueItem = undefined;
            this.filterCount = this.filteredValues.length;
        }
        this.closeDropdown();
        this.resetFiltered();
    }

    private formatValueTextString(valueId: number): string {
        if (this.formatTextValue && valueId > -1) {
            let val = this.formatTextValue.replace(/\((.+?)\)/g, (match, idx) => {
                return this.values[valueId][idx];
            });

            if (val.trim().indexOf("/") === val.trim().length - 1) {
                return this.values[valueId][this.textProperty];
            }
            return val;
        } else if (valueId === -1) {
            return "";
        } else {
            return this.values[valueId][this.textProperty];
        }
    }

    private processValue(newValue: any): void {
        if (this.values) {
            let foundPos: number = this.values.map((v: any) => {
                return v[this.valueProperty];
            }).indexOf(newValue);

            if (foundPos > -1 && !this.clearOnSelect) {
                newValue = this.values[foundPos][this.valueProperty];
                this.valueText = this.formatValueTextString(foundPos);
                this.item = this.values[foundPos];
            } else if (foundPos > -1 && this.clearOnSelect) {
                newValue = this.values[foundPos][this.valueProperty];
                this.valueText = "";
                this.item = this.values[foundPos];
            } else {
                newValue = undefined;
                this.valueText = "";
                this.item = undefined;
            }

            this.closeDropdown();
            this.resetFiltered();
        }
    }

    private findItemHeight(): number {
        let item: HTMLElement;
        item = <HTMLElement>this.lookupItems.children[this.selectedId];
        return item.offsetHeight;
    }

    private isDoubleHeightNeeded(items: any[], textProperty: string): boolean {
        let result: boolean = false;
        items.forEach(item => {
            if (item[textProperty].length > 30) {
                result = true;
            }
        });
        return result;
    }

    private resetFiltered(): void {
        this.filteredValues = [];
        if (this.values && this.values.length > 0) {
            this.values.forEach(value => {
                if (!value[this.textProperty]) {
                    value[this.textProperty] = value[this.valueProperty];
                }
                if (value[this.textProperty] && value[this.valueProperty]) {
                    this.filteredValues.push(value);
                }
            });

            // this.filteredValues.sort();
        }
    }

    private addIdsToObjectArray(): void {
        for (let index = 0; index < this.values.length; index++) {
            let valueItem = this.values[index];
            valueItem[DropDown._ID_PROPERTY] = index + 1;
        }
    }

    private setupAlphabeticalKeys(): void {

        if (this.dropdownType !== DropdownType.smashbuttons) {
            return;
        }

        if (!this.values || this.values.length === 0) {
            return;
        }

        // initialise alphabet categories used for smash buttons

        this.alphabetKeys = DropDown._ALPHABET_ITEMS.split(",");
        this.alphabets = {};

        for (let ch of this.alphabetKeys) {
            this.alphabets[ch] = [];
        }
        this._selectedAlphabetLetter = DropDown._SHOW_ALL_ITEMS;

        this.values.forEach(v => {
            if (v && v[this.textProperty] && v[this.textProperty].length > 0) {

                const text = v[this.textProperty].trim(); // need to remove trailing spaces
                const letter = text.charAt(0).toUpperCase();

                if (this.alphabets[letter]) {
                    this.alphabets[letter].push(v);
                }
            }
        });
    }
}
