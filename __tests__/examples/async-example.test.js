```javascript
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { fetchUserData, handleSubmit, calculateWithTimeout } from './your-module'; // Replace './your-module' with the actual path

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');


describe('fetchUserData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user data successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    const data = await fetchUserData(1);
    expect(data).toEqual({ id: 1, name: 'John Doe' });
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(fetchUserData()).rejects.toThrow('User ID is required');
  });

  it('should throw an error if the fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    await expect(fetchUserData(1)).rejects.toThrow('Network error');
  });

  it('should throw an error if the response is not ok', async () => {
    const mockResponse = { ok: false, status: 500 };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    await expect(fetchUserData(1)).rejects.toThrow('HTTP error! status: 500');
  });
});


describe('handleSubmit', () => {
  it('should call fetch with correct parameters', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
      target: {
        elements: {
          name: { value: 'John Doe' },
          email: { value: 'john.doe@example.com' },
        },
      },
    };
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    handleSubmit(mockEvent as any);
    expect(mockFetch).toHaveBeenCalledWith('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John Doe', email: 'john.doe@example.com' }),
    });
  });
});


describe('calculateWithTimeout', () => {
  it('should calculate the sum of numbers', async () => {
    const result = await calculateWithTimeout([1, 2, 3]);
    expect(result).toBe(6);
  });

  it('should reject if input is not an array', async () => {
    await expect(calculateWithTimeout(null)).rejects.toThrow('Input must be an array');
  });

  it('should handle an empty array', async () => {
    const result = await calculateWithTimeout([]);
    expect(result).toBe(0);
  });

  it('should handle negative numbers', async () => {
    const result = await calculateWithTimeout([-1, 0, 1]);
    expect(result).toBe(0);
  });
});
```