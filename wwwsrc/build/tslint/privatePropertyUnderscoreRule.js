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
        return this.applyWithWalker(new PrivatePropertyUnderscoreWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(abstractRule_1.AbstractRule));
Rule.FAILURE_STRING_PRIVATE = "private properties must start with an underscore";
Rule.FAILURE_STRING_PUBLIC = "public properties must not start with an underscore";
exports.Rule = Rule;
var PrivatePropertyUnderscoreWalker = (function (_super) {
    __extends(PrivatePropertyUnderscoreWalker, _super);
    function PrivatePropertyUnderscoreWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrivatePropertyUnderscoreWalker.prototype.visitPropertyDeclaration = function (node) {
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword)) {
            var identifier = node.name;
            var variableName = identifier.text;
            var firstCharacter = variableName.charAt(0);
            if (firstCharacter !== "_") {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_PRIVATE));
            }
        }
        else if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword)) {
            var identifier = node.name;
            var variableName = identifier.text;
            var firstCharacter = variableName.charAt(0);
            if (firstCharacter === "_") {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_PUBLIC));
            }
        }
    };
    return PrivatePropertyUnderscoreWalker;
}(ruleWalker_1.RuleWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZVByb3BlcnR5VW5kZXJzY29yZVJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcml2YXRlUHJvcGVydHlVbmRlcnNjb3JlUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpRUFBbUU7QUFDbkUsMERBQTREO0FBQzVELHlGQUFzRjtBQUN0Rix1RkFBb0Y7QUFFcEY7SUFBMEIsd0JBQVk7SUFBdEM7O0lBT0EsQ0FBQztJQUhVLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLCtCQUErQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BHLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQVBELENBQTBCLDJCQUFZO0FBQ3BCLDJCQUFzQixHQUFHLGtEQUFrRCxDQUFDO0FBQzVFLDBCQUFxQixHQUFHLHFEQUFxRCxDQUFDO0FBRm5GLG9CQUFJO0FBU2pCO0lBQThDLG1EQUFVO0lBQXhEOztJQStCQSxDQUFDO0lBOUJVLGtFQUF3QixHQUEvQixVQUFnQyxJQUE0QjtRQUV4RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUNaLElBQUksQ0FBQyxTQUFTLEVBQ2QsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQy9CLENBQUMsQ0FBQyxDQUFDO1lBQ0osSUFBTSxVQUFVLEdBQW1CLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFN0MsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztZQUVyQyxJQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQ3ZHLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQ25CLElBQUksQ0FBQyxTQUFTLEVBQ2QsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQzlCLENBQUMsQ0FBQyxDQUFDO1lBQ0osSUFBTSxVQUFVLEdBQW1CLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFN0MsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztZQUVyQyxJQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQ3RHLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUNMLHNDQUFDO0FBQUQsQ0FBQyxBQS9CRCxDQUE4Qyx1QkFBVSxHQStCdkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3R5cGVzY3JpcHQvbGliL3R5cGVzY3JpcHRcIjtcbmltcG9ydCAqIGFzIExpbnQgZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy90c2xpbnQvbGliL2luZGV4XCI7XG5pbXBvcnQge0Fic3RyYWN0UnVsZX0gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy90c2xpbnQvbGliL2xhbmd1YWdlL3J1bGUvYWJzdHJhY3RSdWxlXCI7XG5pbXBvcnQge1J1bGVXYWxrZXJ9IGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHNsaW50L2xpYi9sYW5ndWFnZS93YWxrZXIvcnVsZVdhbGtlclwiO1xuXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIEFic3RyYWN0UnVsZSB7XG4gICAgcHVibGljIHN0YXRpYyBGQUlMVVJFX1NUUklOR19QUklWQVRFID0gXCJwcml2YXRlIHByb3BlcnRpZXMgbXVzdCBzdGFydCB3aXRoIGFuIHVuZGVyc2NvcmVcIjtcbiAgICBwdWJsaWMgc3RhdGljIEZBSUxVUkVfU1RSSU5HX1BVQkxJQyA9IFwicHVibGljIHByb3BlcnRpZXMgbXVzdCBub3Qgc3RhcnQgd2l0aCBhbiB1bmRlcnNjb3JlXCI7XG5cbiAgICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgUHJpdmF0ZVByb3BlcnR5VW5kZXJzY29yZVdhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xuICAgIH1cbn1cblxuY2xhc3MgUHJpdmF0ZVByb3BlcnR5VW5kZXJzY29yZVdhbGtlciBleHRlbmRzIFJ1bGVXYWxrZXIge1xuICAgIHB1YmxpYyB2aXNpdFByb3BlcnR5RGVjbGFyYXRpb24obm9kZTogdHMuUHJvcGVydHlEZWNsYXJhdGlvbikge1xuXG4gICAgICAgIGlmIChMaW50Lmhhc01vZGlmaWVyKFxuICAgICAgICAgICAgICAgIG5vZGUubW9kaWZpZXJzLFxuICAgICAgICAgICAgICAgIHRzLlN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSA8dHMuSWRlbnRpZmllcj4gbm9kZS5uYW1lO1xuXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZU5hbWUgPSBpZGVudGlmaWVyLnRleHQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2hhcmFjdGVyID0gdmFyaWFibGVOYW1lLmNoYXJBdCgwKTtcblxuICAgICAgICAgICAgaWYgKGZpcnN0Q2hhcmFjdGVyICE9PSBcIl9cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkdfUFJJVkFURSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKExpbnQuaGFzTW9kaWZpZXIoXG4gICAgICAgICAgICAgICAgbm9kZS5tb2RpZmllcnMsXG4gICAgICAgICAgICAgICAgdHMuU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gPHRzLklkZW50aWZpZXI+IG5vZGUubmFtZTtcblxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGVOYW1lID0gaWRlbnRpZmllci50ZXh0O1xuXG4gICAgICAgICAgICBjb25zdCBmaXJzdENoYXJhY3RlciA9IHZhcmlhYmxlTmFtZS5jaGFyQXQoMCk7XG5cbiAgICAgICAgICAgIGlmIChmaXJzdENoYXJhY3RlciA9PT0gXCJfXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HX1BVQkxJQykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==