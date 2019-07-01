define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StringifyValueConverter = /** @class */ (function () {
        function StringifyValueConverter() {
        }
        StringifyValueConverter.prototype.toView = function (o) {
            if (o) {
                var json = JSON.stringify(o, undefined, 4);
                json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    var cls = "number";
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = "key";
                        }
                        else {
                            cls = "string";
                        }
                    }
                    else if (/true|false/.test(match)) {
                        cls = "boolean";
                    }
                    else if (/null/.test(match)) {
                        cls = "null";
                    }
                    return "<span class=\"" + cls + "\">" + match + "</span>";
                });
                return json;
            }
            else {
                return "";
            }
        };
        return StringifyValueConverter;
    }());
    exports.StringifyValueConverter = StringifyValueConverter;
});

//# sourceMappingURL=stringifyValueConverter.js.map
