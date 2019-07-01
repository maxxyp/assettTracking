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
var Lint = require("../../node_modules/tslint/lib/index");
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoInvalidImportPathsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.FAILURE_STRING = "the import should not start ./../";
exports.Rule = Rule;
var NoInvalidImportPathsWalker = (function (_super) {
    __extends(NoInvalidImportPathsWalker, _super);
    function NoInvalidImportPathsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoInvalidImportPathsWalker.prototype.visitImportDeclaration = function (node) {
        if (node.getText().indexOf("\"./../") >= 0) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    return NoInvalidImportPathsWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9JbnZhbGlkSW1wb3J0UGF0aHNSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9JbnZhbGlkSW1wb3J0UGF0aHNSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLDBEQUE0RDtBQUU1RCxtRUFBZ0U7QUFFaEU7O0dBRUc7QUFDSDtJQUEwQix3QkFBdUI7SUFBakQ7O0lBTUEsQ0FBQztJQUhVLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLDBCQUEwQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQU5ELENBQTBCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtBQUMvQixtQkFBYyxHQUFHLG1DQUFtQyxDQUFDO0FBRDFELG9CQUFJO0FBUWpCO0lBQXlDLDhDQUFtQjtJQUE1RDs7SUFRQSxDQUFDO0lBUGEsMkRBQXNCLEdBQWhDLFVBQWlDLElBQTBCO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBRUQsaUJBQU0sc0JBQXNCLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNMLGlDQUFDO0FBQUQsQ0FBQyxBQVJELENBQXlDLHlDQUFtQixHQVEzRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHlwZXNjcmlwdC9saWIvdHlwZXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgTGludCBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvaW5kZXhcIjtcblxuaW1wb3J0IHtFcnJvclRvbGVyYW50V2Fsa2VyfSBmcm9tIFwiLi91dGlscy9FcnJvclRvbGVyYW50V2Fsa2VyXCI7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIG5vLXVubmVjZXNzYXJ5LXNlbWljb2xvbnMgcnVsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG4gICAgcHVibGljIHN0YXRpYyBGQUlMVVJFX1NUUklORyA9IFwidGhlIGltcG9ydCBzaG91bGQgbm90IHN0YXJ0IC4vLi4vXCI7XG5cbiAgICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgTm9JbnZhbGlkSW1wb3J0UGF0aHNXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIE5vSW52YWxpZEltcG9ydFBhdGhzV2Fsa2VyIGV4dGVuZHMgRXJyb3JUb2xlcmFudFdhbGtlciB7XG4gICAgcHJvdGVjdGVkIHZpc2l0SW1wb3J0RGVjbGFyYXRpb24obm9kZTogdHMuSW1wb3J0RGVjbGFyYXRpb24pIDogdm9pZCB7XG4gICAgICAgIGlmIChub2RlLmdldFRleHQoKS5pbmRleE9mKFwiXFxcIi4vLi4vXCIpID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyLnZpc2l0SW1wb3J0RGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxufSJdfQ==