define(["require", "exports", "../objectHelper"], function (require, exports, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseException = /** @class */ (function () {
        function BaseException(context, reference, message, parameters, data) {
            this.context = objectHelper_1.ObjectHelper.getClassName(context);
            this.reference = reference;
            this.message = message;
            this.parameters = parameters;
            if (data instanceof BaseException) {
                this.innerException = data;
            }
            else {
                this.data = data;
            }
            var stack = "";
            if (this.data && this.data.stack) {
                stack = this.data.stack;
            }
            else {
                stack = new Error("").stack;
            }
            if (stack) {
                this.stackTrace = stack.split("\n");
                if (stack.length > 3) {
                    this.stackTrace = this.stackTrace.slice(3);
                }
            }
        }
        BaseException.exceptionToStringInternal = function (baseException) {
            var parts = [];
            if (baseException.context && baseException.reference) {
                parts.push(objectHelper_1.ObjectHelper.getClassName(baseException.context) + "::" + baseException.reference);
            }
            if (baseException.message) {
                parts.push(BaseException.substituteParameters(baseException.message, baseException.parameters));
            }
            if (baseException.data) {
                if (baseException.data.message) {
                    parts.push(baseException.data.message);
                }
                else {
                    parts.push(JSON.stringify(baseException.data));
                }
            }
            if (baseException.stackTrace) {
                baseException.stackTrace.forEach(function (st) {
                    parts.push(st);
                });
            }
            if (baseException.innerException) {
                parts.push("-----------------------------------------------------------------");
                parts.push(this.exceptionToStringInternal(baseException.innerException));
            }
            return parts.join("\r\n\r\n");
        };
        BaseException.substituteParameters = function (message, parameters) {
            return message && parameters ? message.replace(/{(\d+)}/g, function (match, idx) {
                return parameters[idx];
            }) : message;
        };
        Object.defineProperty(BaseException.prototype, "resolvedMessage", {
            get: function () {
                var message = " ";
                try {
                    var exception = this;
                    while (exception && exception instanceof BaseException) {
                        var typedException = exception;
                        message += BaseException.substituteParameters(typedException.message, typedException.parameters) + " ";
                        exception = exception.innerException;
                    }
                }
                catch (err) {
                }
                return message;
            },
            enumerable: true,
            configurable: true
        });
        BaseException.prototype.toString = function () {
            return BaseException.exceptionToStringInternal(this);
        };
        return BaseException;
    }());
    exports.BaseException = BaseException;
});

//# sourceMappingURL=baseException.js.map
