# Gemini Project Configuration: discord-browser-api

This document outlines the key conventions, tools, and guidelines for developing the `discord-browser-api` project.

## 1. Project Overview

The primary goal is to create a browser-focused Discord API client library using OAuth2 user tokens. It is built with TypeScript and Bun, and it is designed to be a modern, type-safe, and robust solution for web applications integrating with Discord.

## 2. Tech Stack & Tooling

-   **Language**: TypeScript
-   **Runtime/Bundler/Tester**: Bun
-   **Linter/Formatter**: BiomeJS
-   **HTTP Client**: Axios
-   **Type Definitions**: `discord-api-types`
-   **Git Hooks**: Lefthook
-   **Commit Style**: Conventional Commits (`commitlint`)

## 3. Development Workflow

-   **Install Dependencies**: `bun install`
-   **Run Tests**: `bun test`
-   **Lint & Format**:
    -   Check: `bun run lint`
    -   Fix: `bun run lint:fix`
    -   Format: `bun run format`
-   **Build**: `bun run build` (This also runs the endpoint generation script)
-   **Endpoint Generation**: Endpoints are generated automatically from `src/endpoints/config.ts` by running `bun run build` or `bun run scripts/generate-endpoints.ts`. Do not edit generated endpoint files directly.

## 4. Coding Style & Conventions

-   **Formatting**: Adhere strictly to the rules in `biome.json`.
    -   **Indent**: 2 spaces
    -   **Quotes**: Single quotes for JS/TS, double for JSON.
    -   **Semicolons**: Always use semicolons.
    -   **Line Width**: 100 characters.
-   **Linter**: Follow the rules in `biome.json`. Pay attention to `no-explicit-any`, `no-console-log`, and `use-const`.
-   **Naming**:
    -   Files containing a primary class should be `PascalCase.ts`.
    -   Other files should be `camelCase.ts` or `kebab-case.ts`.
    -   Classes and types should be `PascalCase`.
    -   Methods, functions, and variables should be `camelCase`.
-   **Visibility**: Use `protected` instead of `private` for internal class members to maintain consistency with the user's preference.
-   **Modularity**: Follow the defined project structure. Create new files in their respective directories (`client`, `endpoints`, `oauth`, `errors`, `types`, `utils`). Use `index.ts` files to export modules from a directory.
-   **Types**: Use types from the `discord-api-types` package where possible. Define client-specific types in the `src/types/` directory.

## 5. Commit Messages

All commit messages MUST adhere to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).
-   Use the `commitlint` configuration in `commitlint.config.js` as a reference.
-   Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`.

## 6. Key Files

-   `package.json`: Project metadata and scripts.
-   `tsconfig.json`: TypeScript compiler configuration.
-   `biome.json`: Linter and formatter rules (Biome v2 standard).
-   `lefthook.yml`: Git hook configurations.
-   `src/endpoints/config.ts`: The source of truth for all API endpoints. Modify this file to add or change endpoints.
-   `src/client/DiscordWebClient.ts`: The main client class.
