# Discord Browser API - Complete Project Specifications

## Project Overview

A browser-focused Discord API client library that enables web applications to interact with Discord's REST API using OAuth2 user tokens. This fills a critical gap in the ecosystem where existing libraries (discord.js, discord.py) are designed for server-side bots, leaving web developers without proper tools for Discord integrations.

### Key Discovery
Discord's CORS policy allows browser requests when using OAuth2 user access tokens (`Bearer TOKEN`) but blocks bot token requests (`Bot TOKEN`). This enables browser-based Discord applications that were previously thought impossible.

## Core Features (v1.0)

- ✅ Browser-only OAuth2 Discord API client
- ✅ TypeScript-first with full type safety
- ✅ Configurable axios instance support
- ✅ Auto-generated endpoints from configuration
- ✅ Integration with discord-api-types
- ✅ OAuth2 utilities and helpers
- ✅ Comprehensive error handling
- ✅ Modern development tooling

## Tech Stack

- **Runtime**: Bun
- **Testing**: Bun test (no Jest)
- **Linting/Formatting**: BiomeJS
- **Git Hooks**: Lefthook
- **Commits**: Conventional Commits + Commitlint
- **HTTP Client**: Axios (user-configurable)
- **Types**: discord-api-types package
- **License**: MIT

## Project Structure

```
discord-browser-api/
├── src/
│   ├── client/
│   │   ├── DiscordBrowserApiClient.ts      # Main client class
│   │   └── index.ts
│   ├── endpoints/
│   │   ├── generator.ts             # Endpoint generator script
│   │   ├── config.ts                # Endpoint definitions
│   │   ├── users.ts                 # Generated user endpoints
│   │   ├── guilds.ts                # Generated guild endpoints
│   │   └── index.ts
│   ├── oauth/
│   │   ├── OAuth2Helper.ts          # OAuth2 utilities
│   │   ├── types.ts                 # OAuth2 type definitions
│   │   └── index.ts
│   ├── types/
│   │   ├── client.ts                # Client-specific types
│   │   ├── errors.ts                # Error type definitions
│   │   └── index.ts
│   ├── errors/
│   │   ├── DiscordAPIError.ts       # Custom error classes
│   │   ├── OAuth2Error.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── constants.ts             # API constants
│   │   ├── validation.ts            # Input validation
│   │   └── index.ts
│   └── index.ts                     # Main export
├── scripts/
│   └── generate-endpoints.ts        # Build-time endpoint generation
├── examples/
│   ├── basic-usage.html
│   ├── oauth-flow.html
│   └── guild-management.html
├── docs/
│   ├── api-reference.md
│   ├── oauth-setup.md
│   └── migration-guide.md
├── tests/
│   ├── client/
│   ├── endpoints/
│   ├── oauth/
│   └── utils/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── package.json
├── bun.lockb
├── tsconfig.json
├── biome.json
├── lefthook.yml
├── commitlint.config.js
└── README.md
```

## Detailed Implementation Tasks

### Phase 1: Project Setup & Tooling

#### Task 1.1: Initialize Project
```bash
mkdir discord-browser-api
cd discord-browser-api
bun init -y
```

#### Task 1.2: Configure Package.json
```json
{
  "name": "discord-browser-api",
  "version": "0.1.0",
  "description": "Browser-compatible Discord API client for OAuth2 user authentication and REST API interactions",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "bun run scripts/generate-endpoints.ts && tsc",
    "dev": "bun run build --watch",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "lint": "biome check src/ tests/ scripts/",
    "lint:fix": "biome check --write src/ tests/ scripts/",
    "format": "biome format --write src/ tests/ scripts/",
    "prepare": "bun run build",
    "prepublishOnly": "bun run test && bun run lint"
  },
  "keywords": ["discord", "api", "oauth2", "browser", "web", "client"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/discord-browser-api.git"
  }
}
```

