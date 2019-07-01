import {bindable} from "aurelia-templating";
import {bindingMode} from "aurelia-binding";
import {StringHelper} from "../../core/stringHelper";

const CARET_ID: string = "editable-dropdown-caret";

export class EditableDropDown {

    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value: string;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public disabled: boolean;

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public items: string [];

    @bindable({defaultBindingMode: bindingMode.oneWay})
    public placeholder: string;

    public filterList: string [];
    public isOpen: boolean;
    public keyDown: (event: KeyboardEvent) => void;

    private readonly _clickCheck: (event: Event) => void;

    constructor(element: HTMLElement) {

        this.filterList = [];

        this.keyDown = (event: KeyboardEvent) => {

            if (event.keyCode === 13) { // enter key press
                event.preventDefault();
                this.checkAddNewItem(this.value);
                this.filterList = [];
            }

            this.isOpen = false;
        };

        this._clickCheck = (event: Event) => {

            if (event.srcElement.id !== CARET_ID) {
                event.preventDefault();
                this.filterList = [];
            }
        };
    }

    public attached(): void {

        this.isOpen = !this.value;

        if (!this.placeholder) {
            this.placeholder = "Please select or type...";
        }

        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("click", this._clickCheck);
    }

    public detached(): void {
        document.removeEventListener("keydown", this.keyDown);
        document.removeEventListener("click", this._clickCheck);

    }

    public select(item: string, index: number): void {

        if (StringHelper.isEmptyOrUndefinedOrNull(item)) {
            return;
        }

        if (this.filterList && this.filterList.length > 0) {
            this.value = this.filterList[index];
        } else {
            this.value = item;
        }

        this.filterList = [];
        this.isOpen = false;
    }

    public toggleCaret(): void {

        if (this.disabled) {
            return;
        }

        const {isOpen, filterList} = this;
        const {length: listHasItems} = filterList;

        if (!isOpen && listHasItems) {
            this.clickOpen();
            return;
        }

        if (!isOpen && !listHasItems) {
            this.clickClose();
            return;
        }

        if (isOpen && !listHasItems) {
            this.filterList = this.getItems();
        }
    }

    public blurListener(event: any): void {

        this.checkAddNewItem(this.value);
       // this.select(this.value,0);
    }

    public search(): boolean {

        this.isOpen = true;

        if (this.value && this.items) {
            this.filterList = this.getItems(this.value);
            return true;
        }

        this.filterList = this.items;
        return true;
    }

    private checkAddNewItem(item: string): void {

        if (StringHelper.isEmptyOrUndefinedOrNull(item)) {
            return;
        }

        const index = this.items.findIndex(i => i === item);

        if (index === -1) {
            this.items = [...this.items, item];
        }
    }

    private clickClose(): void {

        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.value = undefined;
        this.filterList = [];
    }

    private clickOpen(): void {

        this.isOpen = true;
        this.filterList = this.getItems();
    }

    private getItems(searchStr: string = null): string [] {

        const filteredItems = this.items.filter(a => a && a.trim().length > 0);

        if (StringHelper.isEmptyOrUndefinedOrNull(searchStr)) {
            return filteredItems;
        }

        return filteredItems.filter(a => a.toUpperCase().indexOf(searchStr.toUpperCase()) > -1);
    }

}
