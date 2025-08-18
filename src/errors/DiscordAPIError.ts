export class DiscordAPIError extends Error {
    public readonly code: number;
    public readonly status: number;
    public readonly method: string;
    public readonly url: string;

    constructor(message: string, code: number, status: number, method: string, url: string) {
        super(message);
        this.name = 'DiscordAPIError';
        this.code = code;
        this.status = status;
        this.method = method;
        this.url = url;
    }
}
