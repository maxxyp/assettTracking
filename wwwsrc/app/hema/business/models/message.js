define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Message = /** @class */ (function () {
        function Message(id, content) {
            this.id = id;
            this.content = content;
            this.date = new Date();
            this.read = false;
            this.deleted = false;
        }
        return Message;
    }());
    exports.Message = Message;
});

//# sourceMappingURL=message.js.map
