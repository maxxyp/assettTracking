/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports", "aurelia-pal", "aurelia-pal"], function (require, exports, aurelia_pal_1, aurelia_pal_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DefaultLinkHandler = /** @class */ (function () {
        function DefaultLinkHandler() {
            var _this = this;
            this._handler = function (e) {
                var eventInfo = _this.getEventInfo(e);
                if (eventInfo.shouldHandleEvent) {
                    e.preventDefault();
                    _this._history.navigate(eventInfo.href);
                }
            };
        }
        DefaultLinkHandler.prototype.activate = function (history) {
            this._history = history;
            aurelia_pal_1.DOM.addEventListener("click", this._handler, true);
        };
        DefaultLinkHandler.prototype.deactivate = function () {
            aurelia_pal_1.DOM.removeEventListener("click", this._handler, true);
        };
        DefaultLinkHandler.prototype.getEventInfo = function (event) {
            var info = {
                shouldHandleEvent: false,
                href: null,
                anchor: null
            };
            var target = this.findClosestAnchor(event.target);
            if (target && this.targetIsThisWindow(target)) {
                if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    var href = target.getAttribute("href");
                    info.anchor = target;
                    info.href = href;
                    var leftButtonClicked = event.which === 1;
                    var isRelative = href && href.charAt(0) === "#";
                    info.shouldHandleEvent = leftButtonClicked && isRelative;
                }
            }
            return info;
        };
        DefaultLinkHandler.prototype.findClosestAnchor = function (el) {
            while (el) {
                if (el.tagName === "A") {
                    break;
                }
                el = el.parentNode;
            }
            return el;
        };
        DefaultLinkHandler.prototype.targetIsThisWindow = function (target) {
            var targetWindow = target.getAttribute("target");
            var win = aurelia_pal_2.PLATFORM.global;
            return !targetWindow ||
                targetWindow === win.name ||
                targetWindow === "_self" ||
                (targetWindow === "top" && win === win.top);
        };
        return DefaultLinkHandler;
    }());
    exports.DefaultLinkHandler = DefaultLinkHandler;
});

//# sourceMappingURL=defaultLinkHandler.js.map
