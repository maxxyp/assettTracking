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
var Utils_1 = require("./utils/Utils");
/**
 * Implementation of the promise-must-complete rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PromiseAnalyzer(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "promise-must-complete",
    type: "maintainability",
    description: "When a Promise instance is created, then either the reject() or resolve() parameter must be " +
        "called on it within all code branches in the scope.",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "Non-SDL",
    issueType: "Error",
    severity: "Critical",
    level: "Opportunity for Excellence",
    group: "Correctness"
};
Rule.FAILURE_STRING = "A Promise was found that appears to not have resolve or reject invoked on all code paths";
exports.Rule = Rule;
var PromiseAnalyzer = (function (_super) {
    __extends(PromiseAnalyzer, _super);
    function PromiseAnalyzer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PromiseAnalyzer.prototype.isPromiseDeclaration = function (node) {
        if (node.expression.kind === SyntaxKind_1.SyntaxKind.current().Identifier
            && node.expression.getText() === "Promise"
            && node.arguments != null && node.arguments.length > 0) {
            var firstArg = node.arguments[0];
            if (firstArg.kind === SyntaxKind_1.SyntaxKind.current().ArrowFunction || firstArg.kind === SyntaxKind_1.SyntaxKind.current().FunctionExpression) {
                return true;
            }
        }
        return false;
    };
    PromiseAnalyzer.prototype.getCompletionIdentifiers = function (declaration) {
        var result = [];
        if (declaration.parameters == null || declaration.parameters.length === 0) {
            return result;
        }
        var arg1 = declaration.parameters[0];
        var arg2 = declaration.parameters[1];
        if (arg1 != null && arg1.name.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
            result.push(declaration.parameters[0].name);
        }
        if (arg2 != null && arg2.name.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
            result.push(declaration.parameters[1].name);
        }
        return result;
    };
    PromiseAnalyzer.prototype.visitNewExpression = function (node) {
        if (this.isPromiseDeclaration(node)) {
            var functionArgument = node.arguments[0];
            var functionBody = functionArgument.body;
            var competionIdentifiers = this.getCompletionIdentifiers(functionArgument);
            this.validatePromiseUsage(node, functionBody, competionIdentifiers);
        }
        _super.prototype.visitNewExpression.call(this, node);
    };
    PromiseAnalyzer.prototype.validatePromiseUsage = function (promiseInstantiation, block, completionIdentifiers) {
        var blockAnalyzer = new PromiseCompletionWalker(this.getSourceFile(), this.getOptions(), completionIdentifiers);
        blockAnalyzer.visitNode(block);
        if (!blockAnalyzer.isAlwaysCompleted()) {
            var failure = this.createFailure(promiseInstantiation.getStart(), promiseInstantiation.getWidth(), Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
    };
    return PromiseAnalyzer;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
var PromiseCompletionWalker = (function (_super) {
    __extends(PromiseCompletionWalker, _super);
    function PromiseCompletionWalker(sourceFile, options, completionIdentifiers) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.wasCompleted = false;
        _this.allBranchesCompleted = true; // by default, there are no branches, so this is true
        _this.hasBranches = false;
        _this.walkerOptions = options; // we need to store this because this.getOptions() returns undefined even when this has a value
        _this.completionIdentifiers = completionIdentifiers;
        return _this;
    }
    // need to make this public so it can invoked from parent walker
    /* tslint:disable:no-unnecessary-override */
    PromiseCompletionWalker.prototype.visitNode = function (node) {
        _super.prototype.visitNode.call(this, node);
    };
    /* tslint:enable:no-unnecessary-override */
    PromiseCompletionWalker.prototype.isAlwaysCompleted = function () {
        if (this.wasCompleted) {
            return true; // if the main code path completed then it doesn"t matter what the child branches did
        }
        if (!this.hasBranches) {
            return false; // if there were no branches and it is not complete... then it is in total not complete.
        }
        return this.allBranchesCompleted; // if main path did *not* complete, the look at child branch status
    };
    PromiseCompletionWalker.prototype.visitIfStatement = function (node) {
        this.hasBranches = true;
        // an if statement is a branch, so we need to see if this branch completes.
        var ifAnalyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, this.completionIdentifiers);
        var elseAnalyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, this.completionIdentifiers);
        ifAnalyzer.visitNode(node.thenStatement);
        if (!ifAnalyzer.isAlwaysCompleted()) {
            this.allBranchesCompleted = false;
        }
        else if (node.elseStatement != null) {
            elseAnalyzer.visitNode(node.elseStatement);
            if (!elseAnalyzer.isAlwaysCompleted()) {
                this.allBranchesCompleted = false;
            }
        }
        // there is no need to call super.visit because we already took care of walking all the branches
    };
    PromiseCompletionWalker.prototype.visitCallExpression = function (node) {
        var _this = this;
        if (node.expression.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
            if (this.isCompletionIdentifier(node.expression)) {
                this.wasCompleted = true;
                return; // this branch was completed, do not walk any more.
            }
        }
        var referenceEscaped = Utils_1.Utils.exists(node.arguments, function (argument) {
            return _this.isCompletionIdentifier(argument);
        });
        if (referenceEscaped) {
            this.wasCompleted = true;
            return; // this branch was completed, do not walk any more.
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    PromiseCompletionWalker.prototype.visitArrowFunction = function (node) {
        // walk into function body but do not track any shadowed identifiers
        var nonShadowedIdentifiers = this.getNonShadowedCompletionIdentifiers(node);
        var analyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, nonShadowedIdentifiers);
        analyzer.visitNode(node.body);
        if (analyzer.isAlwaysCompleted()) {
            this.wasCompleted = true;
        }
    };
    PromiseCompletionWalker.prototype.visitFunctionExpression = function (node) {
        // walk into function body but do not track any shadowed identifiers
        var nonShadowedIdentifiers = this.getNonShadowedCompletionIdentifiers(node);
        var analyzer = new PromiseCompletionWalker(this.getSourceFile(), this.walkerOptions, nonShadowedIdentifiers);
        analyzer.visitNode(node.body);
        if (analyzer.isAlwaysCompleted()) {
            this.wasCompleted = true;
        }
    };
    PromiseCompletionWalker.prototype.getNonShadowedCompletionIdentifiers = function (declaration) {
        var result = [];
        this.completionIdentifiers.forEach(function (identifier) {
            // if this identifier is not shadowed, then add it to result
            var isShadowed = Utils_1.Utils.exists(declaration.parameters, function (parameter) {
                return AstUtils_1.AstUtils.isSameIdentifer(identifier, parameter.name);
            });
            if (!isShadowed) {
                result.push(identifier);
            }
        });
        return result;
    };
    PromiseCompletionWalker.prototype.isCompletionIdentifier = function (sourceIdentifier) {
        return Utils_1.Utils.exists(this.completionIdentifiers, function (identifier) {
            return AstUtils_1.AstUtils.isSameIdentifer(sourceIdentifier, identifier);
        });
    };
    return PromiseCompletionWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZU11c3RDb21wbGV0ZVJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9taXNlTXVzdENvbXBsZXRlUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBeUM7QUFFekMsaURBQThDO0FBQzlDLG1FQUFnRTtBQUNoRSw2Q0FBMEM7QUFDMUMsdUNBQW9DO0FBR3BDOztHQUVHO0FBQ0g7SUFBMEIsd0JBQXVCO0lBQWpEOztJQXNCQSxDQUFDO0lBSFUsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQXRCRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFFL0IsYUFBUSxHQUFzQjtJQUN4QyxRQUFRLEVBQUUsdUJBQXVCO0lBQ2pDLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsV0FBVyxFQUFFLDhGQUE4RjtRQUMzRyxxREFBcUQ7SUFDckQsT0FBTyxFQUFFLElBQUk7SUFDYixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLEtBQUssRUFBRSw0QkFBNEI7SUFDbkMsS0FBSyxFQUFFLGFBQWE7Q0FDdkIsQ0FBQztBQUVZLG1CQUFjLEdBQUcsMEZBQTBGLENBQUM7QUFqQmpILG9CQUFJO0FBd0JqQjtJQUE4QixtQ0FBbUI7SUFBakQ7O0lBZ0RBLENBQUM7SUEvQ1csOENBQW9CLEdBQTVCLFVBQTZCLElBQXNCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLHVCQUFVLENBQUMsT0FB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QU0sQ0FBQyxtQkFBUSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFDTCw4QkFBQztBQUFELENBQUMsQUE3R0QsQ0FBc0MseUNBQW1CLEdBNkd4RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCJ0eXBlc2NyaXB0XCI7XG5pbXBvcnQgKiBhcyBMaW50IGZyb20gXCJ0c2xpbnQvbGliL2luZGV4XCI7XG5cbmltcG9ydCB7U3ludGF4S2luZH0gZnJvbSBcIi4vdXRpbHMvU3ludGF4S2luZFwiO1xuaW1wb3J0IHtFcnJvclRvbGVyYW50V2Fsa2VyfSBmcm9tIFwiLi91dGlscy9FcnJvclRvbGVyYW50V2Fsa2VyXCI7XG5pbXBvcnQge0FzdFV0aWxzfSBmcm9tIFwiLi91dGlscy9Bc3RVdGlsc1wiO1xuaW1wb3J0IHtVdGlsc30gZnJvbSBcIi4vdXRpbHMvVXRpbHNcIjtcbmltcG9ydCB7SUV4dGVuZGVkTWV0YWRhdGF9IGZyb20gXCIuL3V0aWxzL0V4dGVuZGVkTWV0YWRhdGFcIjtcblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgcHJvbWlzZS1tdXN0LWNvbXBsZXRlIHJ1bGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuXG4gICAgcHVibGljIHN0YXRpYyBtZXRhZGF0YTogSUV4dGVuZGVkTWV0YWRhdGEgPSB7XG4gICAgICAgIHJ1bGVOYW1lOiBcInByb21pc2UtbXVzdC1jb21wbGV0ZVwiLFxuICAgICAgICB0eXBlOiBcIm1haW50YWluYWJpbGl0eVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGVuIGEgUHJvbWlzZSBpbnN0YW5jZSBpcyBjcmVhdGVkLCB0aGVuIGVpdGhlciB0aGUgcmVqZWN0KCkgb3IgcmVzb2x2ZSgpIHBhcmFtZXRlciBtdXN0IGJlIFwiICtcbiAgICAgICAgXCJjYWxsZWQgb24gaXQgd2l0aGluIGFsbCBjb2RlIGJyYW5jaGVzIGluIHRoZSBzY29wZS5cIixcbiAgICAgICAgb3B0aW9uczogbnVsbCxcbiAgICAgICAgb3B0aW9uc0Rlc2NyaXB0aW9uOiBudWxsLFxuICAgICAgICB0eXBlc2NyaXB0T25seTogbnVsbCxcbiAgICAgICAgaXNzdWVDbGFzczogXCJOb24tU0RMXCIsXG4gICAgICAgIGlzc3VlVHlwZTogXCJFcnJvclwiLFxuICAgICAgICBzZXZlcml0eTogXCJDcml0aWNhbFwiLFxuICAgICAgICBsZXZlbDogXCJPcHBvcnR1bml0eSBmb3IgRXhjZWxsZW5jZVwiLFxuICAgICAgICBncm91cDogXCJDb3JyZWN0bmVzc1wiXG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkcgPSBcIkEgUHJvbWlzZSB3YXMgZm91bmQgdGhhdCBhcHBlYXJzIHRvIG5vdCBoYXZlIHJlc29sdmUgb3IgcmVqZWN0IGludm9rZWQgb24gYWxsIGNvZGUgcGF0aHNcIjtcblxuICAgIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoV2Fsa2VyKG5ldyBQcm9taXNlQW5hbHl6ZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIFByb21pc2VBbmFseXplciBleHRlbmRzIEVycm9yVG9sZXJhbnRXYWxrZXIge1xuICAgIHByaXZhdGUgaXNQcm9taXNlRGVjbGFyYXRpb24obm9kZTogdHMuTmV3RXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAobm9kZS5leHByZXNzaW9uLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLklkZW50aWZpZXJcbiAgICAgICAgICAgICYmIG5vZGUuZXhwcmVzc2lvbi5nZXRUZXh0KCkgPT09IFwiUHJvbWlzZVwiXG4gICAgICAgICAgICAmJiBub2RlLmFyZ3VtZW50cyAhPSBudWxsICYmIG5vZGUuYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0QXJnOiB0cy5FeHByZXNzaW9uID0gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICAgICAgICBpZiAoZmlyc3RBcmcua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuQXJyb3dGdW5jdGlvbiB8fCBmaXJzdEFyZy5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5GdW5jdGlvbkV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb21wbGV0aW9uSWRlbnRpZmllcnMoZGVjbGFyYXRpb246IHRzLlNpZ25hdHVyZURlY2xhcmF0aW9uKTogdHMuSWRlbnRpZmllcltdIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiB0cy5JZGVudGlmaWVyW10gPSBbXTtcbiAgICAgICAgaWYgKGRlY2xhcmF0aW9uLnBhcmFtZXRlcnMgPT0gbnVsbCB8fCBkZWNsYXJhdGlvbi5wYXJhbWV0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFyZzE6IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uID0gZGVjbGFyYXRpb24ucGFyYW1ldGVyc1swXTtcbiAgICAgICAgY29uc3QgYXJnMjogdHMuUGFyYW1ldGVyRGVjbGFyYXRpb24gPSBkZWNsYXJhdGlvbi5wYXJhbWV0ZXJzWzFdO1xuICAgICAgICBpZiAoYXJnMSAhPSBudWxsICYmIGFyZzEubmFtZS5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCg8dHMuSWRlbnRpZmllcj5kZWNsYXJhdGlvbi5wYXJhbWV0ZXJzWzBdLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmcyICE9IG51bGwgJiYgYXJnMi5uYW1lLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKDx0cy5JZGVudGlmaWVyPmRlY2xhcmF0aW9uLnBhcmFtZXRlcnNbMV0ubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmlzaXROZXdFeHByZXNzaW9uKG5vZGU6IHRzLk5ld0V4cHJlc3Npb24pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQcm9taXNlRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZ1bmN0aW9uQXJndW1lbnQ6IHRzLkZ1bmN0aW9uTGlrZURlY2xhcmF0aW9uID0gPHRzLkZ1bmN0aW9uTGlrZURlY2xhcmF0aW9uPjxhbnk+bm9kZS5hcmd1bWVudHNbMF07XG4gICAgICAgICAgICBjb25zdCBmdW5jdGlvbkJvZHkgPSBmdW5jdGlvbkFyZ3VtZW50LmJvZHk7XG4gICAgICAgICAgICBjb25zdCBjb21wZXRpb25JZGVudGlmaWVycyA6IHRzLklkZW50aWZpZXJbXSA9IHRoaXMuZ2V0Q29tcGxldGlvbklkZW50aWZpZXJzKGZ1bmN0aW9uQXJndW1lbnQpO1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZVByb21pc2VVc2FnZShub2RlLCBmdW5jdGlvbkJvZHksIGNvbXBldGlvbklkZW50aWZpZXJzKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci52aXNpdE5ld0V4cHJlc3Npb24obm9kZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZVByb21pc2VVc2FnZShwcm9taXNlSW5zdGFudGlhdGlvbjogdHMuTmV3RXhwcmVzc2lvbiwgYmxvY2s6IHRzLk5vZGUsIGNvbXBsZXRpb25JZGVudGlmaWVyczogdHMuSWRlbnRpZmllcltdKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBibG9ja0FuYWx5emVyID0gbmV3IFByb21pc2VDb21wbGV0aW9uV2Fsa2VyKHRoaXMuZ2V0U291cmNlRmlsZSgpLCB0aGlzLmdldE9wdGlvbnMoKSwgY29tcGxldGlvbklkZW50aWZpZXJzKTtcbiAgICAgICAgYmxvY2tBbmFseXplci52aXNpdE5vZGUoYmxvY2spO1xuICAgICAgICBpZiAoIWJsb2NrQW5hbHl6ZXIuaXNBbHdheXNDb21wbGV0ZWQoKSkge1xuICAgICAgICAgICAgY29uc3QgZmFpbHVyZSA9IHRoaXMuY3JlYXRlRmFpbHVyZShwcm9taXNlSW5zdGFudGlhdGlvbi5nZXRTdGFydCgpLCBwcm9taXNlSW5zdGFudGlhdGlvbi5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZShmYWlsdXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgUHJvbWlzZUNvbXBsZXRpb25XYWxrZXIgZXh0ZW5kcyBFcnJvclRvbGVyYW50V2Fsa2VyIHtcbiAgICBwcml2YXRlIGNvbXBsZXRpb25JZGVudGlmaWVyczogdHMuSWRlbnRpZmllcltdO1xuICAgIHByaXZhdGUgd2FzQ29tcGxldGVkIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgYWxsQnJhbmNoZXNDb21wbGV0ZWQgOiBib29sZWFuID0gdHJ1ZTsgLy8gYnkgZGVmYXVsdCwgdGhlcmUgYXJlIG5vIGJyYW5jaGVzLCBzbyB0aGlzIGlzIHRydWVcbiAgICBwcml2YXRlIGhhc0JyYW5jaGVzIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgd2Fsa2VyT3B0aW9uczogTGludC5JT3B0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIG9wdGlvbnM6IExpbnQuSU9wdGlvbnMsIGNvbXBsZXRpb25JZGVudGlmaWVyczogdHMuSWRlbnRpZmllcltdKSB7XG4gICAgICAgIHN1cGVyKHNvdXJjZUZpbGUsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLndhbGtlck9wdGlvbnMgPSBvcHRpb25zOyAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoaXMgYmVjYXVzZSB0aGlzLmdldE9wdGlvbnMoKSByZXR1cm5zIHVuZGVmaW5lZCBldmVuIHdoZW4gdGhpcyBoYXMgYSB2YWx1ZVxuICAgICAgICB0aGlzLmNvbXBsZXRpb25JZGVudGlmaWVycyA9IGNvbXBsZXRpb25JZGVudGlmaWVycztcbiAgICB9XG5cbiAgICAvLyBuZWVkIHRvIG1ha2UgdGhpcyBwdWJsaWMgc28gaXQgY2FuIGludm9rZWQgZnJvbSBwYXJlbnQgd2Fsa2VyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bm8tdW5uZWNlc3Nhcnktb3ZlcnJpZGUgKi9cbiAgICBwdWJsaWMgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIudmlzaXROb2RlKG5vZGUpO1xuICAgIH1cbiAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXVubmVjZXNzYXJ5LW92ZXJyaWRlICovXG5cbiAgICBwdWJsaWMgaXNBbHdheXNDb21wbGV0ZWQoKSA6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy53YXNDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBpZiB0aGUgbWFpbiBjb2RlIHBhdGggY29tcGxldGVkIHRoZW4gaXQgZG9lc25cInQgbWF0dGVyIHdoYXQgdGhlIGNoaWxkIGJyYW5jaGVzIGRpZFxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5oYXNCcmFuY2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBpZiB0aGVyZSB3ZXJlIG5vIGJyYW5jaGVzIGFuZCBpdCBpcyBub3QgY29tcGxldGUuLi4gdGhlbiBpdCBpcyBpbiB0b3RhbCBub3QgY29tcGxldGUuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsQnJhbmNoZXNDb21wbGV0ZWQ7IC8vIGlmIG1haW4gcGF0aCBkaWQgKm5vdCogY29tcGxldGUsIHRoZSBsb29rIGF0IGNoaWxkIGJyYW5jaCBzdGF0dXNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmlzaXRJZlN0YXRlbWVudChub2RlOiB0cy5JZlN0YXRlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmhhc0JyYW5jaGVzID0gdHJ1ZTtcblxuICAgICAgICAvLyBhbiBpZiBzdGF0ZW1lbnQgaXMgYSBicmFuY2gsIHNvIHdlIG5lZWQgdG8gc2VlIGlmIHRoaXMgYnJhbmNoIGNvbXBsZXRlcy5cbiAgICAgICAgY29uc3QgaWZBbmFseXplciA9IG5ldyBQcm9taXNlQ29tcGxldGlvbldhbGtlcih0aGlzLmdldFNvdXJjZUZpbGUoKSwgdGhpcy53YWxrZXJPcHRpb25zLCB0aGlzLmNvbXBsZXRpb25JZGVudGlmaWVycyk7XG4gICAgICAgIGNvbnN0IGVsc2VBbmFseXplciA9IG5ldyBQcm9taXNlQ29tcGxldGlvbldhbGtlcih0aGlzLmdldFNvdXJjZUZpbGUoKSwgdGhpcy53YWxrZXJPcHRpb25zLCB0aGlzLmNvbXBsZXRpb25JZGVudGlmaWVycyk7XG5cbiAgICAgICAgaWZBbmFseXplci52aXNpdE5vZGUobm9kZS50aGVuU3RhdGVtZW50KTtcblxuICAgICAgICBpZiAoIWlmQW5hbHl6ZXIuaXNBbHdheXNDb21wbGV0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5hbGxCcmFuY2hlc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZWxzZVN0YXRlbWVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICBlbHNlQW5hbHl6ZXIudmlzaXROb2RlKG5vZGUuZWxzZVN0YXRlbWVudCk7XG4gICAgICAgICAgICBpZiAoIWVsc2VBbmFseXplci5pc0Fsd2F5c0NvbXBsZXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGxCcmFuY2hlc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBzdXBlci52aXNpdCBiZWNhdXNlIHdlIGFscmVhZHkgdG9vayBjYXJlIG9mIHdhbGtpbmcgYWxsIHRoZSBicmFuY2hlc1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB2aXNpdENhbGxFeHByZXNzaW9uKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogdm9pZCB7XG4gICAgICAgIGlmIChub2RlLmV4cHJlc3Npb24ua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuSWRlbnRpZmllcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wbGV0aW9uSWRlbnRpZmllcihub2RlLmV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gdGhpcyBicmFuY2ggd2FzIGNvbXBsZXRlZCwgZG8gbm90IHdhbGsgYW55IG1vcmUuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWZlcmVuY2VFc2NhcGVkIDogYm9vbGVhbiA9IFV0aWxzLmV4aXN0cyhub2RlLmFyZ3VtZW50cywgKGFyZ3VtZW50OiB0cy5FeHByZXNzaW9uKSA6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNDb21wbGV0aW9uSWRlbnRpZmllcihhcmd1bWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVmZXJlbmNlRXNjYXBlZCkge1xuICAgICAgICAgICAgdGhpcy53YXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuOyAvLyB0aGlzIGJyYW5jaCB3YXMgY29tcGxldGVkLCBkbyBub3Qgd2FsayBhbnkgbW9yZS5cbiAgICAgICAgfVxuICAgICAgICBzdXBlci52aXNpdENhbGxFeHByZXNzaW9uKG5vZGUpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB2aXNpdEFycm93RnVuY3Rpb24obm9kZTogdHMuRnVuY3Rpb25MaWtlRGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgICAgLy8gd2FsayBpbnRvIGZ1bmN0aW9uIGJvZHkgYnV0IGRvIG5vdCB0cmFjayBhbnkgc2hhZG93ZWQgaWRlbnRpZmllcnNcbiAgICAgICAgY29uc3Qgbm9uU2hhZG93ZWRJZGVudGlmaWVyczogdHMuSWRlbnRpZmllcltdID0gdGhpcy5nZXROb25TaGFkb3dlZENvbXBsZXRpb25JZGVudGlmaWVycyhub2RlKTtcbiAgICAgICAgY29uc3QgYW5hbHl6ZXIgPSBuZXcgUHJvbWlzZUNvbXBsZXRpb25XYWxrZXIodGhpcy5nZXRTb3VyY2VGaWxlKCksIHRoaXMud2Fsa2VyT3B0aW9ucywgbm9uU2hhZG93ZWRJZGVudGlmaWVycyk7XG4gICAgICAgIGFuYWx5emVyLnZpc2l0Tm9kZShub2RlLmJvZHkpO1xuICAgICAgICBpZiAoYW5hbHl6ZXIuaXNBbHdheXNDb21wbGV0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy53YXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKG5vZGU6IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbik6IHZvaWQge1xuICAgICAgICAvLyB3YWxrIGludG8gZnVuY3Rpb24gYm9keSBidXQgZG8gbm90IHRyYWNrIGFueSBzaGFkb3dlZCBpZGVudGlmaWVyc1xuICAgICAgICBjb25zdCBub25TaGFkb3dlZElkZW50aWZpZXJzOiB0cy5JZGVudGlmaWVyW10gPSB0aGlzLmdldE5vblNoYWRvd2VkQ29tcGxldGlvbklkZW50aWZpZXJzKG5vZGUpO1xuICAgICAgICBjb25zdCBhbmFseXplciA9IG5ldyBQcm9taXNlQ29tcGxldGlvbldhbGtlcih0aGlzLmdldFNvdXJjZUZpbGUoKSwgdGhpcy53YWxrZXJPcHRpb25zLCBub25TaGFkb3dlZElkZW50aWZpZXJzKTtcbiAgICAgICAgYW5hbHl6ZXIudmlzaXROb2RlKG5vZGUuYm9keSk7XG4gICAgICAgIGlmIChhbmFseXplci5pc0Fsd2F5c0NvbXBsZXRlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLndhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vblNoYWRvd2VkQ29tcGxldGlvbklkZW50aWZpZXJzKGRlY2xhcmF0aW9uOiB0cy5GdW5jdGlvbkxpa2VEZWNsYXJhdGlvbik6IHRzLklkZW50aWZpZXJbXSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogdHMuSWRlbnRpZmllcltdID0gW107XG4gICAgICAgIHRoaXMuY29tcGxldGlvbklkZW50aWZpZXJzLmZvckVhY2goKGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXIpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaWRlbnRpZmllciBpcyBub3Qgc2hhZG93ZWQsIHRoZW4gYWRkIGl0IHRvIHJlc3VsdFxuICAgICAgICAgICAgY29uc3QgaXNTaGFkb3dlZDogYm9vbGVhbiA9IFV0aWxzLmV4aXN0cyhkZWNsYXJhdGlvbi5wYXJhbWV0ZXJzLCAocGFyYW1ldGVyOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbik6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBBc3RVdGlscy5pc1NhbWVJZGVudGlmZXIoaWRlbnRpZmllciwgcGFyYW1ldGVyLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIWlzU2hhZG93ZWQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQ29tcGxldGlvbklkZW50aWZpZXIoc291cmNlSWRlbnRpZmllcjogdHMuTm9kZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gVXRpbHMuZXhpc3RzKHRoaXMuY29tcGxldGlvbklkZW50aWZpZXJzLCAoaWRlbnRpZmllcjogdHMuSWRlbnRpZmllcik6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEFzdFV0aWxzLmlzU2FtZUlkZW50aWZlcihzb3VyY2VJZGVudGlmaWVyLCBpZGVudGlmaWVyKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG59Il19