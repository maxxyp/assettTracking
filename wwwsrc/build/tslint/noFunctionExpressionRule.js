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
var Lint = require("tslint/lib/index");
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
/**
 * Implementation of the no-function-expression rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoFunctionExpressionRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "no-function-expression",
    type: "maintainability",
    description: "Do not use function expressions; use arrow functions (lambdas) instead.",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "Non-SDL",
    issueType: "Warning",
    severity: "Important",
    level: "Opportunity for Excellence",
    group: "Clarity",
    commonWeaknessEnumeration: "398, 710"
};
Rule.FAILURE_STRING = "Use arrow function instead of function expression";
exports.Rule = Rule;
var NoFunctionExpressionRuleWalker = (function (_super) {
    __extends(NoFunctionExpressionRuleWalker, _super);
    function NoFunctionExpressionRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoFunctionExpressionRuleWalker.prototype.visitFunctionExpression = function (node) {
        var walker = new SingleFunctionWalker(this.getSourceFile(), this.getOptions());
        node.getChildren().forEach(function (node1) {
            walker.walk(node1);
        });
        // function expression that access "this" is allowed
        if (!walker.isAccessingThis) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitFunctionExpression.call(this, node);
    };
    return NoFunctionExpressionRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
var SingleFunctionWalker = (function (_super) {
    __extends(SingleFunctionWalker, _super);
    function SingleFunctionWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isAccessingThis = false;
        return _this;
        /* tslint:enable:no-empty */
    }
    SingleFunctionWalker.prototype.visitNode = function (node) {
        if (node.getText() === "this") {
            this.isAccessingThis = true;
        }
        _super.prototype.visitNode.call(this, node);
    };
    /* tslint:disable:no-empty */
    SingleFunctionWalker.prototype.visitFunctionExpression = function (node) {
        // do not visit inner blocks
    };
    SingleFunctionWalker.prototype.visitArrowFunction = function (node) {
        // do not visit inner blocks
    };
    return SingleFunctionWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9GdW5jdGlvbkV4cHJlc3Npb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9GdW5jdGlvbkV4cHJlc3Npb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLHVDQUF5QztBQUV6QyxtRUFBZ0U7QUFHaEU7O0dBRUc7QUFDSDtJQUEwQix3QkFBdUI7SUFBakQ7O0lBdUJBLENBQUM7SUFKVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSw4QkFBOEIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRUwsV0FBQztBQUFELENBQUMsQUF2QkQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBRS9CLGFBQVEsR0FBc0I7SUFDeEMsUUFBUSxFQUFFLHdCQUF3QjtJQUNsQyxJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLFdBQVcsRUFBRSx5RUFBeUU7SUFDdEYsT0FBTyxFQUFFLElBQUk7SUFDYixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFFBQVEsRUFBRSxXQUFXO0lBQ3JCLEtBQUssRUFBRSw0QkFBNEI7SUFDbkMsS0FBSyxFQUFFLFNBQVM7SUFDaEIseUJBQXlCLEVBQUUsVUFBVTtDQUN4QyxDQUFDO0FBRVksbUJBQWMsR0FBRyxtREFBbUQsQ0FBQztBQWpCMUUsb0JBQUk7QUF5QmpCO0lBQTZDLGtEQUFtQjtJQUFoRTs7SUFZQSxDQUFDO0lBWGEsZ0VBQXVCLEdBQWpDLFVBQWtDLElBQTJCO1FBQ3pELElBQU0sTUFBTSxHQUFHLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFjO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxvREFBb0Q7UUFDcEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBQ0QsaUJBQU0sdUJBQXVCLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNMLHFDQUFDO0FBQUQsQ0FBQyxBQVpELENBQTZDLHlDQUFtQixHQVkvRDtBQUVEO0lBQW1DLHdDQUFtQjtJQUF0RDtRQUFBLHFFQWdCQztRQWZVLHFCQUFlLEdBQVksS0FBSyxDQUFDOztRQWN4Qyw0QkFBNEI7SUFDaEMsQ0FBQztJQWRhLHdDQUFTLEdBQW5CLFVBQW9CLElBQWE7UUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDaEMsQ0FBQztRQUNELGlCQUFNLFNBQVMsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ0QsNkJBQTZCO0lBQ25CLHNEQUF1QixHQUFqQyxVQUFrQyxJQUEyQjtRQUN6RCw0QkFBNEI7SUFDaEMsQ0FBQztJQUNTLGlEQUFrQixHQUE1QixVQUE2QixJQUFnQztRQUN6RCw0QkFBNEI7SUFDaEMsQ0FBQztJQUVMLDJCQUFDO0FBQUQsQ0FBQyxBQWhCRCxDQUFtQyx5Q0FBbUIsR0FnQnJEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSBcInR5cGVzY3JpcHRcIjtcbmltcG9ydCAqIGFzIExpbnQgZnJvbSBcInRzbGludC9saWIvaW5kZXhcIjtcblxuaW1wb3J0IHtFcnJvclRvbGVyYW50V2Fsa2VyfSBmcm9tIFwiLi91dGlscy9FcnJvclRvbGVyYW50V2Fsa2VyXCI7XG5pbXBvcnQge0lFeHRlbmRlZE1ldGFkYXRhfSBmcm9tIFwiLi91dGlscy9FeHRlbmRlZE1ldGFkYXRhXCI7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIG5vLWZ1bmN0aW9uLWV4cHJlc3Npb24gcnVsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIG1ldGFkYXRhOiBJRXh0ZW5kZWRNZXRhZGF0YSA9IHtcbiAgICAgICAgcnVsZU5hbWU6IFwibm8tZnVuY3Rpb24tZXhwcmVzc2lvblwiLFxuICAgICAgICB0eXBlOiBcIm1haW50YWluYWJpbGl0eVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEbyBub3QgdXNlIGZ1bmN0aW9uIGV4cHJlc3Npb25zOyB1c2UgYXJyb3cgZnVuY3Rpb25zIChsYW1iZGFzKSBpbnN0ZWFkLlwiLFxuICAgICAgICBvcHRpb25zOiBudWxsLFxuICAgICAgICBvcHRpb25zRGVzY3JpcHRpb246IG51bGwsXG4gICAgICAgIHR5cGVzY3JpcHRPbmx5OiBudWxsLFxuICAgICAgICBpc3N1ZUNsYXNzOiBcIk5vbi1TRExcIixcbiAgICAgICAgaXNzdWVUeXBlOiBcIldhcm5pbmdcIixcbiAgICAgICAgc2V2ZXJpdHk6IFwiSW1wb3J0YW50XCIsXG4gICAgICAgIGxldmVsOiBcIk9wcG9ydHVuaXR5IGZvciBFeGNlbGxlbmNlXCIsXG4gICAgICAgIGdyb3VwOiBcIkNsYXJpdHlcIixcbiAgICAgICAgY29tbW9uV2Vha25lc3NFbnVtZXJhdGlvbjogXCIzOTgsIDcxMFwiXG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkcgPSBcIlVzZSBhcnJvdyBmdW5jdGlvbiBpbnN0ZWFkIG9mIGZ1bmN0aW9uIGV4cHJlc3Npb25cIjtcblxuICAgIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoV2Fsa2VyKG5ldyBOb0Z1bmN0aW9uRXhwcmVzc2lvblJ1bGVXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG5cbn1cblxuY2xhc3MgTm9GdW5jdGlvbkV4cHJlc3Npb25SdWxlV2Fsa2VyIGV4dGVuZHMgRXJyb3JUb2xlcmFudFdhbGtlciB7XG4gICAgcHJvdGVjdGVkIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKG5vZGU6IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbik6IHZvaWQge1xuICAgICAgICBjb25zdCB3YWxrZXIgPSBuZXcgU2luZ2xlRnVuY3Rpb25XYWxrZXIodGhpcy5nZXRTb3VyY2VGaWxlKCksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goKG5vZGUxOiB0cy5Ob2RlKSA9PiB7XG4gICAgICAgICAgICB3YWxrZXIud2Fsayhub2RlMSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBmdW5jdGlvbiBleHByZXNzaW9uIHRoYXQgYWNjZXNzIFwidGhpc1wiIGlzIGFsbG93ZWRcbiAgICAgICAgaWYgKCF3YWxrZXIuaXNBY2Nlc3NpbmdUaGlzKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HKSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIudmlzaXRGdW5jdGlvbkV4cHJlc3Npb24obm9kZSk7XG4gICAgfVxufVxuXG5jbGFzcyBTaW5nbGVGdW5jdGlvbldhbGtlciBleHRlbmRzIEVycm9yVG9sZXJhbnRXYWxrZXIge1xuICAgIHB1YmxpYyBpc0FjY2Vzc2luZ1RoaXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcm90ZWN0ZWQgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5vZGUuZ2V0VGV4dCgpID09PSBcInRoaXNcIikge1xuICAgICAgICAgICAgdGhpcy5pc0FjY2Vzc2luZ1RoaXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLnZpc2l0Tm9kZShub2RlKTtcbiAgICB9XG4gICAgLyogdHNsaW50OmRpc2FibGU6bm8tZW1wdHkgKi9cbiAgICBwcm90ZWN0ZWQgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24obm9kZTogdHMuRnVuY3Rpb25FeHByZXNzaW9uKTogdm9pZCB7XG4gICAgICAgIC8vIGRvIG5vdCB2aXNpdCBpbm5lciBibG9ja3NcbiAgICB9XG4gICAgcHJvdGVjdGVkIHZpc2l0QXJyb3dGdW5jdGlvbihub2RlOiB0cy5GdW5jdGlvbkxpa2VEZWNsYXJhdGlvbik6IHZvaWQge1xuICAgICAgICAvLyBkbyBub3QgdmlzaXQgaW5uZXIgYmxvY2tzXG4gICAgfVxuICAgIC8qIHRzbGludDplbmFibGU6bm8tZW1wdHkgKi9cbn0iXX0=