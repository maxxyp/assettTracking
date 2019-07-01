define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HelpOverlayStep = /** @class */ (function () {
        function HelpOverlayStep(stepId) {
            this.id = stepId;
            this.width = 350;
            this.height = 170;
            this.top = 85;
            this.bottom = null;
            this.left = 50;
            this.right = null;
            this.selectorWaitTimeout = 1000;
            this.arrowPosition = "left";
            this.title = "New step #" + this.id;
            this.content = "New step content";
            this.selector = "body";
            this.scrollOffset = 0;
            this.showCircle = true;
        }
        return HelpOverlayStep;
    }());
    exports.HelpOverlayStep = HelpOverlayStep;
});

//# sourceMappingURL=helpOverlayStep.js.map
