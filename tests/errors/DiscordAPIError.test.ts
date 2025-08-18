import { expect, test } from 'bun:test';
import { DiscordAPIError } from '../../src/errors';

test('DiscordAPIError should be an instance of Error', () => {
    const error = new DiscordAPIError('Test message', 10001, 400, 'GET', '/test');
    expect(error).toBeInstanceOf(Error);
});

test('DiscordAPIError should have correct properties', () => {
    const message = 'Test message';
    const code = 10001;
    const status = 400;
    const method = 'GET';
    const url = '/test';
    const error = new DiscordAPIError(message, code, status, method, url);

    expect(error.message).toBe(message);
    expect(error.name).toBe('DiscordAPIError');
    expect(error.code).toBe(code);
    expect(error.status).toBe(status);
    expect(error.method).toBe(method);
    expect(error.url).toBe(url);
});
