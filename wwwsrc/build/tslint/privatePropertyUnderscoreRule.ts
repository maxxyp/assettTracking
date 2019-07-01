import * as ts from "../../node_modules/typescript/lib/typescript";
import * as Lint from "../../node_modules/tslint/lib/index";
import {AbstractRule} from "../../node_modules/tslint/lib/language/rule/abstractRule";
import {RuleWalker} from "../../node_modules/tslint/lib/language/walker/ruleWalker";

export class Rule extends AbstractRule {
    public static FAILURE_STRING_PRIVATE = "private properties must start with an underscore";
    public static FAILURE_STRING_PUBLIC = "public properties must not start with an underscore";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PrivatePropertyUnderscoreWalker(sourceFile, this.getOptions()));
    }
}

class PrivatePropertyUnderscoreWalker extends RuleWalker {
    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {

        if (Lint.hasModifier(
                node.modifiers,
                ts.SyntaxKind.PrivateKeyword
            )) {
            const identifier = <ts.Identifier> node.name;

            const variableName = identifier.text;

            const firstCharacter = variableName.charAt(0);

            if (firstCharacter !== "_") {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_PRIVATE));
            }
        } else if (Lint.hasModifier(
                node.modifiers,
                ts.SyntaxKind.PublicKeyword
            )) {
            const identifier = <ts.Identifier> node.name;

            const variableName = identifier.text;

            const firstCharacter = variableName.charAt(0);

            if (firstCharacter === "_") {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_PUBLIC));
            }
        }
    }
}