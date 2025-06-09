import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { calculateTax, formatCurrency, testFunction, addTask, testFunction2, testFunction3, testFunction4 } from "../../examples/test-example";
import fetchUser from "../../examples/test-example";

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('calculateTax', () => {
  it('should calculate tax correctly for positive amounts', () => {
    expect(calculateTax(100, 0.1)).toBe(10);
    expect(calculateTax(200, 0.2)).toBe(40);
  });

  it('should throw an error for negative amounts', () => {
    expect(() => calculateTax(-100, 0.1)).toThrow('Amount cannot be negative');
  });

  it('should handle zero amount', () => {
    expect(calculateTax(0, 0.1)).toBe(0);
  });

  it('should handle zero rate', () => {
    expect(calculateTax(100, 0)).toBe(0);
  });
});

describe('formatCurrency', () => {
  it('should format currency correctly with default USD', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('should format currency correctly with specified currency', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
  });

  it('should handle zero value', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative values', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000.00');
  });
});

describe('fetchUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should fetch user data successfully', async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }) };
    global.fetch.mockResolvedValue(mockResponse);

    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'John Doe' });
    expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('should handle fetch errors', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    await expect(fetchUser(1)).rejects.toThrow('Network error');
  });
});

describe('testFunction', () => {
  it('should return "hello world"', () => {
    expect(testFunction()).toBe('hello world');
  });
});

describe('addTask', () => {
  it('should return the task passed to it', () => {
    const task = { id: 1, title: 'Test Task' };
    expect(addTask(task)).toEqual(task);
  });

  it('should handle empty object', () => {
    expect(addTask({})).toEqual({});
  });

  it('should handle null input', () => {
    expect(addTask(null)).toBeNull();
  });
});

describe('testFunction2', () => {
  it('should return "hello world 2"', () => {
    expect(testFunction2()).toBe('hello world 2');
  });
});

describe('testFunction3', () => {
  it('should return "hello world 3"', () => {
    expect(testFunction3()).toBe('hello world 3');
  });
});

describe('testFunction4', () => {
  it('should return "hello world 4"', () => {
    expect(testFunction4()).toBe('hello world 4');
  });
});