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
var SyntaxKind_1 = require("./utils/SyntaxKind");
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
var AstUtils_1 = require("./utils/AstUtils");
/**
 * Implementation of the no-unnecessary-bin rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoUnnecessaryBindRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "no-unnecessary-bind",
    type: "maintainability",
    description: "Do not bind `this` as the context for a function literal or lambda expression.",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "Non-SDL",
    issueType: "Warning",
    severity: "Important",
    level: "Opportunity for Excellence",
    group: "Correctness",
    commonWeaknessEnumeration: "398, 710"
};
Rule.FAILURE_FUNCTION_WITH_BIND = "Binding function literal with \"this\" context. Use lambdas instead";
Rule.FAILURE_ARROW_WITH_BIND = "Binding lambda with \"this\" context. Lambdas already have \"this\" bound";
Rule.UNDERSCORE_BINARY_FUNCTION_NAMES = [
    "all", "any", "collect", "countBy", "detect", "each",
    "every", "filter", "find", "forEach", "groupBy", "indexBy",
    "map", "max", "max", "min", "partition", "reject",
    "select", "some", "sortBy", "times", "uniq", "unique"
];
Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES = [
    "foldl", "foldr", "inject", "reduce", "reduceRight"
];
exports.Rule = Rule;
var NoUnnecessaryBindRuleWalker = (function (_super) {
    __extends(NoUnnecessaryBindRuleWalker, _super);
    function NoUnnecessaryBindRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoUnnecessaryBindRuleWalker.prototype.visitCallExpression = function (node) {
        var _this = this;
        var analyzers = [
            new TypeScriptFunctionAnalyzer(), new UnderscoreStaticAnalyzer(), new UnderscoreInstanceAnalyzer()
        ];
        analyzers.forEach(function (analyzer) {
            if (analyzer.canHandle(node)) {
                var contextArgument = analyzer.getContextArgument(node);
                var functionArgument = analyzer.getFunctionArgument(node);
                if (contextArgument == null || functionArgument == null) {
                    return;
                }
                if (contextArgument.getText() === "this") {
                    if (isArrowFunction(functionArgument)) {
                        _this.addFailure(_this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_ARROW_WITH_BIND));
                    }
                    else if (isFunctionLiteral(functionArgument)) {
                        _this.addFailure(_this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_FUNCTION_WITH_BIND));
                    }
                }
            }
        });
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoUnnecessaryBindRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
var TypeScriptFunctionAnalyzer = (function () {
    function TypeScriptFunctionAnalyzer() {
    }
    TypeScriptFunctionAnalyzer.prototype.canHandle = function (node) {
        return !!(AstUtils_1.AstUtils.getFunctionName(node) === "bind"
            && node.arguments.length === 1
            && node.expression.kind === SyntaxKind_1.SyntaxKind.current().PropertyAccessExpression);
    };
    TypeScriptFunctionAnalyzer.prototype.getContextArgument = function (node) {
        return node.arguments[0];
    };
    TypeScriptFunctionAnalyzer.prototype.getFunctionArgument = function (node) {
        return node.expression.expression;
    };
    return TypeScriptFunctionAnalyzer;
}());
var UnderscoreStaticAnalyzer = (function () {
    function UnderscoreStaticAnalyzer() {
    }
    UnderscoreStaticAnalyzer.prototype.canHandle = function (node) {
        var isUnderscore = AstUtils_1.AstUtils.getFunctionTarget(node) === "_";
        if (isUnderscore) {
            var functionName = AstUtils_1.AstUtils.getFunctionName(node);
            if (functionName === "bind") {
                return node.arguments.length === 2;
            }
        }
        return isUnderscore;
    };
    UnderscoreStaticAnalyzer.prototype.getContextArgument = function (node) {
        var functionName = AstUtils_1.AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[2];
        }
        else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[3];
        }
        else if (functionName === "sortedIndex") {
            return node.arguments[3];
        }
        else if (functionName === "bind") {
            return node.arguments[1];
        }
        return null;
    };
    UnderscoreStaticAnalyzer.prototype.getFunctionArgument = function (node) {
        var functionName = AstUtils_1.AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[1];
        }
        else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[1];
        }
        else if (functionName === "sortedIndex") {
            return node.arguments[2];
        }
        else if (functionName === "bind") {
            return node.arguments[0];
        }
        return null;
    };
    return UnderscoreStaticAnalyzer;
}());
var UnderscoreInstanceAnalyzer = (function () {
    function UnderscoreInstanceAnalyzer() {
    }
    UnderscoreInstanceAnalyzer.prototype.canHandle = function (node) {
        if (node.expression.kind === SyntaxKind_1.SyntaxKind.current().PropertyAccessExpression) {
            var propExpression = node.expression;
            if (propExpression.expression.kind === SyntaxKind_1.SyntaxKind.current().CallExpression) {
                var call = propExpression.expression;
                return call.expression.getText() === "_";
            }
        }
        return false;
    };
    UnderscoreInstanceAnalyzer.prototype.getContextArgument = function (node) {
        var functionName = AstUtils_1.AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[1];
        }
        else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[2];
        }
        else if (functionName === "sortedIndex") {
            return node.arguments[2];
        }
        return null;
    };
    UnderscoreInstanceAnalyzer.prototype.getFunctionArgument = function (node) {
        var functionName = AstUtils_1.AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[0];
        }
        else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[0];
        }
        else if (functionName === "sortedIndex") {
            return node.arguments[1];
        }
        return null;
    };
    return UnderscoreInstanceAnalyzer;
}());
function isFunctionLiteral(expression) {
    if (expression.kind === SyntaxKind_1.SyntaxKind.current().FunctionExpression) {
        return true;
    }
    if (expression.kind === SyntaxKind_1.SyntaxKind.current().ParenthesizedExpression) {
        return isFunctionLiteral(expression.expression);
    }
    return false;
}
function isArrowFunction(expression) {
    if (expression.kind === SyntaxKind_1.SyntaxKind.current().ArrowFunction) {
        return true;
    }
    if (expression.kind === SyntaxKind_1.SyntaxKind.current().ParenthesizedExpression) {
        return isArrowFunction(expression.expression);
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9Vbm5lY2Vzc2FyeUJpbmRSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9Vbm5lY2Vzc2FyeUJpbmRSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLHVDQUF5QztBQUV6QyxpREFBOEM7QUFDOUMsbUVBQWdFO0FBQ2hFLDZDQUEwQztBQUcxQzs7R0FFRztBQUNIO0lBQTBCLHdCQUF1QjtJQUFqRDs7SUFpQ0EsQ0FBQztJQUhVLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLDJCQUEyQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQWpDRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFFL0IsYUFBUSxHQUFzQjtJQUN4QyxRQUFRLEVBQUUscUJBQXFCO0lBQy9CLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsV0FBVyxFQUFFLGdGQUFnRjtJQUM3RixPQUFPLEVBQUUsSUFBSTtJQUNiLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsVUFBVSxFQUFFLFNBQVM7SUFDckIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsUUFBUSxFQUFFLFdBQVc7SUFDckIsS0FBSyxFQUFFLDRCQUE0QjtJQUNuQyxLQUFLLEVBQUUsYUFBYTtJQUNwQix5QkFBeUIsRUFBRSxVQUFVO0NBQ3hDLENBQUM7QUFFWSwrQkFBMEIsR0FBRyxxRUFBcUUsQ0FBQztBQUNuRyw0QkFBdUIsR0FBRywyRUFBMkUsQ0FBQztBQUV0RyxxQ0FBZ0MsR0FBYTtJQUN2RCxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU07SUFDcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxF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LElBQUksS0FBSyx1QkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsaUJBQWlCLENBQThCLFVBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQseUJBQXlCLFVBQXlCO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssdUJBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssdUJBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7UUFDbkUsTUFBTSxDQUFDLGVBQWUsQ0FBOEIsVUFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tIFwidHlwZXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgTGludCBmcm9tIFwidHNsaW50L2xpYi9pbmRleFwiO1xuXG5pbXBvcnQge1N5bnRheEtpbmR9IGZyb20gXCIuL3V0aWxzL1N5bnRheEtpbmRcIjtcbmltcG9ydCB7RXJyb3JUb2xlcmFudFdhbGtlcn0gZnJvbSBcIi4vdXRpbHMvRXJyb3JUb2xlcmFudFdhbGtlclwiO1xuaW1wb3J0IHtBc3RVdGlsc30gZnJvbSBcIi4vdXRpbHMvQXN0VXRpbHNcIjtcbmltcG9ydCB7SUV4dGVuZGVkTWV0YWRhdGF9IGZyb20gXCIuL3V0aWxzL0V4dGVuZGVkTWV0YWRhdGFcIjtcblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgbm8tdW5uZWNlc3NhcnktYmluIHJ1bGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuXG4gICAgcHVibGljIHN0YXRpYyBtZXRhZGF0YTogSUV4dGVuZGVkTWV0YWRhdGEgPSB7XG4gICAgICAgIHJ1bGVOYW1lOiBcIm5vLXVubmVjZXNzYXJ5LWJpbmRcIixcbiAgICAgICAgdHlwZTogXCJtYWludGFpbmFiaWxpdHlcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRG8gbm90IGJpbmQgYHRoaXNgIGFzIHRoZSBjb250ZXh0IGZvciBhIGZ1bmN0aW9uIGxpdGVyYWwgb3IgbGFtYmRhIGV4cHJlc3Npb24uXCIsXG4gICAgICAgIG9wdGlvbnM6IG51bGwsXG4gICAgICAgIG9wdGlvbnNEZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgdHlwZXNjcmlwdE9ubHk6IG51bGwsXG4gICAgICAgIGlzc3VlQ2xhc3M6IFwiTm9uLVNETFwiLFxuICAgICAgICBpc3N1ZVR5cGU6IFwiV2FybmluZ1wiLFxuICAgICAgICBzZXZlcml0eTogXCJJbXBvcnRhbnRcIixcbiAgICAgICAgbGV2ZWw6IFwiT3Bwb3J0dW5pdHkgZm9yIEV4Y2VsbGVuY2VcIixcbiAgICAgICAgZ3JvdXA6IFwiQ29ycmVjdG5lc3NcIixcbiAgICAgICAgY29tbW9uV2Vha25lc3NFbnVtZXJhdGlvbjogXCIzOTgsIDcxMFwiXG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9GVU5DVElPTl9XSVRIX0JJTkQgPSBcIkJpbmRpbmcgZnVuY3Rpb24gbGl0ZXJhbCB3aXRoIFxcXCJ0aGlzXFxcIiBjb250ZXh0LiBVc2UgbGFtYmRhcyBpbnN0ZWFkXCI7XG4gICAgcHVibGljIHN0YXRpYyBGQUlMVVJFX0FSUk9XX1dJVEhfQklORCA9IFwiQmluZGluZyBsYW1iZGEgd2l0aCBcXFwidGhpc1xcXCIgY29udGV4dC4gTGFtYmRhcyBhbHJlYWR5IGhhdmUgXFxcInRoaXNcXFwiIGJvdW5kXCI7XG5cbiAgICBwdWJsaWMgc3RhdGljIFVOREVSU0NPUkVfQklOQVJZX0ZVTkNUSU9OX05BTUVTOiBzdHJpbmdbXSA9IFtcbiAgICAgICAgXCJhbGxcIiwgXCJhbnlcIiwgXCJjb2xsZWN0XCIsIFwiY291bnRCeVwiLCBcImRldGVjdFwiLCBcImVhY2hcIixcbiAgICAgICAgXCJldmVyeVwiLCBcImZpbHRlclwiLCBcImZpbmRcIiwgXCJmb3JFYWNoXCIsIFwiZ3JvdXBCeVwiLCBcImluZGV4QnlcIixcbiAgICAgICAgXCJtYXBcIiwgXCJtYXhcIiwgXCJtYXhcIiwgXCJtaW5cIiwgXCJwYXJ0aXRpb25cIiwgXCJyZWplY3RcIixcbiAgICAgICAgXCJzZWxlY3RcIiwgXCJzb21lXCIsIFwic29ydEJ5XCIsIFwidGltZXNcIiwgXCJ1bmlxXCIsIFwidW5pcXVlXCJcbiAgICBdO1xuICAgIHB1YmxpYyBzdGF0aWMgVU5ERVJTQ09SRV9URVJOQVJZX0ZVTkNUSU9OX05BTUVTOiBzdHJpbmdbXSA9IFtcbiAgICAgICAgXCJmb2xkbFwiLCBcImZvbGRyXCIsIFwiaW5qZWN0XCIsIFwicmVkdWNlXCIsIFwicmVkdWNlUmlnaHRcIlxuICAgIF07XG5cbiAgICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgTm9Vbm5lY2Vzc2FyeUJpbmRSdWxlV2Fsa2VyKHNvdXJjZUZpbGUsIHRoaXMuZ2V0T3B0aW9ucygpKSk7XG4gICAgfVxufVxuXG5jbGFzcyBOb1VubmVjZXNzYXJ5QmluZFJ1bGVXYWxrZXIgZXh0ZW5kcyBFcnJvclRvbGVyYW50V2Fsa2VyIHtcbiAgICBwcm90ZWN0ZWQgdmlzaXRDYWxsRXhwcmVzc2lvbihub2RlOiB0cy5DYWxsRXhwcmVzc2lvbik6IHZvaWQge1xuICAgICAgICBjb25zdCBhbmFseXplcnM6IENhbGxBbmFseXplcltdID0gW1xuICAgICAgICAgICAgbmV3IFR5cGVTY3JpcHRGdW5jdGlvbkFuYWx5emVyKCksIG5ldyBVbmRlcnNjb3JlU3RhdGljQW5hbHl6ZXIoKSwgbmV3IFVuZGVyc2NvcmVJbnN0YW5jZUFuYWx5emVyKClcbiAgICAgICAgXTtcblxuICAgICAgICBhbmFseXplcnMuZm9yRWFjaCgoYW5hbHl6ZXI6IENhbGxBbmFseXplcik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKGFuYWx5emVyLmNhbkhhbmRsZShub2RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRleHRBcmd1bWVudDogdHMuRXhwcmVzc2lvbiA9IGFuYWx5emVyLmdldENvbnRleHRBcmd1bWVudChub2RlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jdGlvbkFyZ3VtZW50OiB0cy5FeHByZXNzaW9uID0gYW5hbHl6ZXIuZ2V0RnVuY3Rpb25Bcmd1bWVudChub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGV4dEFyZ3VtZW50ID09IG51bGwgfHwgZnVuY3Rpb25Bcmd1bWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHRBcmd1bWVudC5nZXRUZXh0KCkgPT09IFwidGhpc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0Fycm93RnVuY3Rpb24oZnVuY3Rpb25Bcmd1bWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9BUlJPV19XSVRIX0JJTkQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uTGl0ZXJhbChmdW5jdGlvbkFyZ3VtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRGYWlsdXJlKHRoaXMuY3JlYXRlRmFpbHVyZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSwgUnVsZS5GQUlMVVJFX0ZVTkNUSU9OX1dJVEhfQklORCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3VwZXIudmlzaXRDYWxsRXhwcmVzc2lvbihub2RlKTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBDYWxsQW5hbHl6ZXIge1xuICAgIGNhbkhhbmRsZShub2RlOiB0cy5DYWxsRXhwcmVzc2lvbik6IGJvb2xlYW47XG4gICAgZ2V0Q29udGV4dEFyZ3VtZW50KG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogdHMuRXhwcmVzc2lvbjtcbiAgICBnZXRGdW5jdGlvbkFyZ3VtZW50KG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogdHMuRXhwcmVzc2lvbjtcbn1cblxuY2xhc3MgVHlwZVNjcmlwdEZ1bmN0aW9uQW5hbHl6ZXIgaW1wbGVtZW50cyBDYWxsQW5hbHl6ZXIge1xuICAgIHB1YmxpYyBjYW5IYW5kbGUobm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhKEFzdFV0aWxzLmdldEZ1bmN0aW9uTmFtZShub2RlKSA9PT0gXCJiaW5kXCJcbiAgICAgICAgJiYgbm9kZS5hcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgICAgICYmIG5vZGUuZXhwcmVzc2lvbi5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb250ZXh0QXJndW1lbnQobm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pOiB0cy5FeHByZXNzaW9uIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuYXJndW1lbnRzWzBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGdW5jdGlvbkFyZ3VtZW50KG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgICAgIHJldHVybiAoPHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbj5ub2RlLmV4cHJlc3Npb24pLmV4cHJlc3Npb247XG4gICAgfVxufVxuXG5jbGFzcyBVbmRlcnNjb3JlU3RhdGljQW5hbHl6ZXIgaW1wbGVtZW50cyBDYWxsQW5hbHl6ZXIge1xuICAgIHB1YmxpYyBjYW5IYW5kbGUobm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgaXNVbmRlcnNjb3JlOiBib29sZWFuID0gQXN0VXRpbHMuZ2V0RnVuY3Rpb25UYXJnZXQobm9kZSkgPT09IFwiX1wiO1xuICAgICAgICBpZiAoaXNVbmRlcnNjb3JlKSB7XG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbk5hbWU6IHN0cmluZyA9IEFzdFV0aWxzLmdldEZ1bmN0aW9uTmFtZShub2RlKTtcbiAgICAgICAgICAgIGlmIChmdW5jdGlvbk5hbWUgPT09IFwiYmluZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuYXJndW1lbnRzLmxlbmd0aCA9PT0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNVbmRlcnNjb3JlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb250ZXh0QXJndW1lbnQobm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pOiB0cy5FeHByZXNzaW9uIHtcbiAgICAgICAgY29uc3QgZnVuY3Rpb25OYW1lOiBzdHJpbmcgPSBBc3RVdGlscy5nZXRGdW5jdGlvbk5hbWUobm9kZSk7XG4gICAgICAgIGlmIChSdWxlLlVOREVSU0NPUkVfQklOQVJZX0ZVTkNUSU9OX05BTUVTLmluZGV4T2YoZnVuY3Rpb25OYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmFyZ3VtZW50c1syXTtcbiAgICAgICAgfSBlbHNlIGlmIChSdWxlLlVOREVSU0NPUkVfVEVSTkFSWV9GVU5DVElPTl9OQU1FUy5pbmRleE9mKGZ1bmN0aW9uTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5hcmd1bWVudHNbM107XG4gICAgICAgIH0gZWxzZSBpZiAoZnVuY3Rpb25OYW1lID09PSBcInNvcnRlZEluZGV4XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmFyZ3VtZW50c1szXTtcbiAgICAgICAgfSBlbHNlIGlmIChmdW5jdGlvbk5hbWUgPT09IFwiYmluZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5hcmd1bWVudHNbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZ1bmN0aW9uQXJndW1lbnQobm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pOiB0cy5FeHByZXNzaW9uIHtcbiAgICAgICAgY29uc3QgZnVuY3Rpb25OYW1lOiBzdHJpbmcgPSBBc3RVdGlscy5nZXRGdW5jdGlvbk5hbWUobm9kZSk7XG4gICAgICAgIGlmIChSdWxlLlVOREVSU0NPUkVfQklOQVJZX0ZVTkNUSU9OX05BTUVTLmluZGV4T2YoZnVuY3Rpb25OYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmFyZ3VtZW50c1sxXTtcbiAgICAgICAgfSBlbHNlIGlmIChSdWxlLlVOREVSU0NPUkVfVEVSTkFSWV9GVU5DVElPTl9OQU1FUy5pbmRleE9mKGZ1bmN0aW9uTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5hcmd1bWVudHNbMV07XG4gICAgICAgIH0gZWxzZSBpZiAoZnVuY3Rpb25OYW1lID09PSBcInNvcnRlZEluZGV4XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmFyZ3VtZW50c1syXTtcbiAgICAgICAgfSBlbHNlIGlmIChmdW5jdGlvbk5hbWUgPT09IFwiYmluZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5jbGFzcyBVbmRlcnNjb3JlSW5zdGFuY2VBbmFseXplciBpbXBsZW1lbnRzIENhbGxBbmFseXplciB7XG4gICAgcHVibGljIGNhbkhhbmRsZShub2RlOiB0cy5DYWxsRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAobm9kZS5leHByZXNzaW9uLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgY29uc3QgcHJvcEV4cHJlc3Npb246IHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbiA9IDx0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24+bm9kZS5leHByZXNzaW9uO1xuICAgICAgICAgICAgaWYgKHByb3BFeHByZXNzaW9uLmV4cHJlc3Npb24ua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuQ2FsbEV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsOiB0cy5DYWxsRXhwcmVzc2lvbiA9IDx0cy5DYWxsRXhwcmVzc2lvbj5wcm9wRXhwcmVzc2lvbi5leHByZXNzaW9uO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsLmV4cHJlc3Npb24uZ2V0VGV4dCgpID09PSBcIl9cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbnRleHRBcmd1bWVudChub2RlOiB0cy5DYWxsRXhwcmVzc2lvbik6IHRzLkV4cHJlc3Npb24ge1xuICAgICAgICBjb25zdCBmdW5jdGlvbk5hbWU6IHN0cmluZyA9IEFzdFV0aWxzLmdldEZ1bmN0aW9uTmFtZShub2RlKTtcbiAgICAgICAgaWYgKFJ1bGUuVU5ERVJTQ09SRV9CSU5BUllfRlVOQ1RJT05fTkFNRVMuaW5kZXhPZihmdW5jdGlvbk5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKFJ1bGUuVU5ERVJTQ09SRV9URVJOQVJZX0ZVTkNUSU9OX05BTUVTLmluZGV4T2YoZnVuY3Rpb25OYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmFyZ3VtZW50c1syXTtcbiAgICAgICAgfSBlbHNlIGlmIChmdW5jdGlvbk5hbWUgPT09IFwic29ydGVkSW5kZXhcIikge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuYXJndW1lbnRzWzJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGdW5jdGlvbkFyZ3VtZW50KG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZTogc3RyaW5nID0gQXN0VXRpbHMuZ2V0RnVuY3Rpb25OYW1lKG5vZGUpO1xuICAgICAgICBpZiAoUnVsZS5VTkRFUlNDT1JFX0JJTkFSWV9GVU5DVElPTl9OQU1FUy5pbmRleE9mKGZ1bmN0aW9uTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICAgIH0gZWxzZSBpZiAoUnVsZS5VTkRFUlNDT1JFX1RFUk5BUllfRlVOQ1RJT05fTkFNRVMuaW5kZXhPZihmdW5jdGlvbk5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuYXJndW1lbnRzWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKGZ1bmN0aW9uTmFtZSA9PT0gXCJzb3J0ZWRJbmRleFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5hcmd1bWVudHNbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb25MaXRlcmFsKGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICBpZiAoZXhwcmVzc2lvbi5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5GdW5jdGlvbkV4cHJlc3Npb24pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uTGl0ZXJhbCgoPHRzLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uPmV4cHJlc3Npb24pLmV4cHJlc3Npb24pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzQXJyb3dGdW5jdGlvbihleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKGV4cHJlc3Npb24ua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuQXJyb3dGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24ua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuUGFyZW50aGVzaXplZEV4cHJlc3Npb24pIHtcbiAgICAgICAgcmV0dXJuIGlzQXJyb3dGdW5jdGlvbigoPHRzLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uPmV4cHJlc3Npb24pLmV4cHJlc3Npb24pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59Il19