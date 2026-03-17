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

async function build() {
  await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outdir: './dist',
    minify: true,
    metafile: true,
    plugins: [postcssPlugin],
    loader: { '.js': 'jsx' },
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  });

  fs.copyFileSync('./src/index.html', './dist/index.html');
  console.log('Build complete.');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
