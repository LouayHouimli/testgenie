import type { ParsedFunction, FrameworkConfig } from "../../types/index.ts";

export interface TestStyle {
  name: "bdd" | "tdd" | "minimal" | "verbose";
  description: string;
  structure: {
    grouping: string;
    testCase: string;
    setup: string;
    teardown: string;
  };
  generate: (
    fn: ParsedFunction,
    config: FrameworkConfig,
    pattern: string
  ) => string;
}

export class TestStyleEngine {
  private styles: Map<string, TestStyle> = new Map([
    [
      "bdd",
      {
        name: "bdd",
        description:
          "Behavior-Driven Development style with descriptive language",
        structure: {
          grouping: "describe",
          testCase: "it",
          setup: "beforeEach",
          teardown: "afterEach",
        },
        generate: this.generateBDDStyle.bind(this),
      },
    ],
    [
      "tdd",
      {
        name: "tdd",
        description: "Test-Driven Development with red-green-refactor approach",
        structure: {
          grouping: "suite",
          testCase: "test",
          setup: "setup",
          teardown: "teardown",
        },
        generate: this.generateTDDStyle.bind(this),
      },
    ],
    [
      "minimal",
      {
        name: "minimal",
        description: "Minimal, focused tests for quick validation",
        structure: {
          grouping: "describe",
          testCase: "it",
          setup: "",
          teardown: "",
        },
        generate: this.generateMinimalStyle.bind(this),
      },
    ],
    [
      "verbose",
      {
        name: "verbose",
        description:
          "Comprehensive tests with detailed documentation and edge cases",
        structure: {
          grouping: "describe",
          testCase: "it",
          setup: "beforeEach",
          teardown: "afterEach",
        },
        generate: this.generateVerboseStyle.bind(this),
      },
    ],
  ]);

  getStyle(styleName: string): TestStyle {
    return this.styles.get(styleName) || this.styles.get("bdd")!;
  }

  getStyleInstructions(styleName: string): string {
    const style = this.getStyle(styleName);

    switch (style.name) {
      case "bdd":
        return `- Use BDD style: describe('when X', () => { it('should Y', () => {}) })
- Write tests that read like specifications  
- Use nested describe blocks for different scenarios
- Focus on behavior rather than implementation`;

      case "tdd":
        return `- Use TDD approach: RED (failing test) → GREEN (minimal implementation) → REFACTOR
- Write failing tests first, then make them pass
- Use suite() and test() blocks for structure
- Include comments about TDD phases`;

      case "minimal":
        return `- Keep tests concise and focused
- Minimal setup and teardown
- Cover core functionality and basic error cases
- Avoid over-testing implementation details`;

      case "verbose":
        return `- Include comprehensive documentation and comments
- Test all edge cases and boundary conditions
- Add performance and integration tests
- Use detailed assertions with descriptive messages`;

      default:
        return "- Use clear, descriptive test structure";
    }
  }

  private generateBDDStyle(
    fn: ParsedFunction,
    config: FrameworkConfig,
    pattern: string
  ): string {
    return `BDD style template for ${fn.name} with pattern ${pattern}`;
  }

  private generateTDDStyle(
    fn: ParsedFunction,
    config: FrameworkConfig,
    pattern: string
  ): string {
    return `TDD style template for ${fn.name} with pattern ${pattern}`;
  }

  private generateMinimalStyle(
    fn: ParsedFunction,
    config: FrameworkConfig,
    pattern: string
  ): string {
    return `Minimal style template for ${fn.name} with pattern ${pattern}`;
  }

  private generateVerboseStyle(
    fn: ParsedFunction,
    config: FrameworkConfig,
    pattern: string
  ): string {
    return `Verbose style template for ${fn.name} with pattern ${pattern}`;
  }
}
