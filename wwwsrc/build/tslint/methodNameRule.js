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
var ruleWalker_1 = require("../../node_modules/tslint/lib/language/walker/ruleWalker");
var abstractRule_1 = require("../../node_modules/tslint/lib/language/rule/abstractRule");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(abstractRule_1.AbstractRule));
Rule.FAILURE_STRING = "method name must be camel case";
exports.Rule = Rule;
var NameWalker = (function (_super) {
    __extends(NameWalker, _super);
    function NameWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NameWalker.prototype.visitMethodDeclaration = function (node) {
        var methodName = node.name.getText();
        if (!this.isCamelCase(methodName)) {
            this.addFailureAt(node.name.getStart(), node.name.getWidth(), Rule.FAILURE_STRING);
        }
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    NameWalker.prototype.isCamelCase = function (name) {
        return /[a-z]/.test(name.charAt(0));
    };
    NameWalker.prototype.addFailureAt = function (position, width, failureString) {
        var failure = this.createFailure(position, width, failureString);
        this.addFailure(failure);
    };
    return NameWalker;
}(ruleWalker_1.RuleWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kTmFtZVJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRob2ROYW1lUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSx1RkFBb0Y7QUFDcEYseUZBQXNGO0FBR3RGO0lBQTBCLHdCQUFZO0lBQXRDOztJQU1BLENBQUM7SUFIVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBMEIsMkJBQVk7QUFDcEIsbUJBQWMsR0FBRyxnQ0FBZ0MsQ0FBQztBQUR2RCxvQkFBSTtBQVFqQjtJQUF5Qiw4QkFBVTtJQUFuQzs7SUFvQkEsQ0FBQztJQW5CVSwyQ0FBc0IsR0FBN0IsVUFBOEIsSUFBMEI7UUFDcEQsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN2RixDQUFDO1FBRUQsaUJBQU0sc0JBQXNCLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVPLGdDQUFXLEdBQW5CLFVBQW9CLElBQVk7UUFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxpQ0FBWSxHQUFuQixVQUFvQixRQUFnQixFQUFFLEtBQWEsRUFBRSxhQUFxQjtRQUN0RSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUwsaUJBQUM7QUFBRCxDQUFDLEFBcEJELENBQXlCLHVCQUFVLEdBb0JsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHlwZXNjcmlwdC9saWIvdHlwZXNjcmlwdFwiO1xuaW1wb3J0IHtSdWxlV2Fsa2VyfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvbGFuZ3VhZ2Uvd2Fsa2VyL3J1bGVXYWxrZXJcIjtcbmltcG9ydCB7QWJzdHJhY3RSdWxlfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvbGFuZ3VhZ2UvcnVsZS9hYnN0cmFjdFJ1bGVcIjtcbmltcG9ydCB7UnVsZUZhaWx1cmV9IGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHNsaW50L2xpYi9sYW5ndWFnZS9ydWxlL3J1bGVcIjtcblxuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBBYnN0cmFjdFJ1bGUge1xuICAgIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkcgPSBcIm1ldGhvZCBuYW1lIG11c3QgYmUgY2FtZWwgY2FzZVwiO1xuXG4gICAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBSdWxlRmFpbHVyZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoV2Fsa2VyKG5ldyBOYW1lV2Fsa2VyKHNvdXJjZUZpbGUsIHRoaXMuZ2V0T3B0aW9ucygpKSk7XG4gICAgfVxufVxuXG5jbGFzcyBOYW1lV2Fsa2VyIGV4dGVuZHMgUnVsZVdhbGtlciB7XG4gICAgcHVibGljIHZpc2l0TWV0aG9kRGVjbGFyYXRpb24obm9kZTogdHMuTWV0aG9kRGVjbGFyYXRpb24pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzQ2FtZWxDYXNlKG1ldGhvZE5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmVBdChub2RlLm5hbWUuZ2V0U3RhcnQoKSwgbm9kZS5uYW1lLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIudmlzaXRNZXRob2REZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQ2FtZWxDYXNlKG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gL1thLXpdLy50ZXN0KG5hbWUuY2hhckF0KDApKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRmFpbHVyZUF0KHBvc2l0aW9uOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGZhaWx1cmVTdHJpbmc6IHN0cmluZykge1xuICAgICAgICBjb25zdCBmYWlsdXJlID0gdGhpcy5jcmVhdGVGYWlsdXJlKHBvc2l0aW9uLCB3aWR0aCwgZmFpbHVyZVN0cmluZyk7XG4gICAgICAgIHRoaXMuYWRkRmFpbHVyZShmYWlsdXJlKTtcbiAgICB9XG5cbn1cbiJdfQ==