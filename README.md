# 🧪 testgenie

AI-powered test generator that scans your codebase or git changes and generates comprehensive test cases using AI. Perfect for CI/CD workflows and development efficiency.

## ✨ Features

- 🤖 **AI-Powered**: Generate realistic, comprehensive tests using Google Gemini
- 🔄 **Git Integration**: Generate tests only for changed code (perfect for CI/CD)
- 📁 **Multi-Framework**: Support for Jest, Vitest, and Mocha
- 🎨 **Multiple Styles**: BDD, TDD, minimal, and verbose test styles
- 🔍 **Smart Parsing**: AST-based code analysis for accurate function detection
- ⚡ **Fast & Efficient**: Built with Bun for maximum performance

## 🚀 Installation

```bash
# Install globally with Bun (recommended)
bun install -g testgenie

# Or install with npm
npm install -g testgenie
```

## 🔧 Setup

Set your Google AI API key:

```bash
export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key-here"
```

Get your API key at: https://aistudio.google.com/app/apikey

## ⚡ Quick Start

```bash
# Generate tests for a specific file
testgenie gen src/utils/calculator.js

# Generate tests for uncommitted changes
testgenie gen --diff

# Generate tests for changes since specific time
testgenie gen --since="2 hours ago"

# Scan and analyze git changes
testgenie scan --diff
```

## 📋 Commands

### `testgenie gen [file]`

Generate AI-powered tests for a specific file or git changes.

**Options:**

- `--framework, -f`: Testing framework (jest, vitest, mocha) - default: jest
- `--style, -s`: Test style (bdd, tdd, minimal, verbose) - default: bdd
- `--diff, -d`: Generate tests for git diff changes
- `--since`: Generate tests for changes since specific time

**Examples:**

```bash
# Single file generation
testgenie gen src/auth.js --framework jest --style bdd

# Generate tests for git changes
testgenie gen --diff
testgenie gen --since="1 hour ago"
testgenie gen --diff --framework vitest --style tdd
```

### `testgenie scan [path]`

Scan and analyze codebase or git changes without generating tests.

**Options:**

- `--diff, -d`: Scan git diff instead of all files
- `--since`: Scan changes since specific time

**Examples:**

```bash
# Scan directory
testgenie scan src/

# Analyze git changes
testgenie scan --diff
testgenie scan --since="2 hours ago"
```

### `testgenie audit [path]` _(Coming Soon)_

Audit test coverage and suggest improvements.

### `testgenie init` _(Coming Soon)_

Initialize testgenie configuration file.

## 🎯 Git Workflow Integration

Perfect for modern development workflows:

```bash
# Pre-commit hook - generate tests for staged changes
testgenie gen --diff

# CI/CD pipeline - test coverage for PR changes
testgenie gen --since="24 hours ago"

# Daily development - quick analysis of recent work
testgenie scan --since="1 hour ago"
```

## 🧪 Generated Test Features

- **Comprehensive Coverage**: Happy path, edge cases, error handling
- **Smart Mocking**: Automatic mocking of dependencies and external calls
- **Async Support**: Proper handling of promises and async functions
- **TypeScript Ready**: Full TypeScript support with proper typing
- **Framework Best Practices**: Uses framework-specific conventions and utilities

## 🛠️ Development

```bash
# Clone and install
git clone https://github.com/LouayHouimli/testgenie.git
cd testgenie
bun install

# Build for production
bun run build

# Type checking
bun run type-check
```

## 📁 Project Structure

```
testgenie/
├── src/
│   ├── cli/           # CLI commands and interface
│   ├── core/          # Core business logic
│   │   ├── ai/        # AI test generation
│   │   ├── git/       # Git operations
│   │   └── parser/    # Code parsing and AST
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── __tests__/         # Generated tests go here
└── examples/          # Example source files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Testgenie
