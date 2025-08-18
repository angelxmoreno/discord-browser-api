import type { AxiosInstance } from 'axios';
import type { RESTGetAPIGuildResult } from 'discord-api-types/v10';

export class GuildsEndpoints {
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
     * Get guild
     */
    async getGuild(options: { guildId: string; with_counts?: boolean }): Promise<RESTGetAPIGuildResult> {
        // biome-ignore lint/correctness/noUnusedVariables: Path parameters are intentionally extracted but not used
        const { guildId, ...requestParams } = options || {};
        const path = this.resolvePath('/guilds/{guild.id}', options);
        const response = await this.client.request({
            method: 'GET',
            url: path,
            params: requestParams,
        });
        return response.data;
    }
}
