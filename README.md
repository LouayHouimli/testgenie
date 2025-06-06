# 🧪 Testgenie

AI-powered test generator that scans your codebase or git changes and generates comprehensive test cases using AI. Perfect for CI/CD workflows and development efficiency.

## ✨ Features

- 🤖 **AI-Powered**: Generate realistic, comprehensive tests using Google Gemini
- 🔄 **Git Integration**: Generate tests only for changed code (perfect for CI/CD)
- 📁 **Multi-Framework**: Auto-detect and support Jest, Vitest, and Mocha
- 🎨 **Multiple Styles**: BDD, TDD, minimal, and verbose test styles
- ⚛️ **React Support**: Enhanced React Testing Library integration with component/hook patterns
- 🎯 **Pattern Detection**: Smart detection of function types (API, async, React components, etc.)
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

- `--framework, -f`: Testing framework (jest, vitest, mocha) - auto-detected from package.json
- `--style, -s`: Test style (bdd, tdd, minimal, verbose) - default: bdd
- `--diff, -d`: Generate tests for git diff changes
- `--since`: Generate tests for changes since specific time

**Test Styles:**

- **BDD**: Behavior-driven with descriptive `describe('when X', () => { it('should Y') })` patterns
- **TDD**: Test-driven development with RED-GREEN-REFACTOR phases and comments
- **Minimal**: Concise tests focused on core functionality and basic edge cases
- **Verbose**: Comprehensive tests with detailed documentation, performance tests, and extensive coverage

**Examples:**

```bash
# Single file generation with style options
testgenie gen src/auth.js --style bdd
testgenie gen src/components/Button.jsx --style verbose

# Framework-specific generation (auto-detected)
testgenie gen src/api/users.js --framework vitest --style tdd

# Generate tests for git changes
testgenie gen --diff
testgenie gen --since="1 hour ago"
testgenie gen --diff --style minimal

# React component testing
testgenie gen src/components/Counter.jsx --style verbose
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

## 🧠 Smart Pattern Detection

TestGenie automatically detects function patterns and generates appropriate tests:

| Pattern              | Detection                    | Generated Tests Include                         |
| -------------------- | ---------------------------- | ----------------------------------------------- |
| **React Component**  | JSX return, React hooks      | RTL rendering, props testing, user interactions |
| **React Hook**       | `use*` functions, hook calls | `renderHook()`, state testing, effect cleanup   |
| **API Function**     | `fetch()`, HTTP calls        | Request mocking, status codes, error scenarios  |
| **Async Function**   | `async/await`, Promises      | Promise resolution/rejection, timeout handling  |
| **Event Handler**    | Event parameters, DOM APIs   | Event mocking, `preventDefault()`, delegation   |
| **Utility Function** | Pure functions, calculations | Input validation, edge cases, return values     |

## 🧪 Generated Test Features

### 🎯 **Pattern-Aware Testing**

- **React Components**: RTL best practices with `render()`, `screen` queries, and `fireEvent`
- **React Hooks**: Custom hook testing with `renderHook()` and `act()`
- **API Functions**: HTTP mocking, status codes, network error simulation
- **Async Functions**: Promise resolution/rejection, timeout handling
- **Event Handlers**: DOM event mocking with `preventDefault()` and delegation
- **Utility Functions**: Pure function testing with comprehensive edge cases

### 🔧 **Smart Test Generation**

- **Comprehensive Coverage**: Happy path, edge cases, error handling
- **Auto-Framework Detection**: Detects Jest/Vitest/Mocha from package.json
- **Smart Mocking**: Framework-specific mocking (`jest.fn()`, `vi.fn()`, `sinon.stub()`)
- **React Testing Library**: Auto-detects RTL and includes proper imports
- **Async Support**: Proper handling of promises and async functions
- **TypeScript Ready**: Full TypeScript support with proper typing

### 🎨 **Style-Specific Output**

- **BDD Style**: Behavior-driven tests that read like specifications
- **TDD Style**: Test-driven development with RED-GREEN-REFACTOR phases
- **Minimal Style**: Focused, essential tests for quick validation
- **Verbose Style**: Comprehensive tests with documentation and performance testing

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
│   │   ├── ai/        # AI test generation with Gemini
│   │   ├── framework/ # Framework detection (Jest/Vitest/Mocha)
│   │   ├── git/       # Git operations and diff analysis
│   │   ├── parser/    # AST-based code parsing
│   │   ├── styles/    # Test style engine (BDD/TDD/minimal/verbose)
│   │   └── templates/ # Pattern detection and templates
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── __tests__/         # Generated tests go here
└── examples/          # Example source files
```

## 🌟 Examples

### React Component Testing

```javascript
// Input: React component with hooks
export const Counter = ({ initialValue = 0, onCountChange }) => {
  const [count, setCount] = useState(initialValue);
  // ... component logic
};

// Generated test (verbose style):
describe("Counter Component", () => {
  let onCountChangeMock;

  beforeEach(() => {
    onCountChangeMock = jest.fn();
  });

  it("should render initial value", () => {
    render(<Counter initialValue={5} onCountChange={onCountChangeMock} />);
    expect(screen.getByRole("main")).toHaveTextContent("Counter: 5");
  });

  it("should increment count", () => {
    render(<Counter onCountChange={onCountChangeMock} />);
    fireEvent.click(screen.getByLabelText("Increment counter"));
    expect(screen.getByRole("main")).toHaveTextContent("Counter: 1");
    expect(onCountChangeMock).toHaveBeenCalledWith(1);
  });
  // ... more comprehensive tests
});
```

### API Function Testing

```javascript
// Input: Async API function
export async function fetchUserData(userId) {
  if (!userId) throw new Error("User ID is required");
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

// Generated test (BDD style):
describe("fetchUserData", () => {
  describe("when making a request", () => {
    it("should return the expected data", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 1, name: "Test User" }),
      };
      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const data = await fetchUserData(1);
      expect(data).toEqual({ id: 1, name: "Test User" });
      expect(fetch).toHaveBeenCalledWith("/api/users/1");
    });
  });
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Testgenie
