import * as ts from "../../node_modules/typescript/lib/typescript";
import * as Lint from "../../node_modules/tslint/lib/index";
import {AbstractRule} from "../../node_modules/tslint/lib/language/rule/abstractRule";
import {RuleWalker} from "../../node_modules/tslint/lib/language/walker/ruleWalker";

export class Rule extends AbstractRule {
    public static FAILURE_STRING: string = "assignments must not be made on properties, use the constructor";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoPropertyAssignmentsWalker(sourceFile, this.getOptions()));
    }
}

class NoPropertyAssignmentsWalker extends RuleWalker {
    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
            if (node.getText().indexOf("=") >= 0 && node.getText().indexOf("=>") < 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
    }
}