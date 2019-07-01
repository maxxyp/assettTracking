import * as ts from "../../node_modules/typescript/lib/typescript";
import * as Lint from "../../node_modules/tslint/lib/index";

import {ErrorTolerantWalker} from "./utils/ErrorTolerantWalker";

/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static CONSTUCTOR_FAILURE_STRING: string = "the getters/setters should be declared after the constructor";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AccessorAfterConstructorWalker(sourceFile, this.getOptions()));
    }
}

class AccessorAfterConstructorWalker extends ErrorTolerantWalker {
    private _hadSetterGetter: boolean;

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        if (this._hadSetterGetter) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.CONSTUCTOR_FAILURE_STRING));
        }

        super.visitConstructorDeclaration(node);
    }

    protected visitGetAccessor(node: ts.AccessorDeclaration): void {
        this._hadSetterGetter = true;

        super.visitGetAccessor(node);
    }

    protected visitSetAccessor(node: ts.AccessorDeclaration): void {
        this._hadSetterGetter = true;

        super.visitSetAccessor(node);
    }
}