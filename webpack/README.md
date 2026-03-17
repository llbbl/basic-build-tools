# Webpack

[Webpack](https://webpack.js.org/) is the most established JavaScript bundler, using an explicit configuration approach with loaders and plugins. Every transformation is declared — nothing is assumed.

## Commands

```bash
pnpm dev    # Start dev server (port 3002)
pnpm build  # Production build to dist/
```

## Key Config: `webpack.config.js`

```js
module.exports = (env, argv) => ({
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' }),
  ],
});
```

## How It Works

- **Dev**: `webpack-dev-server` provides HMR with in-memory compilation.
- **Build**: Explicit loader chain processes each file type. Plugins handle HTML generation and CSS extraction.
- **CSS**: Requires `css-loader` + `postcss-loader` + `MiniCssExtractPlugin` — each step is visible and configurable.
- **Entry**: JavaScript is the entry point (unlike Vite/Parcel which use HTML).

## Tradeoffs

| Strength | Tradeoff |
|----------|----------|
| Maximum control over every step | Verbose configuration required |
| Largest plugin ecosystem | Slower builds than Vite/esbuild |
| Battle-tested in production at scale | Steeper learning curve |
| Code splitting and lazy loading | More boilerplate for simple projects |
