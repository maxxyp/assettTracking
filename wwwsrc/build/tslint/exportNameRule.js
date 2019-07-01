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
var Utils_1 = require("./utils/Utils");
var SyntaxKind_1 = require("./utils/SyntaxKind");
var AstUtils_1 = require("./utils/AstUtils");
/**
 * Implementation of the export-name rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ExportNameWalker(sourceFile, this.getOptions()));
    };
    /* tslint:disable:function-name */
    Rule.getExceptions = function (options) {
        /* tslint:enable:function-name */
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return options; // MSE version of tslint somehow requires this
        }
        return null;
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: "export-name",
    type: "maintainability",
    description: "The name of the exported module must match the filename of the source file",
    options: null,
    optionsDescription: null,
    typescriptOnly: null,
    issueClass: "Ignored",
    issueType: "Warning",
    severity: "Low",
    level: "Opportunity for Excellence",
    group: "Clarity",
    commonWeaknessEnumeration: "710"
};
Rule.FAILURE_STRING = "The exported module or identifier name must match the file name. Found: ";
exports.Rule = Rule;
var ExportNameWalker = (function (_super) {
    __extends(ExportNameWalker, _super);
    function ExportNameWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportNameWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        // look for single export assignment from file first
        var singleExport = node.statements.filter(function (element) {
            return element.kind === SyntaxKind_1.SyntaxKind.current().ExportAssignment;
        });
        if (singleExport.length === 1) {
            var exportAssignment = singleExport[0];
            this.validateExport(exportAssignment.expression.getText(), exportAssignment.expression);
            return; // there is a single export and it is valid, so do not proceed
        }
        var exportedTopLevelElements = [];
        // exports are normally declared at the top level
        node.statements.forEach(function (element) {
            var exportStatements = _this.getExportStatements(element);
            exportedTopLevelElements = exportedTopLevelElements.concat(exportStatements);
        });
        // exports might be hidden inside a namespace
        if (exportedTopLevelElements.length === 0) {
            node.statements.forEach(function (element) {
                if (element.kind === SyntaxKind_1.SyntaxKind.current().ModuleDeclaration) {
                    var exportStatements = _this.getExportStatementsWithinModules(element);
                    exportedTopLevelElements = exportedTopLevelElements.concat(exportStatements);
                }
            });
        }
        this.validateExportedElements(exportedTopLevelElements);
    };
    ExportNameWalker.prototype.getExportStatementsWithinModules = function (moduleDeclaration) {
        var _this = this;
        if (moduleDeclaration.body.kind === SyntaxKind_1.SyntaxKind.current().ModuleDeclaration) {
            // modules may be nested so recur into the structure
            return this.getExportStatementsWithinModules(moduleDeclaration.body);
        }
        else if (moduleDeclaration.body.kind === SyntaxKind_1.SyntaxKind.current().ModuleBlock) {
            var exportStatements_1 = [];
            var moduleBlock = moduleDeclaration.body;
            moduleBlock.statements.forEach(function (element) {
                exportStatements_1 = exportStatements_1.concat(_this.getExportStatements(element));
            });
            return exportStatements_1;
        }
    };
    ExportNameWalker.prototype.getExportStatements = function (element) {
        var exportStatements = [];
        if (element.kind === SyntaxKind_1.SyntaxKind.current().ExportAssignment) {
            var exportAssignment = element;
            this.validateExport(exportAssignment.expression.getText(), exportAssignment.expression);
        }
        else if (AstUtils_1.AstUtils.hasModifier(element.modifiers, SyntaxKind_1.SyntaxKind.current().ExportKeyword)) {
            exportStatements.push(element);
        }
        return exportStatements;
    };
    ExportNameWalker.prototype.validateExportedElements = function (exportedElements) {
        // only validate the exported elements when a single export statement is made
        if (exportedElements.length === 1) {
            if (exportedElements[0].kind === SyntaxKind_1.SyntaxKind.current().ModuleDeclaration ||
                exportedElements[0].kind === SyntaxKind_1.SyntaxKind.current().ClassDeclaration ||
                exportedElements[0].kind === SyntaxKind_1.SyntaxKind.current().FunctionDeclaration) {
                this.validateExport(exportedElements[0].name.text, exportedElements[0]);
            }
            else if (exportedElements[0].kind === SyntaxKind_1.SyntaxKind.current().VariableStatement) {
                var variableStatement = exportedElements[0];
                // ignore comma separated variable lists
                if (variableStatement.declarationList.declarations.length === 1) {
                    var variableDeclaration = variableStatement.declarationList.declarations[0];
                    this.validateExport(variableDeclaration.name.text, variableDeclaration);
                }
            }
        }
    };
    ExportNameWalker.prototype.validateExport = function (exportedName, node) {
        var regex = new RegExp(this.toCamel(exportedName) + "\..*"); // filename must be exported name plus any extension
        if (!regex.test(this.getFilename())) {
            if (!this.isSuppressed(exportedName)) {
                var failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName + " and " + exportedName;
                var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                this.addFailure(failure);
            }
        }
    };
    ExportNameWalker.prototype.getFilename = function () {
        var filename = this.getSourceFile().fileName;
        var lastSlash = filename.lastIndexOf("/");
        if (lastSlash > -1) {
            return filename.substring(lastSlash + 1);
        }
        return filename;
    };
    ExportNameWalker.prototype.isSuppressed = function (exportedName) {
        var allExceptions = Rule.getExceptions(this.getOptions());
        return Utils_1.Utils.exists(allExceptions, function (exception) {
            return new RegExp(exception).test(exportedName);
        });
    };
    ExportNameWalker.prototype.toCamel = function (module) {
        return module.substr(0, 1).toLowerCase() + module.substr(1);
    };
    return ExportNameWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
exports.ExportNameWalker = ExportNameWalker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0TmFtZVJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleHBvcnROYW1lUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSwwREFBNEQ7QUFFNUQsbUVBQWdFO0FBQ2hFLHVDQUFvQztBQUNwQyxpREFBOEM7QUFDOUMsNkNBQTBDO0FBRzFDOztHQUVHO0FBQ0g7SUFBMEIsd0JBQXVCO0lBQWpEOztJQWtDQSxDQUFDO0lBZlUsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELGtDQUFrQztJQUNwQixrQkFBYSxHQUEzQixVQUE0QixPQUF1QjtRQUMvQyxpQ0FBaUM7UUFDakMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQWdCLE9BQU8sQ0FBQyxDQUFDLDhDQUE4QztRQUNqRixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFsQ0QsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBRS9CLGFBQVEsR0FBc0I7SUFDeEMsUUFBUSxFQUFFLGFBQWE7SUFDdkIsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixXQUFXLEVBQUUsNEVBQTRFO0lBQ3pGLE9BQU8sRUFBRSxJQUFJO0lBQ2Isa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixjQUFjLEVBQUUsSUFBSTtJQUNwQixVQUFV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QUFDO0lBRU8sa0NBQU8sR0FBZixVQUFnQixNQUFjO1FBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUEzR0QsQ0FBc0MseUNBQW1CLEdBMkd4RDtBQTNHWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIHRzIGZyb20gXCJ0eXBlc2NyaXB0XCI7XG5pbXBvcnQgKiBhcyBMaW50IGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvdHNsaW50L2xpYi9pbmRleFwiO1xuXG5pbXBvcnQge0Vycm9yVG9sZXJhbnRXYWxrZXJ9IGZyb20gXCIuL3V0aWxzL0Vycm9yVG9sZXJhbnRXYWxrZXJcIjtcbmltcG9ydCB7VXRpbHN9IGZyb20gXCIuL3V0aWxzL1V0aWxzXCI7XG5pbXBvcnQge1N5bnRheEtpbmR9IGZyb20gXCIuL3V0aWxzL1N5bnRheEtpbmRcIjtcbmltcG9ydCB7QXN0VXRpbHN9IGZyb20gXCIuL3V0aWxzL0FzdFV0aWxzXCI7XG5pbXBvcnQge0lFeHRlbmRlZE1ldGFkYXRhfSBmcm9tIFwiLi91dGlscy9FeHRlbmRlZE1ldGFkYXRhXCI7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIGV4cG9ydC1uYW1lIHJ1bGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuXG4gICAgcHVibGljIHN0YXRpYyBtZXRhZGF0YTogSUV4dGVuZGVkTWV0YWRhdGEgPSB7XG4gICAgICAgIHJ1bGVOYW1lOiBcImV4cG9ydC1uYW1lXCIsXG4gICAgICAgIHR5cGU6IFwibWFpbnRhaW5hYmlsaXR5XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBuYW1lIG9mIHRoZSBleHBvcnRlZCBtb2R1bGUgbXVzdCBtYXRjaCB0aGUgZmlsZW5hbWUgb2YgdGhlIHNvdXJjZSBmaWxlXCIsXG4gICAgICAgIG9wdGlvbnM6IG51bGwsXG4gICAgICAgIG9wdGlvbnNEZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgdHlwZXNjcmlwdE9ubHk6IG51bGwsXG4gICAgICAgIGlzc3VlQ2xhc3M6IFwiSWdub3JlZFwiLFxuICAgICAgICBpc3N1ZVR5cGU6IFwiV2FybmluZ1wiLFxuICAgICAgICBzZXZlcml0eTogXCJMb3dcIixcbiAgICAgICAgbGV2ZWw6IFwiT3Bwb3J0dW5pdHkgZm9yIEV4Y2VsbGVuY2VcIixcbiAgICAgICAgZ3JvdXA6IFwiQ2xhcml0eVwiLFxuICAgICAgICBjb21tb25XZWFrbmVzc0VudW1lcmF0aW9uOiBcIjcxMFwiXG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkcgPSBcIlRoZSBleHBvcnRlZCBtb2R1bGUgb3IgaWRlbnRpZmllciBuYW1lIG11c3QgbWF0Y2ggdGhlIGZpbGUgbmFtZS4gRm91bmQ6IFwiO1xuXG4gICAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IEV4cG9ydE5hbWVXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgICB9XG5cbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpmdW5jdGlvbi1uYW1lICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRFeGNlcHRpb25zKG9wdGlvbnMgOiBMaW50LklPcHRpb25zKSA6IHN0cmluZ1tdIHtcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpmdW5jdGlvbi1uYW1lICovXG4gICAgICAgIGlmIChvcHRpb25zLnJ1bGVBcmd1bWVudHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMucnVsZUFyZ3VtZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm4gPHN0cmluZ1tdPjxhbnk+b3B0aW9uczsgLy8gTVNFIHZlcnNpb24gb2YgdHNsaW50IHNvbWVob3cgcmVxdWlyZXMgdGhpc1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4cG9ydE5hbWVXYWxrZXIgZXh0ZW5kcyBFcnJvclRvbGVyYW50V2Fsa2VyIHtcbiAgICBwcm90ZWN0ZWQgdmlzaXRTb3VyY2VGaWxlKG5vZGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcblxuICAgICAgICAvLyBsb29rIGZvciBzaW5nbGUgZXhwb3J0IGFzc2lnbm1lbnQgZnJvbSBmaWxlIGZpcnN0XG4gICAgICAgIGNvbnN0IHNpbmdsZUV4cG9ydDogdHMuU3RhdGVtZW50W10gPSBub2RlLnN0YXRlbWVudHMuZmlsdGVyKChlbGVtZW50OiB0cy5TdGF0ZW1lbnQpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLkV4cG9ydEFzc2lnbm1lbnQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2luZ2xlRXhwb3J0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgZXhwb3J0QXNzaWdubWVudDogdHMuRXhwb3J0QXNzaWdubWVudCA9IDx0cy5FeHBvcnRBc3NpZ25tZW50PnNpbmdsZUV4cG9ydFswXTtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGVFeHBvcnQoZXhwb3J0QXNzaWdubWVudC5leHByZXNzaW9uLmdldFRleHQoKSwgZXhwb3J0QXNzaWdubWVudC5leHByZXNzaW9uKTtcbiAgICAgICAgICAgIHJldHVybjsgLy8gdGhlcmUgaXMgYSBzaW5nbGUgZXhwb3J0IGFuZCBpdCBpcyB2YWxpZCwgc28gZG8gbm90IHByb2NlZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBleHBvcnRlZFRvcExldmVsRWxlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gW107XG5cbiAgICAgICAgLy8gZXhwb3J0cyBhcmUgbm9ybWFsbHkgZGVjbGFyZWQgYXQgdGhlIHRvcCBsZXZlbFxuICAgICAgICBub2RlLnN0YXRlbWVudHMuZm9yRWFjaCgoZWxlbWVudDogdHMuU3RhdGVtZW50KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBleHBvcnRTdGF0ZW1lbnRzOiB0cy5TdGF0ZW1lbnRbXSA9IHRoaXMuZ2V0RXhwb3J0U3RhdGVtZW50cyhlbGVtZW50KTtcbiAgICAgICAgICAgIGV4cG9ydGVkVG9wTGV2ZWxFbGVtZW50cyA9IGV4cG9ydGVkVG9wTGV2ZWxFbGVtZW50cy5jb25jYXQoZXhwb3J0U3RhdGVtZW50cyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGV4cG9ydHMgbWlnaHQgYmUgaGlkZGVuIGluc2lkZSBhIG5hbWVzcGFjZVxuICAgICAgICBpZiAoZXhwb3J0ZWRUb3BMZXZlbEVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbm9kZS5zdGF0ZW1lbnRzLmZvckVhY2goKGVsZW1lbnQ6IHRzLlN0YXRlbWVudCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLk1vZHVsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cG9ydFN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gdGhpcy5nZXRFeHBvcnRTdGF0ZW1lbnRzV2l0aGluTW9kdWxlcygoPHRzLk1vZHVsZURlY2xhcmF0aW9uPmVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0ZWRUb3BMZXZlbEVsZW1lbnRzID0gZXhwb3J0ZWRUb3BMZXZlbEVsZW1lbnRzLmNvbmNhdChleHBvcnRTdGF0ZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbGlkYXRlRXhwb3J0ZWRFbGVtZW50cyhleHBvcnRlZFRvcExldmVsRWxlbWVudHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RXhwb3J0U3RhdGVtZW50c1dpdGhpbk1vZHVsZXMobW9kdWxlRGVjbGFyYXRpb246IHRzLk1vZHVsZURlY2xhcmF0aW9uKTogdHMuU3RhdGVtZW50W10ge1xuICAgICAgICBpZiAobW9kdWxlRGVjbGFyYXRpb24uYm9keS5raW5kID09PSBTeW50YXhLaW5kLmN1cnJlbnQoKS5Nb2R1bGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgLy8gbW9kdWxlcyBtYXkgYmUgbmVzdGVkIHNvIHJlY3VyIGludG8gdGhlIHN0cnVjdHVyZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RXhwb3J0U3RhdGVtZW50c1dpdGhpbk1vZHVsZXMoPHRzLk1vZHVsZURlY2xhcmF0aW9uPm1vZHVsZURlY2xhcmF0aW9uLmJvZHkpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZHVsZURlY2xhcmF0aW9uLmJvZHkua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuTW9kdWxlQmxvY2spIHtcbiAgICAgICAgICAgIGxldCBleHBvcnRTdGF0ZW1lbnRzOiB0cy5TdGF0ZW1lbnRbXSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlQmxvY2s6IHRzLk1vZHVsZUJsb2NrID0gPHRzLk1vZHVsZUJsb2NrPm1vZHVsZURlY2xhcmF0aW9uLmJvZHk7XG4gICAgICAgICAgICBtb2R1bGVCbG9jay5zdGF0ZW1lbnRzLmZvckVhY2goKGVsZW1lbnQ6IHRzLlN0YXRlbWVudCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGV4cG9ydFN0YXRlbWVudHMgPSBleHBvcnRTdGF0ZW1lbnRzLmNvbmNhdCh0aGlzLmdldEV4cG9ydFN0YXRlbWVudHMoZWxlbWVudCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZXhwb3J0U3RhdGVtZW50cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RXhwb3J0U3RhdGVtZW50cyhlbGVtZW50OiB0cy5TdGF0ZW1lbnQpOiB0cy5TdGF0ZW1lbnRbXSB7XG4gICAgICAgIGNvbnN0IGV4cG9ydFN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gW107XG4gICAgICAgIGlmIChlbGVtZW50LmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLkV4cG9ydEFzc2lnbm1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9ydEFzc2lnbm1lbnQ6IHRzLkV4cG9ydEFzc2lnbm1lbnQgPSA8dHMuRXhwb3J0QXNzaWdubWVudD5lbGVtZW50O1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUV4cG9ydChleHBvcnRBc3NpZ25tZW50LmV4cHJlc3Npb24uZ2V0VGV4dCgpLCBleHBvcnRBc3NpZ25tZW50LmV4cHJlc3Npb24pO1xuICAgICAgICB9IGVsc2UgaWYgKEFzdFV0aWxzLmhhc01vZGlmaWVyKGVsZW1lbnQubW9kaWZpZXJzLCBTeW50YXhLaW5kLmN1cnJlbnQoKS5FeHBvcnRLZXl3b3JkKSkge1xuICAgICAgICAgICAgZXhwb3J0U3RhdGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHBvcnRTdGF0ZW1lbnRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgdmFsaWRhdGVFeHBvcnRlZEVsZW1lbnRzKGV4cG9ydGVkRWxlbWVudHM6IHRzLlN0YXRlbWVudFtdKTogdm9pZCB7XG4gICAgICAgIC8vIG9ubHkgdmFsaWRhdGUgdGhlIGV4cG9ydGVkIGVsZW1lbnRzIHdoZW4gYSBzaW5nbGUgZXhwb3J0IHN0YXRlbWVudCBpcyBtYWRlXG4gICAgICAgIGlmIChleHBvcnRlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKGV4cG9ydGVkRWxlbWVudHNbMF0ua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuTW9kdWxlRGVjbGFyYXRpb24gfHxcbiAgICAgICAgICAgICAgICBleHBvcnRlZEVsZW1lbnRzWzBdLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLkNsYXNzRGVjbGFyYXRpb24gfHxcbiAgICAgICAgICAgICAgICBleHBvcnRlZEVsZW1lbnRzWzBdLmtpbmQgPT09IFN5bnRheEtpbmQuY3VycmVudCgpLkZ1bmN0aW9uRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRXhwb3J0KCg8YW55PmV4cG9ydGVkRWxlbWVudHNbMF0pLm5hbWUudGV4dCwgZXhwb3J0ZWRFbGVtZW50c1swXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cG9ydGVkRWxlbWVudHNbMF0ua2luZCA9PT0gU3ludGF4S2luZC5jdXJyZW50KCkuVmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZVN0YXRlbWVudDogdHMuVmFyaWFibGVTdGF0ZW1lbnQgPSA8dHMuVmFyaWFibGVTdGF0ZW1lbnQ+ZXhwb3J0ZWRFbGVtZW50c1swXTtcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgY29tbWEgc2VwYXJhdGVkIHZhcmlhYmxlIGxpc3RzXG4gICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlU3RhdGVtZW50LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb246IHRzLlZhcmlhYmxlRGVjbGFyYXRpb24gPSB2YXJpYWJsZVN0YXRlbWVudC5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRXhwb3J0KCg8YW55PnZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZSkudGV4dCwgdmFyaWFibGVEZWNsYXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUV4cG9ydChleHBvcnRlZE5hbWU6IHN0cmluZywgbm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgICAgICBjb25zdCByZWdleCA6IFJlZ0V4cCA9IG5ldyBSZWdFeHAodGhpcy50b0NhbWVsKGV4cG9ydGVkTmFtZSkgKyBcIlxcLi4qXCIpOyAvLyBmaWxlbmFtZSBtdXN0IGJlIGV4cG9ydGVkIG5hbWUgcGx1cyBhbnkgZXh0ZW5zaW9uXG4gICAgICAgIGlmICghcmVnZXgudGVzdCh0aGlzLmdldEZpbGVuYW1lKCkpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTdXBwcmVzc2VkKGV4cG9ydGVkTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmYWlsdXJlU3RyaW5nID0gUnVsZS5GQUlMVVJFX1NUUklORyArIHRoaXMuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lICsgXCIgYW5kIFwiICsgZXhwb3J0ZWROYW1lO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZhaWx1cmUgPSB0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIGZhaWx1cmVTdHJpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkRmFpbHVyZShmYWlsdXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmlsZW5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSB0aGlzLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcbiAgICAgICAgY29uc3QgbGFzdFNsYXNoID0gZmlsZW5hbWUubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgICBpZiAobGFzdFNsYXNoID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlbmFtZS5zdWJzdHJpbmcobGFzdFNsYXNoICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbGVuYW1lO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNTdXBwcmVzc2VkKGV4cG9ydGVkTmFtZTogc3RyaW5nKSA6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBhbGxFeGNlcHRpb25zIDogc3RyaW5nW10gPSBSdWxlLmdldEV4Y2VwdGlvbnModGhpcy5nZXRPcHRpb25zKCkpO1xuXG4gICAgICAgIHJldHVybiBVdGlscy5leGlzdHMoYWxsRXhjZXB0aW9ucywgKGV4Y2VwdGlvbjogc3RyaW5nKSA6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoZXhjZXB0aW9uKS50ZXN0KGV4cG9ydGVkTmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9DYW1lbChtb2R1bGU6IHN0cmluZykgOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbW9kdWxlLnN1YnN0cigwLCAxKS50b0xvd2VyQ2FzZSgpICsgbW9kdWxlLnN1YnN0cigxKTtcbiAgICB9XG59Il19