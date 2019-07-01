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
var Lint = require("../../node_modules/tslint/lib/index");
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AccessorAfterConstructorWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.CONSTUCTOR_FAILURE_STRING = "the getters/setters should be declared after the constructor";
exports.Rule = Rule;
var AccessorAfterConstructorWalker = (function (_super) {
    __extends(AccessorAfterConstructorWalker, _super);
    function AccessorAfterConstructorWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccessorAfterConstructorWalker.prototype.visitConstructorDeclaration = function (node) {
        if (this._hadSetterGetter) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.CONSTUCTOR_FAILURE_STRING));
        }
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    AccessorAfterConstructorWalker.prototype.visitGetAccessor = function (node) {
        this._hadSetterGetter = true;
        _super.prototype.visitGetAccessor.call(this, node);
    };
    AccessorAfterConstructorWalker.prototype.visitSetAccessor = function (node) {
        this._hadSetterGetter = true;
        _super.prototype.visitSetAccessor.call(this, node);
    };
    return AccessorAfterConstructorWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzb3JBZnRlckNvbnN0cnVjdG9yUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY2Vzc29yQWZ0ZXJDb25zdHJ1Y3RvclJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsMERBQTREO0FBRTVELG1FQUFnRTtBQUVoRTs7R0FFRztBQUNIO0lBQTBCLHdCQUF1QjtJQUFqRDs7SUFNQSxDQUFDO0lBSFUsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksOEJBQThCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBQy9CLDhCQUF5QixHQUFXLDhEQUE4RCxDQUFDO0FBRHhHLG9CQUFJO0FBUWpCO0lBQTZDLGtEQUFtQjtJQUFoRTs7SUFzQkEsQ0FBQztJQW5CVSxvRUFBMkIsR0FBbEMsVUFBbUMsSUFBK0I7UUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO1FBQzFHLENBQUM7UUFFRCxpQkFBTSwyQkFBMkIsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRVMseURBQWdCLEdBQTFCLFVBQTJCLElBQTRCO1FBQ25ELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFN0IsaUJBQU0sZ0JBQWdCLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVTLHlEQUFnQixHQUExQixVQUEyQixJQUE0QjtRQUNuRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBRTdCLGlCQUFNLGdCQUFnQixZQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDTCxxQ0FBQztBQUFELENBQUMsQUF0QkQsQ0FBNkMseUNBQW1CLEdBc0IvRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHlwZXNjcmlwdC9saWIvdHlwZXNjcmlwdFwiO1xuaW1wb3J0ICogYXMgTGludCBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGludC9saWIvaW5kZXhcIjtcblxuaW1wb3J0IHtFcnJvclRvbGVyYW50V2Fsa2VyfSBmcm9tIFwiLi91dGlscy9FcnJvclRvbGVyYW50V2Fsa2VyXCI7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIG5vLXVubmVjZXNzYXJ5LXNlbWljb2xvbnMgcnVsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG4gICAgcHVibGljIHN0YXRpYyBDT05TVFVDVE9SX0ZBSUxVUkVfU1RSSU5HOiBzdHJpbmcgPSBcInRoZSBnZXR0ZXJzL3NldHRlcnMgc2hvdWxkIGJlIGRlY2xhcmVkIGFmdGVyIHRoZSBjb25zdHJ1Y3RvclwiO1xuXG4gICAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IEFjY2Vzc29yQWZ0ZXJDb25zdHJ1Y3RvcldhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xuICAgIH1cbn1cblxuY2xhc3MgQWNjZXNzb3JBZnRlckNvbnN0cnVjdG9yV2Fsa2VyIGV4dGVuZHMgRXJyb3JUb2xlcmFudFdhbGtlciB7XG4gICAgcHJpdmF0ZSBfaGFkU2V0dGVyR2V0dGVyOiBib29sZWFuO1xuXG4gICAgcHVibGljIHZpc2l0Q29uc3RydWN0b3JEZWNsYXJhdGlvbihub2RlOiB0cy5Db25zdHJ1Y3RvckRlY2xhcmF0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl9oYWRTZXR0ZXJHZXR0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuQ09OU1RVQ1RPUl9GQUlMVVJFX1NUUklORykpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIudmlzaXRDb25zdHJ1Y3RvckRlY2xhcmF0aW9uKG5vZGUpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB2aXNpdEdldEFjY2Vzc29yKG5vZGU6IHRzLkFjY2Vzc29yRGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5faGFkU2V0dGVyR2V0dGVyID0gdHJ1ZTtcblxuICAgICAgICBzdXBlci52aXNpdEdldEFjY2Vzc29yKG5vZGUpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB2aXNpdFNldEFjY2Vzc29yKG5vZGU6IHRzLkFjY2Vzc29yRGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5faGFkU2V0dGVyR2V0dGVyID0gdHJ1ZTtcblxuICAgICAgICBzdXBlci52aXNpdFNldEFjY2Vzc29yKG5vZGUpO1xuICAgIH1cbn0iXX0=