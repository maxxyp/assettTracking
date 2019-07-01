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
var ruleWalker_1 = require("../../node_modules/tslint/lib/language/walker/ruleWalker");
var abstractRule_1 = require("../../node_modules/tslint/lib/language/rule/abstractRule");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = this.getOptions();
        var noFunctionWalker = new NoFunctionWalker(sourceFile, this.getOptions());
        for (var _i = 0, _a = options.ruleArguments; _i < _a.length; _i++) {
            var option = _a[_i];
            noFunctionWalker.functions.push(option);
        }
        return this.applyWithWalker(noFunctionWalker);
    };
    return Rule;
}(abstractRule_1.AbstractRule));
Rule.FAILURE_STRING_PART = "forbidden function: ";
exports.Rule = Rule;
var NoFunctionWalker = (function (_super) {
    __extends(NoFunctionWalker, _super);
    function NoFunctionWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.functions = [];
        return _this;
    }
    NoFunctionWalker.prototype.visitCallExpression = function (node) {
        var expression = node.expression;
        if (expression.kind === ts.SyntaxKind.Identifier) {
            var expressionName = expression.text;
            for (var i = 0; i < this.functions.length; i++) {
                if (expressionName === this.functions[i]) {
                    this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING_PART + expressionName));
                }
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoFunctionWalker;
}(ruleWalker_1.RuleWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFuRnVuY3Rpb25zUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhbkZ1bmN0aW9uc1J1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQW1FO0FBQ25FLHVGQUFvRjtBQUNwRix5RkFBc0Y7QUFHdEY7SUFBMEIsd0JBQVk7SUFBdEM7O0lBWUEsQ0FBQztJQVRVLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNsQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUU3RSxHQUFHLENBQUMsQ0FBZSxVQUFxQixFQUFyQixLQUFBLE9BQU8sQ0FBQyxhQUFhLEVBQXJCLGNBQXFCLEVBQXJCLElBQXFCO1lBQW5DLElBQUksTUFBTSxTQUFBO1lBQ1gsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBWkQsQ0FBMEIsMkJBQVk7QUFDcEIsd0JBQW1CLEdBQUcsc0JBQXNCLENBQUM7QUFEbEQsb0JBQUk7QUFjakI7SUFBK0Isb0NBQVU7SUFBekM7UUFBQSxxRUFpQkM7UUFoQlUsZUFBUyxHQUFhLEVBQUUsQ0FBQzs7SUFnQnBDLENBQUM7SUFkVSw4Q0FBbUIsR0FBMUIsVUFBMkIsSUFBdUI7UUFDOUMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFNLGNBQWMsR0FBb0IsVUFBVyxDQUFDLElBQUksQ0FBQztZQUN6RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUNqQyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUMvRixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxpQkFBTSxtQkFBbUIsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBakJELENBQStCLHVCQUFVLEdBaUJ4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHlwZXNjcmlwdC9saWIvdHlwZXNjcmlwdFwiO1xuaW1wb3J0IHtSdWxlV2Fsa2VyfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvbGFuZ3VhZ2Uvd2Fsa2VyL3J1bGVXYWxrZXJcIjtcbmltcG9ydCB7QWJzdHJhY3RSdWxlfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvbGFuZ3VhZ2UvcnVsZS9hYnN0cmFjdFJ1bGVcIjtcbmltcG9ydCB7UnVsZUZhaWx1cmV9IGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHNsaW50L2xpYi9sYW5ndWFnZS9ydWxlL3J1bGVcIjtcblxuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBBYnN0cmFjdFJ1bGUge1xuICAgIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkdfUEFSVCA9IFwiZm9yYmlkZGVuIGZ1bmN0aW9uOiBcIjtcblxuICAgIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogUnVsZUZhaWx1cmVbXSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICAgICAgY29uc3Qgbm9GdW5jdGlvbldhbGtlciA9IG5ldyBOb0Z1bmN0aW9uV2Fsa2VyKHNvdXJjZUZpbGUsIHRoaXMuZ2V0T3B0aW9ucygpKTtcblxuICAgICAgICBmb3IgKGxldCBvcHRpb24gb2Ygb3B0aW9ucy5ydWxlQXJndW1lbnRzKSB7XG4gICAgICAgICAgICBub0Z1bmN0aW9uV2Fsa2VyLmZ1bmN0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoV2Fsa2VyKG5vRnVuY3Rpb25XYWxrZXIpO1xuICAgIH1cbn1cblxuY2xhc3MgTm9GdW5jdGlvbldhbGtlciBleHRlbmRzIFJ1bGVXYWxrZXIge1xuICAgIHB1YmxpYyBmdW5jdGlvbnM6IHN0cmluZ1tdID0gW107XG5cbiAgICBwdWJsaWMgdmlzaXRDYWxsRXhwcmVzc2lvbihub2RlOiB0cy5DYWxsRXhwcmVzc2lvbikge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gbm9kZS5leHByZXNzaW9uO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25OYW1lID0gKDx0cy5JZGVudGlmaWVyPiBleHByZXNzaW9uKS50ZXh0O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChleHByZXNzaW9uTmFtZSA9PT0gdGhpcy5mdW5jdGlvbnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRGYWlsdXJlKHRoaXMuY3JlYXRlRmFpbHVyZVxuICAgICAgICAgICAgICAgICAgICAoZXhwcmVzc2lvbi5nZXRTdGFydCgpLCBleHByZXNzaW9uLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkdfUEFSVCArIGV4cHJlc3Npb25OYW1lKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIudmlzaXRDYWxsRXhwcmVzc2lvbihub2RlKTtcbiAgICB9XG59Il19