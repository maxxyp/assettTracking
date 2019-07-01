"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ruleWalker_1 = require("../../../node_modules/tslint/lib/language/walker/ruleWalker");
/**
 * A base walker class that gracefully handles unexpected errors.
 * Errors are often thrown when the TypeChecker is invoked.
 */
var ErrorTolerantWalker = (function (_super) {
    __extends(ErrorTolerantWalker, _super);
    function ErrorTolerantWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorTolerantWalker.prototype.visitNode = function (node) {
        try {
            _super.prototype.visitNode.call(this, node);
        }
        catch (e) {
            var msg = "An error occurred visiting a node."
                + "\nWalker: " + this.getClassName()
                + "\nNode: " + (node.getFullText ? node.getFullText() : "<unknown>")
                + "\n" + e;
            this.addFailure(this.createFailure(node.getStart ? node.getStart() : 0, node.getWidth ? node.getWidth() : 0, msg));
        }
    };
    ErrorTolerantWalker.prototype.getClassName = function () {
        /* Some versions of IE have the word "function" in the constructor name and
         have the function body there as well. This rips out and returns the function name. */
        var result = this.constructor.toString().match(/function\s+([\w\$]+)\s*\(/)[1] || "";
        if (result == null || result.length === 0) {
            throw new Error("Could not determine class name from input: " + this.constructor.toString());
        }
        return result;
    };
    return ErrorTolerantWalker;
}(ruleWalker_1.RuleWalker));
exports.ErrorTolerantWalker = ErrorTolerantWalker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JUb2xlcmFudFdhbGtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkVycm9yVG9sZXJhbnRXYWxrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsMEZBQXVGO0FBRXZGOzs7R0FHRztBQUNIO0lBQXlDLHVDQUFVO0lBQW5EOztJQTZCQSxDQUFDO0lBMUJhLHVDQUFTLEdBQW5CLFVBQW9CLElBQWE7UUFDN0IsSUFBSSxDQUFDO1lBQ0QsaUJBQU0sU0FBUyxZQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxHQUFHLEdBQVcsb0NBQW9DO2tCQUNoRCxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtrQkFDbEMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsV0FBVyxDQUFDO2tCQUNsRSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBRWYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFDbkMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUM7SUFDTCxDQUFDO0lBRU8sMENBQVksR0FBcEI7UUFDSTs4RkFDc0Y7UUFDdEYsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0YsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDakcsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVMLDBCQUFDO0FBQUQsQ0FBQyxBQTdCRCxDQUF5Qyx1QkFBVSxHQTZCbEQ7QUE3Qlksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy90eXBlc2NyaXB0L2xpYi90eXBlc2NyaXB0XCI7XG5pbXBvcnQge1J1bGVXYWxrZXJ9IGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdHNsaW50L2xpYi9sYW5ndWFnZS93YWxrZXIvcnVsZVdhbGtlclwiO1xuXG4vKipcbiAqIEEgYmFzZSB3YWxrZXIgY2xhc3MgdGhhdCBncmFjZWZ1bGx5IGhhbmRsZXMgdW5leHBlY3RlZCBlcnJvcnMuXG4gKiBFcnJvcnMgYXJlIG9mdGVuIHRocm93biB3aGVuIHRoZSBUeXBlQ2hlY2tlciBpcyBpbnZva2VkLlxuICovXG5leHBvcnQgY2xhc3MgRXJyb3JUb2xlcmFudFdhbGtlciBleHRlbmRzIFJ1bGVXYWxrZXIge1xuXG5cbiAgICBwcm90ZWN0ZWQgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN1cGVyLnZpc2l0Tm9kZShub2RlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbGV0IG1zZzogc3RyaW5nID0gXCJBbiBlcnJvciBvY2N1cnJlZCB2aXNpdGluZyBhIG5vZGUuXCJcbiAgICAgICAgICAgICAgICArIFwiXFxuV2Fsa2VyOiBcIiArIHRoaXMuZ2V0Q2xhc3NOYW1lKClcbiAgICAgICAgICAgICAgICArIFwiXFxuTm9kZTogXCIgKyAobm9kZS5nZXRGdWxsVGV4dCA/IG5vZGUuZ2V0RnVsbFRleHQoKSA6IFwiPHVua25vd24+XCIpXG4gICAgICAgICAgICAgICAgKyBcIlxcblwiICsgZTtcblxuICAgICAgICAgICAgdGhpcy5hZGRGYWlsdXJlKHRoaXMuY3JlYXRlRmFpbHVyZShcbiAgICAgICAgICAgICAgICBub2RlLmdldFN0YXJ0ID8gbm9kZS5nZXRTdGFydCgpIDogMCxcbiAgICAgICAgICAgICAgICBub2RlLmdldFdpZHRoID8gbm9kZS5nZXRXaWR0aCgpIDogMCxcbiAgICAgICAgICAgICAgICBtc2cpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2xhc3NOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIC8qIFNvbWUgdmVyc2lvbnMgb2YgSUUgaGF2ZSB0aGUgd29yZCBcImZ1bmN0aW9uXCIgaW4gdGhlIGNvbnN0cnVjdG9yIG5hbWUgYW5kXG4gICAgICAgICBoYXZlIHRoZSBmdW5jdGlvbiBib2R5IHRoZXJlIGFzIHdlbGwuIFRoaXMgcmlwcyBvdXQgYW5kIHJldHVybnMgdGhlIGZ1bmN0aW9uIG5hbWUuICovXG4gICAgICAgIGxldCByZXN1bHQ6IHN0cmluZyA9IHRoaXMuY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLylbMV0gfHwgXCJcIjtcbiAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsIHx8IHJlc3VsdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBkZXRlcm1pbmUgY2xhc3MgbmFtZSBmcm9tIGlucHV0OiBcIiArIHRoaXMuY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbn1cbiJdfQ==