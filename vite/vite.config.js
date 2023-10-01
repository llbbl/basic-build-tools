export default {
  root: './src', // Set the root directory for your source code
  build: {
    outDir: 'dist', // Output directory for built assets
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    loader: { '.js': 'jsx' }
  }
}
