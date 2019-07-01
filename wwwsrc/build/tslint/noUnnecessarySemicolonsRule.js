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
var ts = require("../../node_modules/typescript/lib/typescript");
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
        return this.applyWithWalker(new NoUnnecessarySemicolonsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.FAILURE_STRING = "unnecessary semi-colon";
exports.Rule = Rule;
var NoUnnecessarySemicolonsWalker = (function (_super) {
    __extends(NoUnnecessarySemicolonsWalker, _super);
    function NoUnnecessarySemicolonsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoUnnecessarySemicolonsWalker.prototype.visitNode = function (node) {
        if (node.getText() === ";") {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        if (node.kind === ts.SyntaxKind.EmptyStatement) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitNode.call(this, node);
    };
    return NoUnnecessarySemicolonsWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9Vbm5lY2Vzc2FyeVNlbWljb2xvbnNSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9Vbm5lY2Vzc2FyeVNlbWljb2xvbnNSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlFQUFtRTtBQUNuRSwwREFBNEQ7QUFFNUQsbUVBQWdFO0FBRWhFOztHQUVHO0FBQ0g7SUFBMEIsd0JBQXVCO0lBQWpEOztJQU1BLENBQUM7SUFIVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSw2QkFBNkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFORCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFDL0IsbUJBQWMsR0FBVyx3QkFBd0IsQ0FBQztBQUR2RCxvQkFBSTtBQVFqQjtJQUE0QyxpREFBbUI7SUFBL0Q7O0lBVUEsQ0FBQztJQVRhLGlEQUFTLEdBQW5CLFVBQW9CLElBQWE7UUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFDRCxpQkFBTSxTQUFTLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNMLG9DQUFDO0FBQUQsQ0FBQyxBQVZELENBQTRDLHlDQUFtQixHQVU5RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHlwZXNjcmlwdC9saWIvdHlwZXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgTGludCBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvaW5kZXhcIjtcblxuaW1wb3J0IHtFcnJvclRvbGVyYW50V2Fsa2VyfSBmcm9tIFwiLi91dGlscy9FcnJvclRvbGVyYW50V2Fsa2VyXCI7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIG5vLXVubmVjZXNzYXJ5LXNlbWljb2xvbnMgcnVsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG4gICAgcHVibGljIHN0YXRpYyBGQUlMVVJFX1NUUklORzogc3RyaW5nID0gXCJ1bm5lY2Vzc2FyeSBzZW1pLWNvbG9uXCI7XG5cbiAgICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgTm9Vbm5lY2Vzc2FyeVNlbWljb2xvbnNXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIE5vVW5uZWNlc3NhcnlTZW1pY29sb25zV2Fsa2VyIGV4dGVuZHMgRXJyb3JUb2xlcmFudFdhbGtlciB7XG4gICAgcHJvdGVjdGVkIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgICAgIGlmIChub2RlLmdldFRleHQoKSA9PT0gXCI7XCIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkcpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkVtcHR5U3RhdGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HKSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIudmlzaXROb2RlKG5vZGUpO1xuICAgIH1cbn0iXX0=