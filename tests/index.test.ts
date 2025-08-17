import { expect, test } from 'bun:test';
import { add } from '../src/index';

test('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
});
