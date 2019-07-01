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
var abstractRule_1 = require("../../node_modules/tslint/lib/language/rule/abstractRule");
var ruleWalker_1 = require("../../node_modules/tslint/lib/language/walker/ruleWalker");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoPropertyAssignmentsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(abstractRule_1.AbstractRule));
Rule.FAILURE_STRING = "assignments must not be made on properties, use the constructor";
exports.Rule = Rule;
var NoPropertyAssignmentsWalker = (function (_super) {
    __extends(NoPropertyAssignmentsWalker, _super);
    function NoPropertyAssignmentsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoPropertyAssignmentsWalker.prototype.visitPropertyDeclaration = function (node) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
            if (node.getText().indexOf("=") >= 0 && node.getText().indexOf("=>") < 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
    };
    return NoPropertyAssignmentsWalker;
}(ruleWalker_1.RuleWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9Qcm9wZXJ0eUFzc2lnbm1lbnRzUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vUHJvcGVydHlBc3NpZ25tZW50c1J1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQW1FO0FBQ25FLDBEQUE0RDtBQUM1RCx5RkFBc0Y7QUFDdEYsdUZBQW9GO0FBRXBGO0lBQTBCLHdCQUFZO0lBQXRDOztJQU1BLENBQUM7SUFIVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSwyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFORCxDQUEwQiwyQkFBWTtBQUNwQixtQkFBYyxHQUFXLGlFQUFpRSxDQUFDO0FBRGhHLG9CQUFJO0FBUWpCO0lBQTBDLCtDQUFVO0lBQXBEOztJQVFBLENBQUM7SUFQVSw4REFBd0IsR0FBL0IsVUFBZ0MsSUFBNEI7UUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUMvRixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFDTCxrQ0FBQztBQUFELENBQUMsQUFSRCxDQUEwQyx1QkFBVSxHQVFuRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHlwZXNjcmlwdC9saWIvdHlwZXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgTGludCBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvaW5kZXhcIjtcbmltcG9ydCB7QWJzdHJhY3RSdWxlfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvbGFuZ3VhZ2UvcnVsZS9hYnN0cmFjdFJ1bGVcIjtcbmltcG9ydCB7UnVsZVdhbGtlcn0gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy90c2xpbnQvbGliL2xhbmd1YWdlL3dhbGtlci9ydWxlV2Fsa2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgQWJzdHJhY3RSdWxlIHtcbiAgICBwdWJsaWMgc3RhdGljIEZBSUxVUkVfU1RSSU5HOiBzdHJpbmcgPSBcImFzc2lnbm1lbnRzIG11c3Qgbm90IGJlIG1hZGUgb24gcHJvcGVydGllcywgdXNlIHRoZSBjb25zdHJ1Y3RvclwiO1xuXG4gICAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IE5vUHJvcGVydHlBc3NpZ25tZW50c1dhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xuICAgIH1cbn1cblxuY2xhc3MgTm9Qcm9wZXJ0eUFzc2lnbm1lbnRzV2Fsa2VyIGV4dGVuZHMgUnVsZVdhbGtlciB7XG4gICAgcHVibGljIHZpc2l0UHJvcGVydHlEZWNsYXJhdGlvbihub2RlOiB0cy5Qcm9wZXJ0eURlY2xhcmF0aW9uKSB7XG4gICAgICAgIGlmICghTGludC5oYXNNb2RpZmllcihub2RlLm1vZGlmaWVycywgdHMuU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkKSkge1xuICAgICAgICAgICAgaWYgKG5vZGUuZ2V0VGV4dCgpLmluZGV4T2YoXCI9XCIpID49IDAgJiYgbm9kZS5nZXRUZXh0KCkuaW5kZXhPZihcIj0+XCIpIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iXX0=