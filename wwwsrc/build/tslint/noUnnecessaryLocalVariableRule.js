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
var SyntaxKind_1 = require("./utils/SyntaxKind");
var FAILURE_STRING = "Unnecessary local variable: ";
/**
 * Implementation of the no-unnecessary-local-variable rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UnnecessaryLocalVariableRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "no-unnecessary-local-variable",
    type: "maintainability",
    description: "Do not declare a variable only to return it from the function on the next line.",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "Non-SDL",
    issueType: "Warning",
    severity: "Low",
    level: "Opportunity for Excellence",
    group: "Clarity",
    commonWeaknessEnumeration: "563, 710"
};
exports.Rule = Rule;
var UnnecessaryLocalVariableRuleWalker = (function (_super) {
    __extends(UnnecessaryLocalVariableRuleWalker, _super);
    function UnnecessaryLocalVariableRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnnecessaryLocalVariableRuleWalker.prototype.visitBlock = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitBlock.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitSourceFile = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitSourceFile.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitCaseClause = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitCaseClause.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitDefaultClause = function (node) {
        this.validateStatementArray(node.statements);
        _super.prototype.visitDefaultClause.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.visitModuleDeclaration = function (node) {
        if (node.body != null && node.body.kind === SyntaxKind_1.SyntaxKind.current().ModuleBlock) {
            this.validateStatementArray(node.body.statements);
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    UnnecessaryLocalVariableRuleWalker.prototype.validateStatementArray = function (statements) {
        if (statements == null || statements.length < 2) {
            return; // one liners are always valid
        }
        var lastStatement = statements[statements.length - 1];
        var nextToLastStatement = statements[statements.length - 2];
        var returnedVariableName = this.tryToGetReturnedVariableName(lastStatement);
        var declaredVariableName = this.tryToGetDeclaredVariableName(nextToLastStatement);
        if (returnedVariableName != null && declaredVariableName != null) {
            if (returnedVariableName === declaredVariableName) {
                this.addFailure(this.createFailure(nextToLastStatement.getStart(), nextToLastStatement.getWidth(), FAILURE_STRING + returnedVariableName));
            }
        }
    };
    UnnecessaryLocalVariableRuleWalker.prototype.tryToGetDeclaredVariableName = function (statement) {
        if (statement != null && statement.kind === SyntaxKind_1.SyntaxKind.current().VariableStatement) {
            var variableStatement = statement;
            if (variableStatement.declarationList.declarations.length === 1) {
                var declaration = variableStatement.declarationList.declarations[0];
                if (declaration.name != null && declaration.name.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
                    return declaration.name.text;
                }
            }
        }
        return null;
    };
    UnnecessaryLocalVariableRuleWalker.prototype.tryToGetReturnedVariableName = function (statement) {
        if (statement != null && statement.kind === SyntaxKind_1.SyntaxKind.current().ReturnStatement) {
            var returnStatement = statement;
            if (returnStatement.expression != null && returnStatement.expression.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
                return returnStatement.expression.text;
            }
        }
        return null;
    };
    return UnnecessaryLocalVariableRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9Vbm5lY2Vzc2FyeUxvY2FsVmFyaWFibGVSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9Vbm5lY2Vzc2FyeUxvY2FsVmFyaWFibGVSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLHVDQUF5QztBQUV6QyxtRUFBZ0U7QUFDaEUsaURBQThDO0FBRzlDLElBQU0sY0FBYyxHQUFXLDhCQUE4QixDQUFDO0FBRTlEOztHQUVHO0FBQ0g7SUFBMEIsd0JBQXVCO0lBQWpEOztJQW9CQSxDQUFDO0lBSFUsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksa0NBQWtDLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkcsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBcEJELENBQTBCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtBQUUvQixhQUFRLEdBQXNCO0lBQ3hDLFFBQVEsRUFBRSwrQkFBK0I7SUFDekMsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixXQUFXLEVBQUUsaUZBQWlGO0lBQzlGLE9BQU8sRUFBRSxJQUFJO0lBQ2Isa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixjQUFjLEVBQUUsSUFBSTtJQUNwQixVQUFVLEVBQUUsU0FBUztJQUNyQixTQUFTLEVBQUUsU0FBUztJQUNwQixRQUFRLEVBQUUsS0FBSztJQUNmLEtBQUssRUFBRSw0QkFBNEI7SUFDbkMsS0FBSyxFQUFFLFNBQVM7SUFDaEIseUJBQXlCLEVBQUUsVUFBVTtDQUN4QyxDQUFDO0FBZk8sb0JBQUk7QUFzQmpCO0lBQWlELHNEQUFtQjtJQUFwRTs7SUFzRUEsQ0FBQztJQXJFYSx1REFBVSxHQUFwQixVQUFxQixJQUFjO1FBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0MsaUJBQU0s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QUksQ0FBQyxJQUFJLEtBQUssdUJBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN4RixNQUFNLENBQWlCLFdBQVcsQ0FBQyxJQUFLLENBQUMsSUFBSSxDQUFDO2dCQUNsRCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyx5RUFBNEIsR0FBcEMsVUFBcUMsU0FBdUI7UUFDeEQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLHVCQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUMvRSxJQUFNLGVBQWUsR0FBMkMsU0FBUyxDQUFDO1lBQzFFLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLHVCQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDNUcsTUFBTSxDQUFpQixlQUFlLENBQUMsVUFBVyxDQUFDLElBQUksQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNMLHlDQUFDO0FBQUQsQ0FBQyxBQXRFRCxDQUFpRCx5Q0FBbUIsR0FzRW5FIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSBcInR5cGVzY3JpcHRcIjtcbmltcG9ydCAqIGFzIExpbnQgZnJvbSBcInRzbGludC9saWIvaW5kZXhcIjtcblxuaW1wb3J0IHtFcnJvclRvbGVyYW50V2Fsa2VyfSBmcm9tIFwiLi91dGlscy9FcnJvclRvbGVyYW50V2Fsa2VyXCI7XG5pbXBvcnQge1N5bnRheEtpbmR9IGZyb20gXCIuL3V0aWxzL1N5bnRheEtpbmRcIjtcbmltcG9ydCB7SUV4dGVuZGVkTWV0YWRhdGF9IGZyb20gXCIuL3V0aWxzL0V4dGVuZGVkTWV0YWRhdGFcIjtcblxuY29uc3QgRkFJTFVSRV9TVFJJTkc6IHN0cmluZyA9IFwiVW5uZWNlc3NhcnkgbG9jYWwgdmFyaWFibGU6IFwiO1xuXG4vKipcbiAqIEltcGxlbWVudGF0aW9uIG9mIHRoZSBuby11bm5lY2Vzc2FyeS1sb2NhbC12YXJpYWJsZSBydWxlLlxuICovXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIExpbnQuUnVsZXMuQWJzdHJhY3RSdWxlIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgbWV0YWRhdGE6IElFeHRlbmRlZE1ldGFkYXRhID0ge1xuICAgICAgICBydWxlTmFtZTogXCJuby11bm5lY2Vzc2FyeS1sb2NhbC12YXJpYWJsZVwiLFxuICAgICAgICB0eXBlOiBcIm1haW50YWluYWJpbGl0eVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEbyBub3QgZGVjbGFyZSBhIHZhcmlhYmxlIG9ubHkgdG8gcmV0dXJuIGl0IGZyb20gdGhlIGZ1bmN0aW9uIG9uIHRoZSBuZXh0IGxpbmUuXCIsXG4gICAgICAgIG9wdGlvbnM6IG51bGwsXG4gICAgICAgIG9wdGlvbnNEZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgdHlwZXNjcmlwdE9ubHk6IG51bGwsXG4gICAgICAgIGlzc3VlQ2xhc3M6IFwiTm9uLVNETFwiLFxuICAgICAgICBpc3N1ZVR5cGU6IFwiV2FybmluZ1wiLFxuICAgICAgICBzZXZlcml0eTogXCJMb3dcIixcbiAgICAgICAgbGV2ZWw6IFwiT3Bwb3J0dW5pdHkgZm9yIEV4Y2VsbGVuY2VcIixcbiAgICAgICAgZ3JvdXA6IFwiQ2xhcml0eVwiLFxuICAgICAgICBjb21tb25XZWFrbmVzc0VudW1lcmF0aW9uOiBcIjU2MywgNzEwXCJcbiAgICB9O1xuXG4gICAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IFVubmVjZXNzYXJ5TG9jYWxWYXJpYWJsZVJ1bGVXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIFVubmVjZXNzYXJ5TG9jYWxWYXJpYWJsZVJ1bGVXYWxrZXIgZXh0ZW5kcyBFcnJvclRvbGVyYW50V2Fsa2VyIHtcbiAgICBwcm90ZWN0ZWQgdmlzaXRCbG9jayhub2RlOiB0cy5CbG9jayk6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbGlkYXRlU3RhdGVtZW50QXJyYXkobm9kZS5zdGF0ZW1lbnRzKTtcbiAgICAgICAgc3VwZXIudmlzaXRCbG9jayhub2RlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmlzaXRTb3VyY2VGaWxlKG5vZGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVN0YXRlbWVudEFycmF5KG5vZGUuc3RhdGVtZW50cyk7XG4gICAgICAgIHN1cGVyLnZpc2l0U291cmNlRmlsZShub2RlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmlzaXRDYXNlQ2xhdXNlKG5vZGU6IHRzLkNhc2VDbGF1c2UpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVN0YXRlbWVudEFycmF5KG5vZGUuc3RhdGVtZW50cyk7XG4gICAgICAgIHN1cGVyLnZpc2l0Q2FzZUNsYXVzZShub2RlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmlzaXREZWZhdWx0Q2xhdXNlKG5vZGU6IHRzLkRlZmF1bHRDbGF1c2UpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVN0YXRlbWVudEFycmF5KG5vZGUuc3RhdGVtZW50cyk7XG4gICAgICAgIHN1cGVyLnZpc2l0RGVmYXVsdENsYXVzZShub2RlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmlzaXRNb2R1bGVEZWNsYXJhdGlvbihub2RlOiB0cy5Nb2R1bGVEZWNsYXJhdGlvbik6IHZvaWQge1xuICAgICAgICBpZiAobm9kZS5ib2R5ICE9IG51bGwgJiYgbm9kZS5ib2R5LmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLk1vZHVsZUJsb2NrKSB7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlU3RhdGVtZW50QXJyYXkoKDx0cy5Nb2R1bGVCbG9jaz5ub2RlLmJvZHkpLnN0YXRlbWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLnZpc2l0TW9kdWxlRGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZVN0YXRlbWVudEFycmF5KHN0YXRlbWVudHM6IHRzLk5vZGVBcnJheTx0cy5TdGF0ZW1lbnQ+KTogdm9pZCB7XG4gICAgICAgIGlmIChzdGF0ZW1lbnRzID09IG51bGwgfHwgc3RhdGVtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIG9uZSBsaW5lcnMgYXJlIGFsd2F5cyB2YWxpZFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGFzdFN0YXRlbWVudCA9IHN0YXRlbWVudHNbc3RhdGVtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgbmV4dFRvTGFzdFN0YXRlbWVudCA9IHN0YXRlbWVudHNbc3RhdGVtZW50cy5sZW5ndGggLSAyXTtcblxuICAgICAgICBjb25zdCByZXR1cm5lZFZhcmlhYmxlTmFtZTogc3RyaW5nID0gdGhpcy50cnlUb0dldFJldHVybmVkVmFyaWFibGVOYW1lKGxhc3RTdGF0ZW1lbnQpO1xuICAgICAgICBjb25zdCBkZWNsYXJlZFZhcmlhYmxlTmFtZTogc3RyaW5nID0gdGhpcy50cnlUb0dldERlY2xhcmVkVmFyaWFibGVOYW1lKG5leHRUb0xhc3RTdGF0ZW1lbnQpO1xuXG4gICAgICAgIGlmIChyZXR1cm5lZFZhcmlhYmxlTmFtZSAhPSBudWxsICYmIGRlY2xhcmVkVmFyaWFibGVOYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChyZXR1cm5lZFZhcmlhYmxlTmFtZSA9PT0gZGVjbGFyZWRWYXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5leHRUb0xhc3RTdGF0ZW1lbnQuZ2V0U3RhcnQoKSwgbmV4dFRvTGFzdFN0YXRlbWVudC5nZXRXaWR0aCgpLFxuICAgICAgICAgICAgICAgICAgICBGQUlMVVJFX1NUUklORyArIHJldHVybmVkVmFyaWFibGVOYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRyeVRvR2V0RGVjbGFyZWRWYXJpYWJsZU5hbWUoc3RhdGVtZW50OiB0cy5TdGF0ZW1lbnQpOiBzdHJpbmcge1xuICAgICAgICBpZiAoc3RhdGVtZW50ICE9IG51bGwgJiYgc3RhdGVtZW50LmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZVN0YXRlbWVudDogdHMuVmFyaWFibGVTdGF0ZW1lbnQgPSA8dHMuVmFyaWFibGVTdGF0ZW1lbnQ+c3RhdGVtZW50O1xuXG4gICAgICAgICAgICBpZiAodmFyaWFibGVTdGF0ZW1lbnQuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNsYXJhdGlvbjogdHMuVmFyaWFibGVEZWNsYXJhdGlvbiA9IHZhcmlhYmxlU3RhdGVtZW50LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLm5hbWUgIT0gbnVsbCAmJiBkZWNsYXJhdGlvbi5uYW1lLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8dHMuSWRlbnRpZmllcj5kZWNsYXJhdGlvbi5uYW1lKS50ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyeVRvR2V0UmV0dXJuZWRWYXJpYWJsZU5hbWUoc3RhdGVtZW50OiB0cy5TdGF0ZW1lbnQpOiBzdHJpbmcge1xuICAgICAgICBpZiAoc3RhdGVtZW50ICE9IG51bGwgJiYgc3RhdGVtZW50LmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLlJldHVyblN0YXRlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgcmV0dXJuU3RhdGVtZW50OiB0cy5SZXR1cm5TdGF0ZW1lbnQgPSA8dHMuUmV0dXJuU3RhdGVtZW50PnN0YXRlbWVudDtcbiAgICAgICAgICAgIGlmIChyZXR1cm5TdGF0ZW1lbnQuZXhwcmVzc2lvbiAhPSBudWxsICYmIHJldHVyblN0YXRlbWVudC5leHByZXNzaW9uLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKDx0cy5JZGVudGlmaWVyPnJldHVyblN0YXRlbWVudC5leHByZXNzaW9uKS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iXX0=