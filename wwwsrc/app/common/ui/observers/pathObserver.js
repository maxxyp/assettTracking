define(["require", "exports", "../../core/objectHelper"], function (require, exports, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PathObserver = /** @class */ (function () {
        function PathObserver(bindingEngine, subject, path) {
            this._bindingEngine = bindingEngine;
            this._subject = subject;
            this._path = path;
            var initialPathSplit = path ? path.split(".") : [];
            this._pathSplit = [];
            for (var i = 0; i < initialPathSplit.length; i++) {
                var arrayIdx = initialPathSplit[i].indexOf("[");
                if (arrayIdx > 0) {
                    // if the path element is an array index then make sure
                    // we monitor the array changing as well as the indexed item
                    this._pathSplit.push(initialPathSplit[i].substr(0, arrayIdx));
                    this._pathSplit.push(initialPathSplit[i].substr(arrayIdx + 1, initialPathSplit[i].length - arrayIdx - 2));
                }
                else {
                    this._pathSplit.push(initialPathSplit[i]);
                }
            }
            this._subscriptions = [];
            this.createSubscription(this._subject, 0);
            this.updateValue();
        }
        PathObserver.prototype.subscribe = function (valueChanged) {
            this._valueChanged = valueChanged;
            return this;
        };
        PathObserver.prototype.dispose = function () {
            for (var i = 0; i < this._subscriptions.length; i++) {
                this._subscriptions[i].dispose();
            }
            this._subscriptions = [];
            this._valueChanged = null;
        };
        PathObserver.prototype.createSubscription = function (subject, propertyIndex) {
            var _this = this;
            /* only create a subscription if the object exists */
            if (subject !== null && subject !== undefined && propertyIndex < this._pathSplit.length) {
                /* subscribe to the property on the object */
                var subscription = this._bindingEngine.propertyObserver(subject, this._pathSplit[propertyIndex])
                    .subscribe(function (newValue, oldValue) {
                    /* if this is the subscription for the end of the path then hand on the value to the subscriber */
                    if (propertyIndex === _this._pathSplit.length) {
                        _this.triggerValueChanged();
                    }
                    else {
                        /* if the object has changed and now has no value destroy any subscriptions further down the path */
                        if (newValue === null || newValue === undefined) {
                            _this.destroySubscriptions(propertyIndex);
                            /* this was a mid path change to no object so the end path is now undefined */
                            _this.triggerValueChanged();
                        }
                        else {
                            /* subscription has a value so try and create and subsequent subscriptions in the path */
                            var thisSubject = subject[_this._pathSplit[propertyIndex - 1]];
                            _this.createSubscription(thisSubject, propertyIndex);
                            /* this was a mid path change to no object so the end path is now undefined */
                            _this.triggerValueChanged();
                        }
                    }
                });
                this._subscriptions.push(subscription);
                this.createSubscription(subject[this._pathSplit[propertyIndex]], ++propertyIndex);
            }
        };
        PathObserver.prototype.destroySubscriptions = function (propertyIndex) {
            for (var i = propertyIndex; i < this._subscriptions.length; i++) {
                this._subscriptions[i].dispose();
            }
            this._subscriptions.splice(propertyIndex, this._subscriptions.length - propertyIndex);
        };
        PathObserver.prototype.updateValue = function () {
            this._value = objectHelper_1.ObjectHelper.getPathValue(this._subject, this._path);
        };
        PathObserver.prototype.triggerValueChanged = function () {
            var oldValue = this._value;
            this.updateValue();
            if (this._valueChanged) {
                this._valueChanged(this._value, oldValue);
            }
        };
        return PathObserver;
    }());
    exports.PathObserver = PathObserver;
});

//# sourceMappingURL=pathObserver.js.map
