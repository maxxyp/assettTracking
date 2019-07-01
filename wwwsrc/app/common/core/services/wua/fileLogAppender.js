define(["require", "exports", "../models/log", "../constants/logLevel", "../../dateHelper"], function (require, exports, log_1, logLevel_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileLogAppender = /** @class */ (function () {
        function FileLogAppender() {
            this._logBuffer = [];
        }
        FileLogAppender.prototype.debug = function (meta) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return this.log(logLevel_1.LogLevel.DEBUG, meta, rest);
        };
        FileLogAppender.prototype.info = function (meta) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return this.log(logLevel_1.LogLevel.INFO, meta, rest);
        };
        FileLogAppender.prototype.warn = function (meta) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return this.log(logLevel_1.LogLevel.WARN, meta, rest);
        };
        FileLogAppender.prototype.error = function (meta) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return this.log(logLevel_1.LogLevel.ERROR, meta, rest);
        };
        FileLogAppender.prototype.getLogFileName = function (date) {
            return "log-" + dateHelper_1.DateHelper.toJsonDateString(date) + ".txt";
        };
        FileLogAppender.prototype.log = function (logLevel, meta, rest) {
            var time = dateHelper_1.DateHelper.toJsonDateTimeString(new Date());
            var log = new log_1.Log();
            log.logLevel = logLevel || logLevel_1.LogLevel.NONE;
            log.logText = time + "\t" + log.logLevel + "\t[" + meta.id + "]\t" + (rest || []).reduce(function (prev, curr) { return prev + " " + JSON.stringify(curr || ""); }, "");
            this.logToFile(log);
            return log;
        };
        FileLogAppender.prototype.logToFile = function (log) {
            var _this = this;
            try {
                this._logBuffer.push(log);
                if (!this._isWriting) {
                    this._isWriting = true;
                    var logFragment_1 = this._logBuffer.reduce(function (prev, curr) { return prev + " " + curr.logText + "\r\n"; }, "");
                    this._logBuffer = [];
                    Windows.Storage.ApplicationData.current.localFolder.createFileAsync(this.getLogFileName(new Date()), Windows.Storage.CreationCollisionOption.openIfExists)
                        .then(function (file) { return Windows.Storage.FileIO.appendTextAsync(file, logFragment_1); })
                        .then(function (success) {
                        _this._isWriting = false;
                    }, function (error) {
                        // from development, it *looks* like the logs have still been written to file even if an error is thrown
                        _this._isWriting = false;
                    });
                }
            }
            catch (err) {
                this._logBuffer = [];
            }
        };
        return FileLogAppender;
    }());
    exports.FileLogAppender = FileLogAppender;
});

//# sourceMappingURL=fileLogAppender.js.map
