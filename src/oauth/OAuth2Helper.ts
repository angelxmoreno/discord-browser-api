import { OAuth2Error } from '../errors';
import type { BrowserTokenInfo, OAuth2Config } from '../types/client';

const OAUTH_BASE_URL = 'https://discord.com/oauth2/authorize';

/**
 * A collection of utility functions for handling the Discord OAuth2 flow.
 */
export const OAuth2Helper = {
    /**
     * Generates the Discord OAuth2 authorization URL.
     * @param config - The configuration for the authorization URL.
     * @returns The fully formed authorization URL.
     */
    generateAuthUrl: (config: OAuth2Config): string => {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            scope: config.scopes.join(' '),
            ...(config.state && { state: config.state }),
        });

        return `${OAUTH_BASE_URL}?${params.toString()}`;
    },

    /**
     * Parses the authorization code from a callback URL.
     * @param url - The callback URL from Discord.
     * @returns An object containing the authorization code and optional state.
     * @throws {OAuth2Error} If the URL contains an error or is missing the code.
     */
    parseCallbackUrl: (url: string): { code: string; state?: string } => {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');
        const error = urlObj.searchParams.get('error');
        const state = urlObj.searchParams.get('state');

        if (error) {
            const errorDescription = urlObj.searchParams.get('error_description');
            throw new OAuth2Error(error, errorDescription || undefined);
        }

        if (!code) {
            throw new OAuth2Error('missing_code', 'Authorization code not found in callback URL');
        }

        return { code, state: state || undefined };
    },

    /**
     * Parses the access token from an implicit grant callback URL fragment.
     * @param url - The callback URL from Discord, including the hash fragment.
     * @returns A BrowserTokenInfo object.
     * @throws {OAuth2Error} If the URL contains an error or is missing the token.
     */
    parseImplicitCallback: (url: string): BrowserTokenInfo => {
        const fragment = new URL(url).hash.substring(1);
        const params = new URLSearchParams(fragment);

        const accessToken = params.get('access_token');
        const error = params.get('error');

        if (error) {
            const errorDescription = params.get('error_description');
            throw new OAuth2Error(error, errorDescription || undefined);
        }

        if (!accessToken) {
            throw new OAuth2Error('missing_token', 'Access token not found in callback URL');
        }

        return {
            accessToken,
            tokenType: 'Bearer' as const,
            expiresIn: params.get('expires_in') ? Number(params.get('expires_in')) : undefined,
            scope: params.get('scope') || undefined,
        };
    },
};
