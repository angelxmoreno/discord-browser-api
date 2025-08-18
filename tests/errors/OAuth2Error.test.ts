import { expect, test } from 'bun:test';
import { OAuth2Error } from '../../src/errors';

test('OAuth2Error should be an instance of Error', () => {
    const error = new OAuth2Error('invalid_request', 'Missing required parameter');
    expect(error).toBeInstanceOf(Error);
});

test('OAuth2Error should have correct properties', () => {
    const errorName = 'invalid_request';
    const errorDescription = 'Missing required parameter';
    const error = new OAuth2Error(errorName, errorDescription);

    expect(error.error).toBe(errorName);
    expect(error.errorDescription).toBe(errorDescription);
    expect(error.name).toBe('OAuth2Error');
    expect(error.message).toBe(`OAuth2 Error: ${errorName} - ${errorDescription}`);
});

test('OAuth2Error should handle missing description', () => {
    const errorName = 'invalid_request';
    const error = new OAuth2Error(errorName);

    expect(error.error).toBe(errorName);
    expect(error.errorDescription).toBeUndefined();
    expect(error.name).toBe('OAuth2Error');
    expect(error.message).toBe(`OAuth2 Error: ${errorName}`);
});
