#!/usr/bin/env bun
/**
 * Generates version-specific lockfiles for CI matrix testing.
 * Each lockfile corresponds to a specific tool+version combination.
 *
 * Usage: bun run ./scripts/generate-lockfiles.ts
 */
import { $ } from 'bun';
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dir, '..');
const LOCKFILES_DIR = join(ROOT, 'ci', 'lockfiles');

const MATRIX: Record<string, { filter: string; pkg: string; dep: string; versions: string[] }> = {
  vite: {
    filter: 'vite-basic-build',
    pkg: 'vite/package.json',
    dep: 'vite',
    versions: ['5', '6', '8'],
  },
  parcel: {
    filter: 'parcel-basic-build',
    pkg: 'parcel/package.json',
    dep: 'parcel',
    versions: ['2.9', '2.10', '2.12'],
  },
  esbuild: {
    filter: 'esbuild-basic-build',
    pkg: 'esbuild/package.json',
    dep: 'esbuild',
    versions: ['0.21', '0.23', '0.25'],
  },
};

async function main() {
  // Save original lockfile and package.json files
  const originalLockfile = join(ROOT, 'pnpm-lock.yaml');
  const backupLockfile = join(ROOT, 'pnpm-lock.yaml.bak');
  copyFileSync(originalLockfile, backupLockfile);

  const originalPkgs: Record<string, string> = {};
  for (const [tool, config] of Object.entries(MATRIX)) {
    const pkgPath = join(ROOT, config.pkg);
    originalPkgs[tool] = readFileSync(pkgPath, 'utf8');
  }

  try {
    for (const [tool, config] of Object.entries(MATRIX)) {
      for (const version of config.versions) {
        const label = `${tool}-v${version}`;
        console.log(`Generating lockfile for ${label}...`);

        // Modify package.json to pin the version
        const pkgPath = join(ROOT, config.pkg);
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        if (pkg.devDependencies?.[config.dep]) {
          pkg.devDependencies[config.dep] = `^${version}`;
        } else if (pkg.dependencies?.[config.dep]) {
          pkg.dependencies[config.dep] = `^${version}`;
        }
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

        // Generate lockfile
        await $`pnpm install --no-frozen-lockfile`.cwd(ROOT).quiet();

        // Copy lockfile
        const destLockfile = join(LOCKFILES_DIR, `${label}.yaml`);
        copyFileSync(originalLockfile, destLockfile);
        console.log(`  -> ${destLockfile}`);

        // Restore original package.json
        writeFileSync(pkgPath, originalPkgs[tool]);
      }
    }

    // Also copy the default lockfile (no overrides)
    copyFileSync(backupLockfile, join(LOCKFILES_DIR, 'default.yaml'));
    console.log(`  -> default.yaml`);
  } finally {
    // Restore everything
    copyFileSync(backupLockfile, originalLockfile);
    for (const [tool, config] of Object.entries(MATRIX)) {
      writeFileSync(join(ROOT, config.pkg), originalPkgs[tool]);
    }
    await $`rm -f ${backupLockfile}`.quiet();
    // Reinstall with original lockfile
    await $`pnpm install`.cwd(ROOT).quiet();
  }

  console.log('\nDone! All lockfiles generated in ci/lockfiles/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
