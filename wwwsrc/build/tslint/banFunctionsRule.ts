import * as ts from "../../node_modules/typescript/lib/typescript";
import {RuleWalker} from "../../node_modules/tslint/lib/language/walker/ruleWalker";
import {AbstractRule} from "../../node_modules/tslint/lib/language/rule/abstractRule";
import {RuleFailure} from "../../node_modules/tslint/lib/language/rule/rule";

export class Rule extends AbstractRule {
    public static FAILURE_STRING_PART = "forbidden function: ";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        const options = this.getOptions();
        const noFunctionWalker = new NoFunctionWalker(sourceFile, this.getOptions());

        for (let option of options.ruleArguments) {
            noFunctionWalker.functions.push(option);
        }
        return this.applyWithWalker(noFunctionWalker);
    }
}

class NoFunctionWalker extends RuleWalker {
    public functions: string[] = [];

    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;
        if (expression.kind === ts.SyntaxKind.Identifier) {
            const expressionName = (<ts.Identifier> expression).text;
            for (let i = 0; i < this.functions.length; i++) {
                if (expressionName === this.functions[i]) {
                    this.addFailure(this.createFailure
                    (expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING_PART + expressionName));
                }
            }
        }

        super.visitCallExpression(node);
    }
}