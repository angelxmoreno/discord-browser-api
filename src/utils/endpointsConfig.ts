import type {
    RESTGetAPIChannelResult,
    RESTGetAPICurrentUserGuildsResult,
    RESTGetAPICurrentUserResult,
    RESTGetAPIGuildResult,
} from 'discord-api-types/v10';
import type { EndpointConfig } from '../types';

export const endpointConfigs = {
    users: {
        getCurrentUser: {
            method: 'GET',
            path: '/users/@me',
            options: {} as Record<string, never>,
            returns: {} as RESTGetAPICurrentUserResult,
            optionsType: 'Record<string, never>',
            returnsType: 'RESTGetAPICurrentUserResult',
        } satisfies EndpointConfig,

        getCurrentUserGuilds: {
            method: 'GET',
            path: '/users/@me/guilds',
            options: {} as {
                before?: string;
                after?: string;
                limit?: number;
                with_counts?: boolean;
            },
            returns: {} as RESTGetAPICurrentUserGuildsResult,
            optionsType: '{ before?: string; after?: string; limit?: number; with_counts?: boolean; }',
            returnsType: 'RESTGetAPICurrentUserGuildsResult',
        } satisfies EndpointConfig,
    },

    guilds: {
        getGuild: {
            method: 'GET',
            path: '/guilds/{guild.id}',
            options: {} as {
                guildId: string;
                with_counts?: boolean;
            },
            returns: {} as RESTGetAPIGuildResult,
            optionsType: '{ guildId: string; with_counts?: boolean; }',
            returnsType: 'RESTGetAPIGuildResult',
        } satisfies EndpointConfig,
    },

    channels: {
        getChannel: {
            method: 'GET',
            path: '/channels/{channel.id}',
            options: {} as {
                channelId: string;
            },
            returns: {} as RESTGetAPIChannelResult,
            optionsType: '{ channelId: string; }',
            returnsType: 'RESTGetAPIChannelResult',
        } satisfies EndpointConfig,
    },
} as const;
