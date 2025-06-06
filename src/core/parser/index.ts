import type { ParsedFile, ParsedFunction } from "../../types/index.js";
import { globby } from "globby";
import { isSourceFile, isTestFile } from "../../utils/index.js";
import { readFile } from "fs-extra";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export class CodeParser {
  async findSourceFiles(directory: string): Promise<string[]> {
    const patterns = [
      `${directory}/**/*.{js,ts,jsx,tsx}`,
      `!${directory}/**/node_modules/**`,
      `!${directory}/**/dist/**`,
      `!${directory}/**/build/**`,
    ];

    const allFiles = await globby(patterns);
    return allFiles.filter((file) => isSourceFile(file));
  }

  async findTestFiles(directory: string): Promise<string[]> {
    const patterns = [
      `${directory}/**/*.{test,spec}.{js,ts,jsx,tsx}`,
      `${directory}/**/__tests__/**/*.{js,ts,jsx,tsx}`,
      `!${directory}/**/node_modules/**`,
    ];

    return await globby(patterns);
  }

  async discoverFiles(
    directory: string
  ): Promise<{ sourceFiles: string[]; testFiles: string[] }> {
    const [sourceFiles, testFiles] = await Promise.all([
      this.findSourceFiles(directory),
      this.findTestFiles(directory),
    ]);

    return { sourceFiles, testFiles };
  }

  async parseFile(filePath: string): Promise<ParsedFile> {
    const content = await readFile(filePath, "utf-8");

    const ast = parse(content, {
      sourceType: "module",
      allowImportExportEverywhere: true,
      plugins: [
        "jsx",
        "typescript",
        "decorators-legacy",
        "classProperties",
        "objectRestSpread",
        "optionalChaining",
        "nullishCoalescingOperator",
      ],
    });

    const functions = this.extractFunctions(ast);
    const imports = this.extractImports(ast);
    const exports = this.extractExports(ast);

    return {
      filePath,
      functions,
      imports,
      exports,
    };
  }

  private extractFunctions(ast: any): ParsedFunction[] {
    const functions: ParsedFunction[] = [];

    (traverse as any).default(ast, {
      FunctionDeclaration(path: any) {
        const node = path.node;
        functions.push({
          name: node.id?.name || "anonymous",
          params: node.params.map((param: any) => param.name || "param"),
          returnType: undefined,
          isAsync: node.async || false,
          isExported:
            path.isStatement() && path.parentPath?.isExportNamedDeclaration(),
          startLine: node.loc?.start.line || 0,
          endLine: node.loc?.end.line || 0,
        });
      },

      ArrowFunctionExpression(path: any) {
        const node = path.node;
        const parent = path.parent;
        let name = "anonymous";

        if (
          parent.type === "VariableDeclarator" &&
          parent.id?.type === "Identifier"
        ) {
          name = parent.id.name;
        }

        functions.push({
          name,
          params: node.params.map((param: any) => param.name || "param"),
          returnType: undefined,
          isAsync: node.async || false,
          isExported: false,
          startLine: node.loc?.start.line || 0,
          endLine: node.loc?.end.line || 0,
        });
      },

      ClassMethod(path: any) {
        const node = path.node;
        if (node.key?.type === "Identifier") {
          functions.push({
            name: node.key.name,
            params: node.params.map((param: any) => param.name || "param"),
            returnType: undefined,
            isAsync: node.async || false,
            isExported: false,
            startLine: node.loc?.start.line || 0,
            endLine: node.loc?.end.line || 0,
          });
        }
      },
    });

    return functions;
  }

  private extractImports(ast: any): string[] {
    const imports: string[] = [];

    (traverse as any).default(ast, {
      ImportDeclaration(path: any) {
        imports.push(path.node.source.value);
      },
    });

    return imports;
  }

  private extractExports(ast: any): string[] {
    const exports: string[] = [];

    (traverse as any).default(ast, {
      ExportNamedDeclaration(path: any) {
        const node = path.node;
        if (
          node.declaration?.type === "FunctionDeclaration" &&
          node.declaration.id?.name
        ) {
          exports.push(node.declaration.id.name);
        }
        if (node.specifiers) {
          node.specifiers.forEach((spec: any) => {
            exports.push(spec.exported.name);
          });
        }
      },

      ExportDefaultDeclaration(path: any) {
        exports.push("default");
      },
    });

    return exports;
  }
}
