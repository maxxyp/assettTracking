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
var AstUtils_1 = require("./utils/AstUtils");
var FAILURE_UNDEFINED_INIT = "Unnecessary field initialization. Field explicitly initialized to undefined: ";
var FAILURE_UNDEFINED_DUPE = "Unnecessary field initialization. Field value already initialized in declaration: ";
/**
 * Implementation of the no-unnecessary-field-initialization rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UnnecessaryFieldInitializationRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "no-unnecessary-field-initialization",
    type: "maintainability",
    description: "Do not unnecessarily initialize the fields of a class to values they already have.",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "Non-SDL",
    issueType: "Warning",
    severity: "Moderate",
    level: "Opportunity for Excellence",
    group: "Clarity",
    commonWeaknessEnumeration: "398, 710"
};
exports.Rule = Rule;
var UnnecessaryFieldInitializationRuleWalker = (function (_super) {
    __extends(UnnecessaryFieldInitializationRuleWalker, _super);
    function UnnecessaryFieldInitializationRuleWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fieldInitializations = {};
        return _this;
    }
    UnnecessaryFieldInitializationRuleWalker.prototype.visitClassDeclaration = function (node) {
        var _this = this;
        this.fieldInitializations = {};
        node.members.forEach(function (member) {
            if (member.kind === SyntaxKind_1.SyntaxKind.current().PropertyDeclaration) {
                _this.visitPropertyDeclaration(member);
            }
            else if (member.kind === SyntaxKind_1.SyntaxKind.current().Constructor) {
                _this.visitConstructorDeclaration(member);
            }
        });
        this.fieldInitializations = {};
        // do not call super.visitClass as a performance enhancement
    };
    UnnecessaryFieldInitializationRuleWalker.prototype.visitPropertyDeclaration = function (node) {
        var initializer = node.initializer;
        if (node.name.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
            var fieldName = "this." + node.name.getText();
            if (initializer == null) {
                this.fieldInitializations[fieldName] = undefined;
            }
            else if (AstUtils_1.AstUtils.isConstant(initializer)) {
                this.fieldInitializations[fieldName] = initializer.getText();
            }
        }
        if (AstUtils_1.AstUtils.isUndefined(initializer)) {
            // you should never initialize a field to undefined.
            var start = initializer.getStart();
            var width = initializer.getWidth();
            this.addFailure(this.createFailure(start, width, FAILURE_UNDEFINED_INIT + node.name.getText()));
        }
    };
    UnnecessaryFieldInitializationRuleWalker.prototype.visitConstructorDeclaration = function (node) {
        var _this = this;
        if (node.body != null) {
            node.body.statements.forEach(function (statement) {
                if (statement.kind === SyntaxKind_1.SyntaxKind.current().ExpressionStatement) {
                    var expression = statement.expression;
                    if (expression.kind === SyntaxKind_1.SyntaxKind.current().BinaryExpression) {
                        var binaryExpression = expression;
                        var property = binaryExpression.left;
                        var propertyName = property.getText();
                        // check to see if a field is being assigned in the constructor
                        if (Object.keys(_this.fieldInitializations).indexOf(propertyName) > -1) {
                            if (AstUtils_1.AstUtils.isUndefined(binaryExpression.right)) {
                                // field is being assigned to undefined... create error if the field already has that value
                                if (Object.keys(_this.fieldInitializations).indexOf(propertyName) > -1) {
                                    // make sure the field was declared as undefined
                                    var fieldInitValue = _this.fieldInitializations[propertyName];
                                    if (fieldInitValue == null) {
                                        var start = property.getStart();
                                        var width = property.getWidth();
                                        _this.addFailure(_this.createFailure(start, width, FAILURE_UNDEFINED_INIT + property.getText()));
                                    }
                                }
                            }
                            else if (AstUtils_1.AstUtils.isConstant(binaryExpression.right)) {
                                // field is being assigned a constant... create error if the field already has that value
                                var fieldInitValue = _this.fieldInitializations[propertyName];
                                if (fieldInitValue === binaryExpression.right.getText()) {
                                    var start = binaryExpression.getStart();
                                    var width = binaryExpression.getWidth();
                                    var message = FAILURE_UNDEFINED_DUPE + binaryExpression.getText();
                                    _this.addFailure(_this.createFailure(start, width, message));
                                }
                            }
                        }
                    }
                }
            });
        }
    };
    return UnnecessaryFieldInitializationRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9Vbm5lY2Vzc2FyeUZpZWxkSW5pdGlhbGl6YXRpb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9Vbm5lY2Vzc2FyeUZpZWxkSW5pdGlhbGl6YXRpb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLHVDQUF5QztBQUV6QyxtRUFBZ0U7QUFDaEUsaURBQThDO0FBRTlDLDZDQUEwQztBQUUxQyxJQUFNLHNCQUFzQixHQUFXLCtFQUErRSxDQUFDO0FBQ3ZILElBQU0sc0JBQXNCLEdBQVcsb0ZBQW9GLENBQUM7QUFFNUg7O0dBRUc7QUFDSDtJQUEwQix3QkFBdUI7SUFBakQ7O0lBb0JBLENBQUM7SUFIVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSx3Q0FBd0MsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RyxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFwQkQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBRS9CLGFBQVEsR0FBc0I7SUFDeEMsUUFBUSxFQUFFLHFDQUFxQztJQUMvQyxJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLFdBQVcsRUFBRSxvRkFBb0Y7SUFDakcsT0FBTyxFQUFFLElBQUk7SUFDYixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLEtBQUssRUFBRSw0QkFBNEI7SUFDbkMsS0FBSyxFQUFFLFNBQVM7SUFDaEIseUJBQXlCLEVBQUUsVUFBVTtDQUN4QyxDQUFDO0FBZk8sb0JBQUk7QUFzQmpCO0lBQXVELDREQUFtQjtJQUExRTtRQUFBLHFFQTBFQztRQXhFVywwQkFBb0IsR0FBZ0MsRUFBRSxDQUFDOztJ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QUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQ0FDdkUsRUFBRSxDQUFDLENBQUMsY0FBYyxLQUFLLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0NBQ3RELElBQU0sS0FBSyxHQUFXLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO29DQUNsRCxJQUFNLEtBQUssR0FBVyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQ0FDbEQsSUFBTSxPQUFPLEdBQVcsc0JBQXNCLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7b0NBQzVFLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0NBQy9ELENBQUM7NEJBQ0wsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7SUFDTCwrQ0FBQztBQUFELENBQUMsQUExRUQsQ0FBdUQseUNBQW1CLEdBMEV6RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCJ0eXBlc2NyaXB0XCI7XG5pbXBvcnQgKiBhcyBMaW50IGZyb20gXCJ0c2xpbnQvbGliL2luZGV4XCI7XG5cbmltcG9ydCB7RXJyb3JUb2xlcmFudFdhbGtlcn0gZnJvbSBcIi4vdXRpbHMvRXJyb3JUb2xlcmFudFdhbGtlclwiO1xuaW1wb3J0IHtTeW50YXhLaW5kfSBmcm9tIFwiLi91dGlscy9TeW50YXhLaW5kXCI7XG5pbXBvcnQge0lFeHRlbmRlZE1ldGFkYXRhfSBmcm9tIFwiLi91dGlscy9FeHRlbmRlZE1ldGFkYXRhXCI7XG5pbXBvcnQge0FzdFV0aWxzfSBmcm9tIFwiLi91dGlscy9Bc3RVdGlsc1wiO1xuXG5jb25zdCBGQUlMVVJFX1VOREVGSU5FRF9JTklUOiBzdHJpbmcgPSBcIlVubmVjZXNzYXJ5IGZpZWxkIGluaXRpYWxpemF0aW9uLiBGaWVsZCBleHBsaWNpdGx5IGluaXRpYWxpemVkIHRvIHVuZGVmaW5lZDogXCI7XG5jb25zdCBGQUlMVVJFX1VOREVGSU5FRF9EVVBFOiBzdHJpbmcgPSBcIlVubmVjZXNzYXJ5IGZpZWxkIGluaXRpYWxpemF0aW9uLiBGaWVsZCB2YWx1ZSBhbHJlYWR5IGluaXRpYWxpemVkIGluIGRlY2xhcmF0aW9uOiBcIjtcblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgbm8tdW5uZWNlc3NhcnktZmllbGQtaW5pdGlhbGl6YXRpb24gcnVsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIG1ldGFkYXRhOiBJRXh0ZW5kZWRNZXRhZGF0YSA9IHtcbiAgICAgICAgcnVsZU5hbWU6IFwibm8tdW5uZWNlc3NhcnktZmllbGQtaW5pdGlhbGl6YXRpb25cIixcbiAgICAgICAgdHlwZTogXCJtYWludGFpbmFiaWxpdHlcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRG8gbm90IHVubmVjZXNzYXJpbHkgaW5pdGlhbGl6ZSB0aGUgZmllbGRzIG9mIGEgY2xhc3MgdG8gdmFsdWVzIHRoZXkgYWxyZWFkeSBoYXZlLlwiLFxuICAgICAgICBvcHRpb25zOiBudWxsLFxuICAgICAgICBvcHRpb25zRGVzY3JpcHRpb246IG51bGwsXG4gICAgICAgIHR5cGVzY3JpcHRPbmx5OiBudWxsLFxuICAgICAgICBpc3N1ZUNsYXNzOiBcIk5vbi1TRExcIixcbiAgICAgICAgaXNzdWVUeXBlOiBcIldhcm5pbmdcIixcbiAgICAgICAgc2V2ZXJpdHk6IFwiTW9kZXJhdGVcIixcbiAgICAgICAgbGV2ZWw6IFwiT3Bwb3J0dW5pdHkgZm9yIEV4Y2VsbGVuY2VcIixcbiAgICAgICAgZ3JvdXA6IFwiQ2xhcml0eVwiLFxuICAgICAgICBjb21tb25XZWFrbmVzc0VudW1lcmF0aW9uOiBcIjM5OCwgNzEwXCJcbiAgICB9O1xuXG4gICAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IFVubmVjZXNzYXJ5RmllbGRJbml0aWFsaXphdGlvblJ1bGVXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIFVubmVjZXNzYXJ5RmllbGRJbml0aWFsaXphdGlvblJ1bGVXYWxrZXIgZXh0ZW5kcyBFcnJvclRvbGVyYW50V2Fsa2VyIHtcblxuICAgIHByaXZhdGUgZmllbGRJbml0aWFsaXphdGlvbnM6IHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gICAgcHJvdGVjdGVkIHZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZmllbGRJbml0aWFsaXphdGlvbnMgPSB7fTtcbiAgICAgICAgbm9kZS5tZW1iZXJzLmZvckVhY2goKG1lbWJlcjogdHMuQ2xhc3NFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAobWVtYmVyLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLlByb3BlcnR5RGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2l0UHJvcGVydHlEZWNsYXJhdGlvbig8dHMuUHJvcGVydHlEZWNsYXJhdGlvbj5tZW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZW1iZXIua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2l0Q29uc3RydWN0b3JEZWNsYXJhdGlvbig8dHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbj5tZW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5maWVsZEluaXRpYWxpemF0aW9ucyA9IHt9O1xuICAgICAgICAvLyBkbyBub3QgY2FsbCBzdXBlci52aXNpdENsYXNzIGFzIGEgcGVyZm9ybWFuY2UgZW5oYW5jZW1lbnRcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmlzaXRQcm9wZXJ0eURlY2xhcmF0aW9uKG5vZGU6IHRzLlByb3BlcnR5RGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaW5pdGlhbGl6ZXI6IHRzLkV4cHJlc3Npb24gPSBub2RlLmluaXRpYWxpemVyO1xuICAgICAgICBpZiAobm9kZS5uYW1lLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkTmFtZTogc3RyaW5nID0gXCJ0aGlzLlwiICsgKDx0cy5JZGVudGlmaWVyPm5vZGUubmFtZSkuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgaWYgKGluaXRpYWxpemVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkSW5pdGlhbGl6YXRpb25zW2ZpZWxkTmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKEFzdFV0aWxzLmlzQ29uc3RhbnQoaW5pdGlhbGl6ZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZEluaXRpYWxpemF0aW9uc1tmaWVsZE5hbWVdID0gaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChBc3RVdGlscy5pc1VuZGVmaW5lZChpbml0aWFsaXplcikpIHtcbiAgICAgICAgICAgIC8vIHlvdSBzaG91bGQgbmV2ZXIgaW5pdGlhbGl6ZSBhIGZpZWxkIHRvIHVuZGVmaW5lZC5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXIgPSBpbml0aWFsaXplci5nZXRTdGFydCgpO1xuICAgICAgICAgICAgY29uc3Qgd2lkdGg6IG51bWJlciA9IGluaXRpYWxpemVyLmdldFdpZHRoKCk7XG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKHN0YXJ0LCB3aWR0aCwgRkFJTFVSRV9VTkRFRklORURfSU5JVCArIG5vZGUubmFtZS5nZXRUZXh0KCkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB2aXNpdENvbnN0cnVjdG9yRGVjbGFyYXRpb24obm9kZTogdHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbik6IHZvaWQge1xuICAgICAgICBpZiAobm9kZS5ib2R5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGUuYm9keS5zdGF0ZW1lbnRzLmZvckVhY2goKHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlbWVudC5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5FeHByZXNzaW9uU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24gPSAoPHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQ+c3RhdGVtZW50KS5leHByZXNzaW9uO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwcmVzc2lvbi5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5CaW5hcnlFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5hcnlFeHByZXNzaW9uOiB0cy5CaW5hcnlFeHByZXNzaW9uID0gPHRzLkJpbmFyeUV4cHJlc3Npb24+ZXhwcmVzc2lvbjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHk6IHRzLkV4cHJlc3Npb24gPSBiaW5hcnlFeHByZXNzaW9uLmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWU6IHN0cmluZyA9IHByb3BlcnR5LmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBhIGZpZWxkIGlzIGJlaW5nIGFzc2lnbmVkIGluIHRoZSBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZmllbGRJbml0aWFsaXphdGlvbnMpLmluZGV4T2YocHJvcGVydHlOYW1lKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFzdFV0aWxzLmlzVW5kZWZpbmVkKGJpbmFyeUV4cHJlc3Npb24ucmlnaHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpZWxkIGlzIGJlaW5nIGFzc2lnbmVkIHRvIHVuZGVmaW5lZC4uLiBjcmVhdGUgZXJyb3IgaWYgdGhlIGZpZWxkIGFscmVhZHkgaGFzIHRoYXQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZmllbGRJbml0aWFsaXphdGlvbnMpLmluZGV4T2YocHJvcGVydHlOYW1lKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGZpZWxkIHdhcyBkZWNsYXJlZCBhcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkSW5pdFZhbHVlOiBzdHJpbmcgPSB0aGlzLmZpZWxkSW5pdGlhbGl6YXRpb25zW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGRJbml0VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0OiBudW1iZXIgPSBwcm9wZXJ0eS5nZXRTdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoOiBudW1iZXIgPSBwcm9wZXJ0eS5nZXRXaWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUoc3RhcnQsIHdpZHRoLCBGQUlMVVJFX1VOREVGSU5FRF9JTklUICsgcHJvcGVydHkuZ2V0VGV4dCgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFzdFV0aWxzLmlzQ29uc3RhbnQoYmluYXJ5RXhwcmVzc2lvbi5yaWdodCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmllbGQgaXMgYmVpbmcgYXNzaWduZWQgYSBjb25zdGFudC4uLiBjcmVhdGUgZXJyb3IgaWYgdGhlIGZpZWxkIGFscmVhZHkgaGFzIHRoYXQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRJbml0VmFsdWU6IHN0cmluZyA9IHRoaXMuZmllbGRJbml0aWFsaXphdGlvbnNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkSW5pdFZhbHVlID09PSBiaW5hcnlFeHByZXNzaW9uLnJpZ2h0LmdldFRleHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQ6IG51bWJlciA9IGJpbmFyeUV4cHJlc3Npb24uZ2V0U3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoOiBudW1iZXIgPSBiaW5hcnlFeHByZXNzaW9uLmdldFdpZHRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlOiBzdHJpbmcgPSBGQUlMVVJFX1VOREVGSU5FRF9EVVBFICsgYmluYXJ5RXhwcmVzc2lvbi5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKHN0YXJ0LCB3aWR0aCwgbWVzc2FnZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59Il19