import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiClientOptions } from '../types';

/**
 * Resolves an Axios instance based on user-provided options and defaults.
 * If an instance is provided, it's returned directly.
 * Otherwise, a new instance is created by merging defaults with a provided config.
 * @param options - The options for creating the client.
 * @returns A configured AxiosInstance.
 */
export const createHttpClient = (options: ApiClientOptions = {}): AxiosInstance => {
    if (options.axiosInstance) {
        return options.axiosInstance;
    }

    // Merge default config, user-provided config, and shortcut options
    const mergedConfig: AxiosRequestConfig = {
        // Start with our defaults
        baseURL: `https://discord.com/api/${options.version || 'v10'}`,
        timeout: 10000,
        ...options.axiosConfig, // Apply user's full config
        headers: {
            'Content-Type': 'application/json',
            ...options.axiosConfig?.headers, // Ensure our required headers are merged
        },
        // Let shortcut options override anything else - check for undefined to allow falsy values
        ...(options.baseURL !== undefined && { baseURL: options.baseURL }),
        ...(options.timeout !== undefined && { timeout: options.timeout }),
    };

    return axios.create(mergedConfig);
};
