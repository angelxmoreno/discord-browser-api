import { beforeEach, describe, expect, test } from 'bun:test';
import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { RESTGetAPIGuildResult } from 'discord-api-types/v10';
import { GuildsEndpoints } from '../../src/endpoints/guilds';

describe('GuildsEndpoints', () => {
    let guildsEndpoints: GuildsEndpoints;
    let mockAdapter: MockAdapter;
    let axiosInstance: AxiosInstance;

    // Define mock data at the top level so it's accessible throughout
    const mockGuildData: RESTGetAPIGuildResult = {
        id: '123456789',
        name: 'Test Guild',
        icon: 'guild_icon_hash',
        icon_hash: null,
        splash: null,
        discovery_splash: null,
        owner: false,
        owner_id: '987654321',
        permissions: '2147483647',
        region: null,
        afk_channel_id: null,
        afk_timeout: 300,
        widget_enabled: false,
        widget_channel_id: null,
        verification_level: 1,
        default_message_notifications: 0,
        explicit_content_filter: 2,
        roles: [],
        emojis: [],
        features: ['COMMUNITY'],
        mfa_level: 0,
        application_id: null,
        system_channel_id: null,
        system_channel_flags: 0,
        rules_channel_id: null,
        max_presences: null,
        max_members: 500000,
        vanity_url_code: null,
        description: null,
        banner: null,
        premium_tier: 0,
        premium_subscription_count: 0,
        preferred_locale: 'en-US',
        public_updates_channel_id: null,
        max_video_channel_users: 25,
        max_stage_video_channel_users: 50,
        approximate_member_count: undefined,
        approximate_presence_count: undefined,
        welcome_screen: undefined,
        nsfw_level: 0,
        stickers: [],
        premium_progress_bar_enabled: false,
        safety_alerts_channel_id: null,
    };

    beforeEach(() => {
        axiosInstance = axios.create({
            baseURL: 'https://discord.com/api/v10',
        });
        mockAdapter = new MockAdapter(axiosInstance);
        guildsEndpoints = new GuildsEndpoints(axiosInstance);
    });

    describe('getGuild', () => {
        test('should make correct API call with required guildId parameter', async () => {
            const guildId = '123456789';

            mockAdapter.onGet(`/guilds/${guildId}`).reply(200, mockGuildData);

            const result = await guildsEndpoints.getGuild({ guildId });

            expect(result).toEqual(mockGuildData);
            expect(mockAdapter.history.get).toHaveLength(1);
            expect(mockAdapter.history.get[0]?.url).toBe(`/guilds/${guildId}`);
            expect(mockAdapter.history.get[0]?.method).toBe('get');
            expect(mockAdapter.history.get[0]?.params).toEqual({});
        });

        test('should make correct API call with guildId and with_counts parameter', async () => {
            const guildId = '123456789';
            const options = {
                guildId,
                with_counts: true,
            };

            mockAdapter.onGet(`/guilds/${guildId}`).reply((config) => {
                expect(config.params).toEqual({ with_counts: true });
                return [
                    200,
                    {
                        ...mockGuildData,
                        approximate_member_count: 150,
                        approximate_presence_count: 75,
                    },
                ];
            });

            const result = await guildsEndpoints.getGuild(options);

            expect(result.approximate_member_count).toBe(150);
            expect(result.approximate_presence_count).toBe(75);
            expect(mockAdapter.history.get).toHaveLength(1);
        });

        test('should make correct API call with with_counts set to false', async () => {
            const guildId = '123456789';
            const options = {
                guildId,
                with_counts: false,
            };

            mockAdapter.onGet(`/guilds/${guildId}`).reply((config) => {
                expect(config.params).toEqual({ with_counts: false });
                return [200, mockGuildData];
            });

            const result = await guildsEndpoints.getGuild(options);

            expect(result).toEqual(mockGuildData);
        });

        test('should properly resolve path parameters', async () => {
            const guildId = '987654321';

            // Mock the exact path that should be called after parameter resolution
            mockAdapter.onGet(`/guilds/${guildId}`).reply(200, mockGuildData);

            await guildsEndpoints.getGuild({ guildId });

            expect(mockAdapter.history.get[0]?.url).toBe(`/guilds/${guildId}`);
        });

        test('should exclude guildId from request parameters', async () => {
            const guildId = '123456789';
            const options = {
                guildId,
                with_counts: true,
            };

            mockAdapter.onGet(`/guilds/${guildId}`).reply((config) => {
                // guildId should not be in params since it's a path parameter
                expect(config.params).toEqual({ with_counts: true });
                expect(config.params).not.toHaveProperty('guildId');
                return [200, mockGuildData];
            });

            await guildsEndpoints.getGuild(options);
        });

        test('should handle different guild ID formats', async () => {
            const testCases = [
                '123456789012345678', // 18-digit snowflake
                '987654321098765432', // another snowflake
                '111111111111111111', // all ones
            ];

            for (const guildId of testCases) {
                mockAdapter.reset();
                mockAdapter.onGet(`/guilds/${guildId}`).reply(200, {
                    ...mockGuildData,
                    id: guildId,
                });

                const result = await guildsEndpoints.getGuild({ guildId });

                expect(result.id).toBe(guildId);
                expect(mockAdapter.history.get[0]?.url).toBe(`/guilds/${guildId}`);
            }
        });
    });

    describe('path resolution', () => {
        test('should correctly map guildId to {guild.id} placeholder', async () => {
            const guildId = '555666777888999000';
            mockAdapter.onGet(`/guilds/${guildId}`).reply(200, mockGuildData);

            await guildsEndpoints.getGuild({ guildId });

            // Verify the path was correctly resolved
            expect(mockAdapter.history.get[0]?.url).toBe(`/guilds/${guildId}`);
        });

        test('should handle parameter mapping for other potential ID types', async () => {
            // Even though not used in current endpoints, test the mapping logic
            const guildId = '123456789';
            mockAdapter.onGet(`/guilds/${guildId}`).reply(200, mockGuildData);

            await guildsEndpoints.getGuild({ guildId });

            expect(mockAdapter.history.get[0]?.url).toBe(`/guilds/${guildId}`);
        });
    });

    describe('error handling', () => {
        test('should propagate 404 errors for non-existent guild', async () => {
            const guildId = '123456789';
            mockAdapter.onGet(`/guilds/${guildId}`).reply(404, {
                message: 'Unknown Guild',
                code: 10004,
            });

            await expect(guildsEndpoints.getGuild({ guildId })).rejects.toThrow();
        });

        test('should propagate 403 errors for insufficient permissions', async () => {
            const guildId = '123456789';
            mockAdapter.onGet(`/guilds/${guildId}`).reply(403, {
                message: 'Missing Access',
                code: 50001,
            });

            await expect(guildsEndpoints.getGuild({ guildId })).rejects.toThrow();
        });

        test('should propagate 401 errors for unauthorized requests', async () => {
            const guildId = '123456789';
            mockAdapter.onGet(`/guilds/${guildId}`).reply(401, {
                message: 'Unauthorized',
                code: 0,
            });

            await expect(guildsEndpoints.getGuild({ guildId })).rejects.toThrow();
        });

        test('should handle network errors', async () => {
            const guildId = '123456789';
            mockAdapter.onGet(`/guilds/${guildId}`).networkError();

            await expect(guildsEndpoints.getGuild({ guildId })).rejects.toThrow();
        });

        test('should handle timeout errors', async () => {
            const guildId = '123456789';
            mockAdapter.onGet(`/guilds/${guildId}`).timeout();

            await expect(guildsEndpoints.getGuild({ guildId })).rejects.toThrow();
        });
    });
});
