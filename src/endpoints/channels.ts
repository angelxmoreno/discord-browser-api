import type { AxiosInstance } from 'axios';
import type { RESTGetAPIChannelResult } from 'discord-api-types/v10';

export class ChannelsEndpoints {
    constructor(private client: AxiosInstance) {}

    private resolvePath(path: string, options?: Record<string, unknown>): string {
        let resolvedPath = path;

        if (options) {
            // Replace path parameters like {guild.id} with actual values
            Object.entries(options).forEach(([key, value]) => {
                const placeholder = `{${key}}`;
                if (resolvedPath.includes(placeholder)) {
                    resolvedPath = resolvedPath.replace(placeholder, String(value));
                }
            });
        }

        return resolvedPath;
    }

    async getChannel(options?: { channelId: string }): Promise<RESTGetAPIChannelResult> {
        const path = this.resolvePath('/channels/{channel.id}', options);
        const response = await this.client.request({
            method: 'GET',
            url: path,
            params: options,
        });
        return response.data;
    }
}
