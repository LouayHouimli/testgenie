import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  ParsedFunction,
} from "../../types/index.ts";
import type { FrameworkConfig } from "../framework/index.ts";
import { readFile } from "fs-extra";

export class AITestGenerator {
  private model = google("gemini-1.5-flash");

  async generateTests(
    request: AIGenerationRequest
  ): Promise<AIGenerationResponse> {
    const sourceCode = await readFile(request.filePath, "utf-8");

    const { FrameworkDetector } = await import("../framework/index.ts");
    const detector = new FrameworkDetector();

    const frameworkConfig = await detector.detectFramework();
    const hasReact = await detector.hasReact();
    const hasReactTestingLibrary = await detector.hasReactTestingLibrary();
    const reactTestingConfig = await detector.getReactTestingConfig();

    const { TestTemplateEngine } = await import("../templates/index.ts");
    const { TestStyleEngine } = await import("../styles/index.ts");
    const templateEngine = new TestTemplateEngine();
    const styleEngine = new TestStyleEngine();

    const prompt = this.buildPrompt(
      sourceCode,
      request.functions,
      frameworkConfig,
      request.style,
      { hasReact, hasReactTestingLibrary, reactTestingConfig },
      templateEngine,
      styleEngine
    );

    const result = await generateText({
      model: this.model as any,
      prompt,
      maxTokens: 2500,
    });

    return {
      testCode: result.text,
      testsGenerated: request.functions.length,
      framework: frameworkConfig.name,
    };
  }

  private buildPrompt(
    sourceCode: string,
    functions: ParsedFunction[],
    frameworkConfig: FrameworkConfig,
    style: string,
    context: {
      hasReact: boolean;
      hasReactTestingLibrary: boolean;
      reactTestingConfig: {
        hasRTL: boolean;
        hasUserEvent: boolean;
        hasReactHooks: boolean;
        imports: string[];
        utilities: string[];
      };
    },
    templateEngine: any,
    styleEngine: any
  ): string {
    const functionList = functions
      .map((f) => {
        const template = templateEngine.detectPattern(f, sourceCode);
        return `- ${f.name}(${f.params.join(", ")})${
          f.isAsync ? " (async)" : ""
        }${f.isExported ? " (exported)" : ""} at line ${
          f.startLine
        } [pattern: ${template.name}]`;
      })
      .join("\n");

    const styleGuide = styleEngine.getStyleInstructions(style);
    const frameworkGuide = this.getFrameworkGuide(frameworkConfig, context);

    return `You are an expert software testing engineer. Generate comprehensive, production-ready ${
      frameworkConfig.name
    } tests for the provided code.

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
- Use ${frameworkConfig.name} mocking utilities (${
      frameworkConfig.mocks.function
    }, ${frameworkConfig.mocks.module}, etc.)
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

## PATTERN-SPECIFIC REQUIREMENTS:
${this.getPatternInstructions(functions, templateEngine, sourceCode)}

## OUTPUT REQUIREMENTS:
- Generate ONLY clean, executable test code
- NO explanatory comments or documentation about the test structure
- NO meta-commentary about what the tests include
- ONLY include necessary imports and actual test cases
- Focus on code quality and comprehensive coverage
- Use pattern-specific test structures when appropriate

Generate a complete, well-structured ${frameworkConfig.name} test file:`;
  }

