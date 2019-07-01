import * as ts from "../../node_modules/typescript/lib/typescript";
import * as Lint from "../../node_modules/tslint/lib/index";

import {ErrorTolerantWalker} from "./utils/ErrorTolerantWalker";

/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "the import should not start ./../";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInvalidImportPathsWalker(sourceFile, this.getOptions()));
    }
}

class NoInvalidImportPathsWalker extends ErrorTolerantWalker {
    protected visitImportDeclaration(node: ts.ImportDeclaration) : void {
        if (node.getText().indexOf("\"./../") >= 0) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitImportDeclaration(node);
    }
}