#### Task 1.3: Install Dependencies
```bash
# Core dependencies
bun add axios discord-api-types

# Dev dependencies  
bun add -d typescript @types/node @biomejs/biome@latest lefthook @commitlint/cli @commitlint/config-conventional
```

#### Task 1.4: Configure TypeScript
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noEmitOnError": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### Task 1.5: Configure BiomeJS v2
Create `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["dist/", "node_modules/", "*.d.ts"]
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn",
        "noUselessConstructor": "error"
      },
      "style": {
        "useConst": "error",
        "useTemplate": "error",
        "useShorthandFunctionType": "error",
        "useEnumInitializers": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noConsoleLog": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "always",
      "arrowParentheses": "asNeeded"
    }
  },
  "json": {
    "formatter": {
      "enabled": true,
      "indentWidth": 2
    }
  }
}
```

#### Task 1.6: Configure Lefthook
Create `lefthook.yml`:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
    format:
      run: bun run format
    type-check:
      run: tsc --noEmit

commit-msg:
  commands:
    commitlint:
      run: bunx commitlint --edit
```

#### Task 1.7: Configure Commitlint
Create `commitlint.config.js`:
```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 
      'test', 'chore', 'ci', 'build'
    ]]
  }
};
```

### Phase 2: Core Architecture

#### Task 2.1: Define Base Types
Create `src/types/client.ts`:
```typescript
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface DiscordBrowserApiClientOptions {
  /** Custom axios instance with user configurations */
  axiosInstance?: AxiosInstance;
  /** Discord API base URL */
  baseURL?: string;
  /** API version */
  version?: string;
  /** Default request timeout */
  timeout?: number;
}

export interface OAuth2Config {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state?: string;
}

export interface TokenInfo {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn?: number;
  scope?: string;
}
```

#### Task 2.2: Create Error Classes
Create `src/errors/DiscordAPIError.ts`:
```typescript
export class DiscordAPIError extends Error {
  public readonly code: number;
  public readonly status: number;
  public readonly method: string;
  public readonly url: string;

  constructor(
    message: string,
    code: number,
    status: number,
    method: string,
    url: string
  ) {
    super(message);
    this.name = 'DiscordAPIError';
    this.code = code;
    this.status = status;
    this.method = method;
    this.url = url;
  }
}

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
```

#### Task 2.3: Create OAuth2 Helper
Create `src/oauth/OAuth2Helper.ts`:
```typescript
import type { OAuth2Config } from '../types/client.js';
import { OAuth2Error } from '../errors/index.js';

export class OAuth2Helper {
  private static readonly OAUTH_BASE_URL = 'https://discord.com/oauth2/authorize';
  private static readonly TOKEN_URL = 'https://discord.com/api/oauth2/token';

  /**
   * Generate OAuth2 authorization URL
   */
  static generateAuthUrl(config: OAuth2Config): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      ...(config.state && { state: config.state })
    });

    return `${this.OAUTH_BASE_URL}?${params.toString()}`;
  }

  /**
   * Parse authorization code from callback URL
   */
  static parseCallbackUrl(url: string): { code: string; state?: string } {
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
  }

  /**
   * Extract access token from implicit grant callback
   */
  static parseImplicitCallback(url: string): TokenInfo {
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
      scope: params.get('scope') || undefined
    };
  }
}
```

#### Task 2.4: Create Endpoint Configuration
Create `src/endpoints/config.ts`:
```typescript
import type {
  RESTGetAPICurrentUserResult,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildResult,
  RESTGetAPIChannelResult
} from 'discord-api-types/v10';

interface EndpointConfig<TOptions = unknown, TResult = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  options: TOptions;
  returns: TResult;
}

