# Discord Browser API

[![CI Status](https://github.com/angelxmoreno/discord-browser-api/actions/workflows/pr-check.yml/badge.svg)](https://github.com/angelxmoreno/discord-browser-api/actions/workflows/pr-check.yml)
[![Codecov](https://codecov.io/gh/angelxmoreno/discord-browser-api/branch/main/graph/badge.svg?token=YOUR_CODECOV_TOKEN)](https://codecov.io/gh/angelxmoreno/discord-browser-api)
[![NPM Version](https://img.shields.io/npm/v/discord-browser-api)](https://www.npmjs.com/package/discord-browser-api)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Browser-compatible Discord API client for OAuth2 user authentication and REST API interactions. This library fills a critical gap in the ecosystem by enabling web applications to interact with Discord's REST API using OAuth2 user tokens, which was previously thought impossible due to CORS policies.

## Features

*   **Browser-only OAuth2 Discord API client**: Designed specifically for web environments.
*   **TypeScript-first**: Full type safety with `discord-api-types` integration.
*   **Configurable HTTP Client**: Built on Axios, allowing custom `AxiosInstance` or `AxiosRequestConfig` for flexible network control.
*   **Auto-generated Endpoints**: API endpoints are automatically generated from a configuration, ensuring consistency and reducing manual boilerplate.
*   **Comprehensive Error Handling**: Custom error classes for clear API and OAuth2 errors.
*   **Modern Development Tooling**: Leverages Bun, BiomeJS, Lefthook, and Conventional Commits for a streamlined development experience.

## Installation

To get started with the project, clone the repository and install dependencies:

```bash
git clone https://github.com/angelxmoreno/discord-browser-api.git
cd discord-browser-api
bun install
```

## Development

This project uses [Bun](https://bun.sh) as its runtime and package manager.

### Scripts

*   `bun install`: Installs project dependencies.
*   `bun run build`: Compiles TypeScript to JavaScript and generates API endpoints.
*   `bun run dev`: Runs the build in watch mode for development.
*   `bun test`: Runs the test suite.
*   `bun test:coverage`: Runs tests and generates a code coverage report.
*   `bun lint`: Checks code for linting issues using Biome.
*   `bun lint:fix`: Fixes auto-fixable linting issues.
*   `bun lint:commits`: Validates commit message format using Commitlint.
*   `bun run format`: Formats code using Biome.
*   `bun run typecheck`: Checks TypeScript types without emitting files.
*   `bun run clean`: Removes `node_modules`, `bun.lockb`, and reinstalls dependencies.
*   `bun run prepare`: Installs Git hooks via Lefthook (runs automatically after `bun install`).

### Project Structure

```
discord-browser-api/
├── src/
│   ├── DiscordBrowserApiClient.ts  # Main client class
│   ├── endpoints/                  # Auto-generated API endpoints
│   ├── errors/                     # Custom error classes
│   ├── oauth/                      # OAuth2 utilities
│   ├── types/                      # Shared type definitions
│   ├── utils/                      # General utilities (e.g., HTTP client creation)
│   └── index.ts                    # Main library export
├── scripts/                        # Build-time scripts (e.g., endpoint generation)
├── examples/                       # Usage examples
├── docs/                           # Documentation files
├── tests/                          # Unit and integration tests
├── .github/                        # GitHub Actions workflows, Dependabot config
└── ...                             # Other config files (package.json, tsconfig.json, biome.json, etc.)
```

## Quality & Automation

This project is committed to high code quality, security, and automated releases. We integrate the following tools and practices:

*   **CI/CD (GitHub Actions)**: Automated testing, linting, and type-checking on every pull request (`pr-check.yml`).
*   **Code Coverage (Codecov)**: Tracks test coverage to ensure comprehensive testing. Reports are uploaded automatically.
*   **Dependency Management (Dependabot)**: Automatically keeps dependencies up-to-date, including security patches.
*   **Static Analysis (GitHub Code Scanning with CodeQL)**: Scans the codebase for security vulnerabilities.
*   **Automated Releases (release-please)**: Manages versioning, changelog generation, and GitHub releases based on Conventional Commits.

## Contributing

Contributions are welcome! Please ensure your commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.