import * as ts from "../../node_modules/typescript/lib/typescript";
import {RuleWalker} from "../../node_modules/tslint/lib/language/walker/ruleWalker";
import {AbstractRule} from "../../node_modules/tslint/lib/language/rule/abstractRule";
import {RuleFailure} from "../../node_modules/tslint/lib/language/rule/rule";

export class Rule extends AbstractRule {
    public static FAILURE_STRING = "method name must be camel case";

    public apply(sourceFile: ts.SourceFile): RuleFailure[] {
        return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
    }
}

class NameWalker extends RuleWalker {
    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        const methodName = node.name.getText();

        if (!this.isCamelCase(methodName)) {
            this.addFailureAt(node.name.getStart(), node.name.getWidth(), Rule.FAILURE_STRING);
        }

        super.visitMethodDeclaration(node);
    }

    private isCamelCase(name: string) {
        return /[a-z]/.test(name.charAt(0));
    }

    public addFailureAt(position: number, width: number, failureString: string) {
        const failure = this.createFailure(position, width, failureString);
        this.addFailure(failure);
    }

}
