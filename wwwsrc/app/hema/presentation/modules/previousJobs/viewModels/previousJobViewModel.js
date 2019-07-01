define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PreviousJobViewModel = /** @class */ (function () {
        function PreviousJobViewModel(id, date, tasksDescription, tasks) {
            this.id = id;
            this.date = date;
            this.tasksDescription = tasksDescription;
            this.tasks = tasks;
            this.isCharge = false;
        }
        return PreviousJobViewModel;
    }());
    exports.PreviousJobViewModel = PreviousJobViewModel;
});

//# sourceMappingURL=previousJobViewModel.js.map
