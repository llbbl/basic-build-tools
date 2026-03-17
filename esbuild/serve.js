const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

const postcssPlugin = {
  name: 'postcss',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = fs.readFileSync(args.path, 'utf8');
      const result = await postcss([
        tailwindcss({ config: path.resolve(__dirname, 'tailwind.config.js') }),
        autoprefixer,
      ]).process(css, { from: args.path });
      return { contents: result.css, loader: 'css' };
    });
  },
};

async function serve() {
  const ctx = await esbuild.context({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outdir: './dist',
    plugins: [postcssPlugin],
    loader: { '.js': 'jsx' },
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  });

  fs.mkdirSync('./dist', { recursive: true });
  fs.copyFileSync('./src/index.html', './dist/index.html');

  const { host, port } = await ctx.serve({ servedir: './dist', port: 3003 });
  console.log(`Dev server running at http://${host}:${port}`);
}

serve().catch((err) => {
  console.error(err);
  process.exit(1);
});
