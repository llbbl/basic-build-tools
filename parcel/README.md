# Parcel

[Parcel](https://parceljs.org/) is a zero-configuration bundler that automatically detects your project setup. Point it at an HTML file and it figures out the rest — no config files needed for most use cases.

## Commands

```bash
pnpm dev    # Start dev server (port 1234)
pnpm build  # Production build to dist/
```

## Key Config

Parcel needs almost no configuration. The only config file is `.postcssrc.json` for PostCSS/Tailwind:

```json
{
  "plugins": {
    "tailwindcss": {},
    "autoprefixer": {}
  }
}
```

The `source` field in `package.json` tells Parcel which HTML file is the entry point:

```json
{
  "source": "src/index.html"
}
```

## How It Works

- **Dev**: Built-in dev server with HMR. Auto-detects file types and applies appropriate transforms.
- **Build**: Automatic scope hoisting, tree-shaking, and content hashing.
- **CSS**: Detects PostCSS config files automatically (`.postcssrc.json`, `postcss.config.js`, etc.).
- **Entry**: HTML is the entry point — Parcel follows `<script>` and `<link>` tags to find all dependencies.

## Tradeoffs

| Strength | Tradeoff |
|----------|----------|
| True zero-config for most projects | Less control when you need custom behavior |
| HTML as entry point (intuitive) | Smaller plugin ecosystem than Webpack/Vite |
| Auto-detects transforms (TS, JSX, etc.) | Caching can occasionally cause stale builds |
| Built-in code splitting | Fewer production optimization options |
