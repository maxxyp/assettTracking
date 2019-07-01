define(["require", "exports", "./dateHelper"], function (require, exports, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LogHelper = /** @class */ (function () {
        function LogHelper() {
        }
        LogHelper.getLogFileName = function (date) {
            return "log-" + dateHelper_1.DateHelper.toJsonDateString(date) + ".txt";
        };
        LogHelper.clearDownLogs = function (maxLogFileAgeDays) {
            try {
                var oldestDateToKeep = dateHelper_1.DateHelper.addDays(new Date(), -1 * maxLogFileAgeDays);
                var oldestFileNameToKeep_1 = this.getLogFileName(oldestDateToKeep);
                Windows.Storage.ApplicationData.current.localFolder.getFilesAsync()
                    .then(function (files) {
                    files.forEach(function (file) {
                        // alphabetical comparison is good enough
                        if (file.name < oldestFileNameToKeep_1) {
                            file.deleteAsync(Windows.Storage.StorageDeleteOption.default);
                        }
                    });
                });
            }
            catch (err) {
            }
        };
        return LogHelper;
    }());
    exports.LogHelper = LogHelper;
});

//# sourceMappingURL=logHelper.js.map
