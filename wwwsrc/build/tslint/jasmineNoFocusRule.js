"use strict";
/*  KEEP IN SYNC with README.md
## no-jasmine-focus
Flags any place developers left fit or fdescribe calls in their code.
```javascript
"no-jasmine-focus": true
```
*/
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
var Lint = require("tslint");
var JASMINE_FOCUS_FAIL = "Don't keep jasmine focus methods";
var BAD_CALL_NAMES = ["fdescribe", "fit"];
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoJasmineFocusRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoJasmineFocusRuleWalker = (function (_super) {
    __extends(NoJasmineFocusRuleWalker, _super);
    function NoJasmineFocusRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoJasmineFocusRuleWalker.prototype.visitCallExpression = function (node) {
        var func_id = node.expression;
        var func_name = func_id.getText();
        if (BAD_CALL_NAMES.indexOf(func_name) !== -1) {
            this.addFailure(this.createFailure(func_id.getStart(), func_id.getWidth(), JASMINE_FOCUS_FAIL));
        }
        this.walkChildren(node);
    };
    return NoJasmineFocusRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFzbWluZU5vRm9jdXNSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiamFzbWluZU5vRm9jdXNSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0VBTUU7Ozs7Ozs7Ozs7OztBQUVGLDZCQUErQjtBQUcvQixJQUFNLGtCQUFrQixHQUFHLGtDQUFrQyxDQUFDO0FBQzlELElBQU0sY0FBYyxHQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRWhEO0lBQTBCLHdCQUF1QjtJQUFqRDs7SUFJQSxDQUFDO0lBSFUsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksd0JBQXdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBSWhEO0FBSlksb0JBQUk7QUFNakI7SUFBdUMsNENBQWU7SUFBdEQ7O0lBWUEsQ0FBQztJQVZhLHNEQUFtQixHQUE3QixVQUE4QixJQUF1QjtRQUNqRCxJQUFJLE9BQU8sR0FBTSxJQUFJLENBQUMsVUFBNEIsQ0FBQztRQUNuRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFbEMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLENBQUM7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDTCwrQkFBQztBQUFELENBQUMsQUFaRCxDQUF1QyxJQUFJLENBQUMsVUFBVSxHQVlyRCIsInNvdXJjZXNDb250ZW50IjpbIi8qICBLRUVQIElOIFNZTkMgd2l0aCBSRUFETUUubWRcclxuIyMgbm8tamFzbWluZS1mb2N1c1xyXG5GbGFncyBhbnkgcGxhY2UgZGV2ZWxvcGVycyBsZWZ0IGZpdCBvciBmZGVzY3JpYmUgY2FsbHMgaW4gdGhlaXIgY29kZS5cclxuYGBgamF2YXNjcmlwdFxyXG5cIm5vLWphc21pbmUtZm9jdXNcIjogdHJ1ZVxyXG5gYGBcclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIExpbnQgZnJvbSBcInRzbGludFwiO1xyXG5pbXBvcnQgKiBhcyB0cyBmcm9tIFwidHlwZXNjcmlwdFwiO1xyXG5cclxuY29uc3QgSkFTTUlORV9GT0NVU19GQUlMID0gXCJEb24ndCBrZWVwIGphc21pbmUgZm9jdXMgbWV0aG9kc1wiO1xyXG5jb25zdCBCQURfQ0FMTF9OQU1FUyAgICAgPSBbXCJmZGVzY3JpYmVcIiwgXCJmaXRcIl07XHJcblxyXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIExpbnQuUnVsZXMuQWJzdHJhY3RSdWxlIHtcclxuICAgIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IE5vSmFzbWluZUZvY3VzUnVsZVdhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBOb0phc21pbmVGb2N1c1J1bGVXYWxrZXIgZXh0ZW5kcyBMaW50LlJ1bGVXYWxrZXIge1xyXG5cclxuICAgIHByb3RlY3RlZCB2aXNpdENhbGxFeHByZXNzaW9uKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgbGV0IGZ1bmNfaWQgICA9IChub2RlLmV4cHJlc3Npb24gYXMgdHMuSWRlbnRpZmllcik7XHJcbiAgICAgICAgbGV0IGZ1bmNfbmFtZSA9IGZ1bmNfaWQuZ2V0VGV4dCgpO1xyXG5cclxuICAgICAgICBpZiAoQkFEX0NBTExfTkFNRVMuaW5kZXhPZihmdW5jX25hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKGZ1bmNfaWQuZ2V0U3RhcnQoKSwgZnVuY19pZC5nZXRXaWR0aCgpLCBKQVNNSU5FX0ZPQ1VTX0ZBSUwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMud2Fsa0NoaWxkcmVuKG5vZGUpO1xyXG4gICAgfVxyXG59Il19