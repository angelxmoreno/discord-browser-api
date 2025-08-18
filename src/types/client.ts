import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { OAuth2Scopes } from 'discord-api-types/v10';

/**
 * Base options for configuring the API client's HTTP behavior.
 */
export interface ApiClientOptions {
    /**
     * A pre-configured Axios instance. If provided, all other Axios-related options are ignored.
     */
    axiosInstance?: AxiosInstance;
    /**
     * A custom Axios request configuration object to be used when creating a new instance.
     * This is ignored if `axiosInstance` is provided.
     */
    axiosConfig?: AxiosRequestConfig;
    /** The base URL for the Discord API. This is a shortcut for `axiosConfig.baseURL`. */
    baseURL?: string;
    /** The request timeout in milliseconds. This is a shortcut for `axiosConfig.timeout`. */
    timeout?: number;
    /** The API version to use. Defaults to 'v10'. */
    version?: string;
}

/**
 * The complete set of options for constructing a DiscordBrowserApiClient.
 */
export interface DiscordBrowserApiClientOptions extends ApiClientOptions {
    // In the future, client-specific options that are not related to the HTTP client can go here.
}

export interface OAuth2Config {
    clientId: string;
    redirectUri: string;
    scopes: OAuth2Scopes[];
    state?: string;
}

export interface BrowserTokenInfo {
    accessToken: string;
    tokenType: 'Bearer';
    expiresIn?: number;
    scope?: string;
}
