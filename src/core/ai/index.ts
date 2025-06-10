import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  ParsedFunction,
} from "../../types/index.ts";
import type { FrameworkConfig } from "../framework/index.ts";
import type { TestgenieConfig, AIProvider } from "../../config/index.js";
import { readFile } from "fs-extra";
import { loadConfig } from "../../config/index.js";

export class AITestGenerator {
  private config: TestgenieConfig;

  constructor(config: TestgenieConfig) {
    this.config = config;
  }

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
      request.style || this.config.style,
      { hasReact, hasReactTestingLibrary, reactTestingConfig },
      templateEngine,
      styleEngine,
      request.filePath
    );

    let result;

    try {
      result = await this.generateWithProvider(prompt);
    } catch (error) {
      const fallbackPrompt = this.buildFallbackPrompt(
        sourceCode,
        request.functions,
        frameworkConfig
      );
      result = await this.generateWithProvider(fallbackPrompt);
    }

    const cleanCode = this.stripMarkdownFormatting(result.text);

    return {
      testCode: cleanCode,
      testsGenerated: request.functions.length,
      framework: frameworkConfig.name,
    };
  }

  private async generateWithProvider(prompt: string) {
    const provider = this.config.ai.provider;
    const model = this.getModel();
    const maxTokens = this.config.ai.maxTokens || 4000;
    const temperature = this.config.ai.temperature || 0.7;

    switch (provider) {
      case "testgenie-api":
        return await this.generateWithTestgenieAPI(
          prompt,
          maxTokens,
          temperature
        );

      case "openai":
        return await generateText({
          model: openai(model),
          prompt,
          maxTokens,
          temperature,
        });

      case "gemini":
        return await generateText({
          model: google(model),
          prompt,
          maxTokens,
          temperature,
        });

      case "claude":
        return await generateText({
          model: anthropic(model),
          prompt,
          maxTokens,
          temperature,
        });

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  private async generateWithTestgenieAPI(
    prompt: string,
    maxTokens: number,
    temperature: number
  ) {
    // TODO: Implement testgenie API call when service is ready

    console.warn(
      "⚠️ testgenie-api not yet implemented, falling back to gemini"
    );
    return await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      maxTokens,
      temperature,
    });
  }

  private getModel(): string {
    const provider = this.config.ai.provider;
    const configModel = this.config.ai.model;

    if (configModel && configModel !== "auto") {
      return configModel;
    }

    switch (provider) {
      case "testgenie-api":
        return "auto";
      case "openai":
        return "gpt-4";
      case "gemini":
        return "gemini-1.5-flash";
      case "claude":
        return "claude-3-haiku-20240307";
      default:
        return "auto";
    }
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
    styleEngine: any,
    filePath?: string
  ): string {
    const isTypeScript =
      filePath?.endsWith(".ts") || filePath?.endsWith(".tsx");
    const isReactFile =
      filePath?.endsWith(".jsx") ||
      filePath?.endsWith(".tsx") ||
      sourceCode.includes("import React") ||
      sourceCode.includes("from 'react'") ||
      sourceCode.includes('from "react"') ||
      /<[A-Z]/.test(sourceCode);
    const language = isTypeScript ? "TypeScript" : "JavaScript";
    const fileExtension = isTypeScript ? "ts" : "js";

    const sourceFileRelativePath = filePath
      ? this.calculateSourceImportPath(filePath)
      : "../src/module";
    const configImportPath = filePath
      ? this.calculateConfigImportPath(filePath)
      : "../../config/index.js";

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
    const frameworkGuide = this.getFrameworkGuide(
      frameworkConfig,
      context,
      isReactFile
    );

    return `You are an expert software testing engineer. Generate comprehensive, production-ready ${
      frameworkConfig.name
    } tests for the provided ${language} code with 99% accuracy.

## CRITICAL REQUIREMENTS (MUST FOLLOW EXACTLY):

### FRAMEWORK & IMPORTS:
- Framework: JEST ONLY (Mocha and Vitest coming soon)
- Language: ${language}
- Use Jest imports: import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
${
  isReactFile
    ? `- REQUIRED React imports: import React from 'react';
- REQUIRED React Testing Library: import { render, fireEvent, screen } from '@testing-library/react';
- For JSX components, ALWAYS import React even if not explicitly used in source`
    : ""
}

### IMPORT PATHS (CRITICAL - MUST BE EXACT):
- Source module import: import { [exports] } from "${sourceFileRelativePath}";
- Config import (if needed): import { loadConfig } from "${configImportPath}";
- Use RELATIVE paths from test file location to source file
- NO absolute paths, NO incorrect relative paths

### MOCKING PATTERNS:
- Use jest.mock() for mocking modules
- Use jest.fn() for function mocks
- Use jest.MockedFunction<typeof func> for typed mocks
- Use jest.clearAllMocks() in beforeEach (NOT jest.resetAllMocks)
- Available Jest mock methods: jest.fn(), jest.clearAllMocks(), jest.restoreAllMocks()
- DO NOT use: jest.resetAllMocks(), jest.resetModules(), jest.doMock()

### FRAMEWORK-SPECIFIC SYNTAX RULES:
- Setup: beforeEach(() => { jest.clearAllMocks(); });
- Cleanup: afterEach(() => { jest.restoreAllMocks(); });
- Assertions: expect(value).toBe(), .toEqual(), .toHaveBeenCalled()
- Async tests: Use async/await with expect()
- Mock functions: const mockFn = jest.fn();
- Mock return values: mockFn.mockReturnValue(), mockFn.mockResolvedValue()

### TYPE SAFETY (for TypeScript):
${
  isTypeScript
    ? `- Import and use proper TypeScript types
- Use proper type annotations for mock objects
- Include interface definitions when needed
- Use proper generic types for mocked functions
- ArgumentsCamelCase requires: { _: [], $0: "string", ...otherProps }`
    : `- Use JavaScript syntax throughout
- No TypeScript-specific constructs`
}

### COMMON MISTAKES TO AVOID:
- DO NOT use jest.resetAllMocks() - it doesn't exist
- DO NOT use incorrect import paths like '../src/audit' when file is elsewhere
- DO NOT mix framework syntaxes (Jest vs Mocha vs Vitest)
- DO NOT use process.exit() without mocking it first
- DO NOT create incomplete mock objects missing required properties
- DO NOT use absolute paths in imports
${
  isReactFile
    ? `- DO NOT forget to import React when using JSX syntax
- DO NOT use React Testing Library methods without importing them
- DO NOT forget to mock window.alert if components use it
- DO NOT skip testing component props and callbacks
- DO NOT expect callbacks to be called when component validation prevents it
- DO NOT test form submission without filling required fields first
- DO NOT ignore conditional logic in components (if statements, validation)
- DO NOT test isolated interactions without understanding component flow
- DO NOT assume callbacks fire without reading the component's actual logic
- DO NOT forget to check for preventDefault() that stops default behavior
- DO NOT ignore console.log/console.error calls that happen before throwing
- DO NOT mock FormData with simple objects - use actual HTMLFormElement
- DO NOT assume Promise rejection prevents subsequent code execution
- DO NOT test setTimeout/Promise timing without jest.useFakeTimers()
- DO NOT ignore the order of operations in async functions
- DO NOT mock event.target with plain objects when FormData is used`
    : ""
}

### CODE STYLE REQUIREMENTS:
- NO comments whatsoever in the generated code
- NO explanatory comments about test structure
- NO inline comments explaining what tests do
- Clean code without any comment lines
- Only executable test code

## TESTING REQUIREMENTS:
${frameworkGuide}
${styleGuide}

## MANDATORY: SOURCE CODE ANALYSIS BEFORE TESTING
- **Read and Understand**: Analyze the source code logic thoroughly before writing any tests
- **Identify Conditions**: Find all if statements, validation logic, conditional returns
- **Map User Flows**: Understand realistic user interactions and component responses
- **Validation Logic**: For forms, identify required fields and validation rules
- **Callback Conditions**: Determine when callbacks are called vs prevented/skipped
- **State Dependencies**: Track state changes and their effects on component behavior

## COVERAGE GOALS:
- **Happy Path**: Test normal operation with valid inputs AND proper conditions met
- **Edge Cases**: Empty arrays, null/undefined values, boundary conditions  
- **Error Handling**: Invalid inputs, type mismatches, thrown exceptions
- **Async Operations**: Promise resolution/rejection, callback handling, timing
- **Side Effects**: Function calls, state changes, external dependencies, console logs
- **Conditional Logic**: Test both when conditions are met and when they're not
- **DOM Interactions**: Proper form handling, event mocking, DOM element creation
- **Error Flow**: Both sync throws and async rejections, side effects before errors

## CODE QUALITY REQUIREMENTS:
- Generate realistic, varied test data
- Use proper assertions and matchers
- Handle both sync and async functions appropriately
- Include proper setup and teardown
- Group related tests logically
- Mock external dependencies properly
- Use correct mock cleanup methods

SOURCE CODE TO TEST:
\`\`\`${fileExtension}
${sourceCode}
\`\`\`

FUNCTIONS IDENTIFIED:
${functionList}

## PATTERN-SPECIFIC REQUIREMENTS:
${this.getPatternInstructions(functions, templateEngine, sourceCode)}

## OUTPUT REQUIREMENTS (MANDATORY):
- Generate ONLY clean, executable ${language} test code
- NO markdown code blocks (\`\`\`javascript, \`\`\`typescript, etc.)
- NO explanatory text or documentation
- NO meta-commentary about test structure
- NO comments of any kind in the code
- ONLY include necessary imports and actual test cases
- Use EXACT import paths as specified above
- Use ONLY the Jest methods listed above
- START immediately with import statements
- End with complete test suite
- Ensure 100% syntactic correctness
- Use Jest syntax exclusively
- Follow the exact mocking patterns specified

Generate a complete, syntactically perfect Jest ${language} test file:`;
  }

  private buildFallbackPrompt(
    sourceCode: string,
    functions: ParsedFunction[],
    frameworkConfig: FrameworkConfig
  ): string {
    const functionList = functions
      .map((f) => `- ${f.name}(${f.params.join(", ")})`)
      .join("\n");

    return `Generate ${frameworkConfig.name} tests for these functions:

${functionList}

Source code:
\`\`\`javascript
${sourceCode}
\`\`\`

Requirements:
- Use ${frameworkConfig.name} framework
- Include basic test cases for each function
- Use proper imports and setup
- Generate clean, executable test code only
- NO markdown code blocks (\`\`\`javascript, \`\`\`typescript, etc.)
- Output should be ready to save directly to a .js or .ts file

Generate the test file:`;
  }

  private getFrameworkGuide(
    frameworkConfig: FrameworkConfig,
    context: any,
    isReactFile: boolean = false
  ): string {
    let guide = `- Use Jest testing framework with expect() assertions
- Leverage Jest's mocking with ${frameworkConfig.mocks.function}, ${frameworkConfig.mocks.module}
- Use Jest's async testing utilities
- Import Jest globals: ${frameworkConfig.imports}`;

    if (isReactFile || (context.hasReact && context.hasReactTestingLibrary)) {
      guide += `\n\n### REACT COMPONENT TESTING REQUIREMENTS:
- ALWAYS import React from 'react' at the top of test files
- ALWAYS import { render, fireEvent, screen } from '@testing-library/react'
- Use render() to mount components: const { container } = render(<Component />)
- Use fireEvent for user interactions: fireEvent.click(element)
- Use screen queries when possible: screen.getByRole(), screen.getByTestId()
- Test component props, state changes, and user interactions
- Use data-testid attributes for reliable element selection
- Mock callback functions with jest.fn()
- Test both successful and error scenarios
- Include accessibility testing with roles and labels

### CRITICAL: COMPONENT & FUNCTION BEHAVIOR ANALYSIS
- ANALYZE the source code logic BEFORE writing tests
- UNDERSTAND form validation, conditional rendering, and state management
- For forms: Test ONLY scenarios where onSubmit actually gets called based on validation
- For conditional callbacks: Check if callback has conditions (e.g., if statements, validation)
- For event prevention: Understand when preventDefault() stops default behavior
- Test realistic user flows, not just isolated interactions
- Verify component state changes by checking rendered output
- Mock browser APIs (window.alert, console.log) that components actually use

### CRITICAL: ASYNC FUNCTION ANALYSIS
- TRACE async execution flow: what happens first, second, etc.
- IDENTIFY Promise resolution vs rejection conditions
- CHECK for side effects (console.log, console.error) before throwing
- ANALYZE setTimeout/Promise timing and conditional logic
- VERIFY that error conditions actually stop execution of subsequent code
- UNDERSTAND the difference between sync throws and async Promise.reject()
- LOOK FOR form/DOM APIs that require actual DOM elements (FormData, HTMLElement)

### FORM COMPONENT TESTING PATTERNS:
- Read form validation logic carefully (required fields, conditional submission)
- Test valid form submission with ALL required fields filled
- Test form validation prevents submission with missing required fields
- Test error messages, alerts, or validation feedback
- Test input state changes by checking actual input values
- Use fireEvent.submit on forms, not individual buttons when testing form submission`;

      if (
        context.reactTestingConfig &&
        context.reactTestingConfig.imports.length > 0
      ) {
        guide += `\n- Additional available imports: ${context.reactTestingConfig.imports.join(
          ", "
        )}`;
      }
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

    // Enhanced React component detection
    const hasJSX =
      /<[A-Z]/.test(sourceCode) || /\.jsx?$|\.tsx?$/.test(sourceCode);
    const hasReactImport =
      sourceCode.includes("import React") ||
      sourceCode.includes("from 'react'") ||
      sourceCode.includes('from "react"');

    if (
      (hasJSX || hasReactImport) &&
      !patterns.some((p) => p.name === "react-component")
    ) {
      patterns.push({ name: "react-component", confidence: 0.9 });
    }

    const uniquePatterns = [...new Set(patterns.map((p) => p.name))];

    const instructions = uniquePatterns
      .map((pattern) => {
        switch (pattern) {
          case "react-component":
            return `- CRITICAL: Import React from 'react' - REQUIRED for JSX
- Import { render, fireEvent, screen } from '@testing-library/react'

### STEP 1: ANALYZE COMPONENT LOGIC FIRST
- Read the component source code thoroughly 
- Identify ALL conditional logic (if statements, ternary operators)
- Find form validation rules (required fields, validation functions)
- Locate state management (useState, useEffect dependencies)
- Identify when callbacks are actually called vs prevented
- Look for browser API usage (alert, console, localStorage)

### STEP 2: GENERATE REALISTIC TESTS
- Test component rendering: const { container } = render(<Component />)
- Test props handling: render(<Component prop1="value" prop2={mockFn} />)
- Test user interactions: fireEvent.click(), fireEvent.change(), fireEvent.submit()
- Test callback functions ONLY when they should actually be called
- For forms with validation: Fill ALL required fields before expecting onSubmit
- For conditional callbacks: Test both when callback fires and when it doesn't
- Mock browser APIs that component actually uses: window.alert, console methods
- Test state changes by verifying rendered output changes
- Use data-testid for reliable element selection: screen.getByTestId('element-id')
- Test edge cases: undefined props, null values, empty strings
- Test accessibility: roles, labels, aria attributes

### STEP 3: FORM-SPECIFIC TESTING
- If component has form validation, test submission ONLY with valid data
- Test validation errors/alerts with invalid data (missing required fields)
- Test input value changes with fireEvent.change()
- Use fireEvent.submit on the form element, not buttons
- Check for preventDefault() calls that stop form submission`;
          case "react-hook":
            return "- Use @testing-library/react-hooks: renderHook, act\n- Test hook state, effects, and cleanup\n- Test custom hook edge cases and dependencies";
          case "async-function":
            return `### ASYNC FUNCTION ANALYSIS REQUIRED:
- ANALYZE the actual async flow: what resolves vs what rejects
- CHECK for console.log/console.error calls that happen BEFORE throwing
- IDENTIFY setTimeout/Promise patterns and their timing
- LOOK FOR conditional logic that affects promise resolution

### ASYNC TESTING PATTERNS:
- Use async/await patterns with proper error handling
- Test promise resolution and rejection scenarios
- Mock console methods if function logs before throwing: jest.spyOn(console, 'error').mockImplementation()
- For FormData usage: mock entire HTMLFormElement, not just properties
- For setTimeout/Promise: use jest.useFakeTimers() and jest.advanceTimersByTime()
- Test both sync validation (immediate throws) and async validation (promise rejection)
- Include timeout and race condition tests
- VERIFY that rejection conditions actually prevent execution of subsequent code

### FORM HANDLING SPECIFICS:
- FormData requires actual HTMLFormElement - create proper DOM elements
- Use document.createElement('form') for form tests
- Mock event.target as form element, not object with properties
- Test preventDefault() calls correctly`;
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

  private calculateSourceImportPath(filePath: string): string {
    const path = require("path");

    const sourceModulePath = filePath.replace(/\.(ts|js|tsx|jsx)$/, "");

    const testFilePath = `__tests__/${sourceModulePath}.test`;
    const testDir = path.dirname(testFilePath);
    const relativePath = path.relative(testDir, sourceModulePath);

    return relativePath.replace(/\\/g, "/").replace(/^(?!\.)/, "./");
  }

  private calculateConfigImportPath(filePath: string): string {
    const path = require("path");

    const testFilePath = `__tests__/${filePath.replace(
      /\.(ts|js|tsx|jsx)$/,
      ""
    )}.test`;
    const testDir = path.dirname(testFilePath);
    const configPath = "src/config/index.js";
    const relativePath = path.relative(testDir, configPath);

    return relativePath.replace(/\\/g, "/").replace(/^(?!\.)/, "./");
  }

  private stripMarkdownFormatting(code: string): string {
    let cleaned = code.replace(/^```[\w]*\s*\n/gm, "");
    cleaned = cleaned.replace(/\n```\s*$/gm, "");
    cleaned = cleaned.replace(/^```\s*$/gm, "");

    cleaned = cleaned.replace(/^`{1,2}[\w]*\s*\n/gm, "");
    cleaned = cleaned.replace(/\n`{1,2}\s*$/gm, "");

    cleaned = cleaned.trim();

    return cleaned;
  }

  isConfigured(): boolean {
    const provider = this.config.ai.provider;

    switch (provider) {
      case "testgenie-api":
        return true;

      case "openai":
        return !!process.env.OPENAI_API_KEY;

      case "gemini":
        return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

      case "claude":
        return !!process.env.ANTHROPIC_API_KEY;

      default:
        return false;
    }
  }

  getProviderStatus(): {
    provider: AIProvider;
    configured: boolean;
    message: string;
  } {
    const provider = this.config.ai.provider;
    const configured = this.isConfigured();

    let message = "";

    if (!configured) {
      switch (provider) {
        case "openai":
          message = "Set OPENAI_API_KEY environment variable";
          break;
        case "gemini":
          message = "Set GOOGLE_GENERATIVE_AI_API_KEY environment variable";
          break;
        case "claude":
          message = "Set ANTHROPIC_API_KEY environment variable";
          break;
        default:
          message = "Provider configuration missing";
      }
    } else {
      message = `${provider} is configured and ready`;
    }

    return { provider, configured, message };
  }
}
