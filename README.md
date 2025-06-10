# 🧪 TestGenie AI

![npm](https://img.shields.io/npm/v/testgenie-ai)
![license](https://img.shields.io/npm/l/testgenie-ai)
![downloads](https://img.shields.io/npm/dw/testgenie-ai)

**AI-powered CLI test generator that creates comprehensive test suites for your JavaScript/TypeScript projects in seconds.**

Generate high-quality, maintainable test files using advanced AI models. TestGenie analyzes your code structure, detects patterns, and creates thorough test coverage automatically.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📋 Commands](#-commands)
- [🧪 Test Framework](#-test-framework)
- [🎨 Test Styles](#-test-styles)
- [🤖 AI Providers](#-ai-providers)
- [⚙️ Configuration](#️-configuration)
- [🔧 Requirements](#-requirements)
- [🎯 Examples](#-examples)
- [❓ FAQ](#-faq)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙋‍♂️ Support](#-support)

## ✨ Features

### 🤖 AI-Powered Intelligence

- **Smart Code Analysis**: Automatically detects functions, patterns, and dependencies
- **Multi-Provider Support**: OpenAI, Google Gemini, Anthropic Claude, or TestGenie API
- **Comprehensive Test Generation**: Creates thorough test suites with edge cases
- **Advanced Async Analysis**: Understands Promise flows, timing, and error handling
- **React Component Intelligence**: Detects JSX/TSX and generates proper React tests
- **Behavioral Understanding**: Analyzes component validation, form logic, and user flows

### ⚡ Developer Experience

- **Lightning Fast**: Generate complete test suites in seconds
- **Multiple Test Styles**: BDD, TDD, minimal, and verbose options
- **Framework Support**: Jest (Mocha and Vitest coming soon!)
- **Git Integration**: Generate tests for changed files or specific commits
- **Automatic Setup**: Auto-installs dependencies and creates Jest configuration
- **React/JSX Support**: Full React Testing Library integration with automatic detection

### 📊 Project Management

- **Test Coverage Analysis**: Scans projects and identifies untested code
- **Flexible Configuration**: Customize test directories, patterns, and coverage thresholds
- **Audit & Recommendations**: Comprehensive coverage reports with actionable insights
- **Test Execution**: Built-in test runner with multiple reporters and coverage options

## 🚀 Quick Start

### Installation

```bash
npm install -g testgenie-ai
# or
yarn global add testgenie-ai
# or
pnpm add -g testgenie-ai
# or
bun add -g testgenie-ai
```

### Initialize Configuration

```bash
testgenie init
```

This interactive setup will configure:

- **Test Framework**: Jest (currently supported)
- **Test Style**: BDD, TDD, minimal, or verbose
- **AI Provider**: Choose from multiple providers
- **Test Directory**: Where to generate test files
- **Coverage Settings**: Minimum coverage thresholds

### Generate Tests

```bash
# Generate tests for a specific file
testgenie gen src/utils/helper.ts

# Generate tests for git changes
testgenie gen --diff

# Generate tests for changes since specific commit
testgenie gen --since HEAD~3
```

### Run Tests

```bash
# Run all tests with automatic setup
testgenie test

# Run tests with coverage report
testgenie test --coverage

# Watch mode for development
testgenie test --watch
```

### Help & Commands

```bash
testgenie --help
```

Get comprehensive help for all available commands and options.

### Complete Workflow

```bash
# 1. Initialize project
testgenie init

# 2. Scan for files needing tests
testgenie scan

# 3. Generate tests for specific files
testgenie gen src/components/Button.tsx

# 4. Auto-generate tests for uncovered files
testgenie audit --fix

# 5. Run tests with automatic setup
testgenie test --coverage

# 6. Continuous development with watch mode
testgenie test --watch
```

---

## 📋 Commands

### `testgenie init`

Initialize or update configuration file.

**Options:**

- `--force, -f`: Overwrite existing configuration

**Example:**

```bash
testgenie init --force
```

### `testgenie gen [file]`

Generate comprehensive test files.

**Arguments:**

- `file`: Specific file to generate tests for

**Options:**

- `--diff, -d`: Generate tests for uncommitted git changes
- `--since, -s <commit>`: Generate tests for changes since commit
- `--style <style>`: Override test style (bdd, tdd, minimal, verbose)
- `--output, -o <dir>`: Override output directory

**Examples:**

```bash
# Generate tests for specific file
testgenie gen src/components/Button.tsx

# Generate tests for all changed files
testgenie gen --diff

# Generate tests since last commit
testgenie gen --since HEAD~1

# Use specific style
testgenie gen src/utils/math.js --style minimal
```

### `testgenie scan [path]`

Analyze project for test coverage and discover files.

**Arguments:**

- `path`: Directory to scan (default: current directory)

**Options:**

- `--output, -o <file>`: Save results to file
- `--format, -f <format>`: Output format (json, csv, text)

**Examples:**

```bash
# Scan current directory
testgenie scan

# Scan specific directory with JSON output
testgenie scan src --format json --output coverage-report.json

# Quick scan of components
testgenie scan src/components
```

### `testgenie audit [path]`

Comprehensive test coverage audit with recommendations.

**Arguments:**

- `path`: Directory to audit (default: current directory)

**Options:**

- `--fix`: Auto-generate tests for uncovered files
- `--format, -f <format>`: Report format (text, json, html)
- `--deep`: Enable deep analysis (file modification times, dependencies)

**Examples:**

```bash
# Basic audit
testgenie audit

# Auto-fix missing tests
testgenie audit --fix

# Deep analysis with JSON report
testgenie audit --deep --format json
```

### `testgenie test [pattern]`

Execute tests in the configured test directory with automatic setup.

**Arguments:**

- `pattern`: Test file pattern to run (optional)

**Options:**

- `--watch, -w`: Watch mode for continuous testing
- `--coverage, -c`: Generate coverage reports
- `--reporter, -r <format>`: Test reporter format (default, json, verbose, minimal)
- `--filter, -f <pattern>`: Filter tests by name pattern
- `--parallel, -p`: Run tests in parallel (default: true)
- `--bail, -b`: Stop on first test failure
- `--silent, -s`: Suppress test output (show only results)
- `--timeout, -t <ms>`: Test timeout in milliseconds (default: 30000)

**Examples:**

```bash
# Run all tests with automatic setup
testgenie test

# Run tests with coverage
testgenie test --coverage

# Run specific test pattern
testgenie test --filter="Calculator"

# Watch mode with verbose output
testgenie test --watch --reporter=verbose

# Run tests in a specific directory
testgenie test src/components

# Minimal output for CI/CD
testgenie test --silent --reporter=minimal
```

**Features:**

- **Automatic Setup**: Detects and installs missing Jest dependencies
- **Smart Configuration**: Creates optimized Jest config for your project type
- **React Support**: Automatically detects and configures React Testing Library
- **Multiple Reporters**: Choose from default, JSON, verbose, or minimal output
- **Pattern Matching**: Run specific tests or test suites

### `testgenie config`

Display current configuration.

**Example:**

```bash
testgenie config
```

## 🧪 Test Framework

### Jest (Currently Supported)

TestGenie provides full Jest integration with automatic setup:

**Test Generation:**

- Modern ES6+ syntax and imports
- Comprehensive mocking strategies
- Async/await support
- TypeScript compatibility
- React Testing Library integration

**Automatic Setup:**

- Detects and installs missing Jest dependencies
- Creates optimized Jest configuration
- Configures TypeScript support when needed
- Sets up React Testing Library for JSX/TSX files
- Configures jsdom environment for React components

**Test Execution:**

- Built-in test runner with `testgenie test`
- Multiple output reporters (default, JSON, verbose, minimal)
- Coverage reporting and analysis
- Watch mode for continuous testing
- Pattern-based test filtering

**Coming Soon:**

- **Mocha**: Traditional Node.js testing framework
- **Vitest**: Fast Vite-native testing framework

## 🎨 Test Styles

Choose from multiple test generation styles:

### BDD (Behavior Driven Development)

```javascript
describe("Calculator", () => {
  describe("when adding numbers", () => {
    it("should return correct sum for positive numbers", () => {
      // test implementation
    });
  });
});
```

### TDD (Test Driven Development)

```javascript
suite("Calculator", () => {
  test("adds positive numbers correctly", () => {
    // test implementation
  });
});
```

### Minimal

```javascript
test("Calculator.add()", () => {
  // concise test implementation
});
```

### Verbose

```javascript
describe("Calculator utility class", () => {
  it("should correctly calculate the sum of two positive integers and return the expected result", () => {
    // detailed test implementation with extensive comments
  });
});
```

## 🤖 AI Providers

### TestGenie API (Recommended)

- **No API key required**
- **Optimized for test generation**
- **Best performance and quality**

```bash
# Set during init or manually
testgenie init
# Select "TestGenie API"
```

### OpenAI (GPT Models)

- **Models**: GPT-4o, GPT-4o-mini, GPT-4-turbo
- **Setup**: Set `OPENAI_API_KEY` environment variable

```bash
export OPENAI_API_KEY="your-api-key"
```

### Google Gemini

- **Models**: Gemini-1.5-Pro, Gemini-1.5-Flash
- **Setup**: Set `GOOGLE_GENERATIVE_AI_API_KEY` environment variable

```bash
export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

### Anthropic Claude

- **Models**: Claude-3.5-Sonnet, Claude-3-Haiku
- **Setup**: Set `ANTHROPIC_API_KEY` environment variable

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

---

## ⚙️ Configuration

TestGenie uses `testgenie.config.js` in your project root:

```javascript
export default {
  // Test framework (Jest only for now)
  framework: "jest",

  // Test generation style
  style: "bdd", // "bdd" | "tdd" | "minimal" | "verbose"

  // Test directory
  testDir: "__tests__",

  // AI provider configuration
  ai: {
    provider: "testgenie-api", // "testgenie-api" | "openai" | "gemini" | "claude"
    model: "auto", // or specific model name
  },

  // File patterns to include
  include: ["src/**/*.{js,ts,jsx,tsx}", "lib/**/*.{js,ts,jsx,tsx}"],

  // File patterns to exclude
  exclude: [
    "**/*.test.{js,ts,jsx,tsx}",
    "**/*.spec.{js,ts,jsx,tsx}",
    "**/node_modules/**",
  ],

  // Coverage settings
  coverage: {
    threshold: 80, // minimum coverage percentage
    includeUntested: true,
  },

  // Git integration
  git: {
    autoCommit: false,
    commitMessage: "test: add generated tests",
  },

  // Output preferences
  output: {
    emojis: true,
    verbose: false,
  },
};
```

## 🔧 Requirements

### System Requirements

| Requirement         | Version                 | Notes                               |
| ------------------- | ----------------------- | ----------------------------------- |
| **Node.js**         | 16+                     | LTS recommended                     |
| **Package Manager** | npm, yarn, pnpm, or bun | Any modern package manager          |
| **Git**             | Any                     | Optional, for diff-based generation |
| **Test Framework**  | Jest                    | Mocha/Vitest coming soon            |

### Required Dependencies

TestGenie automatically detects and installs missing dependencies when you run `testgenie test`:

**For JavaScript projects:**

- `jest`, `@jest/globals`
- `@testing-library/react`, `@testing-library/jest-dom` (for React)
- `jest-environment-jsdom` (for React components)

**For TypeScript projects:**

- `@types/jest`, `ts-jest` (additional to above)

**Manual installation (optional):**

```bash
# JavaScript
npm install --save-dev jest @jest/globals

# TypeScript
npm install --save-dev jest @jest/globals @types/jest ts-jest

# React projects (auto-detected and installed)
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

---

## 🎯 Examples

### Basic Function Testing

```javascript
// src/utils/math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

Generated test:

```javascript
// __tests__/src/utils/math.test.js
import { describe, it, expect } from "@jest/globals";
import { add, multiply } from "../../../src/utils/math.js";

describe("add", () => {
  it("should return correct sum for positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("should handle negative numbers", () => {
    expect(add(-1, 1)).toBe(0);
  });

  it("should handle zero values", () => {
    expect(add(0, 5)).toBe(5);
  });
});

describe("multiply", () => {
  it("should return correct product", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it("should handle zero multiplication", () => {
    expect(multiply(5, 0)).toBe(0);
  });
});
```

### Async Function Testing

```javascript
// Generated test for async functions
describe("fetchUserData", () => {
  it("should fetch user data successfully", async () => {
    const mockUser = { id: 1, name: "John" };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUser),
    });

    const result = await fetchUserData(1);
    expect(result).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith("/api/users/1");
  });
});
```

### React Component Testing

TestGenie automatically detects React components and generates comprehensive tests:

```bash
# Generate tests for React component
testgenie gen src/components/UserForm.tsx

# Run React tests with automatic setup
testgenie test --coverage
```

Generated React test with automatic imports and setup:

```javascript
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { UserForm } from "../../../src/components/UserForm";

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

describe("UserForm", () => {
  it("should submit form with valid data", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "john@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      age: "",
    });
  });
});
```

## ❓ FAQ

### Why are my tests not being generated?

Check that the file path is correct and that it's not excluded in `exclude` patterns in your config. Common issues include:

- **File not found**: Verify the file path exists and is accessible
- **Excluded patterns**: Check your `testgenie.config.js` exclude patterns
- **Unsupported file type**: Ensure the file has a supported extension (`.js`, `.ts`, `.jsx`, `.tsx`)
- **AI provider issues**: Verify your API keys are set correctly for external providers

### How do I run tests after generating them?

TestGenie includes a built-in test runner with automatic setup:

```bash
# Basic test execution
testgenie test

# With coverage reports
testgenie test --coverage

# Watch mode for development
testgenie test --watch --reporter=verbose
```

The test command automatically:

- Detects and installs missing Jest dependencies
- Creates optimized Jest configuration
- Sets up React Testing Library for React projects
- Configures TypeScript support when needed

### Can I use it with Mocha or Vitest?

Mocha and Vitest support is coming soon! Currently, only Jest is supported. We're actively working on expanding framework support:

- **Jest**: ✅ Full support
- **Mocha**: 🚧 Coming soon
- **Vitest**: 🚧 Coming soon

### How do I set up different AI providers?

Each provider requires different setup:

**TestGenie API** (Recommended):

- No setup required
- Best performance for test generation

**OpenAI**:

```bash
export OPENAI_API_KEY="your-api-key"
```

**Google Gemini**:

```bash
export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

**Anthropic Claude**:

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

### What file types are supported?

TestGenie supports:

- **JavaScript**: `.js`, `.jsx`
- **TypeScript**: `.ts`, `.tsx`
- **React Components**: Both JS and TS
- **Node.js modules**: CommonJS and ES modules

### How can I customize test output?

You can customize tests through your `testgenie.config.js`:

```javascript
export default {
  style: "bdd", // or "tdd", "minimal", "verbose"
  testDir: "__tests__", // custom test directory
  output: {
    emojis: true, // enable/disable emojis
    verbose: false, // detailed output
  },
};
```

### Can I generate tests for existing test files?

TestGenie automatically excludes existing test files (`.test.js`, `.spec.js`, etc.) to avoid conflicts. If you want to regenerate tests, either:

1. Delete the existing test file first
2. Use a different output directory with `--output`

### How do I handle TypeScript configurations?

TestGenie automatically detects TypeScript projects and generates appropriate tests. Ensure you have:

```bash
npm install --save-dev @types/jest ts-jest
```

Your `jest.config.js` should include:

```javascript
export default {
  preset: "ts-jest",
  testEnvironment: "node",
};
```

### What's the difference between test styles?

- **BDD**: Descriptive, nested describe/it blocks
- **TDD**: Traditional test/suite structure
- **Minimal**: Concise, straightforward tests
- **Verbose**: Detailed with extensive comments

### How accurate are the generated tests?

TestGenie uses advanced AI models specifically trained for test generation with enhanced behavioral analysis. The AI provides production-ready tests by:

**Code Analysis:**

- Analyzes your code structure, dependencies, and logic flow
- Understands React component validation and form behavior
- Traces async function execution and Promise handling
- Detects DOM interactions and browser API usage

**Test Quality:**

- Generates realistic test scenarios that match actual code behavior
- Includes comprehensive edge cases and error handling
- Follows testing best practices and framework conventions
- Creates proper mocks for FormData, console methods, and DOM elements

**React & Async Expertise:**

- Automatically imports React and React Testing Library for JSX components
- Handles form validation logic and user interaction flows
- Properly mocks browser APIs (window.alert, console.error)
- Understands Promise timing and rejection conditions

While tests are comprehensive and thoroughly analyzed, always review them before committing to ensure they meet your specific requirements.

### Can I contribute or request features?

Absolutely! We welcome contributions and feature requests:

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/testgenie-ai/testgenie/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/testgenie-ai/testgenie/discussions)
- 🤝 **Contributions**: See our Contributing section below

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@testgenie.ai
- 🐛 Issues: [GitHub Issues](https://github.com/testgenie-ai/testgenie/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/testgenie-ai/testgenie/discussions)

---

**Happy Testing! 🧪✨**
