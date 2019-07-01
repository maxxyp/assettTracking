// a ValueConverter for iterating an Object's properties inside of a repeat.for in Aurelia
import {IKeyValue} from "./IKeyValue";

export class ObjectKeysValueConverter {
    public toView(obj: any): IKeyValue[] {
        let temp: IKeyValue[] = [];
        // a basic for..in loop to get object properties
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...in
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                let value = obj[prop];
                let type = Array.isArray(value) ? "array" : typeof value;
                temp.push({key: prop, value, type });
            }
        }

        return temp;
    }
}
