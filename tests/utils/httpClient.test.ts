import { afterAll, afterEach, beforeAll, expect, mock, test } from 'bun:test';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { createHttpClient } from '../../src/utils/httpClient';

// Mock axios.create
const originalAxiosCreate = axios.create;
let mockAxiosInstance: AxiosInstance;
let capturedConfig: AxiosRequestConfig | undefined;

beforeAll(() => {
    mockAxiosInstance = {
        defaults: { headers: { common: {} } },
        interceptors: { request: { use: mock() }, response: { use: mock() } },
        get: mock(),
        post: mock(),
        put: mock(),
        delete: mock(),
        patch: mock(),
        head: mock(),
        options: mock(),
        request: mock(),
        // Add other necessary AxiosInstance properties if tests require them
    } as unknown as AxiosInstance; // Cast to AxiosInstance

    axios.create = mock((config?: AxiosRequestConfig) => {
        capturedConfig = config; // Capture the config passed to axios.create
        return mockAxiosInstance;
    });
});

afterEach(() => {
    capturedConfig = undefined; // Clear captured config after each test
    (axios.create as ReturnType<typeof mock>).mockClear(); // Clear mock calls
});

afterAll(() => {
    axios.create = originalAxiosCreate;
});

test('createHttpClient should return provided axiosInstance if available', () => {
    const customInstance = {} as AxiosInstance;
    const client = createHttpClient({ axiosInstance: customInstance });
    expect(client).toBe(customInstance);
    expect(axios.create).not.toHaveBeenCalled();
});

test('createHttpClient should create new instance with default config', () => {
    createHttpClient();
    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(capturedConfig?.baseURL).toBe('https://discord.com/api/v10');
    expect(capturedConfig?.timeout).toBe(10000);
    expect(capturedConfig?.headers?.['Content-Type']).toBe('application/json');
});

test('createHttpClient should apply custom axiosConfig', () => {
    const customConfig: AxiosRequestConfig = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
        headers: { 'X-Custom-Header': 'test' },
    };
    createHttpClient({ axiosConfig: customConfig });
    expect(capturedConfig?.baseURL).toBe(customConfig.baseURL);
    expect(capturedConfig?.timeout).toBe(customConfig.timeout);
    expect(capturedConfig?.headers?.['X-Custom-Header']).toBe('test');
    expect(capturedConfig?.headers?.['Content-Type']).toBe('application/json'); // Default should still be there
});

test('createHttpClient should prioritize top-level baseURL and timeout', () => {
    createHttpClient({
        baseURL: 'https://override.com',
        timeout: 2000,
        axiosConfig: {
            baseURL: 'https://api.example.com',
            timeout: 5000,
        },
    });
    expect(capturedConfig?.baseURL).toBe('https://override.com');
    expect(capturedConfig?.timeout).toBe(2000);
});

test('createHttpClient should use specified API version', () => {
    createHttpClient({ version: 'v9' });
    expect(capturedConfig?.baseURL).toBe('https://discord.com/api/v9');
});

test('createHttpClient should merge headers correctly', () => {
    createHttpClient({
        axiosConfig: {
            headers: { 'X-Auth': 'token' },
        },
    });
    expect(capturedConfig?.headers?.['Content-Type']).toBe('application/json');
    expect(capturedConfig?.headers?.['X-Auth']).toBe('token');
});
