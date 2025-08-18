import { afterAll, beforeAll, expect, mock, test } from 'bun:test';
import { OAuth2Scopes } from 'discord-api-types/v10';
import { OAuth2Error } from '../../src/errors';
import { OAuth2Helper } from '../../src/oauth';

// Mock URL and URLSearchParams globally for these tests
const originalURL = global.URL;
const originalURLSearchParams = global.URLSearchParams;

beforeAll(() => {
    global.URL = mock((url: string) => {
        const instance = new originalURL(url);
        return {
            ...instance,
            searchParams: {
                ...instance.searchParams,
                get: mock((key: string) => {
                    if (url.includes('error=access_denied') && key === 'error') return 'access_denied';
                    if (url.includes('error_description=User%20denied') && key === 'error_description')
                        return 'User denied';
                    if (url.includes('code=12345') && key === 'code') return '12345';
                    if (url.includes('state=abc') && key === 'state') return 'abc';
                    return instance.searchParams.get(key);
                }),
            },
            hash: url.includes('#access_token=token123')
                ? '#access_token=token123&token_type=Bearer&expires_in=3600&scope=identify'
                : instance.hash,
        };
    });

    global.URLSearchParams = mock((init?: string | string[][] | Record<string, string> | URLSearchParams) => {
        const instance = new originalURLSearchParams(init);
        return {
            ...instance,
            get: mock((key: string) => {
                if (init && typeof init === 'string') {
                    if (init.includes('access_token=token123') && key === 'access_token') return 'token123';
                    if (init.includes('token_type=Bearer') && key === 'token_type') return 'Bearer';
                    if (init.includes('expires_in=3600') && key === 'expires_in') return '3600';
                    if (init.includes('scope=identify') && key === 'scope') return 'identify';
                    if (init.includes('error=invalid_token') && key === 'error') return 'invalid_token';
                    if (init.includes('error_description=Bad%20token') && key === 'error_description')
                        return 'Bad token';
                }
                return instance.get(key);
            }),
            toString: mock(() => {
                if (typeof init === 'object' && init !== null && !Array.isArray(init)) {
                    const parts = Object.entries(init).map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
                    return parts.join('&');
                }
                return instance.toString();
            }),
        };
    });
});

afterAll(() => {
    global.URL = originalURL;
    global.URLSearchParams = originalURLSearchParams;
});

test('generateAuthUrl should create correct URL', () => {
    const config = {
        clientId: '123456789',
        redirectUri: 'http://localhost/callback',
        scopes: [OAuth2Scopes.Identify, OAuth2Scopes.Guilds],
        state: 'random_state',
    };
    const url = OAuth2Helper.generateAuthUrl(config);
    expect(url).toBe(
        'https://discord.com/oauth2/authorize?response_type=code&client_id=123456789&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&scope=identify%20guilds&state=random_state'
    );
});

test('parseCallbackUrl should extract code and state', () => {
    const url = 'http://localhost/callback?code=12345&state=abc';
    const result = OAuth2Helper.parseCallbackUrl(url);
    expect(result).toEqual({ code: '12345', state: 'abc' });
});

test('parseCallbackUrl should throw OAuth2Error on error param', () => {
    const url = 'http://localhost/callback?error=access_denied&error_description=User%20denied';
    expect(() => OAuth2Helper.parseCallbackUrl(url)).toThrow(OAuth2Error);
    expect(() => OAuth2Helper.parseCallbackUrl(url)).toThrow('OAuth2 Error: access_denied - User denied');
});

test('parseCallbackUrl should throw OAuth2Error if code is missing', () => {
    const url = 'http://localhost/callback?state=abc';
    expect(() => OAuth2Helper.parseCallbackUrl(url)).toThrow(OAuth2Error);
    expect(() => OAuth2Helper.parseCallbackUrl(url)).toThrow(
        'OAuth2 Error: missing_code - Authorization code not found in callback URL'
    );
});

test('parseImplicitCallback should extract token info', () => {
    const url = 'http://localhost/callback#access_token=token123&token_type=Bearer&expires_in=3600&scope=identify';
    const result = OAuth2Helper.parseImplicitCallback(url);
    expect(result).toEqual({
        accessToken: 'token123',
        tokenType: 'Bearer',
        expiresIn: 3600,
        scope: 'identify',
    });
});

test('parseImplicitCallback should throw OAuth2Error on error param', () => {
    const url = 'http://localhost/callback#error=invalid_token&error_description=Bad%20token';
    expect(() => OAuth2Helper.parseImplicitCallback(url)).toThrow(OAuth2Error);
    expect(() => OAuth2Helper.parseImplicitCallback(url)).toThrow('OAuth2 Error: invalid_token - Bad token');
});

test('parseImplicitCallback should throw OAuth2Error if token is missing', () => {
    const url = 'http://localhost/callback#token_type=Bearer';
    expect(() => OAuth2Helper.parseImplicitCallback(url)).toThrow(OAuth2Error);
    expect(() => OAuth2Helper.parseImplicitCallback(url)).toThrow(
        'OAuth2 Error: missing_token - Access token not found in callback URL'
    );
});