export const endpointConfigs = {
  users: {
    getCurrentUser: {
      method: 'GET',
      path: '/users/@me',
      options: {} as Record<string, never>,
      returns: {} as RESTGetAPICurrentUserResult
    } satisfies EndpointConfig,
    
    getCurrentUserGuilds: {
      method: 'GET', 
      path: '/users/@me/guilds',
      options: {} as {
        before?: string;
        after?: string; 
        limit?: number;
        with_counts?: boolean;
      },
      returns: {} as RESTGetAPICurrentUserGuildsResult
    } satisfies EndpointConfig
  },
  
  guilds: {
    getGuild: {
      method: 'GET',
      path: '/guilds/{guild.id}',
      options: {} as {
        guildId: string;
        with_counts?: boolean;
      },
      returns: {} as RESTGetAPIGuildResult
    } satisfies EndpointConfig
  },

  channels: {
    getChannel: {
      method: 'GET',
      path: '/channels/{channel.id}',
      options: {} as {
        channelId: string;
      },
      returns: {} as RESTGetAPIChannelResult
    } satisfies EndpointConfig
  }
} as const;
```

#### Task 2.5: Create Endpoint Generator Script
Create `scripts/generate-endpoints.ts`:
```typescript
import { writeFileSync } from 'fs';
import { endpointConfigs } from '../src/endpoints/config.js';

