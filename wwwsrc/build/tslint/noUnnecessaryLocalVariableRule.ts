import * as ts from "typescript";
import * as Lint from "tslint/lib/index";

import {ErrorTolerantWalker} from "./utils/ErrorTolerantWalker";
import {SyntaxKind} from "./utils/SyntaxKind";
import {IExtendedMetadata} from "./utils/ExtendedMetadata";

const FAILURE_STRING: string = "Unnecessary local variable: ";

/**
 * Implementation of the no-unnecessary-local-variable rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: IExtendedMetadata = {
        ruleName: "no-unnecessary-local-variable",
        type: "maintainability",
        description: "Do not declare a variable only to return it from the function on the next line.",
        options: null,
        optionsDescription: null,
        typescriptOnly: null,
        issueClass: "Non-SDL",
        issueType: "Warning",
        severity: "Low",
        level: "Opportunity for Excellence",
        group: "Clarity",
        commonWeaknessEnumeration: "563, 710"
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UnnecessaryLocalVariableRuleWalker(sourceFile, this.getOptions()));
    }
}

class UnnecessaryLocalVariableRuleWalker extends ErrorTolerantWalker {
    protected visitBlock(node: ts.Block): void {
        this.validateStatementArray(node.statements);
        super.visitBlock(node);
    }

    protected visitSourceFile(node: ts.SourceFile): void {
        this.validateStatementArray(node.statements);
        super.visitSourceFile(node);
    }

    protected visitCaseClause(node: ts.CaseClause): void {
        this.validateStatementArray(node.statements);
        super.visitCaseClause(node);
    }

    protected visitDefaultClause(node: ts.DefaultClause): void {
        this.validateStatementArray(node.statements);
        super.visitDefaultClause(node);
    }

    protected visitModuleDeclaration(node: ts.ModuleDeclaration): void {
        if (node.body != null && node.body.kind === SyntaxKind.current().ModuleBlock) {
            this.validateStatementArray((<ts.ModuleBlock>node.body).statements);
        }
        super.visitModuleDeclaration(node);
    }

    private validateStatementArray(statements: ts.NodeArray<ts.Statement>): void {
        if (statements == null || statements.length < 2) {
            return; // one liners are always valid
        }

        const lastStatement = statements[statements.length - 1];
        const nextToLastStatement = statements[statements.length - 2];

        const returnedVariableName: string = this.tryToGetReturnedVariableName(lastStatement);
        const declaredVariableName: string = this.tryToGetDeclaredVariableName(nextToLastStatement);

        if (returnedVariableName != null && declaredVariableName != null) {
            if (returnedVariableName === declaredVariableName) {
                this.addFailure(this.createFailure(nextToLastStatement.getStart(), nextToLastStatement.getWidth(),
                    FAILURE_STRING + returnedVariableName));
            }
        }
    }

    private tryToGetDeclaredVariableName(statement: ts.Statement): string {
        if (statement != null && statement.kind === SyntaxKind.current().VariableStatement) {
            const variableStatement: ts.VariableStatement = <ts.VariableStatement>statement;

            if (variableStatement.declarationList.declarations.length === 1) {
                const declaration: ts.VariableDeclaration = variableStatement.declarationList.declarations[0];
                if (declaration.name != null && declaration.name.kind === SyntaxKind.current().Identifier) {
                    return (<ts.Identifier>declaration.name).text;
                }
            }
        }
        return null;
    }

    private tryToGetReturnedVariableName(statement: ts.Statement): string {
        if (statement != null && statement.kind === SyntaxKind.current().ReturnStatement) {
            const returnStatement: ts.ReturnStatement = <ts.ReturnStatement>statement;
            if (returnStatement.expression != null && returnStatement.expression.kind === SyntaxKind.current().Identifier) {
                return (<ts.Identifier>returnStatement.expression).text;
            }
        }
        return null;
    }
}