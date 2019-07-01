define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ARCHIVE_DATE_FORMAT = "DD-MM-YYYY";
    var Archive = /** @class */ (function () {
        function Archive(engineerId) {
            this.engineerId = engineerId;
            this.timestamp = new Date();
            this.date = moment().format(exports.ARCHIVE_DATE_FORMAT);
        }
        return Archive;
    }());
    exports.Archive = Archive;
});

//# sourceMappingURL=archive.js.map
