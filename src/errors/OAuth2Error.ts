export class OAuth2Error extends Error {
    public readonly error: string;
    public readonly errorDescription?: string;

    constructor(error: string, errorDescription?: string) {
        super(`OAuth2 Error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        this.name = 'OAuth2Error';
        this.error = error;
        this.errorDescription = errorDescription;
    }
}
