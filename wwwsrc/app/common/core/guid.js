define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Guid = /** @class */ (function () {
        function Guid() {
        }
        Guid.newGuid = function () {
            return Guid.s4() + Guid.s4() + "-" + Guid.s4() + "-" + Guid.s4() + "-" + Guid.s4() + "-" +
                Guid.s4() + Guid.s4() + Guid.s4();
        };
        Guid.isGuid = function (guid) {
            return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(guid);
        };
        Guid.s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        Guid.empty = "00000000-0000-0000-0000-000000000000";
        return Guid;
    }());
    exports.Guid = Guid;
});

//# sourceMappingURL=guid.js.map
