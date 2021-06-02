import { test, expect, describe } from '@jest/globals';

describe('test description', () => {
  test('test Sum', () => {
    const actualResult = 3 + 5;
    expect(actualResult).toEqual(8);
  });
});
