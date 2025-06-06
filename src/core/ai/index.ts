import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  ParsedFunction,
} from "../../types/index.ts";
import { readFile } from "fs-extra";

export class AITestGenerator {
  private model = google("gemini-1.5-flash");

  async generateTests(
    request: AIGenerationRequest
  ): Promise<AIGenerationResponse> {
    const sourceCode = await readFile(request.filePath, "utf-8");

    const prompt = this.buildPrompt(
      sourceCode,
      request.functions,
      request.framework,
      request.style
    );

    const result = await generateText({
      model: this.model as any,
      prompt,
      maxTokens: 2000,
    });

    return {
      testCode: result.text,
      testsGenerated: request.functions.length,
      framework: request.framework,
    };
  }

  private buildPrompt(
    sourceCode: string,
    functions: ParsedFunction[],
    framework: string,
    style: string
  ): string {
    const functionList = functions
      .map(
        (f) =>
          `- ${f.name}(${f.params.join(", ")})${f.isAsync ? " (async)" : ""}${
            f.isExported ? " (exported)" : ""
          } at line ${f.startLine}`
      )
      .join("\n");

    const styleGuide = this.getStyleGuide(style);
    const frameworkGuide = this.getFrameworkGuide(framework);

    return `You are an expert software testing engineer. Generate comprehensive, production-ready ${framework} tests for the provided code.

## TESTING REQUIREMENTS:
${frameworkGuide}
${styleGuide}

## COVERAGE GOALS:
- **Happy Path**: Test normal operation with valid inputs
- **Edge Cases**: Empty arrays, null/undefined values, boundary conditions
- **Error Handling**: Invalid inputs, type mismatches, thrown exceptions
- **Async Operations**: Promise resolution/rejection, callback handling
- **Side Effects**: Function calls, state changes, external dependencies

## MOCKING & DEPENDENCIES:
- Mock external dependencies, APIs, file system operations
- Use ${framework} mocking utilities (jest.mock, vi.mock, etc.)
- Mock async operations and timers when needed
- Avoid testing implementation details, focus on behavior

## TEST ORGANIZATION:
- Group related tests in logical describe/suite blocks
- Use descriptive test names that explain the scenario
- Follow AAA pattern: Arrange, Act, Assert
- Include setup and teardown when needed

## CODE QUALITY:
- Generate realistic, varied test data
- Use proper assertions and matchers
- Handle both sync and async functions appropriately
- Include proper TypeScript types if the source uses TypeScript

SOURCE CODE TO TEST:
\`\`\`javascript
${sourceCode}
\`\`\`

FUNCTIONS IDENTIFIED:
${functionList}

## OUTPUT REQUIREMENTS:
- Generate ONLY clean, executable test code
- NO explanatory comments or documentation about the test structure
- NO meta-commentary about what the tests include
- ONLY include necessary imports and actual test cases
- Focus on code quality and comprehensive coverage

Generate a complete, well-structured ${framework} test file:`;
  }

  private getStyleGuide(style: string): string {
    switch (style) {
      case "bdd":
        return "- Use BDD style with describe() and it() blocks\n- Write tests that read like specifications\n- Use nested describe blocks for logical grouping";
      case "tdd":
        return "- Use TDD style with suite() and test() blocks\n- Focus on test-driven development patterns\n- Emphasize quick feedback loops";
      default:
        return "- Keep tests concise but comprehensive\n- Use clear, descriptive test names\n- Balance readability with maintainability";
    }
  }

  private getFrameworkGuide(framework: string): string {
    switch (framework.toLowerCase()) {
      case "jest":
        return "- Use Jest testing framework with expect() assertions\n- Leverage Jest's built-in mocking with jest.fn(), jest.mock()\n- Use Jest's async testing utilities (resolves, rejects)\n- Include proper imports: import { jest } from '@jest/globals' if needed";
      case "vitest":
        return "- Use Vitest testing framework with expect() assertions\n- Leverage Vitest's mocking with vi.fn(), vi.mock()\n- Use Vitest's async testing utilities\n- Include proper imports: import { vi, describe, it, expect } from 'vitest'";
      case "mocha":
        return "- Use Mocha testing framework with chai assertions\n- Structure tests with describe() and it() blocks\n- Handle async tests with async/await or done callbacks\n- Include proper imports: import { expect } from 'chai'";
      default:
        return `- Use ${framework} testing framework conventions\n- Follow framework-specific best practices\n- Include appropriate imports and setup`;
    }
  }

  isConfigured(): boolean {
    return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  }
}