  private getFrameworkGuide(
    frameworkConfig: FrameworkConfig,
    context: {
      hasReact: boolean;
      hasReactTestingLibrary: boolean;
      reactTestingConfig: {
        hasRTL: boolean;
        hasUserEvent: boolean;
        hasReactHooks: boolean;
        imports: string[];
        utilities: string[];
      };
    }
  ): string {
    const framework = frameworkConfig.name;
    const imports = frameworkConfig.imports.join("\n");

    let guide = "";

    switch (framework.toLowerCase()) {
      case "jest":
        guide = `- Use Jest testing framework with expect() assertions
- Leverage Jest's built-in mocking with ${frameworkConfig.mocks.function}, ${frameworkConfig.mocks.module}
- Use Jest's async testing utilities (resolves, rejects)
- Include proper imports: ${imports}`;
        break;
      case "vitest":
        guide = `- Use Vitest testing framework with expect() assertions
- Leverage Vitest's mocking with ${frameworkConfig.mocks.function}, ${frameworkConfig.mocks.module}
- Use Vitest's async testing utilities
- Include proper imports: ${imports}`;
        break;
      case "mocha":
        guide = `- Use Mocha testing framework with chai assertions
- Structure tests with describe() and it() blocks
- Handle async tests with async/await or done callbacks
- Include proper imports: ${imports}`;
        break;
      default:
        guide = `- Use ${framework} testing framework conventions
- Follow framework-specific best practices
- Include appropriate imports and setup`;
    }

    if (context.hasReact && context.hasReactTestingLibrary) {
      const rtlConfig = context.reactTestingConfig;
      guide += `
- Use React Testing Library for component testing`;

      if (rtlConfig.hasRTL) {
        guide += `
- RTL imports: ${rtlConfig.imports
          .filter((imp) => imp.includes("@testing-library/react"))
          .join(", ")}
- Use screen queries: screen.getByRole, screen.getByText, screen.getByTestId
- Test user interactions with fireEvent and waitFor for async updates
- Clean up with cleanup() in afterEach hooks`;
      }

      if (rtlConfig.hasUserEvent) {
        guide += `
- Use userEvent for more realistic user interactions
- userEvent.click(), userEvent.type(), userEvent.selectOptions()
- Prefer userEvent over fireEvent for user interactions`;
      }

      if (rtlConfig.hasReactHooks) {
        guide += `
- Test custom hooks with renderHook and act
- Use act() for state updates in hook tests
- Test hook dependencies and cleanup effects`;
      }

      guide += `
- Test accessibility with getByRole and proper ARIA attributes
- Use data-testid sparingly, prefer semantic queries
- Test component behavior, not implementation details`;
    } else if (context.hasReact) {
      guide += `
- React components detected - consider adding @testing-library/react for better testing
- Test component props, state, and lifecycle methods
- Mock React hooks and context providers
- Consider shallow rendering for unit tests`;
    }

    return guide;
  }

  private getPatternInstructions(
    functions: ParsedFunction[],
    templateEngine: any,
    sourceCode: string
  ): string {
    const patterns = functions.map((fn) =>
      templateEngine.detectPattern(fn, sourceCode)
    );
    const uniquePatterns = [...new Set(patterns.map((p) => p.name))];

    const instructions = uniquePatterns
      .map((pattern) => {
        switch (pattern) {
          case "react-component":
            return "- Use React Testing Library patterns: render, screen, fireEvent, waitFor\n- Test rendering, props, user interactions, and accessibility\n- Include snapshot testing for UI regression";
          case "react-hook":
            return "- Use @testing-library/react-hooks: renderHook, act\n- Test hook state, effects, and cleanup\n- Test custom hook edge cases and dependencies";
          case "async-function":
            return "- Use async/await patterns with proper error handling\n- Test promise resolution and rejection scenarios\n- Include timeout and race condition tests";
          case "api-function":
            return "- Mock fetch/axios calls with success and error responses\n- Test different HTTP status codes and network failures\n- Verify request parameters and response handling";
          case "event-handler":
            return "- Mock DOM events with preventDefault and stopPropagation\n- Test event delegation and callback invocation\n- Include edge cases for missing or malformed events";
          case "error-boundary":
            return "- Test error throwing and catching mechanisms\n- Use expect().toThrow() for error assertions\n- Test error recovery and fallback scenarios";
          default:
            return "- Use standard testing patterns for utility functions\n- Test pure function behavior and edge cases\n- Include parameter validation and return value verification";
        }
      })
      .join("\n");

    return instructions;
  }

  isConfigured(): boolean {
    return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  }
}
