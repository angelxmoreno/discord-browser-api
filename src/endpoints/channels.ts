import type { AxiosInstance } from 'axios';
import type { RESTGetAPIChannelResult } from 'discord-api-types/v10';

export class ChannelsEndpoints {
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
     * Get channel
     */
    async getChannel(options: { channelId: string }): Promise<RESTGetAPIChannelResult> {
        const { channelId, ...requestParams } = options;

        if (!channelId) {
            throw new Error('channelId is required');
        }
        const path = this.resolvePath('/channels/{channel.id}', { channelId });
        const response = await this.client.request({
            method: 'GET',
            url: path,
            params: requestParams,
        });
        return response.data;
    }
}
