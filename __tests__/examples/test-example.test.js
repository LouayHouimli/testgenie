```javascript
import { jest } from '@jest/globals';
import { calculateTax, formatCurrency, testFunction, addTask } from './your-module'; // Replace './your-module' with the actual path

jest.mock('./your-module', () => ({
  __esModule: true,
  default: jest.fn(),
  calculateTax: jest.fn(),
  formatCurrency: jest.fn(),
  testFunction: jest.fn(),
  addTask: jest.fn(),
}));


describe('calculateTax', () => {
  it('should calculate tax correctly for positive amounts', () => {
    expect(calculateTax(100, 0.1)).toBe(10);
  });

  it('should throw an error for negative amounts', () => {
    expect(() => calculateTax(-100, 0.1)).toThrow('Amount cannot be negative');
  });

  it('should handle zero amount', () => {
    expect(calculateTax(0, 0.1)).toBe(0);
  });
});

describe('formatCurrency', () => {
  it('should format currency correctly with default currency', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('should format currency correctly with specified currency', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00');
  });

  it('should handle zero value', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('fetchUser', () => {
  it('should fetch user data successfully', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }) });
    global.fetch = mockFetch;
    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'Test User' });
  });

  it('should handle fetch errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to fetch user'));
    global.fetch = mockFetch;
    await expect(fetchUser(1)).rejects.toThrow('Failed to fetch user');
  });
});

describe('testFunction', () => {
  it('should return hello world', () => {
    expect(testFunction()).toBe('hello world');
  });
});

describe('addTask', () => {
  it('should add a task', () => {
    const task = { id: 1, description: 'Test Task' };
    expect(addTask(task)).toBe(task);
  });

  it('should handle null task', () => {
    expect(addTask(null)).toBe(null);
  });

  it('should handle undefined task', () => {
    expect(addTask(undefined)).toBe(undefined);
  });
});

```
