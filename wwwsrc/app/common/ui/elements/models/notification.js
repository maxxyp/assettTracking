/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Notification = /** @class */ (function () {
        function Notification(name, label, icon, callback) {
            this.name = name;
            this.label = label;
            this.icon = icon;
            this.callback = callback;
        }
        return Notification;
    }());
    exports.Notification = Notification;
});

//# sourceMappingURL=notification.js.map
