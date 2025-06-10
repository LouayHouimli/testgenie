import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { fetchUserData, handleSubmit, calculateWithTimeout } from "../../examples/async-example";

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('fetchUserData', () => {
  it('should fetch user data successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const userData = await fetchUserData(1);
    expect(userData).toEqual({ id: 1, name: 'John Doe' });
    expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('should throw an error if userId is missing', async () => {
    await expect(fetchUserData()).rejects.toThrow('User ID is required');
  });

  it('should throw an error if the request fails', async () => {
    const mockResponse = { ok: false, status: 500 };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(fetchUserData(1)).rejects.toThrow('HTTP error! status: 500');
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe('handleSubmit', () => {
  it('should submit the form data', () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'name';
    input.value = 'John Doe';
    form.appendChild(input);
    const event = { preventDefault: jest.fn(), target: form };
    handleSubmit(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":"John Doe"}',
    });
  });
});


describe('calculateWithTimeout', () => {
  it('should calculate the sum of numbers', async () => {
    const sum = await calculateWithTimeout([1, 2, 3]);
    expect(sum).toBe(6);
  });

  it('should reject if input is not an array', async () => {
    await expect(calculateWithTimeout('not an array')).rejects.toThrow('Input must be an array');
  });

  it('should handle empty array', async () => {
    const sum = await calculateWithTimeout([]);
    expect(sum).toBe(0);
  });
});