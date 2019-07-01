import * as ts from "../../node_modules/typescript/lib/typescript";
import * as Lint from "../../node_modules/tslint/lib/index";

import {ErrorTolerantWalker} from "./utils/ErrorTolerantWalker";

/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING: string = "unnecessary semi-colon";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnnecessarySemicolonsWalker(sourceFile, this.getOptions()));
    }
}

class NoUnnecessarySemicolonsWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.getText() === ";") {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        if (node.kind === ts.SyntaxKind.EmptyStatement) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitNode(node);
    }
}