function generateEndpointClass(category: string, endpoints: Record<string, any>): string {
  const methods = Object.entries(endpoints).map(([name, config]) => {
    const methodName = name;
    const returnType = `Promise<${config.returns.constructor.name || 'unknown'}>`;
    const optionsType = typeof config.options === 'object' ? 'Record<string, unknown>' : 'unknown';
    
    return `
  async ${methodName}(options${Object.keys(config.options || {}).length === 0 ? '?' : ''}: ${optionsType})${returnType} {
    const path = this.resolvePath('${config.path}', options);
    const response = await this.client.request({
      method: '${config.method}',
      url: path,
      ${config.method === 'GET' ? 'params: options' : 'data: options'}
    });
    return response.data;
  }`;
  }).join('\n');

  return `
import type { AxiosInstance } from 'axios';

export class ${capitalize(category)}Endpoints {
  constructor(private client: AxiosInstance) {}

  private resolvePath(path: string, options?: Record<string, unknown>): string {
    let resolvedPath = path;
    
    if (options) {
      // Replace path parameters like {guild.id} with actual values
      Object.entries(options).forEach(([key, value]) => {
        const placeholder = \`{\${key}}\`;
        if (resolvedPath.includes(placeholder)) {
          resolvedPath = resolvedPath.replace(placeholder, String(value));
        }
      });
    }
    
    return resolvedPath;
  }
  ${methods}
}
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate endpoint files
Object.entries(endpointConfigs).forEach(([category, endpoints]) => {
  const content = generateEndpointClass(category, endpoints);
  writeFileSync(`src/endpoints/${category}.ts`, content);
});

console.log('Endpoints generated successfully!');
```

#### Task 2.6: Create Main Client Class
Create `src/client/DiscordBrowserApiClient.ts`:
```typescript
import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { DiscordBrowserApiClientOptions, TokenInfo } from '../types/client.js';
import { DiscordAPIError } from '../errors/index.js';
import { UsersEndpoints } from '../endpoints/users.js';
import { GuildsEndpoints } from '../endpoints/guilds.js';
import { ChannelsEndpoints } from '../endpoints/channels.js';

export class DiscordBrowserApiClient {
  private httpClient: AxiosInstance;
  private accessToken?: string;

  // Endpoint categories
  public readonly users: UsersEndpoints;
  public readonly guilds: GuildsEndpoints; 
  public readonly channels: ChannelsEndpoints;

  constructor(options: DiscordBrowserApiClientOptions = {}) {
    // Create or use provided axios instance
    this.httpClient = options.axiosInstance || axios.create({
      baseURL: options.baseURL || `https://discord.com/api/${options.version || 'v10'}`,
      timeout: options.timeout || 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      response => response,
      this.handleResponseError.bind(this)
    );

    // Initialize endpoint categories
    this.users = new UsersEndpoints(this.httpClient);
    this.guilds = new GuildsEndpoints(this.httpClient);
    this.channels = new ChannelsEndpoints(this.httpClient);
  }

  /**
   * Set the access token for API requests
   */
  setAccessToken(tokenInfo: TokenInfo | string): void {
    const token = typeof tokenInfo === 'string' ? tokenInfo : tokenInfo.accessToken;
    this.accessToken = token;
    this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear the access token
   */
  clearAccessToken(): void {
    this.accessToken = undefined;
    delete this.httpClient.defaults.headers.common['Authorization'];
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private handleResponseError(error: AxiosError): Promise<never> {
    if (error.response) {
      const { status, data, config } = error.response;
      const message = (data as any)?.message || error.message;
      const code = (data as any)?.code || 0;
      
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
```

### Phase 3: Testing & Documentation

#### Task 3.1: Create Test Setup
Create basic test structure in `tests/` directory with Bun test files.

#### Task 3.2: Write Examples
Create practical examples in `examples/` directory showing:
- Basic OAuth2 flow
- Guild management
- User profile display

#### Task 3.3: Generate Documentation
- API reference from TypeScript
- OAuth2 setup guide
- Migration guide from discord.js

### Phase 4: Build & Release

The release process will be managed by **release-please** to automate versioning, changelog generation, and the creation of GitHub releases.

#### Task 4.1: Configure GitHub Actions
Create CI/CD pipeline for testing and releasing. The `release.yml` workflow will use `release-please` to manage the release process based on Conventional Commits.

#### Task 4.2: Prepare for NPM
- Final package.json configuration
- README with examples
- Changelog setup

#### Task 4.3: Initial Release
- Version 1.0.0 release
- NPM publication
- GitHub release with examples

### Phase 5: Quality, Security & Automation

To ensure the long-term health, security, and maintainability of the package, we will integrate the following services:

#### Task 5.1: Configure Code Coverage Reporting
- **Tool**: Codecov
- **Action**: Integrate `codecov/codecov-action` into the `pr-check.yml` workflow.
- **Goal**: Upload coverage reports on every PR to track test coverage over time and enforce quality standards. A coverage badge will be added to the `README.md`.

#### Task 5.2: Configure Dependency Management
- **Tool**: Dependabot
- **Action**: Enable Dependabot in the GitHub repository settings and add a `.github/dependabot.yml` file.
- **Goal**: Automatically create pull requests to keep all `npm` dependencies up-to-date, patching security vulnerabilities and maintaining a modern codebase.

#### Task 5.3: Configure Static Security Analysis (SAST)
- **Tool**: GitHub Code Scanning (CodeQL)
- **Action**: Add the `CodeQL` GitHub Actions workflow to the project.
- **Goal**: Proactively scan the codebase for common security vulnerabilities and coding errors on every push and pull request.

## Post-V1 Roadmap

### Future Features (Document but don't implement)
- **Rate Limiting**: Automatic rate limit handling with exponential backoff
- **Auto-Retry**: Configurable retry logic for transient failures
- **Caching**: Optional response caching with TTL
- **WebSocket Support**: Gateway connection for real-time events (research needed)
- **Node.js Support**: Environment detection and Node.js compatibility
- **PKCE OAuth2**: Enhanced security flow (if Discord supports it)

### Token Refresh Strategy
Document approaches for token refresh without client secret:
1. **Backend Proxy Pattern** (recommended)
2. **Implicit Grant Flow** (limited but simple)
3. **PKCE Flow** (if Discord adds support)

## Success Metrics

- ✅ Successfully authenticate with Discord OAuth2
- ✅ Make API calls from browser without CORS issues
- ✅ Full TypeScript support with discord-api-types
- ✅ Easy endpoint expansion via configuration
- ✅ Comprehensive error handling
- ✅ Developer-friendly API design
- ✅ Ready for NPM publication

This project fills a genuine gap in the Discord developer ecosystem by enabling browser-based Discord integrations that were previously thought impossible due to CORS restrictions.