export interface EndpointConfig<TOptions = unknown, TResult = unknown> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    options: TOptions;
    returns: TResult;
    optionsType: string;
    returnsType: string;
}
