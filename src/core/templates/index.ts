import type { ParsedFunction, FrameworkConfig } from "../../types/index.ts";

export interface TestTemplate {
  name: string;
  pattern: RegExp;
  priority: number;
  generate: (fn: ParsedFunction, config: FrameworkConfig) => string;
}

export class TestTemplateEngine {
  private templates: TestTemplate[] = [
    {
      name: "react-component",
      pattern: /^(function|const)\s+[A-Z]\w*.*\{.*return.*<.*>.*\}/s,
      priority: 1,
      generate: this.generateReactComponentTest.bind(this),
    },
    {
      name: "react-hook",
      pattern: /^(function|const)\s+use[A-Z]\w*/,
      priority: 2,
      generate: this.generateReactHookTest.bind(this),
    },
    {
      name: "async-function",
      pattern: /async\s+(function|=>)/,
      priority: 3,
      generate: this.generateAsyncTest.bind(this),
    },
    {
      name: "promise-function",
      pattern: /(Promise\.|\.then\(|\.catch\(|new Promise)/,
      priority: 4,
      generate: this.generatePromiseTest.bind(this),
    },
    {
      name: "api-function",
      pattern: /(fetch\(|axios\.|http\.|request\()/,
      priority: 5,
      generate: this.generateApiTest.bind(this),
    },
    {
      name: "event-handler",
      pattern: /(onClick|onSubmit|onChange|addEventListener)/,
      priority: 6,
      generate: this.generateEventHandlerTest.bind(this),
    },
    {
      name: "error-boundary",
      pattern: /(throw\s+|Error\(|catch\s*\()/,
      priority: 7,
      generate: this.generateErrorTest.bind(this),
    },
    {
      name: "utility-function",
      pattern: /.*/,
      priority: 99,
      generate: this.generateUtilityTest.bind(this),
    },
  ];

  detectPattern(fn: ParsedFunction, sourceCode: string): TestTemplate {
    const fnCode = this.extractFunctionCode(fn, sourceCode);

    return (
      this.templates
        .filter((template) => template.pattern.test(fnCode))
        .sort((a, b) => a.priority - b.priority)[0] ||
      this.templates[this.templates.length - 1]
    );
  }

  private extractFunctionCode(fn: ParsedFunction, sourceCode: string): string {
    const lines = sourceCode.split("\n");
    return lines.slice(fn.startLine - 1, fn.endLine).join("\n");
  }

  private generateReactComponentTest(
    fn: ParsedFunction,
    config: FrameworkConfig
  ): string {
    return `
describe('${fn.name}', () => {
  it('should render without crashing', () => {
    const { container } = render(<${fn.name} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with props', () => {
    const props = { /* mock props */ };
    const { getByRole } = render(<${fn.name} {...props} />);
    expect(getByRole('main')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const mockHandler = ${config.mocks.function};
    const { getByRole } = render(<${fn.name} onClick={mockHandler} />);
    
    fireEvent.click(getByRole('button'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should match snapshot', () => {
    const { container } = render(<${fn.name} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});`;
  }

  private generateReactHookTest(
    fn: ParsedFunction,
    config: FrameworkConfig
  ): string {
    return `
describe('${fn.name}', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => ${fn.name}());
    expect(result.current).toBeDefined();
  });

  it('should handle state updates', () => {
    const { result } = renderHook(() => ${fn.name}());
    
    act(() => {
      // Trigger state update
    });
    
    expect(result.current).toEqual(expect.any(Object));
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => ${fn.name}());
    unmount();
    // Assert cleanup logic
  });
});`;
  }

  private generateAsyncTest(
    fn: ParsedFunction,
    config: FrameworkConfig
  ): string {
    return `
describe('${fn.name}', () => {
  it('should resolve successfully with valid input', async () => {
    const input = /* mock input */;
    const result = await ${fn.name}(${fn.params.join(", ")});
    expect(result).toBeDefined();
  });

  it('should handle async errors gracefully', async () => {
    const invalidInput = /* invalid input */;
    await expect(${fn.name}(invalidInput)).rejects.toThrow();
  });

  it('should timeout after reasonable duration', async () => {
    ${config.mocks.timer}
    const promise = ${fn.name}(/* slow input */);
    
    // Fast-forward timers
    act(() => {
      ${
        config.name === "jest"
          ? "jest.advanceTimersByTime(5000)"
          : "vi.advanceTimersByTime(5000)"
      };
    });
    
    await expect(promise).resolves.toBeDefined();
  });
});`;
  }

  private generatePromiseTest(
    fn: ParsedFunction,
    config: FrameworkConfig
  ): string {
    return `
describe('${fn.name}', () => {
  it('should resolve with expected value', async () => {
    const result = await ${fn.name}(${fn.params.join(", ")});
    expect(result).toEqual(expect.any(Object));
  });

  it('should reject with error for invalid input', async () => {
    const invalidInput = null;
    await expect(${fn.name}(invalidInput)).rejects.toThrow();
  });

  it('should handle promise chaining', async () => {
    const result = await ${fn.name}(/* valid input */)
      .then(data => data)
      .catch(error => error.message);
    
    expect(result).toBeDefined();
  });
});`;
  }

  private generateApiTest(fn: ParsedFunction, config: FrameworkConfig): string {
    return `
describe('${fn.name}', () => {
  beforeEach(() => {
    // Reset API mocks
    ${config.mocks.function}.resetAllMocks();
  });

  it('should make successful API call', async () => {
    const mockResponse = { data: 'test data' };
    global.fetch = ${config.mocks.function}.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await ${fn.name}(${fn.params.join(", ")});
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    global.fetch = ${
      config.mocks.function
    }.mockRejectedValue(new Error('Network error'));
    
    await expect(${fn.name}(/* params */)).rejects.toThrow('Network error');
  });

  it('should handle HTTP error responses', async () => {
    global.fetch = ${config.mocks.function}.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(${fn.name}(/* params */)).rejects.toThrow();
  });
});`;
  }

  private generateEventHandlerTest(
    fn: ParsedFunction,
    config: FrameworkConfig
  ): string {
    return `
describe('${fn.name}', () => {
  it('should handle event correctly', () => {
    const mockEvent = {
      preventDefault: ${config.mocks.function},
      stopPropagation: ${config.mocks.function},
      target: { value: 'test value' },
    };

    ${fn.name}(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle edge cases', () => {
    const edgeCases = [null, undefined, {}];
    
    edgeCases.forEach(eventCase => {
      expect(() => ${fn.name}(eventCase)).not.toThrow();
    });
  });

  it('should call callbacks when provided', () => {
    const mockCallback = ${config.mocks.function};
    const mockEvent = { target: { value: 'test' } };
    
    ${fn.name}(mockEvent, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith('test');
  });
});`;
  }

  private generateErrorTest(
    fn: ParsedFunction,
    config: FrameworkConfig
  ): string {
    return `
describe('${fn.name}', () => {
  it('should handle errors gracefully', () => {
    const invalidInput = /* invalid data */;
    expect(() => ${fn.name}(invalidInput)).toThrow();
  });

  it('should throw specific error types', () => {
    const testCases = [
      { input: null, expectedError: 'TypeError' },
      { input: undefined, expectedError: 'ReferenceError' },
      { input: '', expectedError: 'ValidationError' },
    ];

    testCases.forEach(({ input, expectedError }) => {
      expect(() => ${fn.name}(input)).toThrow(expectedError);
    });
  });

  it('should recover from errors when possible', () => {
    const fallbackValue = 'default';
    const result = ${fn.name}(/* problematic input */, fallbackValue);
    expect(result).toBe(fallbackValue);
  });
});`;
  }

  private generateUtilityTest(
    fn: ParsedFunction,
    config: FrameworkConfig
  ): string {
    return `
describe('${fn.name}', () => {
  it('should return expected output for valid input', () => {
    const input = /* mock valid input */;
    const result = ${fn.name}(${fn.params.join(", ")});
    expect(result).toBeDefined();
  });

  it('should handle edge cases', () => {
    const edgeCases = [null, undefined, '', 0, false, [], {}];
    
    edgeCases.forEach(edgeCase => {
      const result = ${fn.name}(edgeCase);
      expect(result).toBeDefined();
    });
  });

  it('should be pure function (same input, same output)', () => {
    const input = /* consistent input */;
    const result1 = ${fn.name}(input);
    const result2 = ${fn.name}(input);
    expect(result1).toEqual(result2);
  });

  ${
    fn.params.length > 1
      ? `
  it('should handle multiple parameters correctly', () => {
    const result = ${fn.name}(${fn.params.map(() => "/* param */").join(", ")});
    expect(result).toBeDefined();
  });`
      : ""
  }
});`;
  }
}
