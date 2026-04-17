import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should add two numbers correctly', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  it('should check array length', () => {
    const array = [1, 2, 3];
    expect(array.length).toBe(3);
  });

  it('should check string equality', () => {
    const text = 'hello world';
    expect(text).toBe('hello world');
  });
});
