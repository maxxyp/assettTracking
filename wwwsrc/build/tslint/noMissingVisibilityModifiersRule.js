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
var AstUtils_1 = require("./utils/AstUtils");
/**
 * Implementation of the mo-missing-visibility-modifiers rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MissingVisibilityModifierWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "no-missing-visibility-modifiers",
    type: "maintainability",
    description: "Deprecated - This rule is in the TSLint product as `member-access`",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "Ignored",
    issueType: "Warning",
    severity: "Low",
    level: "Opportunity for Excellence",
    group: "Deprecated",
    recommendation: "false, // use tslint member-access rule instead",
    commonWeaknessEnumeration: "398, 710"
};
exports.Rule = Rule;
var MissingVisibilityModifierWalker = (function (_super) {
    __extends(MissingVisibilityModifierWalker, _super);
    function MissingVisibilityModifierWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingVisibilityModifierWalker.prototype.visitPropertyDeclaration = function (node) {
        if (this.isMissingVisibilityModifier(node)) {
            var failureString = "Field missing visibility modifier: " + this.getFailureCodeSnippet(node);
            var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
            this.addFailure(failure);
        }
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    MissingVisibilityModifierWalker.prototype.visitMethodDeclaration = function (node) {
        if (this.isMissingVisibilityModifier(node)) {
            var failureString = "Method missing visibility modifier: " + this.getFailureCodeSnippet(node);
            var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
            this.addFailure(failure);
        }
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    MissingVisibilityModifierWalker.prototype.isMissingVisibilityModifier = function (node) {
        return !(AstUtils_1.AstUtils.isPrivate(node) || AstUtils_1.AstUtils.isProtected(node) || AstUtils_1.AstUtils.isPublic(node));
    };
    MissingVisibilityModifierWalker.prototype.getFailureCodeSnippet = function (node) {
        var message = node.getText();
        if (message.indexOf("\n") > 0) {
            return message.substr(0, message.indexOf("\n"));
        }
        return message;
    };
    return MissingVisibilityModifierWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9NaXNzaW5nVmlzaWJpbGl0eU1vZGlmaWVyc1J1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub01pc3NpbmdWaXNpYmlsaXR5TW9kaWZpZXJzUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBeUM7QUFFekMsbUVBQWdFO0FBQ2hFLDZDQUEwQztBQUcxQzs7R0FFRztBQUNIO0lBQTBCLHdCQUF1QjtJQUFqRDs7SUFxQkEsQ0FBQztJQUhVLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLCtCQUErQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BHLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQXJCRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFFL0IsYUFBUSxHQUFzQjtJQUN4QyxRQUFRLEVBQUUsaUNBQWlDO0lBQzNDLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsV0FBVyxFQUFFLG9FQUFvRTtJQUNqRixPQUFPLEVBQUUsSUFBSTtJQUNiLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsVUFBVSxFQUFFLFNBQVM7SUFDckIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsUUFBUSxFQUFFLEtBQUs7SUFDZixLQUFLLEVBQUUsNEJBQTRCO0lBQ25DLEtBQUssRUFBRSxZQUFZO0lBQ25CLGNBQWMsRUFBRSxpREFBaUQ7SUFDakUseUJBQXlCLEVBQUUsVUFBVTtDQUN4QyxDQUFDO0FBaEJPLG9CQUFJO0FBdUJqQjtJQUE4QyxtREFBbUI7SUFBakU7O0lBOEJBLENBQUM7SUE3QmEsa0VBQXdCLEdBQWxDLFVBQW1DLElBQTRCO1FBQzNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBTSxhQUFhLEdBQUcscUNBQXFDLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9GLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxpQkFBTSx3QkFBd0IsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRVMsZ0VBQXNCLEdBQWhDLFVBQWlDLElBQTBCO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBTSxhQUFhLEdBQUcsc0NBQXNDLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hHLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxpQkFBTSxzQkFBc0IsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU8scUVBQTJCLEdBQW5DLFVBQW9DLElBQWE7UUFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFFTywrREFBcUIsR0FBN0IsVUFBOEIsSUFBYTtRQUN2QyxJQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNMLHNDQUFDO0FBQUQsQ0FBQyxBQTlCRCxDQUE4Qyx5Q0FBbUIsR0E4QmhFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSBcInR5cGVzY3JpcHRcIjtcbmltcG9ydCAqIGFzIExpbnQgZnJvbSBcInRzbGludC9saWIvaW5kZXhcIjtcblxuaW1wb3J0IHtFcnJvclRvbGVyYW50V2Fsa2VyfSBmcm9tIFwiLi91dGlscy9FcnJvclRvbGVyYW50V2Fsa2VyXCI7XG5pbXBvcnQge0FzdFV0aWxzfSBmcm9tIFwiLi91dGlscy9Bc3RVdGlsc1wiO1xuaW1wb3J0IHtJRXh0ZW5kZWRNZXRhZGF0YX0gZnJvbSBcIi4vdXRpbHMvRXh0ZW5kZWRNZXRhZGF0YVwiO1xuXG4vKipcbiAqIEltcGxlbWVudGF0aW9uIG9mIHRoZSBtby1taXNzaW5nLXZpc2liaWxpdHktbW9kaWZpZXJzIHJ1bGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuXG4gICAgcHVibGljIHN0YXRpYyBtZXRhZGF0YTogSUV4dGVuZGVkTWV0YWRhdGEgPSB7XG4gICAgICAgIHJ1bGVOYW1lOiBcIm5vLW1pc3NpbmctdmlzaWJpbGl0eS1tb2RpZmllcnNcIixcbiAgICAgICAgdHlwZTogXCJtYWludGFpbmFiaWxpdHlcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRGVwcmVjYXRlZCAtIFRoaXMgcnVsZSBpcyBpbiB0aGUgVFNMaW50IHByb2R1Y3QgYXMgYG1lbWJlci1hY2Nlc3NgXCIsXG4gICAgICAgIG9wdGlvbnM6IG51bGwsXG4gICAgICAgIG9wdGlvbnNEZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgdHlwZXNjcmlwdE9ubHk6IG51bGwsXG4gICAgICAgIGlzc3VlQ2xhc3M6IFwiSWdub3JlZFwiLFxuICAgICAgICBpc3N1ZVR5cGU6IFwiV2FybmluZ1wiLFxuICAgICAgICBzZXZlcml0eTogXCJMb3dcIixcbiAgICAgICAgbGV2ZWw6IFwiT3Bwb3J0dW5pdHkgZm9yIEV4Y2VsbGVuY2VcIixcbiAgICAgICAgZ3JvdXA6IFwiRGVwcmVjYXRlZFwiLFxuICAgICAgICByZWNvbW1lbmRhdGlvbjogXCJmYWxzZSwgLy8gdXNlIHRzbGludCBtZW1iZXItYWNjZXNzIHJ1bGUgaW5zdGVhZFwiLFxuICAgICAgICBjb21tb25XZWFrbmVzc0VudW1lcmF0aW9uOiBcIjM5OCwgNzEwXCJcbiAgICB9O1xuXG4gICAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IE1pc3NpbmdWaXNpYmlsaXR5TW9kaWZpZXJXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIE1pc3NpbmdWaXNpYmlsaXR5TW9kaWZpZXJXYWxrZXIgZXh0ZW5kcyBFcnJvclRvbGVyYW50V2Fsa2VyIHtcbiAgICBwcm90ZWN0ZWQgdmlzaXRQcm9wZXJ0eURlY2xhcmF0aW9uKG5vZGU6IHRzLlByb3BlcnR5RGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNNaXNzaW5nVmlzaWJpbGl0eU1vZGlmaWVyKG5vZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBmYWlsdXJlU3RyaW5nID0gXCJGaWVsZCBtaXNzaW5nIHZpc2liaWxpdHkgbW9kaWZpZXI6IFwiICsgdGhpcy5nZXRGYWlsdXJlQ29kZVNuaXBwZXQobm9kZSk7XG4gICAgICAgICAgICBjb25zdCBmYWlsdXJlID0gdGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBmYWlsdXJlU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZShmYWlsdXJlKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci52aXNpdFByb3BlcnR5RGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHZpc2l0TWV0aG9kRGVjbGFyYXRpb24obm9kZTogdHMuTWV0aG9kRGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNNaXNzaW5nVmlzaWJpbGl0eU1vZGlmaWVyKG5vZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBmYWlsdXJlU3RyaW5nID0gXCJNZXRob2QgbWlzc2luZyB2aXNpYmlsaXR5IG1vZGlmaWVyOiBcIiArIHRoaXMuZ2V0RmFpbHVyZUNvZGVTbmlwcGV0KG5vZGUpO1xuICAgICAgICAgICAgY29uc3QgZmFpbHVyZSA9IHRoaXMuY3JlYXRlRmFpbHVyZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSwgZmFpbHVyZVN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUoZmFpbHVyZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIudmlzaXRNZXRob2REZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzTWlzc2luZ1Zpc2liaWxpdHlNb2RpZmllcihub2RlOiB0cy5Ob2RlKSA6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIShBc3RVdGlscy5pc1ByaXZhdGUobm9kZSkgfHwgQXN0VXRpbHMuaXNQcm90ZWN0ZWQobm9kZSkgfHwgQXN0VXRpbHMuaXNQdWJsaWMobm9kZSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmFpbHVyZUNvZGVTbmlwcGV0KG5vZGU6IHRzLk5vZGUpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID0gbm9kZS5nZXRUZXh0KCk7XG4gICAgICAgIGlmIChtZXNzYWdlLmluZGV4T2YoXCJcXG5cIikgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHIoMCwgbWVzc2FnZS5pbmRleE9mKFwiXFxuXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9XG59Il19