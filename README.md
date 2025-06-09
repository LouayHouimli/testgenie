# 🧪 TestGenie AI

**AI-powered CLI test generator that creates comprehensive test suites for your JavaScript/TypeScript projects in seconds.**

Generate high-quality, maintainable test files using advanced AI models. TestGenie analyzes your code structure, detects patterns, and creates thorough test coverage automatically.

## ✨ Features

- 🤖 **AI-Powered Generation**: Creates comprehensive test suites using multiple AI providers
- 🎯 **Smart Code Analysis**: Automatically detects functions, patterns, and dependencies
- 📊 **Test Coverage Analysis**: Scans projects and identifies untested code
- 🔄 **Git Integration**: Generate tests for changed files or specific commits
- ⚡ **Framework Support**: Jest (Mocha and Vitest coming soon!)
- 🎨 **Multiple Test Styles**: BDD, TDD, minimal, and verbose options
- 🌐 **Multi-Provider AI**: OpenAI, Google Gemini, Anthropic Claude, or TestGenie API
- 📁 **Flexible Configuration**: Customize test directories, patterns, and coverage thresholds

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

### `testgenie config`

Display current configuration.

**Example:**

```bash
testgenie config
```

## 🧪 Test Framework

### Jest (Currently Supported)

TestGenie generates Jest-compatible test files with:

- Modern ES6+ syntax and imports
- Comprehensive mocking strategies
- Async/await support
- TypeScript compatibility
- React Testing Library integration

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

- **Node.js**: 16+
- **Package Manager**: npm, yarn, pnpm, or bun
- **Git**: For diff-based generation (optional)
- **Test Framework**: Jest (Mocha/Vitest coming soon)

### Required Dependencies

TestGenie will check and prompt you to install required dependencies:

**For JavaScript projects:**

```bash
npm install --save-dev jest @jest/globals
```

**For TypeScript projects:**

```bash
npm install --save-dev jest @jest/globals @types/jest ts-jest
```

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
