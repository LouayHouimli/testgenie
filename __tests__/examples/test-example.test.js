```javascript
import { jest } from '@jest/globals';
import { calculateTax, formatCurrency } from './your-module'; // Replace './your-module' with the actual path
import fetchUser from './your-module'; // Replace './your-module' with the actual path


describe('Tax Calculation', () => {
  it('should calculate tax correctly for positive amounts', () => {
    expect(calculateTax(100, 0.1)).toBe(10);
    expect(calculateTax(500, 0.2)).toBe(100);
  });

  it('should throw an error for negative amounts', () => {
    expect(() => calculateTax(-100, 0.1)).toThrowError("Amount cannot be negative");
  });

  it('should handle zero amount correctly', () => {
    expect(calculateTax(0, 0.1)).toBe(0);
  });

  it('should handle zero rate correctly', () => {
    expect(calculateTax(100, 0)).toBe(0);
  });

  it('should handle large amounts correctly', () => {
    expect(calculateTax(1000000, 0.25)).toBe(250000);
  });


  it('should handle edge case: rate slightly below 1', () => {
    expect(calculateTax(100, 0.99)).toBeCloseTo(99);
  });

  it('should handle edge case: rate slightly above 0', () => {
    expect(calculateTax(100, 0.01)).toBeCloseTo(1);
  });

});


describe('Currency Formatting', () => {
  it('should format currency correctly with default currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format currency correctly with specified currency', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
  });

  it('should handle zero value', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle large values', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });

  it('should handle negative values', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle invalid currency code gracefully', () => {
    //Intl.NumberFormat might handle this differently depending on the browser/environment.  A more robust test might check the output for a reasonable fallback.
    expect(formatCurrency(1234.56, 'XXX')).toMatch(/1,234\.56/); //Loose match to account for variations
  });
});


describe('User Fetching', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('should fetch user data successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    });

    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'John Doe' });
    expect(mockFetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('should handle fetch errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchUser(1)).rejects.toThrow('Network error');
  });

  it('should handle JSON parsing errors', async () => {
    mockFetch.mockResolvedValueOnce({ json: jest.fn().mockRejectedValueOnce(new Error('JSON parsing error')) });
    await expect(fetchUser(1)).rejects.toThrow('JSON parsing error');
  });

  it('should handle invalid user ID', async () => {
    //  The test itself doesn't directly test for invalid IDs, as the API response handling is what determines the outcome.  A more comprehensive test would involve mocking the API to return an error for invalid IDs.
    mockFetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({}) });
    const user = await fetchUser('invalid');
    expect(user).toEqual({}); // Or a more specific assertion based on the expected API response for invalid IDs.
  });
});

```