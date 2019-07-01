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
/**
 * Implementation of the no-delete-expression rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var noDeleteExpression = new NoDeleteExpression(sourceFile, this.getOptions());
        return this.applyWithWalker(noDeleteExpression);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "no-delete-expression",
    type: "maintainability",
    description: "Do not delete expressions. Only properties should be deleted",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "SDL",
    issueType: "Error",
    severity: "Critical",
    level: "Mandatory",
    group: "Security"
};
Rule.FAILURE_STRING = "Variables should not be deleted: ";
exports.Rule = Rule;
var NoDeleteExpression = (function (_super) {
    __extends(NoDeleteExpression, _super);
    function NoDeleteExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoDeleteExpression.prototype.visitExpressionStatement = function (node) {
        _super.prototype.visitExpressionStatement.call(this, node);
        if (node.expression.kind === SyntaxKind_1.SyntaxKind.current().DeleteExpression) {
            // first child is delete keyword, second one is what is being deleted.
            var deletedObject = node.expression.getChildren()[1];
            if (deletedObject != null && deletedObject.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
                this.addNoDeleteFailure(deletedObject);
            }
        }
    };
    NoDeleteExpression.prototype.addNoDeleteFailure = function (deletedObject) {
        var msg = Rule.FAILURE_STRING + deletedObject.getFullText().trim();
        this.addFailure(this.createFailure(deletedObject.getStart(), deletedObject.getWidth(), msg));
    };
    return NoDeleteExpression;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9EZWxldGVFeHByZXNzaW9uUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vRGVsZXRlRXhwcmVzc2lvblJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQXlDO0FBRXpDLGlEQUE4QztBQUM5QyxtRUFBZ0U7QUFHaEU7O0dBRUc7QUFDSDtJQUEwQix3QkFBdUI7SUFBakQ7O0lBc0JBLENBQUM7SUFKVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNqRixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQXRCRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFFL0IsYUFBUSxHQUFzQjtJQUN4QyxRQUFRLEVBQUUsc0JBQXNCO0lBQ2hDLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsV0FBVyxFQUFFLDhEQUE4RDtJQUMzRSxPQUFPLEVBQUUsSUFBSTtJQUNiLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsVUFBVSxFQUFFLEtBQUs7SUFDakIsU0FBUyxFQUFFLE9BQU87SUFDbEIsUUFBUSxFQUFFLFVBQVU7SUFDcEIsS0FBSyxFQUFFLFdBQVc7SUFDbEIsS0FBSyxFQUFFLFVBQVU7Q0FDcEIsQ0FBQztBQUVZLG1CQUFjLEdBQVcsbUNBQW1DLENBQUM7QUFoQmxFLG9CQUFJO0FBd0JqQjtJQUFpQyxzQ0FBbUI7SUFBcEQ7O0lBa0JBLENBQUM7SUFoQlUscURBQXdCLEdBQS9CLFVBQWdDLElBQTRCO1FBQ3hELGlCQUFNLHdCQUF3QixZQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLHVCQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLHNFQUFzRTtZQUN0RSxJQUFNLGFBQWEsR0FBWSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLEVBQUUsQ0FBQyxDQUFDLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksS0FBSyx1QkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFTSwrQ0FBa0IsR0FBekIsVUFBMEIsYUFBc0I7UUFDNUMsSUFBTSxHQUFHLEdBQVcsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRUwseUJBQUM7QUFBRCxDQUFDLEFBbEJELENBQWlDLHlDQUFtQixHQWtCbkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tIFwidHlwZXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgTGludCBmcm9tIFwidHNsaW50L2xpYi9pbmRleFwiO1xuXG5pbXBvcnQge1N5bnRheEtpbmR9IGZyb20gXCIuL3V0aWxzL1N5bnRheEtpbmRcIjtcbmltcG9ydCB7RXJyb3JUb2xlcmFudFdhbGtlcn0gZnJvbSBcIi4vdXRpbHMvRXJyb3JUb2xlcmFudFdhbGtlclwiO1xuaW1wb3J0IHtJRXh0ZW5kZWRNZXRhZGF0YX0gZnJvbSBcIi4vdXRpbHMvRXh0ZW5kZWRNZXRhZGF0YVwiO1xuXG4vKipcbiAqIEltcGxlbWVudGF0aW9uIG9mIHRoZSBuby1kZWxldGUtZXhwcmVzc2lvbiBydWxlLlxuICovXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIExpbnQuUnVsZXMuQWJzdHJhY3RSdWxlIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgbWV0YWRhdGE6IElFeHRlbmRlZE1ldGFkYXRhID0ge1xuICAgICAgICBydWxlTmFtZTogXCJuby1kZWxldGUtZXhwcmVzc2lvblwiLFxuICAgICAgICB0eXBlOiBcIm1haW50YWluYWJpbGl0eVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEbyBub3QgZGVsZXRlIGV4cHJlc3Npb25zLiBPbmx5IHByb3BlcnRpZXMgc2hvdWxkIGJlIGRlbGV0ZWRcIixcbiAgICAgICAgb3B0aW9uczogbnVsbCxcbiAgICAgICAgb3B0aW9uc0Rlc2NyaXB0aW9uOiBudWxsLFxuICAgICAgICB0eXBlc2NyaXB0T25seTogbnVsbCxcbiAgICAgICAgaXNzdWVDbGFzczogXCJTRExcIixcbiAgICAgICAgaXNzdWVUeXBlOiBcIkVycm9yXCIsXG4gICAgICAgIHNldmVyaXR5OiBcIkNyaXRpY2FsXCIsXG4gICAgICAgIGxldmVsOiBcIk1hbmRhdG9yeVwiLFxuICAgICAgICBncm91cDogXCJTZWN1cml0eVwiXG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkc6IHN0cmluZyA9IFwiVmFyaWFibGVzIHNob3VsZCBub3QgYmUgZGVsZXRlZDogXCI7XG5cbiAgICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgICAgIGNvbnN0IG5vRGVsZXRlRXhwcmVzc2lvbiA9IG5ldyBOb0RlbGV0ZUV4cHJlc3Npb24oc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobm9EZWxldGVFeHByZXNzaW9uKTtcbiAgICB9XG59XG5cbmNsYXNzIE5vRGVsZXRlRXhwcmVzc2lvbiBleHRlbmRzIEVycm9yVG9sZXJhbnRXYWxrZXIge1xuXG4gICAgcHVibGljIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChub2RlOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50KSB7XG4gICAgICAgIHN1cGVyLnZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgaWYgKG5vZGUuZXhwcmVzc2lvbi5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5EZWxldGVFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBjaGlsZCBpcyBkZWxldGUga2V5d29yZCwgc2Vjb25kIG9uZSBpcyB3aGF0IGlzIGJlaW5nIGRlbGV0ZWQuXG4gICAgICAgICAgICBjb25zdCBkZWxldGVkT2JqZWN0OiB0cy5Ob2RlID0gbm9kZS5leHByZXNzaW9uLmdldENoaWxkcmVuKClbMV07XG4gICAgICAgICAgICBpZiAoZGVsZXRlZE9iamVjdCAhPSBudWxsICYmIGRlbGV0ZWRPYmplY3Qua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuSWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTm9EZWxldGVGYWlsdXJlKGRlbGV0ZWRPYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZE5vRGVsZXRlRmFpbHVyZShkZWxldGVkT2JqZWN0OiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1zZzogc3RyaW5nID0gUnVsZS5GQUlMVVJFX1NUUklORyArIGRlbGV0ZWRPYmplY3QuZ2V0RnVsbFRleHQoKS50cmltKCk7XG4gICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUoZGVsZXRlZE9iamVjdC5nZXRTdGFydCgpLCBkZWxldGVkT2JqZWN0LmdldFdpZHRoKCksIG1zZykpO1xuICAgIH1cblxufSJdfQ==