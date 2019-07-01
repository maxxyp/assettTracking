define(["require", "exports", "../core/threading"], function (require, exports, threading_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DomHelper = /** @class */ (function () {
        function DomHelper() {
        }
        DomHelper.setWindowTarget = function (win) {
            DomHelper._win = win;
        };
        DomHelper.scrollToTop = function () {
            DomHelper.scrollToElement(document.getElementsByTagName("body")[0], 10);
        };
        DomHelper.jumpToTop = function () {
            DomHelper.scrollToElement(document.getElementsByTagName("body")[0], -1);
        };
        DomHelper.scrollToElement = function (scrollTarget, stepRate, adjustment) {
            /* When a menu entry is navigated make sure the page is reset to be at the top */
            if (!DomHelper._win) {
                DomHelper._win = window;
            }
            if (stepRate === -1) {
                threading_1.Threading.nextCycle(function () {
                    if (!adjustment) {
                        adjustment = 0;
                    }
                    DomHelper._win.scrollTo(0, scrollTarget.offsetTop + adjustment);
                });
            }
            else {
                if (DomHelper._scrollInterval === -1) {
                    DomHelper._scrollPos = DomHelper._win.scrollY;
                    if (DomHelper._scrollPos > scrollTarget.offsetTop) {
                        DomHelper._scrollInterval = threading_1.Threading.startTimer(function () {
                            if (DomHelper._scrollPos > scrollTarget.offsetTop) {
                                DomHelper._scrollPos -= stepRate;
                                DomHelper._win.scrollTo(0, DomHelper._scrollPos);
                            }
                            else {
                                threading_1.Threading.stopTimer(DomHelper._scrollInterval);
                                DomHelper._scrollInterval = -1;
                            }
                        }, 1);
                    }
                    else {
                        DomHelper._scrollInterval = threading_1.Threading.startTimer(function () {
                            if (DomHelper._scrollPos < scrollTarget.offsetTop) {
                                DomHelper._scrollPos += stepRate;
                                DomHelper._win.scrollTo(0, DomHelper._scrollPos);
                            }
                            else {
                                threading_1.Threading.stopTimer(DomHelper._scrollInterval);
                                DomHelper._scrollInterval = -1;
                            }
                        }, 1);
                    }
                }
            }
        };
        DomHelper.closest = function (element, selector) {
            while (element && element.nodeType === 1) {
                if (element.matches(selector)) {
                    return element;
                }
                element = (element.parentNode);
            }
            return null;
        };
        DomHelper.closestTag = function (element, tagName) {
            while (element && element.nodeType === 1) {
                if (element.parentNode) {
                    for (var i = 0; i < element.parentNode.childNodes.length; i++) {
                        var elem = element.parentNode.childNodes[i];
                        if (elem.nodeType === 1 && elem.tagName.toLowerCase() === tagName) {
                            return elem;
                        }
                    }
                }
                element = (element.parentNode);
            }
            return null;
        };
        DomHelper.getAureliaComponentFromElement = function (element, componentName) {
            if (element && element.au && element.au[componentName]) {
                return element.au[componentName].viewModel;
            }
            else {
                return undefined;
            }
        };
        // aurelia converters mean that | and & may be present in the binding expression, the property name is always the first segment though
        DomHelper.getModelPropertyNameFromBindingPath = function (path) {
            return path && path.split(/\||\&/)[0].trim();
        };
        DomHelper._scrollInterval = -1;
        return DomHelper;
    }());
    exports.DomHelper = DomHelper;
});

//# sourceMappingURL=domHelper.js.map
