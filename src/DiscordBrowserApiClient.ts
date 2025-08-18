import type { AxiosError, AxiosInstance } from 'axios';
import { ChannelsEndpoints, GuildsEndpoints, UsersEndpoints } from './endpoints';
import { DiscordAPIError } from './errors';
import type { BrowserTokenInfo, DiscordBrowserApiClientOptions } from './types';
import { createHttpClient } from './utils';

export class DiscordBrowserApiClient {
    protected readonly httpClient: AxiosInstance;
    protected accessToken?: string;

    // Endpoint categories
    public readonly users: UsersEndpoints;
    public readonly guilds: GuildsEndpoints;
    public readonly channels: ChannelsEndpoints;

    constructor(options: DiscordBrowserApiClientOptions = {}) {
        this.httpClient = createHttpClient(options);

        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use((response) => response, this.handleResponseError.bind(this));

        // Initialize endpoint categories
        this.users = new UsersEndpoints(this.httpClient);
        this.guilds = new GuildsEndpoints(this.httpClient);
        this.channels = new ChannelsEndpoints(this.httpClient);
    }

    /**
     * Set the access token for API requests.
     * @param tokenInfo - The token information object or a raw access token string.
     */
    setAccessToken(tokenInfo: BrowserTokenInfo | string): void {
        const token = typeof tokenInfo === 'string' ? tokenInfo : tokenInfo.accessToken;
        this.accessToken = token;
        this.httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    /**
     * Clears the access token from the client.
     */
    clearAccessToken(): void {
        this.accessToken = undefined;
        delete this.httpClient.defaults.headers.common.Authorization;
    }

    /**
     * Gets the current access token.
     * @returns The access token or undefined if not set.
     */
    getAccessToken(): string | undefined {
        return this.accessToken;
    }

    /**
     * Checks if the client has an access token.
     * @returns True if an access token is set, false otherwise.
     */
    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    protected handleResponseError(error: AxiosError): Promise<never> {
        interface DiscordErrorResponseData {
            message?: string;
            code?: number;
        }

        if (error.response) {
            const { status, data, config } = error.response;
            const errorData = data as DiscordErrorResponseData;
            const message = errorData.message || error.message;
            const code = errorData.code || 0;

            throw new DiscordAPIError(
                message,
                code,
                status,
                config?.method?.toUpperCase() || 'UNKNOWN',
                config?.url || 'UNKNOWN'
            );
        }

        throw error;
    }
}
