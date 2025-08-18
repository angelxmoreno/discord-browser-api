import { beforeEach, describe, expect, test } from 'bun:test';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { RESTGetAPIChannelResult } from 'discord-api-types/v10';
import { ChannelType } from 'discord-api-types/v10';
import { ChannelsEndpoints } from '../../src/endpoints/channels';

describe('ChannelsEndpoints', () => {
    let channelsEndpoints: ChannelsEndpoints;
    let mockAdapter: MockAdapter;
    let axiosInstance: typeof axios;

    // Define mock data at the top level so it's accessible throughout
    const mockTextChannelData: RESTGetAPIChannelResult = {
        id: '123456789012345678',
        type: ChannelType.GuildText,
        guild_id: '987654321098765432',
        position: 0,
        permission_overwrites: [],
        name: 'general',
        topic: 'General discussion channel',
        nsfw: false,
        last_message_id: '111222333444555666',
        bitrate: undefined,
        user_limit: undefined,
        rate_limit_per_user: 0,
        recipients: undefined,
        icon: undefined,
        owner_id: undefined,
        application_id: undefined,
        managed: false,
        parent_id: '555666777888999000',
        last_pin_timestamp: '2024-01-01T12:00:00.000000+00:00',
        rtc_region: undefined,
        video_quality_mode: undefined,
        message_count: undefined,
        member_count: undefined,
        thread_metadata: undefined,
        member: undefined,
        default_auto_archive_duration: 4320,
        permissions: undefined,
        flags: 0,
        total_message_sent: undefined,
        available_tags: undefined,
        applied_tags: undefined,
        default_reaction_emoji: undefined,
        default_thread_rate_limit_per_user: undefined,
        default_sort_order: undefined,
        default_forum_layout: undefined,
    };

    const mockVoiceChannelData: RESTGetAPIChannelResult = {
        id: '999888777666555444',
        type: ChannelType.GuildVoice,
        guild_id: '987654321098765432',
        position: 1,
        permission_overwrites: [],
        name: 'Voice Chat',
        topic: undefined,
        nsfw: false,
        last_message_id: undefined,
        bitrate: 64000,
        user_limit: 10,
        rate_limit_per_user: undefined,
        recipients: undefined,
        icon: undefined,
        owner_id: undefined,
        application_id: undefined,
        managed: false,
        parent_id: '555666777888999000',
        last_pin_timestamp: undefined,
        rtc_region: 'us-west',
        video_quality_mode: 1,
        message_count: undefined,
        member_count: undefined,
        thread_metadata: undefined,
        member: undefined,
        default_auto_archive_duration: undefined,
        permissions: undefined,
        flags: 0,
        total_message_sent: undefined,
        available_tags: undefined,
        applied_tags: undefined,
        default_reaction_emoji: undefined,
        default_thread_rate_limit_per_user: undefined,
        default_sort_order: undefined,
        default_forum_layout: undefined,
    };

    beforeEach(() => {
        axiosInstance = axios.create({
            baseURL: 'https://discord.com/api/v10',
        });
        mockAdapter = new MockAdapter(axiosInstance);
        channelsEndpoints = new ChannelsEndpoints(axiosInstance);
    });

    describe('getChannel', () => {
        test('should make correct API call with required channelId parameter', async () => {
            const channelId = '123456789012345678';

            mockAdapter.onGet(`/channels/${channelId}`).reply(200, mockTextChannelData);

            const result = await channelsEndpoints.getChannel({ channelId });

            expect(result).toEqual(mockTextChannelData);
            expect(mockAdapter.history.get).toHaveLength(1);
            expect(mockAdapter.history.get[0]?.url).toBe(`/channels/${channelId}`);
            expect(mockAdapter.history.get[0]?.method).toBe('get');
            expect(mockAdapter.history.get[0]?.params).toEqual({});
        });

        test('should properly resolve path parameters', async () => {
            const channelId = '999888777666555444';

            // Mock the exact path that should be called after parameter resolution
            mockAdapter.onGet(`/channels/${channelId}`).reply(200, mockVoiceChannelData);

            await channelsEndpoints.getChannel({ channelId });

            expect(mockAdapter.history.get[0]?.url).toBe(`/channels/${channelId}`);
        });

        test('should exclude channelId from request parameters', async () => {
            const channelId = '123456789012345678';

            mockAdapter.onGet(`/channels/${channelId}`).reply((config) => {
                // channelId should not be in params since it's a path parameter
                expect(config.params).toEqual({});
                expect(config.params).not.toHaveProperty('channelId');
                return [200, mockTextChannelData];
            });

            await channelsEndpoints.getChannel({ channelId });
        });

        test('should handle different channel ID formats', async () => {
            const testCases = [
                '123456789012345678', // 18-digit snowflake
                '987654321098765432', // another snowflake
                '111111111111111111', // all ones
                '999999999999999999', // all nines
            ];

            for (const channelId of testCases) {
                mockAdapter.reset();
                mockAdapter.onGet(`/channels/${channelId}`).reply(200, {
                    ...mockTextChannelData,
                    id: channelId,
                });

                const result = await channelsEndpoints.getChannel({ channelId });

                expect(result.id).toBe(channelId);
                expect(mockAdapter.history.get[0]?.url).toBe(`/channels/${channelId}`);
            }
        });

        test('should handle text channel response', async () => {
            const channelId = '123456789012345678';
            mockAdapter.onGet(`/channels/${channelId}`).reply(200, mockTextChannelData);

            const result = await channelsEndpoints.getChannel({ channelId });

            expect(result.type).toBe(ChannelType.GuildText);
            expect(result.name).toBe('general');
            expect(result.topic).toBe('General discussion channel');
            expect(result.rate_limit_per_user).toBe(0);
        });

        test('should handle voice channel response', async () => {
            const channelId = '999888777666555444';
            mockAdapter.onGet(`/channels/${channelId}`).reply(200, mockVoiceChannelData);

            const result = await channelsEndpoints.getChannel({ channelId });

            expect(result.type).toBe(ChannelType.GuildVoice);
            expect(result.name).toBe('Voice Chat');
            expect(result.bitrate).toBe(64000);
            expect(result.user_limit).toBe(10);
            expect(result.rtc_region).toBe('us-west');
        });

        test('should handle DM channel response', async () => {
            const channelId = '444555666777888999';
            const mockDMChannelData: RESTGetAPIChannelResult = {
                id: channelId,
                type: ChannelType.DM,
                guild_id: undefined,
                position: undefined,
                permission_overwrites: undefined,
                name: undefined,
                topic: undefined,
                nsfw: undefined,
                last_message_id: '111222333444555666',
                bitrate: undefined,
                user_limit: undefined,
                rate_limit_per_user: undefined,
                recipients: [
                    {
                        id: '111111111111111111',
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
                    },
                ],
                icon: null,
                owner_id: undefined,
                application_id: undefined,
                managed: undefined,
                parent_id: undefined,
                last_pin_timestamp: undefined,
                rtc_region: undefined,
                video_quality_mode: undefined,
                message_count: undefined,
                member_count: undefined,
                thread_metadata: undefined,
                member: undefined,
                default_auto_archive_duration: undefined,
                permissions: undefined,
                flags: 0,
                total_message_sent: undefined,
                available_tags: undefined,
                applied_tags: undefined,
                default_reaction_emoji: undefined,
                default_thread_rate_limit_per_user: undefined,
                default_sort_order: undefined,
                default_forum_layout: undefined,
            };

            mockAdapter.onGet(`/channels/${channelId}`).reply(200, mockDMChannelData);

            const result = await channelsEndpoints.getChannel({ channelId });

            expect(result.type).toBe(ChannelType.DM);
            expect(result.recipients).toHaveLength(1);
            expect(result.recipients?.[0]?.username).toBe('testuser');
        });
    });

    describe('path resolution', () => {
        test('should correctly map channelId to {channel.id} placeholder', async () => {
            const channelId = '555666777888999000';
            mockAdapter.onGet(`/channels/${channelId}`).reply(200, mockTextChannelData);

            await channelsEndpoints.getChannel({ channelId });

            // Verify the path was correctly resolved
            expect(mockAdapter.history.get[0]?.url).toBe(`/channels/${channelId}`);
        });

        test('should handle parameter mapping for other potential ID types', async () => {
            // Even though not used in current endpoints, test the mapping logic
            const channelId = '123456789012345678';
            mockAdapter.onGet(`/channels/${channelId}`).reply(200, mockTextChannelData);

            await channelsEndpoints.getChannel({ channelId });

            expect(mockAdapter.history.get[0]?.url).toBe(`/channels/${channelId}`);
        });
    });

    describe('error handling', () => {
        test('should propagate 404 errors for non-existent channel', async () => {
            const channelId = '123456789012345678';
            mockAdapter.onGet(`/channels/${channelId}`).reply(404, {
                message: 'Unknown Channel',
                code: 10003,
            });

            await expect(channelsEndpoints.getChannel({ channelId })).rejects.toThrow();
        });

        test('should propagate 403 errors for insufficient permissions', async () => {
            const channelId = '123456789012345678';
            mockAdapter.onGet(`/channels/${channelId}`).reply(403, {
                message: 'Missing Access',
                code: 50001,
            });

            await expect(channelsEndpoints.getChannel({ channelId })).rejects.toThrow();
        });

        test('should propagate 401 errors for unauthorized requests', async () => {
            const channelId = '123456789012345678';
            mockAdapter.onGet(`/channels/${channelId}`).reply(401, {
                message: 'Unauthorized',
                code: 0,
            });

            await expect(channelsEndpoints.getChannel({ channelId })).rejects.toThrow();
        });

        test('should handle network errors', async () => {
            const channelId = '123456789012345678';
            mockAdapter.onGet(`/channels/${channelId}`).networkError();

            await expect(channelsEndpoints.getChannel({ channelId })).rejects.toThrow();
        });

        test('should handle timeout errors', async () => {
            const channelId = '123456789012345678';
            mockAdapter.onGet(`/channels/${channelId}`).timeout();

            await expect(channelsEndpoints.getChannel({ channelId })).rejects.toThrow();
        });
    });
});
