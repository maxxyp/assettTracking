import * as ts from "typescript";
import * as Lint from "tslint/lib/index";

import {SyntaxKind} from "./utils/SyntaxKind";
import {ErrorTolerantWalker} from "./utils/ErrorTolerantWalker";
import {IExtendedMetadata} from "./utils/ExtendedMetadata";

/**
 * Implementation of the no-delete-expression rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: IExtendedMetadata = {
        ruleName: "no-delete-expression",
        type: "maintainability",
        description: "Do not delete expressions. Only properties should be deleted",
        options: null,
        optionsDescription: null,
        typescriptOnly: null,
        issueClass: "SDL",
        issueType: "Error",
        severity: "Critical",
        level: "Mandatory",
        group: "Security"
    };

    public static FAILURE_STRING: string = "Variables should not be deleted: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const noDeleteExpression = new NoDeleteExpression(sourceFile, this.getOptions());
        return this.applyWithWalker(noDeleteExpression);
    }
}

class NoDeleteExpression extends ErrorTolerantWalker {

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        super.visitExpressionStatement(node);
        if (node.expression.kind === SyntaxKind.current().DeleteExpression) {
            // first child is delete keyword, second one is what is being deleted.
            const deletedObject: ts.Node = node.expression.getChildren()[1];
            if (deletedObject != null && deletedObject.kind === SyntaxKind.current().Identifier) {
                this.addNoDeleteFailure(deletedObject);
            }
        }
    }

    public addNoDeleteFailure(deletedObject: ts.Node): void {
        const msg: string = Rule.FAILURE_STRING + deletedObject.getFullText().trim();
        this.addFailure(this.createFailure(deletedObject.getStart(), deletedObject.getWidth(), msg));
    }

}