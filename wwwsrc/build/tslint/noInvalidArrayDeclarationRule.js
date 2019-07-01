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
        return this.applyWithWalker(new NoInvalidArrayDelarationsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.FAILURE_STRING = "the array is not declared correctly it should be Type[] or Array<Type>";
exports.Rule = Rule;
var NoInvalidArrayDelarationsWalker = (function (_super) {
    __extends(NoInvalidArrayDelarationsWalker, _super);
    function NoInvalidArrayDelarationsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoInvalidArrayDelarationsWalker.prototype.visitVariableDeclaration = function (node) {
        var idx = node.getText().indexOf(": [");
        if (idx >= 0 && idx < node.getText().indexOf("=")) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    NoInvalidArrayDelarationsWalker.prototype.visitPropertyDeclaration = function (node) {
        var idx = node.getText().indexOf(": [");
        if (idx >= 0 && idx < node.getText().indexOf("=")) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    return NoInvalidArrayDelarationsWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9JbnZhbGlkQXJyYXlEZWNsYXJhdGlvblJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub0ludmFsaWRBcnJheURlY2xhcmF0aW9uUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwwREFBNEQ7QUFFNUQsbUVBQWdFO0FBRWhFOztHQUVHO0FBQ0g7SUFBMEIsd0JBQXVCO0lBQWpEOztJQU1BLENBQUM7SUFIVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSwrQkFBK0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRyxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFORCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFDL0IsbUJBQWMsR0FBRyx3RUFBd0UsQ0FBQztBQUQvRixvQkFBSTtBQVFqQjtJQUE4QyxtREFBbUI7SUFBakU7O0lBbUJBLENBQUM7SUFsQmEsa0VBQXdCLEdBQWxDLFVBQW1DLElBQTRCO1FBQzNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUVELGlCQUFNLHdCQUF3QixZQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFUyxrRUFBd0IsR0FBbEMsVUFBbUMsSUFBNEI7UUFDM0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBRUQsaUJBQU0sd0JBQXdCLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNMLHNDQUFDO0FBQUQsQ0FBQyxBQW5CRCxDQUE4Qyx5Q0FBbUIsR0FtQmhFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy90eXBlc2NyaXB0L2xpYi90eXBlc2NyaXB0XCI7XG5pbXBvcnQgKiBhcyBMaW50IGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHNsaW50L2xpYi9pbmRleFwiO1xuXG5pbXBvcnQge0Vycm9yVG9sZXJhbnRXYWxrZXJ9IGZyb20gXCIuL3V0aWxzL0Vycm9yVG9sZXJhbnRXYWxrZXJcIjtcblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgbm8tdW5uZWNlc3Nhcnktc2VtaWNvbG9ucyBydWxlLlxuICovXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIExpbnQuUnVsZXMuQWJzdHJhY3RSdWxlIHtcbiAgICBwdWJsaWMgc3RhdGljIEZBSUxVUkVfU1RSSU5HID0gXCJ0aGUgYXJyYXkgaXMgbm90IGRlY2xhcmVkIGNvcnJlY3RseSBpdCBzaG91bGQgYmUgVHlwZVtdIG9yIEFycmF5PFR5cGU+XCI7XG5cbiAgICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgTm9JbnZhbGlkQXJyYXlEZWxhcmF0aW9uc1dhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xuICAgIH1cbn1cblxuY2xhc3MgTm9JbnZhbGlkQXJyYXlEZWxhcmF0aW9uc1dhbGtlciBleHRlbmRzIEVycm9yVG9sZXJhbnRXYWxrZXIge1xuICAgIHByb3RlY3RlZCB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZTogdHMuVmFyaWFibGVEZWNsYXJhdGlvbikgOiB2b2lkIHtcbiAgICAgICAgbGV0IGlkeCA9IG5vZGUuZ2V0VGV4dCgpLmluZGV4T2YoXCI6IFtcIik7XG5cbiAgICAgICAgaWYgKGlkeCA+PSAwICYmIGlkeCA8IG5vZGUuZ2V0VGV4dCgpLmluZGV4T2YoXCI9XCIpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHZpc2l0UHJvcGVydHlEZWNsYXJhdGlvbihub2RlOiB0cy5Qcm9wZXJ0eURlY2xhcmF0aW9uKSA6IHZvaWQge1xuICAgICAgICBsZXQgaWR4ID0gbm9kZS5nZXRUZXh0KCkuaW5kZXhPZihcIjogW1wiKTtcbiAgICAgICAgaWYgKGlkeCA+PSAwICYmIGlkeCA8IG5vZGUuZ2V0VGV4dCgpLmluZGV4T2YoXCI9XCIpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci52aXNpdFByb3BlcnR5RGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxufSJdfQ==