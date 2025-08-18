import { beforeEach, describe, expect, test } from 'bun:test';
import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { RESTGetAPICurrentUserGuildsResult, RESTGetAPICurrentUserResult } from 'discord-api-types/v10';
import { UsersEndpoints } from '../../src/endpoints/users';

describe('UsersEndpoints', () => {
    let usersEndpoints: UsersEndpoints;
    let mockAdapter: MockAdapter;
    let axiosInstance: AxiosInstance;

    beforeEach(() => {
        axiosInstance = axios.create({
            baseURL: 'https://discord.com/api/v10',
        });
        mockAdapter = new MockAdapter(axiosInstance);
        usersEndpoints = new UsersEndpoints(axiosInstance);
    });

    describe('getCurrentUser', () => {
        test('should make correct API call for current user', async () => {
            const mockUserData: RESTGetAPICurrentUserResult = {
                id: '123456789',
                username: 'testuser',
                discriminator: '1234',
                avatar: 'avatar_hash',
                bot: false,
                system: false,
                mfa_enabled: false,
                verified: true,
                email: 'test@example.com',
                flags: 0,
                premium_type: 0,
                public_flags: 0,
                banner: null,
                accent_color: null,
                global_name: 'Test User',
                avatar_decoration_data: null,
                banner_color: null,
                clan: null,
                locale: 'en-US',
            };

            mockAdapter.onGet('/users/@me').reply(200, mockUserData);

            const result = await usersEndpoints.getCurrentUser();

            expect(result).toEqual(mockUserData);
            expect(mockAdapter.history.get).toHaveLength(1);
            expect(mockAdapter.history.get[0]?.url).toBe('/users/@me');
            expect(mockAdapter.history.get[0]?.method).toBe('get');
            expect(mockAdapter.history.get[0]?.params).toBeUndefined();
        });

        test('should handle empty options parameter', async () => {
            const mockUserData: RESTGetAPICurrentUserResult = {
                id: '123456789',
                username: 'testuser',
                discriminator: '1234',
                avatar: 'avatar_hash',
                bot: false,
                system: false,
                mfa_enabled: false,
                verified: true,
                email: 'test@example.com',
                flags: 0,
                premium_type: 0,
                public_flags: 0,
                banner: null,
                accent_color: null,
                global_name: 'Test User',
                avatar_decoration_data: null,
                banner_color: null,
                clan: null,
                locale: 'en-US',
            };

            mockAdapter.onGet('/users/@me').reply(200, mockUserData);

            const result = await usersEndpoints.getCurrentUser({});

            expect(result).toEqual(mockUserData);
        });
    });

    describe('getCurrentUserGuilds', () => {
        test('should make correct API call for current user guilds without options', async () => {
            const mockGuildsData: RESTGetAPICurrentUserGuildsResult = [
                {
                    id: '987654321',
                    name: 'Test Guild',
                    icon: 'guild_icon_hash',
                    owner: true,
                    permissions: '2147483647',
                    features: [],
                },
                {
                    id: '111222333',
                    name: 'Another Guild',
                    icon: null,
                    owner: false,
                    permissions: '104189504',
                    features: ['COMMUNITY'],
                },
            ];

            mockAdapter.onGet('/users/@me/guilds').reply(200, mockGuildsData);

            const result = await usersEndpoints.getCurrentUserGuilds();

            expect(result).toEqual(mockGuildsData);
            expect(mockAdapter.history.get).toHaveLength(1);
            expect(mockAdapter.history.get[0]?.url).toBe('/users/@me/guilds');
            expect(mockAdapter.history.get[0]?.method).toBe('get');
            expect(mockAdapter.history.get[0]?.params).toBeUndefined();
        });

        test('should make correct API call with all query parameters', async () => {
            const mockGuildsData: RESTGetAPICurrentUserGuildsResult = [];
            const options = {
                before: '987654321',
                after: '111222333',
                limit: 10,
                with_counts: true,
            };

            mockAdapter.onGet('/users/@me/guilds').reply((config) => {
                expect(config.params).toEqual(options);
                return [200, mockGuildsData];
            });

            const result = await usersEndpoints.getCurrentUserGuilds(options);

            expect(result).toEqual(mockGuildsData);
            expect(mockAdapter.history.get).toHaveLength(1);
        });

        test('should make correct API call with partial query parameters', async () => {
            const mockGuildsData: RESTGetAPICurrentUserGuildsResult = [];
            const options = {
                limit: 5,
                with_counts: true,
            };

            mockAdapter.onGet('/users/@me/guilds').reply((config) => {
                expect(config.params).toEqual(options);
                return [200, mockGuildsData];
            });

            const result = await usersEndpoints.getCurrentUserGuilds(options);

            expect(result).toEqual(mockGuildsData);
        });

        test('should handle only before parameter', async () => {
            const mockGuildsData: RESTGetAPICurrentUserGuildsResult = [];
            const options = {
                before: '987654321',
            };

            mockAdapter.onGet('/users/@me/guilds').reply((config) => {
                expect(config.params).toEqual(options);
                return [200, mockGuildsData];
            });

            const result = await usersEndpoints.getCurrentUserGuilds(options);

            expect(result).toEqual(mockGuildsData);
        });

        test('should handle only after parameter', async () => {
            const mockGuildsData: RESTGetAPICurrentUserGuildsResult = [];
            const options = {
                after: '111222333',
            };

            mockAdapter.onGet('/users/@me/guilds').reply((config) => {
                expect(config.params).toEqual(options);
                return [200, mockGuildsData];
            });

            const result = await usersEndpoints.getCurrentUserGuilds(options);

            expect(result).toEqual(mockGuildsData);
        });
    });

    describe('path resolution', () => {
        test('should not modify paths without parameters', async () => {
            const mockUserData: RESTGetAPICurrentUserResult = {
                id: '123456789',
                username: 'testuser',
                discriminator: '1234',
                avatar: 'avatar_hash',
                bot: false,
                system: false,
                mfa_enabled: false,
                verified: true,
                email: 'test@example.com',
                flags: 0,
                premium_type: 0,
                public_flags: 0,
                banner: null,
                accent_color: null,
                global_name: 'Test User',
                avatar_decoration_data: null,
                banner_color: null,
                clan: null,
                locale: 'en-US',
            };

            mockAdapter.onGet('/users/@me').reply(200, mockUserData);

            await usersEndpoints.getCurrentUser();

            expect(mockAdapter.history.get[0]?.url).toBe('/users/@me');
        });

        test('should handle guild paths correctly', async () => {
            const mockGuildsData: RESTGetAPICurrentUserGuildsResult = [];

            mockAdapter.onGet('/users/@me/guilds').reply(200, mockGuildsData);

            await usersEndpoints.getCurrentUserGuilds();

            expect(mockAdapter.history.get[0]?.url).toBe('/users/@me/guilds');
        });
    });

    describe('error handling', () => {
        test('should propagate API errors for getCurrentUser', async () => {
            mockAdapter.onGet('/users/@me').reply(401, {
                message: 'Unauthorized',
                code: 0,
            });

            await expect(usersEndpoints.getCurrentUser()).rejects.toThrow();
        });

        test('should propagate API errors for getCurrentUserGuilds', async () => {
            mockAdapter.onGet('/users/@me/guilds').reply(403, {
                message: 'Forbidden',
                code: 50001,
            });

            await expect(usersEndpoints.getCurrentUserGuilds()).rejects.toThrow();
        });
    });
});
