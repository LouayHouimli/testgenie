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
  it('should calculate tax correctly', () => {
    expect(calculateTax(100, 0.1)).toBe(10);
  });
  it('should throw an error for negative amounts', () => {
    expect(() => calculateTax(-100, 0.1)).toThrow("Amount cannot be negative");
  });
});

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });
  it('should format currency with different currency', () => {
    expect(formatCurrency(100, "EUR")).toBe("€100.00");
  });
});

describe('fetchUser', () => {
  it('should fetch user data', async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue({ id: 1, name: "Test User" }) };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: "Test User" });
    expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
  });
  it('should handle fetch errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch user'));
    await expect(fetchUser(1)).rejects.toThrow('Failed to fetch user');
  });
});

describe('testFunction', () => {
  it('should return hello world', () => {
    expect(testFunction()).toBe("hello world");
  });
});

describe('addTask', () => {
  it('should return the task', () => {
    const task = { id: 1, title: 'Test Task' };
    expect(addTask(task)).toBe(task);
  });
});

describe('testFunction2', () => {
  it('should return hello world 2', () => {
    expect(testFunction2()).toBe("hello world 2");
  });
});

describe('testFunction3', () => {
  it('should return hello world 3', () => {
    expect(testFunction3()).toBe("hello world 3");
  });
});

describe('testFunction4', () => {
  it('should return hello world 4', () => {
    expect(testFunction4()).toBe("hello world 4");
  });
});