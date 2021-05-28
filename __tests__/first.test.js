import { test, expect, describe } from '@jest/globals';
import sum from '../bin/firstbin';

describe('test description', () => {
  test('test Sum', () => {
    const actualResult = sum(3, 5);
    expect(actualResult).toEqual(8);
  });
});
