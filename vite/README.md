# Vite

[Vite](https://vitejs.dev/) is a convention-based build tool that uses **esbuild** for blazing-fast dev server startup and **Rollup** for optimized production bundles. It requires minimal configuration while still being highly extensible.

## Commands

```bash
pnpm dev      # Start dev server (port 5173)
pnpm build    # Production build to dist/
pnpm preview  # Preview production build
```

## Key Config: `vite.config.js`

```js
export default defineConfig({
  root: './src',          // Source directory
  build: {
    outDir: '../dist',    // Output outside root
    emptyOutDir: true,
  },
  esbuild: {
    jsxFactory: 'h',     // Preact compatibility
    jsxFragment: 'Fragment',
  },
});
```

## How It Works

- **Dev**: Uses esbuild for near-instant HMR. Serves files via native ES modules (no bundling in dev).
- **Build**: Switches to Rollup for tree-shaking and code splitting in production.
- **CSS**: PostCSS + Tailwind processed automatically when config files are present.
- **Entry**: HTML file is the entry point — Vite resolves `<script>` and `<link>` tags automatically.

## Tradeoffs

| Strength | Tradeoff |
|----------|----------|
| Fastest dev server startup | Two different engines (esbuild dev, Rollup prod) |
| Minimal config for common setups | Less control than Webpack's explicit loader chain |
| Native ES module dev serving | Requires modern browser for dev |
| Rich plugin ecosystem | Rollup plugins, not Webpack plugins |
