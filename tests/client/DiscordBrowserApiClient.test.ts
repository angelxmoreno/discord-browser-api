import { beforeEach, describe, expect, test } from 'bun:test';
import type { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DiscordBrowserApiClient } from '../../src/DiscordBrowserApiClient';
import { ChannelsEndpoints, GuildsEndpoints, UsersEndpoints } from '../../src/endpoints';
import { DiscordAPIError } from '../../src/errors';
import type { BrowserTokenInfo, DiscordBrowserApiClientOptions } from '../../src/types';

// Helper interface to access protected members for testing
interface TestableDiscordBrowserApiClient extends DiscordBrowserApiClient {
    httpClient: AxiosInstance;
    handleResponseError: (error: unknown) => Promise<never>;
}

describe('DiscordBrowserApiClient', () => {
    let client: DiscordBrowserApiClient;
    let mockAdapter: MockAdapter;

    beforeEach(() => {
        client = new DiscordBrowserApiClient();
        mockAdapter = new MockAdapter((client as TestableDiscordBrowserApiClient).httpClient);
    });

    describe('constructor', () => {
        test('should create client with default options', () => {
            const defaultClient = new DiscordBrowserApiClient();
            expect(defaultClient).toBeInstanceOf(DiscordBrowserApiClient);
            expect(defaultClient.users).toBeInstanceOf(UsersEndpoints);
            expect(defaultClient.guilds).toBeInstanceOf(GuildsEndpoints);
            expect(defaultClient.channels).toBeInstanceOf(ChannelsEndpoints);
        });

        test('should create client with custom options', () => {
            const options: DiscordBrowserApiClientOptions = {
                baseURL: 'https://custom.api.com',
                timeout: 5000,
                version: 'v9',
            };
            const customClient = new DiscordBrowserApiClient(options);
            expect(customClient).toBeInstanceOf(DiscordBrowserApiClient);
        });

        test('should initialize endpoint categories', () => {
            expect(client.users).toBeInstanceOf(UsersEndpoints);
            expect(client.guilds).toBeInstanceOf(GuildsEndpoints);
            expect(client.channels).toBeInstanceOf(ChannelsEndpoints);
        });
    });

    describe('authentication methods', () => {
        describe('setAccessToken', () => {
            test('should set access token from string', () => {
                const token = 'test_access_token_123';
                client.setAccessToken(token);

                expect(client.getAccessToken()).toBe(token);
                expect(client.isAuthenticated()).toBe(true);
                expect(
                    (client as TestableDiscordBrowserApiClient).httpClient.defaults.headers.common.Authorization
                ).toBe(`Bearer ${token}`);
            });

            test('should set access token from BrowserTokenInfo object', () => {
                const tokenInfo: BrowserTokenInfo = {
                    accessToken: 'test_token_from_object',
                    tokenType: 'Bearer',
                    expiresIn: 3600,
                    scope: 'identify',
                };
                client.setAccessToken(tokenInfo);

                expect(client.getAccessToken()).toBe(tokenInfo.accessToken);
                expect(client.isAuthenticated()).toBe(true);
                expect(
                    (client as TestableDiscordBrowserApiClient).httpClient.defaults.headers.common.Authorization
                ).toBe(`Bearer ${tokenInfo.accessToken}`);
            });
        });

        describe('clearAccessToken', () => {
            test('should clear access token and authorization header', () => {
                client.setAccessToken('test_token');
                expect(client.isAuthenticated()).toBe(true);

                client.clearAccessToken();

                expect(client.getAccessToken()).toBeUndefined();
                expect(client.isAuthenticated()).toBe(false);
                expect(
                    (client as TestableDiscordBrowserApiClient).httpClient.defaults.headers.common.Authorization
                ).toBeUndefined();
            });
        });

        describe('getAccessToken', () => {
            test('should return undefined when no token is set', () => {
                expect(client.getAccessToken()).toBeUndefined();
            });

            test('should return the current access token', () => {
                const token = 'current_access_token';
                client.setAccessToken(token);
                expect(client.getAccessToken()).toBe(token);
            });
        });

        describe('isAuthenticated', () => {
            test('should return false when no token is set', () => {
                expect(client.isAuthenticated()).toBe(false);
            });

            test('should return true when token is set', () => {
                client.setAccessToken('test_token');
                expect(client.isAuthenticated()).toBe(true);
            });

            test('should return false after clearing token', () => {
                client.setAccessToken('test_token');
                client.clearAccessToken();
                expect(client.isAuthenticated()).toBe(false);
            });
        });
    });

    describe('error handling', () => {
        test('should handle Discord API errors with response data', async () => {
            const errorData = {
                message: 'Missing Access',
                code: 50001,
            };

            mockAdapter.onGet('/test').reply(401, errorData);

            try {
                await (client as TestableDiscordBrowserApiClient).httpClient.get('/test');
                expect.unreachable('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(DiscordAPIError);
                const discordError = error as DiscordAPIError;
                expect(discordError.message).toBe(errorData.message);
                expect(discordError.code).toBe(errorData.code);
                expect(discordError.status).toBe(401);
                expect(discordError.method).toBe('GET');
                expect(discordError.url).toBe('/test');
            }
        });

        test('should handle Discord API errors without message', async () => {
            const errorData = {
                code: 50001,
            };

            mockAdapter.onPost('/test').reply(403, errorData);

            try {
                await (client as TestableDiscordBrowserApiClient).httpClient.post('/test');
                expect.unreachable('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(DiscordAPIError);
                const discordError = error as DiscordAPIError;
                expect(discordError.code).toBe(errorData.code);
                expect(discordError.status).toBe(403);
                expect(discordError.method).toBe('POST');
            }
        });

        test('should handle Discord API errors without code', async () => {
            const errorData = {
                message: 'Custom error message',
            };

            mockAdapter.onPatch('/test').reply(500, errorData);

            try {
                await (client as TestableDiscordBrowserApiClient).httpClient.patch('/test');
                expect.unreachable('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(DiscordAPIError);
                const discordError = error as DiscordAPIError;
                expect(discordError.message).toBe(errorData.message);
                expect(discordError.code).toBe(0);
                expect(discordError.status).toBe(500);
                expect(discordError.method).toBe('PATCH');
            }
        });

        test('should handle network errors (no response)', async () => {
            mockAdapter.onGet('/test').networkError();

            try {
                await (client as TestableDiscordBrowserApiClient).httpClient.get('/test');
                expect.unreachable('Should have thrown an error');
            } catch (error) {
                expect(error).not.toBeInstanceOf(DiscordAPIError);
                expect(error.message).toContain('Network Error');
            }
        });

        test('should handle timeout errors', async () => {
            mockAdapter.onGet('/test').timeout();

            try {
                await (client as TestableDiscordBrowserApiClient).httpClient.get('/test');
                expect.unreachable('Should have thrown an error');
            } catch (error) {
                expect(error).not.toBeInstanceOf(DiscordAPIError);
                expect(error.code).toBe('ECONNABORTED');
            }
        });

        test('should fallback to unknown method and url when config is missing', async () => {
            const errorData = {
                message: 'Test error',
                code: 50001,
            };

            // Create a mock error without config
            const mockError = {
                response: {
                    status: 400,
                    data: errorData,
                    config: undefined,
                },
            };

            try {
                await (client as TestableDiscordBrowserApiClient).handleResponseError(mockError);
                expect.unreachable('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(DiscordAPIError);
                const discordError = error as DiscordAPIError;
                expect(discordError.method).toBe('UNKNOWN');
                expect(discordError.url).toBe('UNKNOWN');
            }
        });
    });

    describe('http client integration', () => {
        test('should make authenticated requests when token is set', async () => {
            const token = 'test_auth_token';
            client.setAccessToken(token);

            mockAdapter.onGet('/users/@me').reply((config) => {
                expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
                return [200, { id: '123', username: 'testuser' }];
            });

            const response = await (client as TestableDiscordBrowserApiClient).httpClient.get('/users/@me');
            expect(response.status).toBe(200);
        });

        test('should make unauthenticated requests when token is not set', async () => {
            mockAdapter.onGet('/public').reply((config) => {
                expect(config.headers?.Authorization).toBeUndefined();
                return [200, { message: 'public data' }];
            });

            const response = await (client as TestableDiscordBrowserApiClient).httpClient.get('/public');
            expect(response.status).toBe(200);
        });
    });
});
