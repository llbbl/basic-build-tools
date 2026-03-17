# Turbo (Turborepo)

[Turborepo](https://turbo.build/) is a task runner for JavaScript monorepos — it orchestrates and caches build tasks but **does not bundle code itself**. This sub-project uses Turbo with **Webpack** as the underlying bundler to demonstrate how task runners complement build tools.

## Commands

```bash
pnpm dev    # Turbo orchestrates webpack serve (port 3001)
pnpm build  # Turbo orchestrates webpack --mode production
```

## Key Config: `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Turbo manages task dependencies and caching. The actual bundling is handled by `webpack.config.js`.

## How It Works

- **Task runner**: Turbo wraps your npm scripts, adding dependency-aware execution and remote caching.
- **Caching**: If source files haven't changed, Turbo replays the cached output instead of rebuilding.
- **Bundler**: Webpack handles the actual compilation (see `webpack.config.js` for loader/plugin config).
- **Monorepo**: In a real monorepo, Turbo coordinates builds across multiple packages.

## Tradeoffs

| Strength | Tradeoff |
|----------|----------|
| Smart caching skips unchanged builds | Extra layer of config on top of bundler |
| Parallelizes tasks across packages | Overhead for single-package projects |
| Remote caching for CI speedups | Requires a separate bundler underneath |
| Dependency-aware task execution | Not a bundler — doesn't replace Vite/Webpack |
