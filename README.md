# Basic Build Tools

A side-by-side comparison of JavaScript build tools, all building the same **Preact + HTM + Tailwind CSS** "Hello World" app.

## Why?

Choosing a build tool is one of the first decisions in any frontend project. This repo lets you compare how different tools handle the exact same app — from config verbosity to build speed to bundle size.

## Tools Compared

| Tool | Version | Config Style | Entry Point | Dev Port |
|------|---------|-------------|-------------|----------|
| [Vite](./vite) | ^6.0 | `vite.config.js` (convention-based) | HTML | 5173 |
| [Parcel](./parcel) | ^2.12 | Zero-config | HTML | 1234 |
| [Turbo](./turbo) | ^2.0 + Webpack | Task runner + bundler | JS | 3001 |
| [Webpack](./webpack) | ^5.95 | `webpack.config.js` (explicit) | JS | 3002 |
| [esbuild](./esbuild) | ^0.21 | `build.js` (API script) | JS | 3003 |

## Getting Started

```bash
# Install all dependencies
pnpm install

# Run any individual dev server
pnpm dev:vite
pnpm dev:parcel
pnpm dev:turbo
pnpm dev:webpack
pnpm dev:esbuild

# Build all projects
pnpm build:all
```

## Benchmarks

Run local benchmarks (requires [hyperfine](https://github.com/sharkdp/hyperfine)):

```bash
brew install hyperfine
pnpm benchmark
```

This measures cold build time and bundle size (raw + gzipped) for each tool.

CI benchmarks run automatically via GitHub Actions on push to `main`, testing multiple versions of each tool. Check the [Actions tab](../../actions) for results.

## The App

Every sub-project builds the same minimal app:

- **Preact** for rendering (lightweight React alternative)
- **HTM** for JSX-like templates without a compile step
- **Tailwind CSS** via PostCSS for styling

```js
import { h, render } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

function HelloWorld() {
  return html`<h1 class="text-4xl">Hello World</h1>`;
}

render(html`<${HelloWorld} />`, document.getElementById('app'));
```

## Project Structure

```
basic-build-tools/
  vite/           # Vite — convention-based, esbuild dev + Rollup prod
  parcel/         # Parcel — zero-config, HTML as entry
  turbo/          # Turborepo — task runner with Webpack underneath
  webpack/        # Webpack 5 — explicit loaders and plugins
  esbuild/        # esbuild — Go-based, API-driven, fastest raw builds
  scripts/        # Benchmark script (Bun + hyperfine)
  .github/        # CI workflow with matrix version testing
```
