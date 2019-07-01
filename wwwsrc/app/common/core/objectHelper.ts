export class ObjectHelper {
    public static isObject(object: any): boolean {
        if (object === null) {
            return false;
        } else if (object === undefined) {
            return false;
        } else {
            return typeof object === "object";
        }
    }

    public static hasKeys(object: any): boolean {
        if (object === null) {
            return false;
        } else if (object === undefined) {
            return false;
        } else {
            return Object.keys(object).length > 0;
        }
    }

    public static getClassName(object: any): string {
        if (object) {
            let constructor = typeof object === "function" ? object.toString() : object.constructor.toString();
            let results = constructor.match(/\w+/g);
            return (results && results.length > 1) ? results[1] : "<no object>";
        } else {
            return "<no object>";
        }
    }

    public static getPathValue(subject: any, path: string): any {
        let ret: any = undefined;

        if (path && subject) {
            let parts: string[] = path.split(".");

            for (let i = 0; i < parts.length; i++) {
                let arrayOperatorStartIndex = parts[i].indexOf("[");

                if (arrayOperatorStartIndex !== -1) {
                    let propertyName: string = parts[i].substr(0, arrayOperatorStartIndex);

                    if (subject[propertyName] !== null && subject[propertyName] !== undefined && subject[propertyName] instanceof Array) {
                        let arrayOperatorEndIndex = parts[i].indexOf("]");

                        if (arrayOperatorEndIndex !== -1) {
                            let index: string = parts[i].substr(arrayOperatorStartIndex + 1, arrayOperatorEndIndex - arrayOperatorStartIndex - 1);

                            if (subject[propertyName][index] !== null && subject[propertyName][index] !== undefined) {
                                subject = subject[propertyName][index];
                            } else {
                                subject = undefined;
                                break;
                            }
                        } else {
                            subject = undefined;
                            break;
                        }
                    } else {
                        subject = undefined;
                        break;
                    }
                } else {
                    if (subject[parts[i]] !== null && subject[parts[i]] !== undefined) {
                        subject = subject[parts[i]];
                    } else {
                        subject = undefined;
                        break;
                    }
                }
            }

            ret = subject;
        }

        return ret;
    }

    public static clone(object: any): any {
        if (object == null || typeof object !== "object") {
            return object;
        } else if (object.constructor !== Object && object.constructor !== Array) {
            return object;
        } else if (object.constructor === Date || object.constructor === RegExp || object.constructor === Function ||
            object.constructor === String || object.constructor === Number || object.constructor === Boolean) {
            return new object.constructor(object);
        }

        let ret = new object.constructor();

        for (let name in object) {
            ret[name] = typeof ret[name] === "undefined" ? ObjectHelper.clone(object[name]) : ret[name];
        }

        return ret;
    }

    public static isComparable(object1: any, object2: any): boolean {
        if (object1 === null || object2 === null) {
            return object1 === object2;
        } else if (object1 === undefined || object2 === undefined) {
            return object1 === object2;
        } else if (typeof object1 === "number" && typeof object2 === "number" && isNaN(object1) && isNaN(object2)) {
            /* NaN === NaN returns false so do explicit comparison */
            return true;
        } else if (Object.prototype.toString.call(object1) === "[object Date]" &&
            Object.prototype.toString.call(object2) === "[object Date]") {
            let t1 = object1.getTime();
            let t2 = object2.getTime();
            return (isNaN(t1) && isNaN(t2)) || t1 === t2;
        } else if (Array.isArray(object1) && Array.isArray(object2)) {
            if (object1.length !== object2.length) {
                return false;
            } else {
                let isEqual = true;
                for (let i = 0; i < object1.length; i++) {
                    if (!ObjectHelper.isComparable(object1[i], object2[i])) {
                        isEqual = false;
                        break;
                    }
                }
                return isEqual;
            }
        } else if (typeof object1 !== "object") {
            return object1 === object2;
        } else {
            let combinedKeys = Object.keys(object1);
            let keys2 = Object.keys(object2);

            for (let i = 0; i < keys2.length; i++) {
                if (combinedKeys.indexOf(keys2[i]) < 0) {
                    combinedKeys.push(keys2[i]);
                }
            }

            let isEqual = true;
            for (let i = 0; i < combinedKeys.length; i++) {
                let key = combinedKeys[i];

                if (!ObjectHelper.isComparable(object1[key], object2[key])) {
                    isEqual = false;
                    break;
                }
            }
            return isEqual;
        }
    }

    public static parseQueryString(qstr: string): { [index: string]: string } {
        let query: { [index: string]: string } = {};
        let a = (qstr[0] === "?" ? qstr.substr(1) : qstr).split("&");
        for (let i = 0; i < a.length; i++) {
            let b = a[i].split("=");
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
        }
        return query;
    }

    public static keyValueArrayToObject(keyValueArray: {key: string, value: any}[]): {[key: string]: any} {
        return (keyValueArray || []).reduce((result, curr) => {
            result[curr.key] = curr && curr.value;
            return result;
        }, <{[key: string]: any}>{});
    }

    public static sanitizeObjectStringsForHttp(object: any): void {
        // removes control characters from strings in an object
        ObjectHelper.walkObjectLookingForStrings(object, (objRef, key) => {
            objRef[key] = (objRef[key] as string)
                            .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
                            .replace(/  +/g, " ");
        });
    }

    public static sanitizeObjectStringsForJobUpdate(object: any, allowedStrings: string[] = []): void {

        ObjectHelper.walkObjectLookingForStrings(object, (objRef, key) => {
            if (!allowedStrings.some(allowedString => allowedString === objRef[key])) {
                // we want to retain the range of ascii characters from space (20) to tilde (7E) plus the pound sign
                objRef[key] = (objRef[key] as string)
                                .replace(/[^\x20-\x7E|\xA3]/g, " ")
                                .replace(/  +/g, " ");
            }
        });
    }

    public static getAllStringsFromObject(inputObject: any): string[] {
        let foundStrings: string[] = [];

        ObjectHelper.walkObjectLookingForStrings(inputObject, (objRef, key) => {
            if (!foundStrings.some(existingResult => existingResult === objRef[key])) {
                foundStrings.push(objRef[key]);
            }
        });
        return foundStrings;
    }

    private static walkObjectLookingForStrings(object: any, onFoundString: (foundStringParentRef: any, key: string) => void): void {
        if (!object) {
            return;
        }

        Object.keys(object).forEach(key => {
            let type = typeof object[key];
            if (type === "object") {
                ObjectHelper.walkObjectLookingForStrings(object[key], onFoundString);
            } else if (type === "string") {
                onFoundString(object, key);
            }
        });
    }

}
