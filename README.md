# 🧪 testgenie

AI-powered test case generator for your codebase. Generate comprehensive tests from your functions, components, and git changes.

## 🚀 Installation

```bash
# Install globally with Bun
bun install -g testgenie

# Or install with npm
npm install -g testgenie
```

## ⚡ Quick Start

```bash
# Generate tests for a specific file
testgenie gen src/utils/calculator.js

# Scan git changes and generate tests
testgenie scan --diff

# Audit test coverage
testgenie audit

# Initialize configuration
testgenie init
```

## 📋 Commands

### `testgenie gen <file>`

Generate tests for a specific file.

**Options:**

- `--framework, -f`: Testing framework (jest, vitest, mocha) - default: jest
- `--style, -s`: Test style (bdd, tdd, minimal, verbose) - default: bdd

**Example:**

```bash
testgenie gen src/auth.js --framework jest --style bdd
```

### `testgenie scan [path]`

Scan codebase or git changes for test generation.

**Options:**

- `--diff, -d`: Scan git diff instead of all files
- `--since`: Scan changes since specific time

**Examples:**

```bash
testgenie scan src/
testgenie scan --diff
testgenie scan --since "2 hours ago"
```

### `testgenie audit [path]`

Audit test coverage and suggest improvements.

**Options:**

- `--deep`: Perform deep analysis

**Example:**

```bash
testgenie audit --deep
```

### `testgenie init`

Initialize testgenie configuration file.

## 🛠️ Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build for production
bun run build

# Type checking
bun run type-check
```

## 📄 License

MIT © LouLi
