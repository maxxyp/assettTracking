import {BindingEngine, Disposable} from "aurelia-binding";
import {ObjectHelper} from "../../core/objectHelper";

export class PathObserver implements Disposable {
    private _bindingEngine: BindingEngine;
    private _subject: any;
    private _path: string;
    private _pathSplit: string[];
    private _subscriptions: Disposable[];
    private _valueChanged: (oldValue: any, newValue: any) => void;
    private _value: any;

    constructor(bindingEngine: BindingEngine, subject: any, path: string) {
        this._bindingEngine = bindingEngine;
        this._subject = subject;
        this._path = path;
        let initialPathSplit = path ? path.split(".") : [];
        this._pathSplit = [];

        for (let i = 0; i < initialPathSplit.length; i++) {
            let arrayIdx = initialPathSplit[i].indexOf("[");
            if (arrayIdx > 0) {
                // if the path element is an array index then make sure
                // we monitor the array changing as well as the indexed item
                this._pathSplit.push(initialPathSplit[i].substr(0, arrayIdx));
                this._pathSplit.push(initialPathSplit[i].substr(arrayIdx + 1, initialPathSplit[i].length - arrayIdx - 2));
            } else {
                this._pathSplit.push(initialPathSplit[i]);
            }
        }

        this._subscriptions = [];

        this.createSubscription(this._subject, 0);
        this.updateValue();
    }

    public subscribe(valueChanged: (newValue: any, oldValue: any) => void): Disposable {
        this._valueChanged = valueChanged;
        return this;
    }

    public dispose(): void {
        for (let i = 0; i < this._subscriptions.length; i++) {
            this._subscriptions[i].dispose();
        }

        this._subscriptions = [];
        this._valueChanged = null;
    }

    private createSubscription(subject: any, propertyIndex: number): void {
        /* only create a subscription if the object exists */
        if (subject !== null && subject !== undefined && propertyIndex < this._pathSplit.length) {
            /* subscribe to the property on the object */
            let subscription = this._bindingEngine.propertyObserver(subject, this._pathSplit[propertyIndex])
                .subscribe((newValue, oldValue) => {
                    /* if this is the subscription for the end of the path then hand on the value to the subscriber */
                    if (propertyIndex === this._pathSplit.length) {
                        this.triggerValueChanged();
                    } else {
                        /* if the object has changed and now has no value destroy any subscriptions further down the path */
                        if (newValue === null || newValue === undefined) {
                            this.destroySubscriptions(propertyIndex);

                            /* this was a mid path change to no object so the end path is now undefined */
                            this.triggerValueChanged();
                        } else {
                            /* subscription has a value so try and create and subsequent subscriptions in the path */
                            let thisSubject: any = subject[this._pathSplit[propertyIndex - 1]];
                            this.createSubscription(thisSubject, propertyIndex);

                            /* this was a mid path change to no object so the end path is now undefined */
                            this.triggerValueChanged();
                        }
                    }
                });

            this._subscriptions.push(subscription);

            this.createSubscription(subject[this._pathSplit[propertyIndex]], ++propertyIndex);
        }
    }

    private destroySubscriptions(propertyIndex: number): void {
        for (let i = propertyIndex; i < this._subscriptions.length; i++) {
            this._subscriptions[i].dispose();
        }

        this._subscriptions.splice(propertyIndex, this._subscriptions.length - propertyIndex);
    }

    private updateValue() : void {
        this._value = ObjectHelper.getPathValue(this._subject, this._path);
    }

    private triggerValueChanged() : void {
        let oldValue: any = this._value;
        this.updateValue();

        if (this._valueChanged) {
            this._valueChanged(this._value, oldValue);
        }
    }
}
