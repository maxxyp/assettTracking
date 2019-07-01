import * as ts from "typescript";
import * as Lint from "tslint/lib/index";

import {ErrorTolerantWalker} from "./utils/ErrorTolerantWalker";
import {IExtendedMetadata} from "./utils/ExtendedMetadata";

/**
 * Implementation of the no-function-expression rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: IExtendedMetadata = {
        ruleName: "no-function-expression",
        type: "maintainability",
        description: "Do not use function expressions; use arrow functions (lambdas) instead.",
        options: null,
        optionsDescription: null,
        typescriptOnly: null,
        issueClass: "Non-SDL",
        issueType: "Warning",
        severity: "Important",
        level: "Opportunity for Excellence",
        group: "Clarity",
        commonWeaknessEnumeration: "398, 710"
    };

    public static FAILURE_STRING = "Use arrow function instead of function expression";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFunctionExpressionRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoFunctionExpressionRuleWalker extends ErrorTolerantWalker {
    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        const walker = new SingleFunctionWalker(this.getSourceFile(), this.getOptions());
        node.getChildren().forEach((node1: ts.Node) => {
            walker.walk(node1);
        });
        // function expression that access "this" is allowed
        if (!walker.isAccessingThis) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitFunctionExpression(node);
    }
}

class SingleFunctionWalker extends ErrorTolerantWalker {
    public isAccessingThis: boolean = false;
    protected visitNode(node: ts.Node): void {
        if (node.getText() === "this") {
            this.isAccessingThis = true;
        }
        super.visitNode(node);
    }
    /* tslint:disable:no-empty */
    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        // do not visit inner blocks
    }
    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        // do not visit inner blocks
    }
    /* tslint:enable:no-empty */
}