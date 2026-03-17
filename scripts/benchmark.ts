#!/usr/bin/env bun
import { $ } from 'bun';
import { statSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dir, '..');
const TOOLS = ['vite', 'parcel', 'webpack', 'esbuild'];

interface BenchResult {
  tool: string;
  coldBuildMs: number;
  bundleSizeBytes: number;
  bundleSizeGzipped: number;
}

async function checkDeps() {
  try {
    await $`which hyperfine`.quiet();
  } catch {
    console.error('Error: hyperfine not found.');
    console.error('Install it with: brew install hyperfine');
    process.exit(1);
  }
}

async function cleanDist(tool: string) {
  const distDir = join(ROOT, tool, 'dist');
  const parcelCache = join(ROOT, tool, '.parcel-cache');
  await $`rm -rf ${distDir} ${parcelCache}`.quiet();
}

async function coldBuild(tool: string): Promise<number> {
  await cleanDist(tool);

  const filterName = `${tool}-basic-build`;
  const benchFile = `/tmp/${tool}-bench.json`;

  await $`hyperfine --warmup 0 --runs 3 --export-json ${benchFile} "pnpm --filter ${filterName} build"`
    .cwd(ROOT)
    .quiet();

  const data = await Bun.file(benchFile).json();
  return Math.round(data.results[0].mean * 1000);
}

function getDirSize(dir: string, extensions: string[]): number {
  if (!existsSync(dir)) return 0;
  let total = 0;
  for (const file of readdirSync(dir, { recursive: true })) {
    const filePath = join(dir, file.toString());
    if (extensions.some((ext) => filePath.endsWith(ext))) {
      try {
        total += statSync(filePath).size;
      } catch {}
    }
  }
  return total;
}

async function getGzippedSize(dir: string, extensions: string[]): Promise<number> {
  if (!existsSync(dir)) return 0;
  let total = 0;
  for (const file of readdirSync(dir, { recursive: true })) {
    const filePath = join(dir, file.toString());
    if (extensions.some((ext) => filePath.endsWith(ext))) {
      try {
        const result = await $`gzip -c ${filePath} | wc -c`.text();
        total += parseInt(result.trim());
      } catch {}
    }
  }
  return total;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  await checkDeps();

  console.log('Installing dependencies...');
  await $`pnpm install`.cwd(ROOT).quiet();

  console.log('Running initial build for all tools...');
  for (const tool of TOOLS) {
    const filterName = `${tool}-basic-build`;
    await $`pnpm --filter ${filterName} build`.cwd(ROOT).quiet();
  }

  const results: BenchResult[] = [];

  for (const tool of TOOLS) {
    console.log(`\nBenchmarking ${tool}...`);
    const coldBuildMs = await coldBuild(tool);

    const distDir = join(ROOT, tool, 'dist');
    const bundleSizeBytes = getDirSize(distDir, ['.js', '.css']);
    const bundleSizeGzipped = await getGzippedSize(distDir, ['.js', '.css']);

    results.push({ tool, coldBuildMs, bundleSizeBytes, bundleSizeGzipped });
  }

  console.log('\n## Benchmark Results\n');
  console.log('| Tool     | Cold Build | Bundle (raw) | Bundle (gzip) |');
  console.log('|----------|-----------|-------------|--------------|');
  for (const r of results) {
    const tool = r.tool.padEnd(8);
    const build = `${r.coldBuildMs}ms`.padStart(9);
    const raw = formatBytes(r.bundleSizeBytes).padStart(11);
    const gzip = formatBytes(r.bundleSizeGzipped).padStart(12);
    console.log(`| ${tool} | ${build} | ${raw} | ${gzip} |`);
  }

  console.log('\nBenchmarked with hyperfine (3 runs, mean).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
