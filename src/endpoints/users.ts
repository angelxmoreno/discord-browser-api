import type { AxiosInstance } from 'axios';
import type { RESTGetAPICurrentUserGuildsResult, RESTGetAPICurrentUserResult } from 'discord-api-types/v10';

export class UsersEndpoints {
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

    async getCurrentUser(options?: Record<string, never>): Promise<RESTGetAPICurrentUserResult> {
        const path = this.resolvePath('/users/@me', options);
        const response = await this.client.request({
            method: 'GET',
            url: path,
            params: options,
        });
        return response.data;
    }

    async getCurrentUserGuilds(options?: {
        before?: string;
        after?: string;
        limit?: number;
        with_counts?: boolean;
    }): Promise<RESTGetAPICurrentUserGuildsResult> {
        const path = this.resolvePath('/users/@me/guilds', options);
        const response = await this.client.request({
            method: 'GET',
            url: path,
            params: options,
        });
        return response.data;
    }
}
