import * as ts from "../../node_modules/typescript/lib/typescript";
import * as Lint from "../../node_modules/tslint/lib/index";

import {ErrorTolerantWalker} from "./utils/ErrorTolerantWalker";

/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "the array is not declared correctly it should be Type[] or Array<Type>";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInvalidArrayDelarationsWalker(sourceFile, this.getOptions()));
    }
}

class NoInvalidArrayDelarationsWalker extends ErrorTolerantWalker {
    protected visitVariableDeclaration(node: ts.VariableDeclaration) : void {
        let idx = node.getText().indexOf(": [");

        if (idx >= 0 && idx < node.getText().indexOf("=")) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitVariableDeclaration(node);
    }

    protected visitPropertyDeclaration(node: ts.PropertyDeclaration) : void {
        let idx = node.getText().indexOf(": [");
        if (idx >= 0 && idx < node.getText().indexOf("=")) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitPropertyDeclaration(node);
    }
}