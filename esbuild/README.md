# esbuild

[esbuild](https://esbuild.github.io/) is a Go-based bundler focused on raw speed. It's an order of magnitude faster than JavaScript-based bundlers. Configuration is done via its JavaScript API rather than config files.

## Commands

```bash
pnpm dev    # Start dev server (port 3003)
pnpm build  # Production build to dist/
```

## Key Config: `build.js`

```js
await esbuild.build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outdir: './dist',
  minify: true,
  plugins: [postcssPlugin],
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
});
```

esbuild uses a programmatic API instead of a config file. The PostCSS/Tailwind integration is done via a custom plugin in `build.js`.

## How It Works

- **Dev**: Uses esbuild's `context.serve()` API for a lightweight dev server.
- **Build**: Single-pass bundling in Go — extremely fast, minimal overhead.
- **CSS**: Custom plugin processes CSS through PostCSS/Tailwind before esbuild bundles it.
- **Entry**: JavaScript entry point. HTML is copied to dist as a static file.

## Tradeoffs

| Strength | Tradeoff |
|----------|----------|
| Fastest build times by far | No built-in HTML processing |
| Simple, predictable API | Smaller plugin ecosystem |
| Written in Go (parallelized) | Custom plugins needed for PostCSS |
| Used internally by Vite for dev | Less mature than Webpack for complex setups |
