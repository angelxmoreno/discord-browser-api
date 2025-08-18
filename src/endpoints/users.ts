import type { AxiosInstance } from 'axios';
import type { RESTGetAPICurrentUserGuildsResult, RESTGetAPICurrentUserResult } from 'discord-api-types/v10';

export class UsersEndpoints {
    constructor(private client: AxiosInstance) {}

    private resolvePath(path: string, options?: Record<string, unknown>): string {
        let resolvedPath = path;

        if (options) {
            // Replace path parameters like {guild.id} with actual values from options
            // Map option keys to path placeholders (e.g., guildId -> {guild.id})
            const paramMappings: Record<string, string> = {
                guildId: 'guild.id',
                channelId: 'channel.id',
                userId: 'user.id',
                messageId: 'message.id',
                roleId: 'role.id',
            };

            Object.entries(options).forEach(([key, value]) => {
                const pathParam = paramMappings[key] || key;
                const placeholder = `{${pathParam}}`;
                if (resolvedPath.includes(placeholder)) {
                    resolvedPath = resolvedPath.replace(placeholder, String(value));
                }
            });
        }

        return resolvedPath;
    }
    /**
     * Get current user
     */
    async getCurrentUser(options?: Record<string, never>): Promise<RESTGetAPICurrentUserResult> {
        const requestParams = options;
        const path = this.resolvePath('/users/@me', options);
        const response = await this.client.request({
            method: 'GET',
            url: path,
            params: requestParams,
        });
        return response.data;
    }
    /**
     * Get current user guilds
     */
    async getCurrentUserGuilds(options?: {
        before?: string;
        after?: string;
        limit?: number;
        with_counts?: boolean;
    }): Promise<RESTGetAPICurrentUserGuildsResult> {
        const requestParams = options;
        const path = this.resolvePath('/users/@me/guilds', options);
        const response = await this.client.request({
            method: 'GET',
            url: path,
            params: requestParams,
        });
        return response.data;
    }
}
