define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectHelper = /** @class */ (function () {
        function ObjectHelper() {
        }
        ObjectHelper.isObject = function (object) {
            if (object === null) {
                return false;
            }
            else if (object === undefined) {
                return false;
            }
            else {
                return typeof object === "object";
            }
        };
        ObjectHelper.hasKeys = function (object) {
            if (object === null) {
                return false;
            }
            else if (object === undefined) {
                return false;
            }
            else {
                return Object.keys(object).length > 0;
            }
        };
        ObjectHelper.getClassName = function (object) {
            if (object) {
                var constructor = typeof object === "function" ? object.toString() : object.constructor.toString();
                var results = constructor.match(/\w+/g);
                return (results && results.length > 1) ? results[1] : "<no object>";
            }
            else {
                return "<no object>";
            }
        };
        ObjectHelper.getPathValue = function (subject, path) {
            var ret = undefined;
            if (path && subject) {
                var parts = path.split(".");
                for (var i = 0; i < parts.length; i++) {
                    var arrayOperatorStartIndex = parts[i].indexOf("[");
                    if (arrayOperatorStartIndex !== -1) {
                        var propertyName = parts[i].substr(0, arrayOperatorStartIndex);
                        if (subject[propertyName] !== null && subject[propertyName] !== undefined && subject[propertyName] instanceof Array) {
                            var arrayOperatorEndIndex = parts[i].indexOf("]");
                            if (arrayOperatorEndIndex !== -1) {
                                var index = parts[i].substr(arrayOperatorStartIndex + 1, arrayOperatorEndIndex - arrayOperatorStartIndex - 1);
                                if (subject[propertyName][index] !== null && subject[propertyName][index] !== undefined) {
                                    subject = subject[propertyName][index];
                                }
                                else {
                                    subject = undefined;
                                    break;
                                }
                            }
                            else {
                                subject = undefined;
                                break;
                            }
                        }
                        else {
                            subject = undefined;
                            break;
                        }
                    }
                    else {
                        if (subject[parts[i]] !== null && subject[parts[i]] !== undefined) {
                            subject = subject[parts[i]];
                        }
                        else {
                            subject = undefined;
                            break;
                        }
                    }
                }
                ret = subject;
            }
            return ret;
        };
        ObjectHelper.clone = function (object) {
            if (object == null || typeof object !== "object") {
                return object;
            }
            else if (object.constructor !== Object && object.constructor !== Array) {
                return object;
            }
            else if (object.constructor === Date || object.constructor === RegExp || object.constructor === Function ||
                object.constructor === String || object.constructor === Number || object.constructor === Boolean) {
                return new object.constructor(object);
            }
            var ret = new object.constructor();
            for (var name_1 in object) {
                ret[name_1] = typeof ret[name_1] === "undefined" ? ObjectHelper.clone(object[name_1]) : ret[name_1];
            }
            return ret;
        };
        ObjectHelper.isComparable = function (object1, object2) {
            if (object1 === null || object2 === null) {
                return object1 === object2;
            }
            else if (object1 === undefined || object2 === undefined) {
                return object1 === object2;
            }
            else if (typeof object1 === "number" && typeof object2 === "number" && isNaN(object1) && isNaN(object2)) {
                /* NaN === NaN returns false so do explicit comparison */
                return true;
            }
            else if (Object.prototype.toString.call(object1) === "[object Date]" &&
                Object.prototype.toString.call(object2) === "[object Date]") {
                var t1 = object1.getTime();
                var t2 = object2.getTime();
                return (isNaN(t1) && isNaN(t2)) || t1 === t2;
            }
            else if (Array.isArray(object1) && Array.isArray(object2)) {
                if (object1.length !== object2.length) {
                    return false;
                }
                else {
                    var isEqual = true;
                    for (var i = 0; i < object1.length; i++) {
                        if (!ObjectHelper.isComparable(object1[i], object2[i])) {
                            isEqual = false;
                            break;
                        }
                    }
                    return isEqual;
                }
            }
            else if (typeof object1 !== "object") {
                return object1 === object2;
            }
            else {
                var combinedKeys = Object.keys(object1);
                var keys2 = Object.keys(object2);
                for (var i = 0; i < keys2.length; i++) {
                    if (combinedKeys.indexOf(keys2[i]) < 0) {
                        combinedKeys.push(keys2[i]);
                    }
                }
                var isEqual = true;
                for (var i = 0; i < combinedKeys.length; i++) {
                    var key = combinedKeys[i];
                    if (!ObjectHelper.isComparable(object1[key], object2[key])) {
                        isEqual = false;
                        break;
                    }
                }
                return isEqual;
            }
        };
        ObjectHelper.parseQueryString = function (qstr) {
            var query = {};
            var a = (qstr[0] === "?" ? qstr.substr(1) : qstr).split("&");
            for (var i = 0; i < a.length; i++) {
                var b = a[i].split("=");
                query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
            }
            return query;
        };
        ObjectHelper.keyValueArrayToObject = function (keyValueArray) {
            return (keyValueArray || []).reduce(function (result, curr) {
                result[curr.key] = curr && curr.value;
                return result;
            }, {});
        };
        ObjectHelper.sanitizeObjectStringsForHttp = function (object) {
            // removes control characters from strings in an object
            ObjectHelper.walkObjectLookingForStrings(object, function (objRef, key) {
                objRef[key] = objRef[key]
                    .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
                    .replace(/  +/g, " ");
            });
        };
        ObjectHelper.sanitizeObjectStringsForJobUpdate = function (object, allowedStrings) {
            if (allowedStrings === void 0) { allowedStrings = []; }
            ObjectHelper.walkObjectLookingForStrings(object, function (objRef, key) {
                if (!allowedStrings.some(function (allowedString) { return allowedString === objRef[key]; })) {
                    // we want to retain the range of ascii characters from space (20) to tilde (7E) plus the pound sign
                    objRef[key] = objRef[key]
                        .replace(/[^\x20-\x7E|\xA3]/g, " ")
                        .replace(/  +/g, " ");
                }
            });
        };
        ObjectHelper.getAllStringsFromObject = function (inputObject) {
            var foundStrings = [];
            ObjectHelper.walkObjectLookingForStrings(inputObject, function (objRef, key) {
                if (!foundStrings.some(function (existingResult) { return existingResult === objRef[key]; })) {
                    foundStrings.push(objRef[key]);
                }
            });
            return foundStrings;
        };
        ObjectHelper.walkObjectLookingForStrings = function (object, onFoundString) {
            if (!object) {
                return;
            }
            Object.keys(object).forEach(function (key) {
                var type = typeof object[key];
                if (type === "object") {
                    ObjectHelper.walkObjectLookingForStrings(object[key], onFoundString);
                }
                else if (type === "string") {
                    onFoundString(object, key);
                }
            });
        };
        return ObjectHelper;
    }());
    exports.ObjectHelper = ObjectHelper;
});

//# sourceMappingURL=objectHelper.js.map
